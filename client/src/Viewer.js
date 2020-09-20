import React, { Component } from 'react'
import * as THREE from 'three'

var cubes = [];
var scene;

const Vis = (props) => {
    const { useRef, useEffect, useState } = React
    const mount = useRef(null)
    const [isAnimating, setAnimating] = useState(true)
    const controls = useRef(null)
    
    useEffect(() => {
      let width = mount.current.clientWidth
      let height = mount.current.clientHeight
      let frameId
      console.log(props);
  
      scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })

      var planegeometry = new THREE.PlaneGeometry( 50, 20, 32 );
      var planematerial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
      var plane = new THREE.Mesh( planegeometry, planematerial );

      for(var i = 0; i< 10;i++){
        var cube = new THREE.Mesh( geometry, material );
        scene.add(cube);
        cubes.push(cube);
      }


      scene.add(plane);
  
      camera.position.z = 50;
      camera.position.y = 50;
      camera.up.set( 0, 0, 1 );
      camera.lookAt(0, 0, 0);
      renderer.setClearColor('#000000')
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
        if(props.gamestate.Players){
          props.gamestate.Players.map((player, index) => {
            cubes[index].position.x = player.x;
            cubes[index].position.y = player.y;
          })
          console.log(cubes);
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
  
      controls.current = { start, stop }
      
      return () => {
        stop()
        window.removeEventListener('resize', handleResize)
        mount.current.removeChild(renderer.domElement)
  
        //scene.remove(cube)
        geometry.dispose()
        material.dispose()
      }
    }, [])
  
    useEffect(() => {

        controls.current.start()

    }, [isAnimating])

    const activateLasers = () => {
      console.log(props.gamestate.Players);
    }
    
    return <div className="vis" ref={mount} onClick={activateLasers}/>
  }

  export default Vis;