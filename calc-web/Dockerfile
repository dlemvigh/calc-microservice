FROM node:16.11 as deps
WORKDIR /app
COPY package* ./
RUN npm ci
COPY . ./

FROM node:16.11 as build
WORKDIR /app
ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL $REACT_APP_BASE_URL
COPY --from=deps /app ./
RUN npm run test:func -- --watchAll=false
RUN npm run build


FROM nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]