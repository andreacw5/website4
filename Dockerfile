# Stage 1: Build the application
FROM node:23.6.0-alpine3.21 AS build

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && pnpm store prune

# Bundle app source
COPY . .

# Build the application
RUN NODE_OPTIONS=--max-old-space-size=4096 pnpm build

# Stage 2: Create the final image
FROM node:23.6.0-alpine3.21

# Set working directory
WORKDIR /app

# Copy built output from the build stage (.output contains everything, including native binaries)
COPY --from=build /app/.output ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server/index.mjs"]
