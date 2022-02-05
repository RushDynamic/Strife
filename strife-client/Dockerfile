FROM node:14 as builder
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache bash
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
WORKDIR /var/www/strife/html
RUN rm -rf ./*
COPY --from=builder /app/build/ .
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80

#certbot SSL
RUN sudo apt install certbot python3-certbot-nginx
RUN sudo certbot certonly --webroot --webroot-path=/var/www/strife/html --email rushdynamic1ms@gmail.com --agree-tos --no-eff-email -d strife.chat
EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]