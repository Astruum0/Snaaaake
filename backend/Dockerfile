FROM node:alpine

# Selection du workdir
WORKDIR /usr/src/app

# Mv du package.json
COPY package*.json ./

# Npm install pour prod
RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]

# Ouverture du port 3000
EXPOSE 3000
