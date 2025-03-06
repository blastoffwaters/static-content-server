FROM node:slim AS builder
ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm install
# safety for compiling
RUN npm install -D typescript
RUN npm uninstall tsc

RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder . .
EXPOSE 6677
CMD ["node", "/app/dist/app.js"]