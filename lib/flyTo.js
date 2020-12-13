/**
 * Moves camera to given point, and stops it and given radius
 */
var THREE = require('three');
var intersect = require('./intersect.js');

module.exports = {fly, center};
function center(camera, to, radius) {
  var cameraOffset = radius / Math.tan(Math.PI / 180.0 * camera.fov * 0.5);

  var from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };

  camera.lookAt(new THREE.Vector3(to.x, to.y, to.z));
  var cameraEndPos = intersect(from, to, cameraOffset);
  camera.position.x = cameraEndPos.x;
  camera.position.y = cameraEndPos.y;
  camera.position.z = cameraEndPos.z;
}
function fly(camera, to, radius) {
  var cameraOffset = radius / Math.tan(Math.PI / 180.0 * camera.fov * 0.5);

  var from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };


  var cameraEndPos = intersect(from, to, cameraOffset);
  // camera.position.x = cameraEndPos.x;
  // camera.position.y = cameraEndPos.y;
  // camera.position.z = cameraEndPos.z;
  animate(camera, cameraEndPos, cameraOffset, to);
}

function animate(camera, cameraEndPos, tolerance, to) {
  let requestId;
  const worlddir = camera.getWorldDirection();
  const target = camera.worldToLocal(new THREE.Vector3(to.x, to.y, to.z));
  // tolerance /=2;
  // const delta = tolerance / 2;
  let delta = 8;
  const dx = (cameraEndPos.x - camera.position.x) > 0;
  const dy = (cameraEndPos.y - camera.position.y) > 0;
  const dz = (cameraEndPos.z - camera.position.z) > 0;
  step();
  function step() {
    let needrequest = false;
    const target = camera.worldToLocal(new THREE.Vector3(to.x, to.y, to.z));
    if (Math.abs(target.x) > tolerance || Math.abs(target.y) > tolerance) {
      const theta = target.x < 0 ? 0.01 : -0.01;
      const phi = target.y > 0 ? 0.01 : -0.01;
      (Math.abs(target.x) > tolerance) && camera.rotateY(theta * tolerance / Math.abs(target.x));
      (Math.abs(target.y) > tolerance) && camera.rotateX(phi * tolerance / Math.abs(target.y));
      needrequest = true;
    }
    if (Math.abs(camera.position.x - cameraEndPos.x) > tolerance || Math.abs(camera.position.y - cameraEndPos.y) > tolerance || Math.abs(camera.position.z != cameraEndPos.z) > tolerance) {
      Math.abs(camera.position.x - cameraEndPos.x) > tolerance && (dx ? (camera.position.x += delta) : (camera.position.x -= delta));
      Math.abs(camera.position.y - cameraEndPos.y) > tolerance && (dy ? (camera.position.y += delta) : (camera.position.y -= delta));
      Math.abs(camera.position.z - cameraEndPos.z) > tolerance && (dz ? (camera.position.z += delta) : (camera.position.z -= delta));
      needrequest = true;
    }
    needrequest && requestAnimationFrame(step);
  }

}
