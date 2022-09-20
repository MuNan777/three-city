varying float vSize;
uniform float uLength;
uniform float uTime;
attribute float aSize;

void main() {
  vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
  gl_Position = projectionMatrix * viewPosition;
  vSize = (aSize - uTime);
  if(vSize < 0.0) {
    vSize = vSize + uLength;
  }
  vSize = (vSize - 500.0) * 0.01;
  gl_PointSize = vSize;
}