FROM node:20

WORKDIR /test-notice

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
