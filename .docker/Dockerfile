# syntax=docker/dockerfile:1
FROM python:3
WORKDIR /code
RUN pip install --no-cache-dir python-dotenv azure-eventhub azure-eventhub-checkpointstoreblob-aio

COPY ./listener .
CMD ["python", "./listener.py"]