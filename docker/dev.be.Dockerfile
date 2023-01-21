# syntax=docker/dockerfile:1
FROM python:3.10-slim
WORKDIR /code
ENV FLASK_ENV=development
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY ./be .
RUN /code/generate_secret.sh

EXPOSE 8080
# `flask run` does not support flask-socketio, therefore, we still run the app using
# `python app.py`. This can still support the init_app() factory design.
# See https://flask-socketio.readthedocs.io/en/latest/getting_started.html
CMD ["python", "serve.py"]
