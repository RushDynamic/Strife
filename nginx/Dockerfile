FROM alpine:latest
RUN apk add --no-cache bash
RUN rm /etc/nginx/conf.d/strife.chat.conf
COPY strife.chat.conf /etc/nginx/conf.d/strife.chat.conf
ENTRYPOINT ["echo", "Copied NGINX config"]