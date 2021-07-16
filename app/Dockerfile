# syntax=docker/dockerfile:1
FROM node:alpine AS build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build:production
RUN ls /app/dist

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/