# Stage 1: Building the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy package files
COPY package.json ./

# Generate yarn.lock if it doesn't exist and install dependencies
RUN yarn install --frozen-lockfile || yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Running the application
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Install yarn
RUN apk add --no-cache yarn

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production || yarn install --production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]