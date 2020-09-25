import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragmentShader from './shader.js'

var oldplayerset = new Set();
var oldpointset = new Set();
var scene;
var gamestate = [];
var num_player = 1;
// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();

// create a global audio source
var soundAmbiance = new THREE.Audio( listener );
var anote = new THREE.Audio( listener );
var bnote = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'ambiance.mp3', function( buffer ) {
	soundAmbiance.setBuffer( buffer );
	soundAmbiance.setLoop( true );
	soundAmbiance.setVolume( 0.5 );
	soundAmbiance.play();
});

audioLoader.load( 'a.mp3', function( buffer ) {
	anote.setBuffer( buffer );
	anote.setVolume( 0.5 );
});
//var time = 1;


function initGameContext(mount)
{
  let width = mount.current.clientWidth
  let height = mount.current.clientHeight
  let frameId;


  scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })

  var planegeometry = new THREE.PlaneGeometry( 50, 20, 32 );

  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const planematerial = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  
  var plane = new THREE.Mesh( planegeometry, planematerial );


  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set(0, 0, 5);
  scene.add( directionalLight );

  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5);
  directionalLight2.position.set(-20, -50, 50);
  scene.add( directionalLight2 );
  
  var controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set( 0, 20, 100 );
  controls.update();
  controls.enableKeys = false;


  scene.add(plane);

  camera.position.z = 50;
  camera.position.y = -50;
  camera.up.set( 0, 0, 1 );
  camera.lookAt(0, 0, 0);
  //renderer.setClearColor('#000000')
  renderer.setSize(width, height)

  const renderScene = () => {
    renderer.render(scene, camera)
  }

  const handleResize = () => {
    width = mount.current.clientWidth
    height = mount.current.clientHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderScene()
  }
  
  const animate = (time) => {
    if(gamestate.Players){
      let newplayerset = new Set();
      let newpointset = new Set();
      // 1, Add new player, and update positions of the old ones
      gamestate.Players.map((player, index) => {
        var mesh = scene.getObjectByName( player.name)
        if (!mesh){
          const geometry = new THREE.BoxGeometry(1, 1, 1)
          const material = new THREE.MeshLambertMaterial({ color: ((255.0)/(10.0)) * num_player * 0xffffff })
          var cube = new THREE.Mesh( geometry, material );
          cube.name = player.name;
          cube.position.set( player.x, player.y, 1 );
          cube.visible = true;
          scene.add(cube);
          oldplayerset.add(player.name);
          num_player++;
        }
        else{
          mesh.position.set( player.x, player.y, 1 );
        }
        newplayerset.add(player.name);
      })
      // 2, Remove players which are not in the game anymore
      let difference = new Set(
        [...oldplayerset].filter(x => !newplayerset.has(x)));

      difference.forEach( element => {
              var mesh = scene.getObjectByName( element);
              if(mesh){
                scene.remove(mesh);
                /*TBD: Memory should be cleared here !!! */
              }
          }
        
      );

      // 3, Add new points, and update positions of the old ones
      gamestate.Points.map((point, index) => {
        var mesh = scene.getObjectByName( point.id)
        if (!mesh){
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshLambertMaterial({ color:0xff0000} );
          var cube = new THREE.Mesh( geometry, material );
          cube.name = point.id;
          cube.position.set( point.x, point.y, 1 );
          cube.visible = true;
          scene.add(cube);
          oldpointset.add(point.id);
          //num_player++;
        }
        newpointset.add(point.id);
      })

      // 4, Remove points which are not in the game anymore
      difference = new Set(
        [...oldpointset].filter(x => !newpointset.has(x)));

      difference.forEach( element => {
              var mesh = scene.getObjectByName( element);
              if(mesh){
                scene.remove(mesh);
                /*TBD: Memory should be cleared here !!! */
                anote.play();
              }
          }
        
      );

    }
    time *= 0.001;  // convert to seconds
    uniforms.iResolution.value.set(mount.current.clientWidth, mount.current.clientHeight, 1);
    uniforms.iTime.value = time;
    controls.update();

    renderer.render( scene, camera );
    renderScene()
    frameId = window.requestAnimationFrame(animate);
  }

  const start = () => {
    if (!frameId) {
      frameId = requestAnimationFrame(animate)
    }
  }

  const stop = () => {
    cancelAnimationFrame(frameId)
    frameId = null
  }

  mount.current.appendChild(renderer.domElement)
  window.addEventListener('resize', handleResize)
  start()

}


const Vis = (props) => {
    const { useRef, useEffect, useState } = React
    const mount = useRef(null);
    gamestate = props.gamestate;
    
    useEffect(() => {
      initGameContext(mount);
    }, [])

    return (
        <div className="vis" ref={mount}>
          <div className="label" ref={mount}> Use → ↑ ← ↓ to move around the game</div>
       </div>
    )
  }

  export default Vis;
