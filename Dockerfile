FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better Docker layer caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ .

# Create data directory for waitlist storage
RUN mkdir -p /app/data

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Start command - Railway will provide PORT env var
CMD ["python", "-c", "import uvicorn; import os; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', 8001)), log_level='info')"]