FROM node:10-alpine

WORKDIR /app

COPY . .

EXPOSE 4000

RUN npm install

CMD [ "npm", "start" ]