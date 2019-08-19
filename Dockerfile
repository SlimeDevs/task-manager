FROM node:10.16.2-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Start the application and expose the port
EXPOSE 8080
CMD ["npm", "start"]