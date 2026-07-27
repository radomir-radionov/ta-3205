# syntax=docker/dockerfile:1

# alpine:3.22 has no critical/high CVEs (unlike node:22-alpine's bundled npm).
# Use nodejs-current (not nodejs) — Alpine's nodejs package pulls vulnerable sqlite-libs.
FROM alpine:3.22 AS deps
RUN apk add --no-cache nodejs-current npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
# @typescript/native ships a glibc binary; on Alpine use the JS tsc instead.
RUN node node_modules/@typescript/old/lib/tsc.js -p tsconfig.build.json

FROM alpine:3.22 AS prod-deps
RUN apk add --no-cache nodejs-current npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Runtime without npm — no bundled-npm CVEs.
FROM alpine:3.22 AS runner
RUN apk add --no-cache nodejs-current \
  && addgroup -S node && adduser -S node -G node
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
