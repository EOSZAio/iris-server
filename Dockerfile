FROM node:8
WORKDIR /usr/src/app
COPY . .
RUN npm install

CMD ["node", "iris/IrisServer.js", "-x", "3000", "-e", "3001", "-b", "3002", "-w", "8881"]
