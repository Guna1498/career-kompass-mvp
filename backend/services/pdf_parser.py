import fitz  # PyMuPDF


def extract_text(file_bytes: bytes) -> str:
    # TODO: open PDF from bytes and extract all page text
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()
