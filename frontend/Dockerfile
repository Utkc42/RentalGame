# Use an official Node.js runtime as a parent image
FROM node:20.12.0-alpine

# Declaring env
ENV NODE_ENV development

# Set the working directory in the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of your application's source code to the working directory
COPY . .

# Copy .env file to the working directory
COPY .env ./

# Expose the port that your app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["yarn", "run", "dev"]
