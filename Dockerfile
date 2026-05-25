# Stage 1: Build the application
FROM node:24.15.0-alpine3.23 AS build

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Set working directory (creates dir automatically)
WORKDIR /app

# Install app dependencies — frozen lockfile for reproducible builds
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build the application
RUN NODE_OPTIONS=--max-old-space-size=4096 pnpm build

# Stage 2: Create the final image
FROM node:24.15.0-alpine3.23 AS prod

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy built application from the build stage and fix ownership
COPY --from=build --chown=appuser:appgroup /app/.output ./.output

# Drop root privileges
USER appuser

# Expose the application port
EXPOSE 3000

# Healthcheck — avoids sending traffic to a container that hasn't started yet
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Start the application — node directly as PID 1 for correct signal handling
CMD ["node", ".output/server/index.mjs"]
