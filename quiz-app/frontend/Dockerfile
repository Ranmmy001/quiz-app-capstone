# ---- Build stage: compile the React app ----
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000 \
    && npm ci

COPY . .

# Baked in at BUILD time (this is how Vite env vars work).
# "/api" is a relative path -> works identically on Minikube, EKS, anywhere,
# because nginx below forwards it to the backend internally.
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# ---- Serve stage: lightweight nginx, not node+serve ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]