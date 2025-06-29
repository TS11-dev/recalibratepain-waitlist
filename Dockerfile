FROM python:3.11-slim

WORKDIR /app

# Copy and install requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Use a startup script approach
CMD python -c "import uvicorn; import os; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', 8001)))"