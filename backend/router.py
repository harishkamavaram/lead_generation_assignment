from fastapi import APIRouter, Request, HTTPException
import asyncio
from fastapi.responses import JSONResponse
from typing import Union, Dict, Any, List , Type
from fastapi.security import HTTPBearer
from utils.logging_config import setup_logging
from dataclasses import dataclass, field, make_dataclass
import os
import re
import io
from datetime import datetime 
from pydantic import BaseModel
from helper import filter_leads_with_llm
import csv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from utils.config_manager import get_config

backend_router = APIRouter(prefix="/b", tags=["Backend"])
security = HTTPBearer()
logger = setup_logging()

def get_client_info(request: Request):
    return {
        "ip_address": request.client.host,
        "user_agent": request.headers.get("User-Agent", "Unknown"), 
    }

class SearchRequest(BaseModel):  
    prompt: str


@backend_router.post("/search")  
async def search(request: Request, data: SearchRequest):
    try:
        client = get_client_info(request)
        
        prompt = data.prompt
        
        response = filter_leads_with_llm(prompt)
        # print("response in search :",response)

        return JSONResponse(
            content={
                "prompt": data.prompt,
                "response_data": response,
                "status": "ok",
                "received_at": datetime.utcnow().isoformat() + "Z",
            },
            status_code=200
        )
    except Exception as e:
        logger.exception("Error in /search")
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=500
        )

class SendEmailRequest(BaseModel):
    email: str
    data: List[Dict[str, Any]]  # JSON rows to convert to CSV

def rows_to_csv_bytes(rows: List[Dict[str, Any]]) -> bytes:
    # Determine headers across all rows
    headers: List[str] = []
    seen = set()
    for row in rows:
        for k in row.keys():
            if k not in seen:
                seen.add(k)
                headers.append(k)
    # Write CSV to memory
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=headers, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({k: row.get(k, "") for k in headers})
    return buf.getvalue().encode("utf-8")

def send_email_with_csv(to_email: str, subject: str, body: str, csv_bytes: bytes, filename: str = "data.csv") -> bool:
    config = get_config()
    sender_email = config.EMAIL_USER
    sender_password = config.EMAIL_PASSWORD
    smtp_server = config.SMTP_SERVER
    smtp_port = int(config.SMTP_PORT)

    msg = MIMEMultipart('mixed')
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject

    alt = MIMEMultipart('alternative')
    alt.attach(MIMEText(body, 'plain', 'utf-8'))
    msg.attach(alt)

    part = MIMEApplication(csv_bytes, _subtype="csv")
    part.add_header('Content-Disposition', 'attachment', filename=filename)
    msg.attach(part)

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        logger.info(f"Email with CSV sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

@backend_router.post("/send-email")
async def send_email(request: Request, data: SendEmailRequest):
    try:
        client = get_client_info(request)
        email = data.email
        subject = "The Filter Data"
        body = "Please Check the attached file for the filter data."
        rows = data.data

        csv_bytes = rows_to_csv_bytes(rows)
        ok = await asyncio.to_thread(send_email_with_csv, email, subject, body, csv_bytes, "leads.csv")
        if not ok:
            return JSONResponse(
                content={"status": "error", "message": "Failed to send email"},
                status_code=500
            )

        return JSONResponse(
            content={"status": "ok", "sent_to": email, "count": len(rows)},
            status_code=200
        )
    except Exception as e:
        logger.exception("Error in /send-email")
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=500
        )
