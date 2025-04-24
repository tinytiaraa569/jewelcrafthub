FROM python:3.10-slim

# Install OS-level dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    libffi-dev \
    && apt-get clean

# Set working directory in container
WORKDIR /app

# Copy requirements.txt from similarity-engine folder
COPY similarity-engine/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code from similarity-engine folder
COPY similarity-engine/ .

# Expose FastAPI port
EXPOSE 5001

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"]
