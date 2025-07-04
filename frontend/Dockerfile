# 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 단계
FROM node:18-alpine AS runner
EXPOSE 3000
CMD ["npm", "run", "start"]
