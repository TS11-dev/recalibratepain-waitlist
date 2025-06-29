#!/bin/bash

# Railway startup script for RecalibratePain API
echo "🚀 Starting RecalibratePain API..."

# Set default port if not provided by Railway
export PORT=${PORT:-8001}

echo "📡 Port: $PORT"
echo "🐍 Python version: $(python --version)"
echo "📁 Working directory: $(pwd)"
echo "📋 Files: $(ls -la)"

# Create data directory
mkdir -p /app/data

# Start the FastAPI server
echo "🎯 Starting uvicorn server..."
python -c "
import uvicorn
import os
import sys

print(f'🔥 Starting server on 0.0.0.0:{os.environ.get(\"PORT\", 8001)}')
sys.stdout.flush()

uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', 8001)), log_level='info')
"