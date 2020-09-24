const http = require('http');
const WebSocket = require('ws');
const game = require('./game.js');
const express = require('express');


var state = {
  Players: [],
  Points: game.PointsSet(50, 20, 5)
};

function IncreasePlayerPosition(id, direction, minus) {
  console.log("Increase Player" + id);
  state.Players.forEach(function(player, index, object){
    if (player.id === id){
      console.log("found")
      if (direction === "x" && !minus)
        player.x += 1 
      else if (direction === "x" && minus)
        player.x -= 1
      else if (direction === "y" && !minus)
        player.y += 1
      else if (direction === "y" && minus)
        player.y -= 1  
    }
    state.Points.forEach( (points, index, object) => {
      if ((player.x > (points.x-1)  
          && (player.x < (points.x+1)) 
          && (player.y > (points.y-1))  
          && (player.y < (points.y+1)))){
            object.splice(index, 1);
          }
    })
    if (state.Points.length == 0){
      state.Points = game.PointsSet(50, 20, 5);
    }
  });
  
};





// Create a new instance of Express
let app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static('/usr/src/frontend/build/'));
app.get('*', (req, res) => {
  res.sendFile(path.join('/usr/src/frontend/build/index.html'));
});

const server = http.createServer(app);

server.listen(8081);

const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  ws.id = game.getUniqueID();
  var player = new game.Player(ws.id, ws.id);
  state.Players.push(player);
  ws.on('message', function incoming(message) {
      console.log('receivedmessage: %s', message);
      var n = message.lastIndexOf(':');
      var messagetype = message.substring(0, n);
      var messagepayload = message.substring(n + 1);
      if(messagetype === 'keydown'){
        
        if (messagepayload==="38"){
          console.log("increase y")
          IncreasePlayerPosition(ws.id, "y", false)
        }
        if (messagepayload==="40"){
          IncreasePlayerPosition(ws.id, "y", true)
        }
        if (messagepayload==="37"){
          IncreasePlayerPosition(ws.id, "x", true)
        }
        if (messagepayload==="39"){
          IncreasePlayerPosition(ws.id, "x", false)
        }
      }
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
    //console.log(state);
    ws.send(JSON.stringify(state));
  }, 20);
 
});



