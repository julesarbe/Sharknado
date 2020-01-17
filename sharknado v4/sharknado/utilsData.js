const utilsData = (function() {
  return {
    enterMode: function(drawingData, scene, mode){
      switch(mode){
        case "removeMode":
          drawingData.removeMode = true;
          drawingData.finMode = false;
          drawingData.bodyMode = false;
          drawingData.tornadoMode = false;
          document.getElementById("AffichageMode").innerHTML = "clique sur un objet pour l'effacer";
        break;

        case "finMode":
          drawingData.removeMode = false;
          drawingData.finMode = true;
          drawingData.bodyMode = false;
          drawingData.tornadoMode = false;
          document.getElementById("AffichageMode").innerHTML = "dessine les nageoires";
        break;

        case "bodyMode":
          drawingData.removeMode = false;
          drawingData.finMode = false;
          drawingData.bodyMode = true;
          drawingData.tornadoMode = false;
          document.getElementById("AffichageMode").innerHTML = "dessine le corps de ton requin";
        break;

        case "tornadoMode":
          drawingData.removeMode = false;
          drawingData.finMode = false;
          drawingData.bodyMode = false;
          drawingData.tornadoMode = true;
          // sauvegarde du requin
          drawingData.sharkTab.push(drawingData.body);
          // reinitialisation a la scene vide
          scene.remove(drawingData.body);
          document.getElementById("AffichageMode").innerHTML = "il est maintenant temps de dessiner une tornade";
        break;
      }
    },

    removeLines: function(drawingData, scene) {
      const lineTab = drawingData.lineTab;
      for(let i = 0; i < lineTab.length; i++){
        scene.remove(lineTab[i]);
      }
      drawingData.lineTab = [];
    },

    addLine: function(drawingData, scene){
      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices = drawingData.drawing3DPoints;
      const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff00ff } );
      drawingData.line = new THREE.Line( lineGeometry, lineMaterial );
      drawingData.lineTab.push(drawingData.line);
      drawingData.line.is_ob = true;
      scene.add(drawingData.line);
    },
  };
})();
