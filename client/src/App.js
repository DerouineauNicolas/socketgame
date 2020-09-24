import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Controller from './Controller.js'
import Vis from './Viewer.js'

console.log(process.env);

const socket = new WebSocket('ws://'+process.env.REACT_APP_WEBSOCKET_HOST);

function App() {
  const [state, setGameState] = useState([]);
  

  useEffect(() => {
    // Listen for messages
    socket.addEventListener('message', function (event) {
        var object =  JSON.parse(event.data);
        setGameState(object);
    });

  },[]);

    

  return (
    
    <div className="App">
      <Vis gamestate={state}></Vis>
      <Controller websocket={socket}>
      </Controller>
      {state.Players &&
        state.Players.map(player => {
          return <li> name = {player.name} position: x = {player.x},  y = {player.y} score: {player.score} </li>;
        })}
    </div>

  );

}

export default App;
