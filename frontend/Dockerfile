# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .


ENV REACT_APP_BACKEND_API_URL "http://localhost:3000"

# Expose port 3000 to the host
EXPOSE 3000

# Build the React application for production
# Command to run the backend (adjust based on your backend)
CMD ["npm", "start"]
