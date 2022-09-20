varying float vSize;
uniform vec3 uColor;

void main() {
  float rnd = distance(gl_PointCoord, vec2(0.5, 0.5));
  float strength = 1.0 - (rnd * 2.0);
  if(vSize <= 0.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    gl_FragColor = vec4(uColor, strength);
  }
}