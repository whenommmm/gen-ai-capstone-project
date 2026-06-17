"""
llm.py — the single gateway for every Gemini API call in this project.

Why one file: keeping all model access here means the model name, retry logic,
JSON parsing, and rate-limit handling live in exactly one place. Every other
module (jd_parser, cv_parser, scorer, bias, interview) calls `generate_json`
or `generate_json_async` and never touches the SDK directly.
"""

import os
import json
import random
import asyncio

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
_API_KEY = os.getenv("GEMINI_API_KEY")
_MAX_RETRIES = 5

# Concurrency cap: we run candidates in parallel to hit the <60s batch target,
# but the free tier has a per-minute request ceiling, so we don't fire all at once.
MAX_CONCURRENCY = 8

_client = None
_semaphore = None


def get_client():
    """Lazily build (and reuse) the Gemini client."""
    global _client
    if _client is None:
        if not _API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Put it in a .env file next to this script."
            )
        _client = genai.Client(api_key=_API_KEY)
    return _client


def _semaphore_for_loop():
    """One semaphore per event loop, created lazily inside the running loop."""
    global _semaphore
    if _semaphore is None:
        _semaphore = asyncio.Semaphore(MAX_CONCURRENCY)
    return _semaphore


def _config(system=None, temperature=0.2):
    return types.GenerateContentConfig(
        response_mime_type="application/json",  # forces valid JSON output
        temperature=temperature,
        system_instruction=system,
    )


def _parse(text):
    """Gemini returns a JSON string; be defensive about stray code fences."""
    if text is None:
        raise ValueError("Empty response from model")
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```", 2)[1] if "```" in cleaned else cleaned
            cleaned = cleaned.removeprefix("json").strip().strip("`").strip()
        return json.loads(cleaned)


def _is_transient(err):
    msg = str(err).lower()
    return any(k in msg for k in ("429", "rate", "quota", "resource", "503", "unavailable", "500", "deadline"))


def generate_json(prompt, system=None, temperature=0.2):
    """Synchronous JSON generation (used for one-off calls like JD parsing)."""
    client = get_client()
    last = None
    for attempt in range(_MAX_RETRIES):
        try:
            resp = client.models.generate_content(
                model=MODEL, contents=prompt, config=_config(system, temperature)
            )
            return _parse(resp.text)
        except Exception as err:  # noqa: BLE001
            last = err
            if _is_transient(err) and attempt < _MAX_RETRIES - 1:
                import time
                time.sleep(2 ** attempt + random.random())
                continue
            raise
    raise last


async def generate_json_async(prompt, system=None, temperature=0.2):
    """Async JSON generation with backoff — the workhorse for batch scoring."""
    client = get_client()
    sem = _semaphore_for_loop()
    last = None
    for attempt in range(_MAX_RETRIES):
        try:
            async with sem:
                resp = await client.aio.models.generate_content(
                    model=MODEL, contents=prompt, config=_config(system, temperature)
                )
            return _parse(resp.text)
        except Exception as err:  # noqa: BLE001
            last = err
            if _is_transient(err) and attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(2 ** attempt + random.random())
                continue
            raise
    raise last
