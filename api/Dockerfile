# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"] 