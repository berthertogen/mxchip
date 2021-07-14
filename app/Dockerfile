# syntax=docker/dockerfile:1
FROM node:current-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD [ "node", "server.js" ]