# syntax=docker/dockerfile:1
# Build step #1: build the React front end
FROM node:16.14.0-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH


COPY ./fe/package.json ./
COPY ./fe/package-lock.json ./
COPY ./fe/.eslintrc.json ./
COPY ./fe/.prettierrc.json ./
COPY ./fe/src/ ./src/
COPY ./fe/public/ ./public/

RUN npm ci
RUN npm run build


# Build step #2: run the Python back end
FROM python:3.7-alpine

WORKDIR /code

ENV FLASK_ENV debug
RUN apk add --no-cache gcc musl-dev linux-headers
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8080
COPY ./be .
COPY --from=build-step /app/build /code/client
CMD ["python",  "serve.py"]
