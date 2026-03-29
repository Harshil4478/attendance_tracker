# Node image
FROM node:18

# Working folder
WORKDIR /app

# Copy files
COPY package*.json ./

# Install deps
RUN npm install

# Copy all code
COPY . .

# Run app
CMD ["node", "server.js"]

# Port
EXPOSE 3000