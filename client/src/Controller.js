import React, { useState, useEffect } from 'react';

function Controller(websocket) {

  function HandleMove(event) {
    console.log("key down");
    console.log(event.keyCode);
  }
  
  window.addEventListener('keydown', HandleMove);

  return null;

}

export default Controller;