FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the TypeScript application
RUN npm run build

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist

USER expressjs

EXPOSE 6677
ENV PORT=6677
ENV HOSTNAME="0.0.0.0"

ARG IMAGE_TAG="No Version Available"
ENV IMAGE_TAG=${IMAGE_TAG:-"No Version Available"}

CMD ["node", "dist/app.cjs"]