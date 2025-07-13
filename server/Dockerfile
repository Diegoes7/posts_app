# Use official Node.js image from Docker Hub
FROM node:20

# Create and set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV NODE_ENV=production

# Install PostgreSQL client (if needed)
# RUN apt-get update && apt-get install -y postgresql-client

# Expose the port your app runs on
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgres://username:password@postgres_host:5432/dbname
ENV REDIS_URL=redis://redis_host:6379

# Compile TypeScript to JavaScript (if needed)
RUN npm run build

# Start the application
CMD ["node", "dist/index.js"]
USER node
