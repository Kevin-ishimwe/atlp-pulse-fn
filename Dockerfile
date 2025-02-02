# Using node:16-alpine base image
FROM node:16-alpine AS builder

# Set the default work directory
WORKDIR /app

# Add the backend application in environment variables
ENV BACKEND_URL=https://devpulse-backend.devpulse.co

# copy package.json to the working directory for packages installation
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy all the project files to the working directory
COPY . .

# Build your project
RUN npm run build

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# command to run

CMD [ "nginx", "-g", "daemon off;" ]
