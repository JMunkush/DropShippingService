FROM node:20

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:prod"]