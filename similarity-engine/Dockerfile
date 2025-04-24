FROM python:3.10-slim

WORKDIR /app

COPY . /app

# Install system packages needed for image and FAISS support
RUN apt-get update && \
    apt-get install -y libgl1 && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

EXPOSE 5001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"]
