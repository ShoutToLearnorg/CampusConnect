# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install -g @angular/cli
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app for production
RUN ng build --prod

# Install an HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory to the build output directory
WORKDIR /app/dist/your-angular-app-name

# Expose the port that the HTTP server will run on
EXPOSE 8080

# Start the HTTP server
CMD ["http-server", "-p", "8080"]
