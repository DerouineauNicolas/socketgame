import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Controller from './Controller.js'

const socket = new WebSocket('ws://localhost:8081');

function App() {
  const [state, setGameState] = useState([]);
  

  useEffect(() => {

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log('Send message to server');
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        var object =  JSON.parse(event.data);
        console.log(object)
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
