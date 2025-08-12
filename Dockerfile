FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG BACKEND_URL

ENV BACKEND_URL=${BACKEND_URL}

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

RUN corepack enable pnpm && pnpm run build

FROM nginx:stable-alpine AS runner

ENV BACKEND_URL=${BACKEND_URL}

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["sh", "-c", "envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
