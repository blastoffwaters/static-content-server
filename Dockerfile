FROM nginx:latest

RUN mkdir -p /var/www/imgsrv
RUN mkdir -p /etc/nginx
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY defaults/ /var/www/imgsrv/