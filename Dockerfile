FROM node:8
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
EXPOSE 3001
EXPOSE 8800
CMD ["node", "iris/IrisServer.js", "-x", "3000", "-e", "3001"]
