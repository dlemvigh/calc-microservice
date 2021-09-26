FROM node:16.10 as build-deps
WORKDIR /app
COPY package* ./
RUN npm ci

FROM node:16.10 as runtime-deps
WORKDIR /app
COPY package* ./
RUN npm ci --production


FROM node:16.10 as build
WORKDIR /app
COPY --from=build-deps /app ./
COPY . ./
RUN npm run build

FROM node:16.10 as test
WORKDIR /app
COPY --from=build-deps /app ./
COPY . ./
RUN npm run test

FROM node:16.10-alpine
WORKDIR /app
COPY --from=runtime-deps /app ./
COPY --from=build /app/build ./

EXPOSE 80
CMD ["node", "index.js"]
