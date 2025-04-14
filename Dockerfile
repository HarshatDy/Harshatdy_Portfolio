FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

# Command to run the dev server
CMD ["npm", "run", "dev"]