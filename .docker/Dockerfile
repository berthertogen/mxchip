# syntax=docker/dockerfile:1
FROM python:3
WORKDIR /code
COPY ./listener/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY ./listener .
CMD ["python", "./listener.py"]