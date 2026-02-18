FROM node:20

WORKDIR /nanase-bot
RUN npm install

CMD ["npm", "run", "dev"]
