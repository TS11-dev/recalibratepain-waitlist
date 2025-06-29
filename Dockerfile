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

# Create a startup script to handle PORT properly
RUN echo '#!/bin/bash\nset -e\necho "Starting on port: ${PORT:-8001}"\nexec python -m uvicorn server:app --host 0.0.0.0 --port ${PORT:-8001}' > /app/start.sh
RUN chmod +x /app/start.sh

# Use the startup script
CMD ["/app/start.sh"]