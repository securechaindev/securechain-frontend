FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS dev-builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build

FROM nginx:stable-alpine AS dev-runner

RUN apk add --no-cache gettext curl

COPY --from=dev-builder /app/out /usr/share/nginx/html

COPY dev/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["sh", "-c", "\
  : \"${BACKEND_URL:?Set BACKEND_URL}\" && \
  envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
  exec nginx -g 'daemon off;'"]
