FROM node:14 as build-deps
WORKDIR /app
COPY package* ./
RUN npm ci

FROM node:14 as runtime-deps
WORKDIR /app
COPY package* ./
RUN npm ci --production


FROM node:14 as build
WORKDIR /app
COPY --from=build-deps /app ./
COPY . ./
RUN npm run build

FROM node:14 as test
WORKDIR /app
COPY --from=build-deps /app ./
COPY . ./
RUN npm run test

FROM node:14-alpine
WORKDIR /app
COPY --from=runtime-deps /app ./
COPY --from=build /app/build ./

EXPOSE 80
CMD ["node", "index.js"]
