FROM node:lts-slim

# switch user
USER node

# Create app directory
WORKDIR /home/node

# Install app dependencies & setup
COPY --chown=node:node package*.json ./
RUN npm install --production
COPY --chown=node:node . .

# Expose
EXPOSE 80 443 3000 35729 8080

# Command to run
CMD [ "node", "server.js" ]