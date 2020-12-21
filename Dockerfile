FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN npm install

RUN npm install -g pm2

RUN npm run build

EXPOSE 3030

CMD ["pm2-runtime", "dist/index.js"]
