FROM node:24 AS base

ENV PNPM_HOME="/pnpm"
ENV PNPM_CONFIG_STORE_DIR="/pnpm/store"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack install

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS development
COPY . .
CMD ["pnpm", "dev"]

FROM deps AS builder
COPY . .
RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production

RUN pnpm install --frozen-lockfile --prod

# NOTE: 書き込みが発生するなら変更する必要がある
COPY --from=builder /app/build ./build

USER node

CMD ["node", "./build/src/index.js"]
