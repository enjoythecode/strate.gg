# syntax=docker/dockerfile:1
# Build step #1: build the React front end
FROM node:16.14.0-alpine as build-step

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# prevent react from inlining scripts and images, so that we can
# maintain a strict Content-Security-Policy
# https://drag13.io/posts/react-inline-runtimer-chunk/index.html
ENV INLINE_RUNTIME_CHUNK=false
ENV IMAGE_INLINE_SIZE_LIMIT=0

COPY ./fe/src/ ./src/
COPY ./fe/public/ ./public/
COPY ./fe/package.json ./
COPY ./fe/package-lock.json ./
COPY ./fe/.eslintrc.json ./
COPY ./fe/.prettierrc.json ./
COPY ./fe/jsconfig.json ./


RUN npm ci
RUN npm run build


# Build step #2: run the Python back end
FROM python:3.7-slim

WORKDIR /code

ENV FLASK_ENV debug
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8080
COPY ./be .
COPY --from=build-step /app/build /code/client
CMD ["python",  "serve.py"]
