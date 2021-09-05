FROM node:14 as deps

WORKDIR /app
COPY package* ./
RUN npm ci
COPY . ./


FROM node:14 as build
WORKDIR /app
COPY --from=deps /app ./
RUN npm run build


FROM node:14 as test
WORKDIR /app
COPY --from=deps /app ./
RUN npm run test --watchAll=false


FROM nginx:1.12-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD [nginx, "-g", "daemon off;"]