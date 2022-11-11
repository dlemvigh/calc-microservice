FROM node:16.16 as build
WORKDIR /app

COPY package* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:16.16-alpine as runner
WORKDIR /app

ENV NODE_ENV production

COPY package* ./
# RUN npm ci --production

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]