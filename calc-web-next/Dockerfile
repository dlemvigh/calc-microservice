FROM node:16.13 as build
WORKDIR /app

COPY package* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:16.13-alpine as runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]