
import * as THREE from 'three'

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
var buffers = []
var num_audio_files;

var AudioManager = function(soundlists) {

    num_audio_files = soundlists.length;

    soundlists.forEach(element => {
        audioLoader.load( element, function( buffer ) {
            buffers.push(buffer);
        });
        
    });

    this.getRandomBuffer = function() {
        return buffers[Math.floor(Math.random() * num_audio_files)];
    }

    this.isready = function() {
        if (buffers.length == num_audio_files)
            return true;
        else   
            return false;    
    }
}


export default AudioManager;

