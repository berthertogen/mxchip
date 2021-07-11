# syntax=docker/dockerfile:1
FROM python:3-alpine
WORKDIR /code
RUN apk add --no-cache gcc musl-dev linux-headers
COPY ./listener .
CMD ["python", "./listener.py"]