const express = require('express');
const http = require('http');
const { initSocketServer } = require('./socket');


const initExpressServer = async () => {
  const app = express();
  const server = http.createServer(app);
  initSocketServer(server);
  app.use(express.static('public'));
  const PORT = 3000;
  server.listen(PORT)
  console.log(`Server is running on port ${PORT}`)
  return server;
};

module.exports = {
  initExpressServer,
};
