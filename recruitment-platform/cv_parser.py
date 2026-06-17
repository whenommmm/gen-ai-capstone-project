"""
cv_parser.py — CV Ingestion & Parsing (Core Feature #2), the local half.

This module handles *ingestion*: turning an uploaded PDF / DOCX / TXT file into
raw text. The expensive *structuring* step (raw text -> structured candidate
profile) is done by the LLM inside scorer.py, combined with scoring in a single
API call so the batch stays fast. Keeping text extraction here (no API needed)
means we can ingest 100s of files cheaply before we ever call the model.
"""

import io

import fitz  # PyMuPDF
import docx


def extract_text(file_name, file_bytes):
    """Dispatch on file extension. Returns plain text."""
    name = file_name.lower()
    if name.endswith(".pdf"):
        return _pdf_text(file_bytes)
    if name.endswith(".docx"):
        return _docx_text(file_bytes)
    if name.endswith((".txt", ".md")):
        return file_bytes.decode("utf-8", errors="ignore")
    raise ValueError(f"Unsupported file type: {file_name} (use PDF, DOCX, or TXT)")


def _pdf_text(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    try:
        return "\n".join(page.get_text() for page in doc)
    finally:
        doc.close()


def _docx_text(file_bytes):
    document = docx.Document(io.BytesIO(file_bytes))
    return "\n".join(p.text for p in document.paragraphs)
