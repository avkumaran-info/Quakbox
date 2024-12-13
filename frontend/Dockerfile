# Choose correct version from Hocker Hub (https://hub.docker.com/)
FROM node:20.9.0-alpine AS development

# Set project working directory inside the container
WORKDIR /react-app

# Copy package.json insite the working directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy all the files in the project working directory
COPY . .

# Expose port 8010 for development server (not really necessary since docker componse port will override it)
EXPOSE 3001

# Start the React development server with hot-reloading
CMD [ "npm", "run", "dev" ]