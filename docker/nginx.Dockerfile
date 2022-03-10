FROM nginx:stable-alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
