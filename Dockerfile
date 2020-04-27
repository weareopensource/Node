FROM node:lts-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose
EXPOSE 80 443 3000 35729 8080

# Command to run the executable
CMD [ "node", "server.js" ]