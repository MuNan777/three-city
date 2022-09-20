uniform vec3 uColor;
uniform float uHeight;
varying vec3 vPosition;

void main() {
  float opcity = (vPosition.y + uHeight / 2.0) / uHeight;
  gl_FragColor = vec4(uColor, 1.0 - opcity);
}