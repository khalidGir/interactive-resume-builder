# This is a multi-stage Dockerfile that can build either frontend or backend
# Use build arguments to determine which to build

ARG APP_TYPE=backend
ARG WORK_DIR=/app

FROM node:18-alpine AS base
WORKDIR ${WORK_DIR}
COPY package*.json ./
RUN npm ci

# Backend build stage
FROM base AS backend-builder
COPY . .
RUN npm run build

# Frontend build stage  
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY apps/frontend/package*.json ./
RUN npm ci
COPY apps/frontend/ .
RUN cd apps/frontend && npm run build


# Backend production stage
FROM node:18-alpine AS backend-runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=backend-builder /app/dist ./dist
EXPOSE 8000
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]

# Frontend production stage
FROM node:18-alpine AS frontend-runner
WORKDIR /app
COPY apps/frontend/package*.json ./
RUN npm ci --only=production --prefix apps/frontend
COPY --from=frontend-builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=frontend-builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=frontend-builder /app/apps/frontend/next.config.js ./apps/frontend/next.config.js
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start", "--prefix", "apps/frontend"]

# Default to backend
FROM backend-runner