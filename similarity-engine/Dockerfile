# Use a specific base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code from the current directory (similarity-engine)
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Command to run the FastAPI app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

