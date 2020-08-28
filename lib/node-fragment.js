module.exports = [
  'uniform vec3 color;',
  'uniform sampler2D pointTexture;',
  '',
  'varying vec3 vColor;',
  '',
  'void main() {',
  '  gl_FragColor = vec4( color * vColor, 1.0 );',
  '  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );',
  '  if ( gl_FragColor.a < ALPHATEST ) discard;',
  // '  vec4 tColor = texture2D( texture, gl_PointCoord );',
  // '  if (tColor.a < 0.5) discard;',
  // '  gl_FragColor = vec4(gl_FragColor.rgb * tColor.a, tColor.a);',
  '}'
].join('\n');

// uniform vec3 color;
// uniform sampler2D pointTexture;

// varying vec3 vColor;

// void main() {

//   gl_FragColor = vec4( color * vColor, 1.0 );

//   gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

//   if ( gl_FragColor.a < ALPHATEST ) discard;

// }