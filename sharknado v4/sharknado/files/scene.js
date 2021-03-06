"use strict";

main();

function main(){

  const sceneThreeJs = {
    sceneGraph: null,
    camera: null,
    renderer: null,
    controls: null
  };

  // Données pour le dessin
  // contient le mode actuel : body, fin, jaw...
  const drawingData = {
    drawingObjects: [],
    currentShape: null,
    currentShapeSym: null,
    selectedObject: null,
    enableDrawing: false,
    drawing3DPoints:[],
    drawing3DPointsSym:[],
    line: null,
    body:null,
    lineTab:[],
    finMode:false,
    bodyMode:true,
    tornadoMode:false,
    removeMode:false,
    epaisseur:5,
    // contient les requins dessines
    sharkTab: [],
  };

  initEmptyScene(sceneThreeJs);
  init3DObjects(sceneThreeJs.camera,sceneThreeJs.sceneGraph, drawingData);

  const screenSize = {
    w:sceneThreeJs.renderer.domElement.clientWidth,
    h:sceneThreeJs.renderer.domElement.clientHeight
  };

  const raycaster = new THREE.Raycaster();
  ///////////// Mouse Events ////////////////////////////////////////////////////////////
  const wrapperMouseDown = function(event) { mouseEvents.onMouseDown(event,sceneThreeJs.sceneGraph, sceneThreeJs.camera, raycaster, screenSize, drawingData); };
  document.addEventListener( 'mousedown', wrapperMouseDown );

  const wrapperMouseMove = function(event) { mouseEvents.onMouseMove(event, sceneThreeJs.sceneGraph, sceneThreeJs.camera, raycaster, screenSize, drawingData) };
  document.addEventListener( 'mousemove', wrapperMouseMove );

  const wrapperMouseUp = function(event) { mouseEvents.onMouseUp(event, sceneThreeJs.sceneGraph, sceneThreeJs.camera, raycaster, screenSize, drawingData); };
  document.addEventListener( 'mouseup', wrapperMouseUp );

  ///////////// Keyboard Events ////////////////////////////////////////////////////////////

  const wrapperKeyDown = function(event) { keyboardEvents.onKeyDown(event, sceneThreeJs.sceneGraph, sceneThreeJs.camera, screenSize, drawingData) };
  document.addEventListener( 'keydown', wrapperKeyDown );

  animationLoop(sceneThreeJs);
}


function init3DObjects(camera,sceneGraph, drawingData) {

  const planeGeometry = primitive.Quadrangle(new THREE.Vector3(-100,-50,0),new THREE.Vector3(-100,50,0),new THREE.Vector3(100,50,0),new THREE.Vector3(100,-50,0));
  const materialGround = new THREE.MeshPhongMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide, opacity: 0.2, transparent:true,});

  const plane = new THREE.Mesh(planeGeometry,materialGround);

  plane.name="plane";
  drawingData.drawingObjects.push(plane);
  sceneGraph.add(plane);
  drawingData.currentShape = new THREE.Shape();
}


function initEmptyScene(sceneThreeJs, affichageElement) {
  sceneThreeJs.sceneGraph = new THREE.Scene();
  sceneThreeJs.sceneGraph.background = new THREE.Color(0xB0E0E6);

  sceneThreeJs.camera = sceneInit.createCamera(0.47,0.68,138)
  sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
  const spotLight1 = sceneInit.insertLight(sceneThreeJs.sceneGraph,sceneThreeJs.camera.position);
  spotLight1.name = "spotLight1";

  const spotLight2 = sceneInit.insertLight(sceneThreeJs.sceneGraph,new THREE.Vector3(3+sceneThreeJs.camera.position.x, 100+sceneThreeJs.camera.position.y, sceneThreeJs.camera.position.z));
  spotLight2.name = "spotLight2";

  const spotLight3 = sceneInit.insertLight(sceneThreeJs.sceneGraph,new THREE.Vector3(0, 0, -40));
  spotLight2.name = "spotLight3";

  sceneThreeJs.renderer = sceneInit.createRenderer();
  sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

  sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera,sceneThreeJs.renderer.domElement );

  //sceneThreeJs.controls.addEventListener( 'change', function(event){light_update2(sceneThreeJs.camera,spotLight2);},true);

  window.addEventListener('resize', function(event){onResize(sceneThreeJs);}, true);
}

function onResize(sceneThreeJs) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  sceneThreeJs.camera.aspect = width / height;
  sceneThreeJs.camera.updateProjectionMatrix();

  sceneThreeJs.renderer.setSize(width, height);
}

function render( sceneThreeJs ) {
  sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

  const t = time/1000;//time in second
  render(sceneThreeJs);
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {
  // Fonction JavaScript de demande d'image courante à afficher
  requestAnimationFrame(

    // La fonction (dite de callback) recoit en paramètre le temps courant
    function(timeStamp){
      animate(sceneThreeJs,timeStamp); // appel de notre fonction d'animation
      animationLoop(sceneThreeJs); // relance une nouvelle demande de mise à jour
    }

  );

}
