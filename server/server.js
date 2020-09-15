const http = require('http');
const WebSocket = require('ws');
const game = require('./game.js');

const server = http.createServer({
});
const wss = new WebSocket.Server({ server });

var state = {
  Players: [],
};

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};


wss.on('connection', function connection(ws) {
  ws.id = getUniqueID();
  var player = new game.Player(ws.id, ws.id);
  state.Players.push(player);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.onclose = function(e) {
    console.log("close");
    state.Players.forEach(function(player, index, object){
      if (player.id === ws.id){
        object.splice(index, 1);
      }
    });
  };

  setInterval(function() {
    ws.send(JSON.stringify(state));
  }, 500);
 
});

server.listen(8081);