# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Production stage - chỉ cần serve static files
FROM node:18-alpine

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy build folder từ builder stage
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Start serve command
CMD ["serve", "-s", "build", "-l", "3000"]
