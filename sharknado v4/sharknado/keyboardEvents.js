"use strict";

const keyboardEvents = (function() {
  return {
    onKeyDown: function(event, scene, camera, screenSize, drawingData) {
      const deplacement = 1;
      const direction = camera.getWorldDirection();

      if(event.code == "KeyW"){
        drawingData.drawingObjects[0].position.add(direction);
      }
      if(event.code == "Space"){
        drawingData.drawingObjects[0].position.set(0,0,0);
      }
      if(event.code == "KeyS"){
        drawingData.drawingObjects[0].position.add(direction.multiplyScalar(-1));
      }
      if(event.code == "KeyR"){
        utilsData.enterMode(drawingData, scene, "removeMode");
      }
      if(event.code == "KeyA"){
        utilsData.enterMode(drawingData, scene, "finMode");
      }
      if(event.code == "KeyT"){
        utilsData.enterMode(drawingData, scene, "tornadoMode");
      }

    },
  };
})();
