
import * as THREE from 'three'

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
var buffers = []

var AudioManager = function() {
    audioLoader.load( 'a.mp3', function( buffer ) {
        buffers.push(buffer);
    });
      
    audioLoader.load( 'b.mp3', function( buffer ) {
        buffers.push(buffer);
    });

    this.getRandomBuffer = function() {
        return buffers[Math.floor(Math.random() * 2)];
    }

    this.isready = function() {
        if (buffers.length == 2)
            return true;
        else   
            return false;    
    }
}


export default AudioManager;

