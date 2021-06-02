const ws = require('ws');
const sockets = [];
const setUp = (expressServer)=> {
  const socketServer = new ws.Server({ server: expressServer });
  socketServer.on('connection', (socket)=> {
    sockets.push(socket);
  });
};

module.exports = {
  setUp,
  getSockets: ()=> sockets
};
