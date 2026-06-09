# Stage 1: Build the Angular app
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i && npm run build

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/tuberculosis /usr/share/nginx/html/tuberculosis
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5500
ENTRYPOINT ["nginx", "-g", "daemon off;"]
