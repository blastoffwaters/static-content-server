# Stage 1: Build
FROM node:slim AS builder

ENV NODE_ENV production
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 6677
CMD ["node", "/app/dist/app.js"]