FROM python:3.10-slim

# Install OS-level dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    libffi-dev \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy requirements and install them
COPY similarity-engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app code
COPY similarity-engine .

# Expose FastAPI port
EXPOSE 5001

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"]
