import React, { Component } from 'react'
import * as THREE from 'three'

var oldplayerset = new Set();
var oldpointset = new Set();
var scene;
var gamestate = [];
var num_player = 1;


function initGameContext(mount)
{
  let width = mount.current.clientWidth
  let height = mount.current.clientHeight
  let frameId


  scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })


  var planegeometry = new THREE.PlaneGeometry( 50, 20, 32 );

  var planematerial = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
  });
  
  var plane = new THREE.Mesh( planegeometry, planematerial );


  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set(0, 0, 5);
  scene.add( directionalLight );

  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5);
  directionalLight2.position.set(-20, -50, 50);
  scene.add( directionalLight2 );  


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
  
  const animate = () => {
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

      console.log(oldpointset);
      console.log(newpointset)

      // 4, Remove points which are not in the game anymore
      difference = new Set(
        [...oldpointset].filter(x => !newpointset.has(x)));

      difference.forEach( element => {
              var mesh = scene.getObjectByName( element);
              if(mesh){
                scene.remove(mesh);
                /*TBD: Memory should be cleared here !!! */
              }
          }
        
      );

    }
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
       </div>
    )
  }

  export default Vis;
