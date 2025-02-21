FROM nginx:latest

RUN mkdir -p /var/www/imgsrv
RUN mkdir -p /etc/nginx/sites-available
RUN mdkir -p /etc/nginx/sites-enabled

COPY imgsrv-config /etc/nginx/sites-available/imgsrv-config
RUN ln -s /etc/nginx/sites-available/imgsrv-config /etc/nginx/sites-enabled/imgsrv-config

RUN chmod +x /vf/cron.sh /vf/startup.sh

COPY defaults/ /var/www/imgsrv/