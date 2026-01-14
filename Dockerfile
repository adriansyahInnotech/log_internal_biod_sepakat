# --- Stage 1: Build the app ---
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Yarn via Corepack (optional, tapi direkomendasikan)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy dependency files terlebih dahulu (agar cache lebih efisien)
COPY package.json ./

# Install dependencies (pakai frozen lockfile agar reproducible)
RUN yarn install --frozen-lockfile

# Copy semua source code
COPY . .

# Build Next.js app
RUN yarn build

# --- Stage 2: Run the app ---
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

# Copy hasil build dari stage builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 9004

CMD ["yarn", "start"]
