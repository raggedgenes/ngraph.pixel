var THREE = require('three');
// var LineSegmentsGeometry = require('three/examples/jsm/lines/LineSegmentsGeometry.js').LineSegmentsGeometry;
// var LineMaterial = require('three/examples/jsm/lines/LineMaterial.js').LineMaterial;
// var LineSegments2 = require('three/examples/jsm/lines/LineSegments2.js').LineSegments2;

module.exports = edgeView;

function edgeView(scene, options) {
  var total = 0;
  var edges; // edges of the graph
  var colors, points; // buffer attributes that represent edge.
  var geometry, edgeMesh;
  var colorDirty, positionDirty;

  // declares bindings between model events and update handlers
  var edgeConnector = {
    fromColor: fromColor,
    toColor: toColor,
    'from.position': fromPosition,
    'to.position': toPosition
  };

  return {
    init: init,
    update: update,
    needsUpdate: needsUpdate,
    setFromColor: fromColor,
    setToColor: toColor,
    setFromPosition: fromPosition,
    setToPosition: toPosition,
    refresh: refresh
  };

  function needsUpdate() {
    return colorDirty || positionDirty;
  }

  function update() {
    if (positionDirty) {
      geometry.getAttribute('position').needsUpdate = true;
      positionDirty = false;
    }

    if (colorDirty) {
      geometry.getAttribute('color').needsUpdate = true;
      colorDirty = false;
    }
  }

  function init(edgeCollection) {
    disconnectOldEdges();

    edges = edgeCollection;
    total = edges.length;

    // If we can reuse old arrays - reuse them:
    var pointsInitialized = (points !== undefined) && points.length === total * 6;
    if (!pointsInitialized) points = new Float32Array(total * 6);
    var colorsInitialized = (colors !== undefined) && colors.length === total * 6;
    if (!colorsInitialized) colors = new Float32Array(total * 6);

    for (var i = 0; i < total; ++i) {
      var edge = edges[i];
      if (options.activeLink) edge.connect(edgeConnector);

      fromPosition(edge);
      toPosition(edge);

      fromColor(edge);
      toColor(edge);
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: 5
    });


    // setupAttributes(geometry);

  //   var material = new THREE.ShaderMaterial({
  //     uniforms: {
  //       lineWidth: {
  //         value: 5
  //       }
  //     },
  //     vertexShader:   'attribute vec3 center; varying vec3 vCenter; void main() { vCenter = center; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
  //     fragmentShader:  [ "varying vec3 vCenter; uniform float lineWidth;",
  //                       "float edgeFactorTri() { ",
  //                       "vec3 d = fwidth( vCenter.xyz );" ,
  //                       "vec3 a3 = smoothstep( vec3( 0.0 ), d * lineWidth, vCenter.xyz ); ",
  //                       "return min( min( a3.x, a3.y ), a3.z ); } ",
  //                     "void main() {",
  //                      " float factor = edgeFactorTri();",
  //                      " if ( factor > 0.8 ) discard; // <===============",
  //                       "gl_FragColor.rgb = mix( vec3(",
  //                       "1.0 ), vec3( 0.2 ), factor);" ,
  //                       "gl_FragColor.a = 1.0;}"].join('\n'),
  //     side: THREE.DoubleSide // <===============
  // });


    // material.extensions.derivatives = true;

    if (edgeMesh) {
      scene.remove(edgeMesh);
    }

    edgeMesh = new THREE.LineSegments(geometry, material);
    edgeMesh.frustumCulled = false;
    scene.add(edgeMesh);
  }

  function refresh() {
    for (var i = 0; i < total; ++i) {
      var edge = edges[i];

      fromPosition(edge);
      toPosition(edge);

      fromColor(edge);
      toColor(edge);
    }
  }

  function disconnectOldEdges() {
    if (!edges) return;
    if (!options.activeLink) return;
    for (var i = 0; i < edges.length; ++i) {
      edges[i].disconnect(edgeConnector);
    }
  }

  function fromColor(edge) {
    var fromColorHex = edge.fromColor;

    var i6 = edge.idx * 6;

    colors[i6] = ((fromColorHex >> 16) & 0xFF) / 0xFF;
    colors[i6 + 1] = ((fromColorHex >> 8) & 0xFF) / 0xFF;
    colors[i6 + 2] = (fromColorHex & 0xFF) / 0xFF;

    colorDirty = true;
  }

  function toColor(edge) {
    var toColorHex = edge.toColor;
    var i6 = edge.idx * 6;

    colors[i6 + 3] = ((toColorHex >> 16) & 0xFF) / 0xFF;
    colors[i6 + 4] = ((toColorHex >> 8) & 0xFF) / 0xFF;
    colors[i6 + 5] = (toColorHex & 0xFF) / 0xFF;

    colorDirty = true;
  }

  function fromPosition(edge) {
    var from = edge.from.position;
    var i6 = edge.idx * 6;

    points[i6] = from.x;
    points[i6 + 1] = from.y;
    points[i6 + 2] = from.z;

    positionDirty = true;
  }

  function toPosition(edge) {
    var to = edge.to.position;
    var i6 = edge.idx * 6;

    points[i6 + 3] = to.x;
    points[i6 + 4] = to.y;
    points[i6 + 5] = to.z;

    positionDirty = true;
  }
  function setupAttributes(geometry) {

    // TODO: Bring back quads
  
    var vectors = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1)
    ];
  
    var position = geometry.attributes.position;
    var centers = new Float32Array(position.count * 3);

    for (var i = 0, l = position.count; i < l; i++) {
  
      vectors[i % 3].toArray(centers, i * 3);
    }
  
    geometry.setAttribute("center", new THREE.BufferAttribute(centers, 3));
  
  }
}
