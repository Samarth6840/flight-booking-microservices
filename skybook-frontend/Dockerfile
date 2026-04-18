FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.15.1 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm install -g pnpm@10.15.1 && pnpm install --frozen-lockfile
COPY server ./server
EXPOSE 3000
CMD ["pnpm", "run", "start"]
