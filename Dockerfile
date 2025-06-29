FROM python:3.11-slim

WORKDIR /app

# Copy and install requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Set environment variables for Railway
ENV PYTHONUNBUFFERED=1

# Simple, robust startup command
CMD python -m uvicorn server:app --host 0.0.0.0 --port $PORT