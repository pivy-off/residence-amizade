FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

# Railway sets PORT; default to 8001 for local Docker
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}
