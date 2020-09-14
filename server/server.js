const http = require('http');
const WebSocket = require('ws');
const game = require('./game.js');

const server = http.createServer({
});
const wss = new WebSocket.Server({ server });

var state = {
  Players: [],
};


wss.on('connection', function connection(ws) {
  var player = new game.Player(1, "toto");
  state.Players.push(player);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  setInterval(function() {
    console.log(state);
    ws.send(JSON.stringify(state));
  }, 500);
 
});

server.listen(8081);