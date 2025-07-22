FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose your desired port (adjust if needed)
EXPOSE 4000

# Run the compiled output (adjust entrypoint as needed)
CMD ["node", "dist/index.js"]


