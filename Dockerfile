# ===============================
# Stage 1: Builder
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# ===============================
# Stage 2: Runner
# ===============================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=prod

# Copy build output and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port default Next.js
EXPOSE 9004

# Start Next.js
CMD ["npm", "start"]
