FROM node:16.16 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16.16-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --production
COPY --from=build /app/build .

EXPOSE 80
CMD ["node", "index.js"]