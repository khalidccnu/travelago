FROM node:latest as nodework

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=nodework /app/dist .

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
