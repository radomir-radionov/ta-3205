# syntax=docker/dockerfile:1

# alpine:3.22 has no critical/high CVEs (unlike node:22-alpine's bundled npm).
# Use nodejs-current (not nodejs) — Alpine's nodejs package pulls vulnerable sqlite-libs.
FROM alpine:3.22 AS build
RUN apk add --no-cache nodejs-current npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Prefer JS tsc on Alpine; @typescript/native is glibc-only.
RUN node node_modules/@typescript/old/lib/tsc.js -b && npx vite build

# nginx:alpine (current) is clean; nginx:1.27-alpine still has many OS CVEs.
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
