import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Controller from './Controller.js'

console.log(process.env);

const socket = new WebSocket('ws://'+process.env.REACT_APP_WEBSOCKET_HOST);

function App() {
  const [state, setGameState] = useState([]);
  

  useEffect(() => {
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        var object =  JSON.parse(event.data);
        //console.log(object)
        setGameState(object);
    });

  },[]);

    

  return (
    <div className="App">
      {state.Players &&
        state.Players.map(player => {
          return <li> name = {player.name} position: x = {player.x},  y = {player.y} </li>;
        })}
      }
      <Controller websocket={socket}>
      </Controller>
    </div>

  );

}

export default App;
