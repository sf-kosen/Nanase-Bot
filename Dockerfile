FROM node:20

WORKDIR /nanase-bot

CMD ["npm", "install"]
CMD ["npm", "run", "dev"]
