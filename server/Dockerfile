FROM node:lts-alpine

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
