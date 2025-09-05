# Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp and bcrypt
RUN apk add --no-cache python3 make g++ py3-pip

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all application files
COPY . .

# Create necessary directories
RUN mkdir -p uploads

# Create log files if they don't exist and set permissions
RUN touch combined.log error.log && chmod 666 combined.log error.log

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start the application using the start script from package.json
CMD ["npm", "start"]