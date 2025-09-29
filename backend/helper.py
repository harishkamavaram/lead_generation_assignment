import os
import json
from typing import List, Dict, Any
from pathlib import Path

from groq import Groq

LEADS_PATH = Path(__file__).parent / "dummy_leads.json"

def load_leads() -> List[Dict[str, Any]]:
    with open(LEADS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def _truncate_leads(leads: List[Dict[str, Any]], limit: int = 150) -> List[Dict[str, Any]]:
    return leads[:limit] if len(leads) > limit else leads

def _keyword_filter(leads: List[Dict[str, Any]], prompt: str) -> List[Dict[str, Any]]:
    q = prompt.lower()
    def hit(lead: Dict[str, Any]) -> bool:
        hay = " ".join([
            lead.get("name", ""),
            lead.get("title", ""),
            lead.get("location", ""),
            " ".join(lead.get("skills", []) or []),
        ]).lower()
        return all(tok in hay for tok in q.split())
    return [l for l in leads if hit(l)]

def filter_leads_with_llm(prompt: str, max_items: int = 150) -> List[Dict[str, Any]]:
    leads = load_leads()
    sample = _truncate_leads(leads, max_items)
    client = Groq(api_key=os.environ["GROQ_API_KEY"])

    system = (
        "You are a recruiting assistant. You receive a list of candidate leads in JSON. "
        "Given the user's search prompt, return ONLY the ids of leads that best match. "
        "Consider title, location, and skills. Be strict but helpful. "
        "Respond as a compact JSON object: {\"ids\": [\"id1\",\"id2\",...]}. No extra text."
    )

    user = (
        "PROMPT:\n"
        f"{prompt}\n\n"
        "LEADS_JSON:\n"
        f"{json.dumps(sample, ensure_ascii=False)}"
    )
    # model = "llama-3.3-70b-versatile"
    # model = "openai/gpt-oss-20b"
    model_ids = ["openai/gpt-oss-20b", "openai/gpt-oss-120b","llama-3.3-70b-versatile"]
    # model = random.choice(model_ids)
    model = "openai/gpt-oss-120b"
    temperature = 0.2


    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=temperature,
        )
        content = completion.choices[0].message.content or "{}"
        parsed = json.loads(content)
        ids = set(parsed.get("ids", []))
        # print(f"content in filter_leads_with_llm : {content}")

        if not ids:
            # Fallback to keyword filter if LLM returns empty
            return _keyword_filter(leads, prompt)

        filtered = [l for l in leads if l.get("id") in ids]
        # If model returned ids not present in full dataset due to truncation,
        # try a soft merge using keyword fallback if empty.
        return filtered or _keyword_filter(leads, prompt)

    except Exception as e:
        print(f"Exception in filter_leads_with_llm,{str(e)}")
        return _keyword_filter(leads, prompt)