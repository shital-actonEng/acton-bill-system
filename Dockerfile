# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the app
CMD npm run dev