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

# Use Python to handle PORT variable reliably
CMD ["python", "-c", "import os; import uvicorn; port=int(os.environ.get('PORT', 8001)); print(f'Starting on port {port}'); uvicorn.run('server:app', host='0.0.0.0', port=port, log_level='info')"]