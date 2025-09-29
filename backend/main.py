
import sys
sys.path.insert(0, "/root/project")

import os
import secrets
from pathlib import Path
import modal

from modal import App, Image, Volume, Secret, enter, exit, asgi_app
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from router import backend_router

from utils.logging_config import setup_logging
from utils.config_manager import initialize_config

logger = setup_logging()

app = App(name="backend")

project_root = Path(__file__).parent

new_image = (
    Image.debian_slim(python_version="3.12")
    .pip_install(
        "fastapi==0.100.0",
        "uvicorn==0.22.0",
        "sqlalchemy==1.4.39",
        "psycopg2-binary",
        "passlib",
        "groq>=0.3.0",
        "pydantic[email]",
        "zxcvbn",
        "pytz",
        "python-jose",
        "ulid-py",
    )
    .add_local_dir(str(project_root), remote_path="/root/project")
)

# print(os.environ)
print(os.getcwd())


secret = Secret.from_name("Backend")

@app.cls(
    image=new_image,
    secrets=[secret],
)
# @modal.concurrent(max_inputs=10)
class FastAPIApp:
    @enter() 
    def start(self):
        initialize_config(
            groq_api_key=os.environ["GROQ_API_KEY"],
        )


    @exit()  
    def cleanup(self):
        pass

    @asgi_app()  
    def fastapi_app(self):
        api = FastAPI(
            title="Backend",
            description="Backend",
            version="1.0.0",
            docs_url=None,
            redoc_url=None,
        )

        # CORS
        origins = ["http://localhost:3000",
            "https://lead-generation-assignment-n6so2bs7u-harishkamavarams-projects.vercel.app",
            "https://lead-generation-assignment.vercel.app"]
        # origins = ["*"]

        api.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["*", "Set-Cookie", "set-cookie"],
        )


        # Include your router
        api.include_router(backend_router)

        @api.get("/test-cors")
        async def test_cors():
            return {"message": "CORS is working"}

        @api.get("/docs", include_in_schema=False)
        async def custom_swagger_ui():
            return get_swagger_ui_html(
                openapi_url="/openapi.json",
                title="User Authentication API – Swagger UI",
                oauth2_redirect_url="/docs/oauth2-redirect",
                swagger_js_url="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
                swagger_css_url="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css",
            )

        return api

@app.local_entrypoint()
def main():
    logger.info("FastAPI is now running")
    print("Authentication endpoints exposed under `/auth`")
    print("Swagger UI available at `/docs`")
    print(f"Deployed at https://{app.name}--fastapi-app.modal.run")
 