# syntax=docker/dockerfile:1
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_ENV=development
RUN apk add --no-cache gcc musl-dev linux-headers
COPY ../requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8080
COPY ./be .
# `flask run` does not support flask-socketio, therefore, we still run the app using
# `python app.py`. This can still support the init_app() factory design.
# See https://flask-socketio.readthedocs.io/en/latest/getting_started.html
CMD ["python", "serve.py"]
