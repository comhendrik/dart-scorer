# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the backend's port (adjust if your backend uses a different port)
EXPOSE 3000

# Command to run the backend (adjust based on your backend)
CMD ["npm", "start"]