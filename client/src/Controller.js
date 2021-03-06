import React, { useState, useEffect } from 'react';

function Controller(props) {

  function HandleMove(event) {
    props.websocket.send('keydown:'+event.keyCode);
  }

  useEffect(() => {
    window.addEventListener('keydown', HandleMove);

  },[]);

  return null;

}

export default Controller;