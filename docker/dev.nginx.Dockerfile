FROM nginx:stable-alpine
COPY ./docker/nginx.dev.conf /etc/nginx/conf.d/default.conf
