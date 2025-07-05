# Use official Node.js image as the build environment
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
COPY . .

# Install dependencies (prefer bun if lockfile exists)
RUN if [ -f bun.lockb ]; then \
   npm install -g bun && bun install; \
   else \
   npm install; \
   fi

RUN npm run build || bun run build

# Production image
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]