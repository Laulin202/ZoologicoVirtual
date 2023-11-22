// ----------------------------
// Inicialización de Variables:
// ----------------------------

var buttonTime;

var scene = null,
  camera = null,
  renderer = null,
  controls = null,
  clock = null,
  estadoDia = "dia";


var modelLoad = null,
  light = null,
  light2 = null,
  figuresGeo = [];


var color = new THREE.Color();

var scale = 1;
var rotSpd = 0.05;
var spd = 0.1;
var input = { left: 0, right: 0, up: 0, down: 0 };

var posX = 3;
var posY = 0.5;
var posZ = 1;

//PRUEBA
var plane;
var t = 0;
var group = new THREE.Group();

// ----------------------------
//Variables: Posición x y z de los animales.
// ----------------------------

var posLeon = [-16, -0.3, -1]
var posJaguar = [27, -0.3, -10]
var posTucan = [17.6, 0.7, -20]
var posOso = [19, -0.5, 17]

// ----------------------------
//Variables: Sonidos de los animales.
// ----------------------------

var sound1 = null, //Sonido Leon
  sound2 = null,  //Sonido Jaguar
  sound3 = null,  //Sonido Tucan
  sound4 = null;  //Sonido Oso 

// ----------------------------
//Variables: Posiciones de los arboles
// ----------------------------
const PinePositions = [
  [22, -0.7, 7.94],
  [28, -0.7, 7.46],
  [13.9, -0.7, 14.4],
  [18, -0.7, 24],
  [28.4, -0.7, 21.1],
  [9.9, -0.7, 17.9],
  [-2.4, -0.7, 12.6]
];
const AcaciaPositions = [
  [-14, -0.7, 7.9],
  [-14.6, -0.7, -9.7]
];
const banana1Positions = [
  [10.1, -0.5, -20.9],
  [12.2, -0.5, -17.5],
  [27.8, -0.5, -15.9],
  [17.8, -0.5, -5.75]
];
const banana2Positions = [
  [25.4, -0.5, -5.12],
  [10.4, -0.5, -14.7],
  [27.01, -0.5, -13.7],
  [12.3, -0.5, -22.9]
];
const RubberPositions = [
  [26.6, -0.5, -23.3]
];

// ----------------------------
// Funciones de creación init:
// ----------------------------
function start() {

  window.onresize = onWindowResize;
  initScene();
  animate();
}

function onWindowResize() {

  // Update the aspect ratio of the camera based on the new window dimensions
  camera.aspect = window.innerWidth / window.innerHeight;

  // Update the projection matrix of the camera to ensure proper rendering
  camera.updateProjectionMatrix();

  // Update the size of the renderer to match the new window dimensions
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initScene() {

  initBasicElements(); // Scene, Camera and Render
  initSound();         // To generate 3D Audio
  createLight();       // Create light
  initWorld();         // Load map, animals and educational info.
  createPlayerMove();  // Movement of the player
}

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  movePlayer();

  //Animals sounds animations
  sound1.update(camera);
  sound2.update(camera);
  sound3.update(camera);
  sound4.update(camera);

  //Sign's animation 
  t += 0.01;
  const y = (0.1 * Math.sin(2 * t)) + 1;
  group.position.set(0, y, 0);

}

function initBasicElements() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
  clock = new THREE.Clock();
  scene.fog = new THREE.Fog(0xffffff, 0, 750);
  renderer.setSize(window.innerWidth, window.innerHeight - 4);
  document.body.appendChild(renderer.domElement);
  loadBackground('./img/lightSky.jpg');

  camera.position.x = 3;
  camera.position.y = 1;
  camera.position.z = 1;

  playAudio(y);
}

function initSound() {

  sound1 = new Sound(["./sounds/lion/rugLion.mp3"], 6, scene, {
    position: { x: posLeon[0], y: posLeon[1], z: posLeon[2] },
    debug: false,
  });
  sound2 = new Sound(["./sounds/tucan/sonTucan.mp3"], 6, scene, {
    position: { x: posTucan[0], y: posTucan[1], z: posTucan[2] },
    debug: false,
  });
  sound3 = new Sound(["./sounds/jaguar/jaguar.mp3"], 6, scene, {
    position: { x: posJaguar[0], y: posJaguar[1], z: posJaguar[2] },
    debug: false,
  });
  sound4 = new Sound(["./sounds/bear/rugOso.mp3"], 6, scene, {
    position: { x: posOso[0], y: posOso[1], z: posOso[2] },
    debug: false,
  });

  sound1.play(); //Leon sound
  sound2.play(); //Toucan Sound
  sound3.play(); //Jaguar Sound
  sound4.play(); //Grizzly Sound
}

function createGLTFLoader(path, position, scale, rotationY) {

  const loader = new THREE.GLTFLoader().setPath(path);

  loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.y = rotationY;
    scene.add(mesh);
  });
}

function loadAnimals() {

  createGLTFLoader('./modelos/animals/lion/', posLeon, [5, 5, 5], 2.79);
  createGLTFLoader('./modelos/animals/jaguar/', posJaguar, [1.3, 1.3, 1.3], 4.71);
  createGLTFLoader('./modelos/animals/tucan/', posTucan, [0.1, 0.1, 0.1], 3.14);
  createGLTFLoader('./modelos/animals/oso/', posOso, [1, 1, 1], 3.14);
}

function loadTrees() {

  //Normal tree
  createGLTFLoader('./modelos/other/oak/', [3.7, -1, -0.9], [1, 1, 1], 0);
  // Savahna's Trees
  for (let i = 0; i < AcaciaPositions.length; i++) {
    createGLTFLoader('./modelos/other/acacia/', AcaciaPositions[i], [1, 1, 1], 0);
  }
  //Forest's Trees
  for (let i = 0; i < PinePositions.length; i++) {
    createGLTFLoader('./modelos/other/pine/', PinePositions[i], [3, 3, 3], 0);
  }
  //Jungle's trees
  for (let i = 0; i < RubberPositions.length; i++) {
    createGLTFLoader('./modelos/other/rubber/', RubberPositions[i], [0.01, 0.01, 0.01], 0);
  }
  for (let i = 0; i < banana1Positions.length; i++) {
    createGLTFLoader('./modelos/other/banana/', banana1Positions[i], [0.1, 0.1, 0.1], 0);
  }
  for (let i = 0; i < banana2Positions.length; i++) {
    createGLTFLoader('./modelos/other/banana2/', banana2Positions[i], [2, 2, 2], 0);
  }
}

function createFistModel(generalPath, pathMtl, pathObj) {

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(pathMtl, function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(generalPath);
    objLoader.load(pathObj, function (object) {

      modelLoad = object;
      figuresGeo.push(modelLoad);
      scene.add(object);
      object.scale.set(2, 2, 2);

      object.position.y = -1;
      object.position.x = 5;

    });
  });
}

function addVideos() {

  let video = document.getElementById("video");
  video.load();
  video.play();

  const texture = new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

  const geometry = new THREE.PlaneGeometry(4, 2);
  const plano = new THREE.Mesh(geometry, material);
  plano.position.y = 1.5;
  plano.position.z = -22;
  scene.add(plano);
}

function createPlaneGeometry(path, position, rotation = 0) {

  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

  const geometry = new THREE.PlaneGeometry(2, 2);
  plane = new THREE.Mesh(geometry, material);
  plane.position.x = position[0];
  plane.position.z = position[1];
  plane.rotation.y = rotation;
  group.add(plane);
}

function addInfo() {

  createPlaneGeometry('./img/info/lion.png', [-16, 1], 1.57); //x & z positions of the plane
  createPlaneGeometry('./img/info/jaguar.png', [27, -8], 4.71);
  createPlaneGeometry('./img/info/toucan.png', [16, -20]);
  createPlaneGeometry('./img/info/brown bear.png', [16, 19]);
  //Habitats info
  createPlaneGeometry('./img/info/tropical jungle.png', [19, -8], 3.14);
  createPlaneGeometry('./img/info/savahna.png', [-12.5, -6]);
  createPlaneGeometry('./img/info/forest.png', [1, 12]);
  scene.add(group);
}

function createLight() {

  light = new THREE.AmbientLight(0xffffff, 0.9);
  light.position.set(10, 10, 10);
  scene.add(light);

  light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(-20, 10, 10)
  scene.add(light2);
  light2.castShadow = true;
}

function initWorld() {

  createFistModel("./modelos/Base/", "base 1.mtl", "base 1.obj");
  loadAnimals();
  loadTrees();
  addVideos();
  addInfo();
}


// ----------------------------------
// Functions to move the player:
// ----------------------------------
function movePlayer() {

  if (input.right == 1) {
    camera.rotation.y -= rotSpd;
    MovingCube.rotation.y -= rotSpd;
  }
  if (input.left == 1) {
    camera.rotation.y += rotSpd;
    MovingCube.rotation.y += rotSpd;
  }

  if (input.up == 1) {
    camera.position.z -= Math.cos(camera.rotation.y) * spd;
    camera.position.x -= Math.sin(camera.rotation.y) * spd;

    MovingCube.position.z -= Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x -= Math.sin(camera.rotation.y) * spd;
  }
  if (input.down == 1) {
    camera.position.z += Math.cos(camera.rotation.y) * spd;
    camera.position.x += Math.sin(camera.rotation.y) * spd;

    MovingCube.position.z += Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x += Math.sin(camera.rotation.y) * spd;
  }
}

window.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case 68:
      input.right = 1;
      break;
    case 65:
      input.left = 1;
      break;
    case 87:
      input.up = 1;
      break;
    case 83:
      input.down = 1;
      break;
    case 27:
      document.getElementById("blocker").style.display = 'block';
      break;
  }
});


window.addEventListener('keyup', function (e) {
  switch (e.keyCode) {
    case 68:
      input.right = 0;
      break;
    case 65:
      input.left = 0;
      break;
    case 87:
      input.up = 0;
      break;
    case 83:
      input.down = 0;
      break;
  }
});


function loadBackground(path) {
  const loader = new THREE.TextureLoader();
  loader.load(path, function (texture) {
    scene.background = texture;
  });
}

function changeTime() {
  switch (estadoDia) {
    case "dia":

      scene.dispose(); //Delete previous resources of the scene's background
      loadBackground('./img/nightSky.jpg');
      estadoDia = "noche";
      light.intensity = 0.3;
      //Switch audios
      pauseAudio(x);
      playAudio(z);

      break;
    case "noche":

      scene.dispose(); //Delete previous resources of the scene's background
      loadBackground('./img/lightSky.jpg');
      estadoDia = "dia";
      light.intensity = 0.9;
      //Switch audios
      pauseAudio(z);
      playAudio(x);

      break;
    default:
      console.log("Ninguno");
  }
}

// ----------------------------------
// Funciones llamadas desde el index:
// ----------------------------------

function go2Play() {
  pauseAudio(y);
  document.getElementById('instrucciones').style.display = 'none'; //Blocks the instruction's Screen
  document.getElementById('buttonShow').style.display = 'block'; //Unlock the Button of "Switch Time"

  playAudio(x);
}

function goToInstructions() {
  document.getElementById('blocker').style.display = 'none'; //Blocks main screen
  document.getElementById('instrucciones').style.display = 'block'; //Unlock the instruction's Screen
}


function createPlayerMove() {
  var cubeGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.0 });
  MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
  MovingCube.position.set(camera.position.x, camera.position.y, camera.position.z);
  scene.add(MovingCube);
}

/*
function createFrontera() {
  var cubeGeometry = new THREE.CubeGeometry(12, 5, 12, 1, 1, 1);
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.0 });
  worldWalls = new THREE.Mesh(cubeGeometry, wireMaterial);
  worldWalls.position.set(5, 0, 0);
  scene.add(worldWalls);
  collidableMeshList.push(worldWalls);
}
*/


