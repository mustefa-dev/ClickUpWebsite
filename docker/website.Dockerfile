FROM node:current-alpine3.19 AS build
WORKDIR /src

COPY ./src/website/package.json .
COPY ./src/website/package-lock.json .

RUN npm install

COPY ./src/website .

RUN npm run build

FROM nginx:alpine

COPY --from=build ./src/dist /var/www/app
COPY ./src/website/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
