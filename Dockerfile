# Stage 1: Build the Angular frontend
FROM node:18 as build-frontend

# Set the working directory inside the container
WORKDIR /chatApp

# Copy package.json and package-lock.json to the working directory
COPY chatApp/package*.json ./

# Install the dependencies
RUN npm install
RUN npm install -g @angular/cli

# Copy the rest of the frontend application code
COPY chatApp/ .  # Ensure this copies the correct frontend directory

# Build the Angular app for production
RUN ng build --prod

# Stage 2: Set up the backend with the built frontend
FROM node:14

# Set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the backend application code
COPY backend/ .

# Copy the built frontend from the previous stage
COPY --from=build-frontend /chatApp/dist/ /backend/public  # Specify both source and destination

# Expose the port that the backend application will run on
EXPOSE 3000

# Start the backend application
CMD ["npm", "start"]
