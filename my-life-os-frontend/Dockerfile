FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose Port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]