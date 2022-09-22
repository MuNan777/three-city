import * as THREE from 'three'
import vertexShader from '../../../../shaders/lightRadar/vertex.glsl'
import fragmentShader from '../../../../shaders/lightRadar/fragment.glsl'
import gsap from 'gsap'
import BassMesh from './baseMesh';

export default class LightRadar extends BassMesh {
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

  constructor(position = { x: 0, z: 0 }, radius = 5, color = 0x00ff00) {
    super()
    this.geometry = new THREE.PlaneGeometry(radius, radius)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Color(color)
        },
        uTime: {
          value: 0,
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, 1, position.z);
    this.mesh.rotation.x = -Math.PI / 2;

    // 动画
    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      ease: "none",
    })
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}