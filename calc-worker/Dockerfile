FROM node:17.0 as build-deps
WORKDIR /app
COPY package* ./
RUN npm ci

FROM node:17.0 as runtime-deps
WORKDIR /app
COPY package* ./
RUN npm ci --production


FROM node:17.0 as build
WORKDIR /app
COPY --from=build-deps /app ./
COPY . ./
RUN npm run test
RUN npm run build

FROM node:17.0-alpine
WORKDIR /app
COPY --from=runtime-deps /app ./
COPY --from=build /app/build ./

EXPOSE 80
CMD ["node", "index.js"]
