FROM node:20

WORKDIR /nanase-bot

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
