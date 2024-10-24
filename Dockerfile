FROM node:20-alpine

#create app directory

WORKDIR /app

#Install app dependacies
COPY package*.json ./

#run NPM INSTALL
RUN npm install

#Bundle app source code
COPY . .

ENV NODE_ENV=production

EXPOSE 8000

CMD ["npm","start"]