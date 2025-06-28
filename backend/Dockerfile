FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for waitlist storage
RUN mkdir -p /app/data

# Expose port (Railway will override with $PORT)
EXPOSE 8001

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:${PORT:-8001}/api/health', timeout=5).raise_for_status()" || exit 1

# Start command - Railway will provide PORT env var
CMD ["python", "-c", "import uvicorn; import os; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', 8001)), log_level='info')"]