FROM node:24 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./

FROM base AS development
RUN pnpm install --frozen-lockfile
COPY . .

CMD ["pnpm", "run", "dev"]

FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production

COPY tsconfig.json ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/build ./build

USER node
EXPOSE 3000

CMD ["node", "-r", "tsconfig-paths/register", "./build/index.js"]
