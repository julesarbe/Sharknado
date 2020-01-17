"use strict";

const utilsDrawing = (function() {

  return {
    addBody: function(raycaster, camera, xPosition, yPosition, drawingData, scene, down) {
      raycaster.setFromCamera(new THREE.Vector2(xPosition,yPosition),camera);
      const epaisseur = drawingData.epaisseur;
      const intersects = raycaster.intersectObjects( drawingData.drawingObjects );

      const intersection = intersects[0];

      drawingData.drawing3DPoints.push(intersection.point.clone());

      utilsData.addLine(drawingData, scene);
    },

    addFin: function(raycaster, camera, xPosition, yPosition, drawingData, scene, down) {
      // ajout d'une nageoire : on l'ajoute toujours sur le plan de dessin
      raycaster.setFromCamera(new THREE.Vector2(xPosition,yPosition),camera);
      const epaisseur = drawingData.epaisseur;
      const intersects = raycaster.intersectObjects( drawingData.drawingObjects );

      const nbrIntersection = intersects.length;

      var intersection = intersects[0];
      var k = 0;

      // on attend de trouver les coordonnees du point d'intersection avec le plan de dessin
      while(intersection.object.name != "plane" ) {
        k = k + 1;
        intersection = intersects[k];
      }

      drawingData.drawing3DPoints.push(intersection.point.clone());

      // on met egalement le symetrique par rapport au corps de ce point car c'est une nageoire
      const pointSym = new THREE.Vector3(intersection.point.x, intersection.point.y, - intersection.point.z);
      drawingData.drawing3DPointsSym.push(pointSym.clone());

      utilsData.addLine(drawingData, scene);
    },

    addTornado: function(raycaster, camera, xPosition ,yPosition, drawingData, scene){
      
    },

    removeMesh: function(raycaster, camera, xPosition ,yPosition, drawingData, scene){
      raycaster.setFromCamera(new THREE.Vector2(xPosition,yPosition),camera);

      const intersects = raycaster.intersectObjects( drawingData.drawingObjects );

      const nbrIntersection = intersects.length;
      if( nbrIntersection>0 ) {
        let intersection = intersects[0];
        // on ne doit pas remove le plan de dessin !

        if(intersection.object.name != "plane"){
          // un objet est soit le corps, child de scene, soit un child de corps
          if(intersection.object.name == "body"){
            scene.remove(intersection.object);
          }
          else{
            drawingData.drawingObjects[1].remove(intersection.object);
          }
        }
      }
    },

    // shapePoints : points de la forme a extruder
    addMesh: function(scene, shapePoints, camera, drawingData, epaisseur) {
      // precision de l'echantillonnage
      const division = 70;

      // on choisit 3 points de la shape
      // p0 = origine du repere local

      const p0 = shapePoints[0].clone();
      const p1 = shapePoints[Math.floor(shapePoints.length /3)].clone();
      const p2 = shapePoints[Math.floor(2 * shapePoints.length /3)].clone();

      // un vecteur du plan
      const u1 = new THREE.Vector3(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
      u1.normalize();
      // un autre vecteur du plan
      const v = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

      // vecteur orthogonal au plan
      const n = new THREE.Vector3(0,0,0);
      n.crossVectors(u1, v);
      n.normalize();

      // dernier vecteur de la base
      const u2= new THREE.Vector3(0,0,0);
      u2.crossVectors(n, u1);
      u2.normalize();

      const M = new THREE.Matrix3();
      M.set(u1.x, u1.y, u1.z,
            u2.x, u2.y, u2.z,
            n.x, n.y,n.z)

      const tab = []
      for (let v = 0; v < shapePoints.length; v++){
        var currentPoint = shapePoints[v].clone().sub(p0).applyMatrix3(M);
        tab.push(currentPoint)
      }

      // on echantillonne avec une spline 3D pour avoir un rendu plus smooth de la mesh
      const tabSpline = new THREE.CatmullRomCurve3(tab);
      const tabSampled = tabSpline.getPoints(division);

      drawingData.currentShape = new THREE.Shape(tabSampled);
      var extrudeSettings = {
         bevelEnabled:false, amount: epaisseur,
      };

      var geometry = new THREE.ExtrudeGeometry( drawingData.currentShape, extrudeSettings );

      const M1 = new THREE.Matrix3().getInverse(M)

      // on ajoute un vecteur selon z pour toujours avoir le plan de dessin comme plan transversal
      const trans = new THREE.Vector3(0,0,-epaisseur/2);

      for (let g = 0; g < geometry.vertices.length; g++){
        geometry.vertices[g].add(trans).applyMatrix3(M1).add(p0)
      }

      var material = new THREE.MeshPhongMaterial( { color: 0x4e42f5 } );
      var mesh = new THREE.Mesh( geometry, material ) ;

      // update de la scene
      // si nageoire : alors child du corps
      if(drawingData.finMode){
        drawingData.body.add(mesh);
      }
      else{
        scene.add( mesh );
      }

      drawingData.drawingObjects.push(mesh);
      // reinitalisation et effacage des traits de construction
      drawingData.currentShape = new THREE.Shape();
      utilsData.removeLines(drawingData, scene);
    },

  };
})();
