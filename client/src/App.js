import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [state, setGameState] = useState(0);

  useEffect(() => {
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8081');

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log('Send message to server');
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

  });

  return (
    <div className="App">
    </div>
  );

}

export default App;
