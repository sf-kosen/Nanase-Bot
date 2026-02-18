FROM node:20

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
