FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++ py3-pip
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p uploads && touch combined.log error.log && chmod 666 combined.log error.log
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"
CMD ["npm", "start"]
