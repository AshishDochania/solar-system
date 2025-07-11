import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import starsT from "/2k_stars.jpg";
import sun from "/2k_sun.jpg";
import juipiter from "/2k_jupiter.jpg";
import mars from "/2k_mars.jpg";
import mercury from "/2k_mercury.jpg";
import neptune from "/2k_neptune.jpg";
import saturnRing from "/2k_saturn_ring_alpha.png";
import saturn from "/2k_saturn.jpg";
import uranus from "/2k_uranus.jpg";
import venus from "/2k_venus_surface.jpg";
import pluto from "/plutomap1k.jpg";
import earth from "/2k_earth_daymap.jpg";
import uranus_ring from "/uranusringcolour.jpg";

const renderer= new Three.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);


renderer.shadowMap.enabled=true;

//create scene
const scene=new Three.Scene();

// renderer.setClearColor(0x000000)
//create camera
const camera=new Three.PerspectiveCamera(
    50,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

// position camera
camera.position.set(-90,140,140);
const orbit=new OrbitControls(camera,renderer.domElement);
orbit.update();

//create amibient light source
const ambientlight=new Three.AmbientLight(0x444444,2);
scene.add(ambientlight);

const directionalLight = new Three.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-50, 50, 50);
scene.add(directionalLight);

// cube texture loader so that we can have a 3d cube in the background
// const cube=new Three.CubeTextureLoader();
// scene.background=cube.load([starsT,starsT,starsT,starsT,starsT,starsT])
// not working
// texture loader for planets
const textureLoader=new Three.TextureLoader();
// scene.background=textureLoader.load(starsT);


// here we will create our planets and sun
const sunGeo=new Three.SphereGeometry(16,30,30);
const sunmap=textureLoader.load(sun);
sunmap.colorSpace=Three.SRGBColorSpace;
const sunTexture=new Three.MeshBasicMaterial({
  map:sunmap
});
const sunball=new Three.Mesh(sunGeo,sunTexture);
scene.add(sunball);

//sun is parent of mercury
// but we will create another parent for murcury as it should at a different speed than the sun


//know we will make a function for making the planets as we have to write the same code for all the planets
function Planet(size,texture,position,ring){
  const Geo=new Three.SphereGeometry(size,30,30);
  const planetmap=textureLoader.load(texture);
  planetmap.colorSpace=Three.SRGBColorSpace;
  const Texture=new Three.MeshStandardMaterial({
    map:planetmap
  });
  const ball=new Three.Mesh(Geo,Texture);
  const Obj=new Three.Object3D();

  Obj.add(ball);
  scene.add(Obj);
  ball.position.x=position;
  if(ring){
    const RingGeo=new Three.RingGeometry(ring.inner,ring.outer,32);
    const ringmap=textureLoader.load(ring.texture);
    ringmap.colorSpace=Three.SRGBColorSpace;
    const RingTexture=new Three.MeshBasicMaterial({
      map:ringmap,
      side:Three.DoubleSide
    });
    const Ringball=new Three.Mesh(RingGeo,RingTexture);
    Obj.add(Ringball);
    Ringball.position.x=position;
    Ringball.rotation.x=-0.5*Math.PI;
  }
  return {ball,Obj}
  // here we are returning ball and obj because we need them to rotate the planet.
}

const planets={
 Mercury:Planet(3.2,mercury,28),
Venus:Planet(5.8 ,venus,44),
 Earth:Planet(6,earth,62),
 Mars:Planet(4,mars,78),
 Jupiter:Planet(12,juipiter,100),
 Saturn:Planet(10,saturn,138,{
  inner:10,
  outer:20,
  texture:saturnRing
}),
 Uranus:Planet(7,uranus,176,{
  inner:7,
  outer:12,
  texture:uranus_ring
}),
 Neptune:Planet(7,neptune,200),
 Pluto:Planet(2.8,pluto,216),
}



// as all the planets rotate around the sun at different speeds but the children of sun will all rotate at the same speed
// so we need to create a parent for all the planets and put it at the exact position as sun so that they rotate at different speeds
// we can create a parent object by using the object 3d class of three js which do not need any mesh material


// making a light which will sit at the centre of the sun which will emit light on other planets
const pointLight=new Three.PointLight(0xFFFFFF,1000,300);
scene.add(pointLight);


// speed control

const speedControls = document.createElement("div");
speedControls.innerHTML = `
    <style>
        div { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 10px; color: white; }
        input { width: 100px; }
    </style>
`;
document.body.appendChild(speedControls);





//animate function to render the camera
// function animate(){
//   // self rotation
//   sunball.rotateY(0.004)
//   planetMercury.ball.rotateY(0.004)
//   planetSaturn.ball.rotateY(0.038)
//   planetEarth.ball.rotateY(0.02)
//   planetNeptune.ball.rotateY(0.032)
//   planetVenus.ball.rotateY(0.002)
//   planetUranus.ball.rotateY(0.03)
//   planetPluto.ball.rotateY(0.039)
//   planetMars.ball.rotateY(0.018)
//   planetJupiter.ball.rotateY(0.008)



//   // rotation around sun
//   planetMercury.Obj.rotateY(0.04)
//   planetSaturn.Obj.rotateY(0.0009)
//   planetVenus.Obj.rotateY(0.015)
//   planetEarth.Obj.rotateY(0.01)
//   planetNeptune.Obj.rotateY(0.0001)
//   planetPluto.Obj.rotateY(0.00007)
//   planetMars.Obj.rotateY(0.008)
//   planetJupiter.Obj.rotateY(0.002)
//   planetUranus.Obj.rotateY(0.0004)




//   renderer.render(scene,camera);
// }

const speedValues = {
    Mercury: 0.04,
    Venus: 0.015,
    Earth: 0.01,
    Mars: 0.008,
    Jupiter: 0.002,
    Saturn: 0.0009,
    Uranus: 0.0004,
    Neptune: 0.0001,
    Pluto: 0.00007
};

// sliders

Object.keys(speedValues).forEach(planet => {
    const label = document.createElement("label");
    label.innerHTML = `${planet}: <input type="range" min="0.00001" max="0.05" step="0.00001" value="${speedValues[planet]}">`;
    speedControls.appendChild(label);

    label.querySelector("input").addEventListener("input", (event) => {
        speedValues[planet] = parseFloat(event.target.value);
    });
});

// Use THREE.Clock for animations
const clock = new Three.Clock();

function animate() {
  // added this if statment for pause button.
  if(!isPaused){
    const deltaTime = clock.getDelta();

    sunball.rotateY(0.004 * deltaTime * 60); // Maintain frame rate independence

    // Rotate planets based on speed values from UI
    // console.log(planets["Saturn"]);
    Object.keys(planets).forEach(planet => {
        planets[planet].ball.rotateY(0.02 * deltaTime * 60);
        planets[planet].Obj.rotateY(speedValues[planet] * deltaTime * 60);
    });


    // movse hover
    raycaster.setFromCamera(mouse, camera);
    const intersectObjects = Object.values(planets).map(p => p.ball);
    const intersects = raycaster.intersectObjects(intersectObjects);

    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      const planetName = Object.keys(planets).find(key => planets[key].ball === hovered);
      if (planetName) {
        label.innerText = planetName;
        label.style.display = "block";
        label.style.left = `${mouseX + 10}px`;
        label.style.top = `${mouseY + 10}px`;
      }
    } else {
      label.style.display = "none";
    }

    renderer.render(scene, camera);
  }
}


//pause button
const pauseButton = document.createElement("button");
pauseButton.innerText = "Pause Animation";
pauseButton.style.position = "absolute";
pauseButton.style.top = "10px";
pauseButton.style.right = "10px";
pauseButton.style.padding = "10px";
pauseButton.style.background = "white";
pauseButton.style.color = "black";
pauseButton.style.border = "none";
pauseButton.style.cursor = "pointer";
document.body.appendChild(pauseButton);

let isPaused = false;
pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume Animation" : "Pause Animation";
});


// stars

const starGeometry = new Three.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 5500; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
}
starGeometry.setAttribute("position", new Three.Float32BufferAttribute(starVertices, 3));
const starMaterial = new Three.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new Three.Points(starGeometry, starMaterial);
scene.add(stars);


// hover effects

const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
// this detects hover

const label = document.createElement("div");
label.style.position = "absolute";
label.style.backgroundColor = "white";
label.style.color = "black";
label.style.padding = "5px";
label.style.display = "none";
label.style.borderRadius = "5px";
label.style.fontSize = "12px";
document.body.appendChild(label);

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  mouseX = event.clientX;
  mouseY = event.clientY;
});


// theme change

const themeToggle = document.createElement("button");
themeToggle.innerText = "Toggle Theme";
themeToggle.style.position = "absolute";
themeToggle.style.top = "50px";
themeToggle.style.right = "10px";
themeToggle.style.padding = "10px";
themeToggle.style.background = "white";
themeToggle.style.color = "black";
themeToggle.style.border = "none";
themeToggle.style.cursor = "pointer";
document.body.appendChild(themeToggle);

let isDarkTheme = true;

themeToggle.addEventListener("click", () => {
  isDarkTheme = !isDarkTheme;
  document.body.style.backgroundColor = isDarkTheme ? "black" : "white";
  themeToggle.style.background = isDarkTheme ? "white" : "black";
  themeToggle.style.color = isDarkTheme ? "black" : "white";
  pauseButton.style.background = isDarkTheme ? "white" : "black";
  pauseButton.style.color = isDarkTheme ? "black" : "white";
  speedControls.style.background = isDarkTheme ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)";
  speedControls.style.color = isDarkTheme ? "white" : "black";
  label.style.backgroundColor = isDarkTheme ? "white" : "black";
  label.style.color = isDarkTheme ? "black" : "white";
});

// set animate function on loop
renderer.setAnimationLoop(animate);

// rendering the screen again on a size change
window.addEventListener('resize',function(){
  camera.aspect=this.window.innerWidth/this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(this.window.innerWidth,this.window.innerHeight);
})