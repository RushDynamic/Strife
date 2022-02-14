FROM alpine:latest
RUN apk add --no-cache bash
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
WORKDIR /usr/share/nginx/strife-html
RUN rm -rf ./*
COPY --from=builder /app/build/ .
RUN rm /etc/nginx/conf.d/strife.chat.conf
COPY strife.chat.conf /etc/nginx/conf.d/strife.chat.conf
ENTRYPOINT ["echo", "Copied NGINX config"]