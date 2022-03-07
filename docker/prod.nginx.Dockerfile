FROM nginx:stable-alpine
COPY ./docker/nginx.prod.conf /etc/nginx/conf.d/default.conf
