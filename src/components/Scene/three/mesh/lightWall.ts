import * as THREE from 'three'
import vertexShader from '../../../../shaders/lightWall/vertex.glsl'
import fragmentShader from '../../../../shaders/lightWall/fragment.glsl'
import gsap from 'gsap'
import BassMesh from './baseMesh';

export default class LightWall extends BassMesh {
  material: THREE.ShaderMaterial;
  geometry: THREE.CylinderGeometry;
  mesh: THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>;

  constructor(position = { x: 0, z: 0 }, radius = 5, expand = 1.2, color = 0xff0000) {
    super()
    this.geometry = new THREE.CylinderGeometry(radius, radius, 2, 32, 1, true)
    this.geometry.computeBoundingBox()
    const { max, min } = this.geometry.boundingBox! // 外边距矩形
    // 获取物体高度差
    let height = max.y - min.y
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Color(color)
        },
        uHeight: {
          value: height // 整体高度差
        }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(position.x, 1, position.z)

    // 动画
    gsap.to(this.mesh.scale, {
      x: expand,
      z: expand,
      duration: 2,
      repeat: -1,
      yoyo: true,
    })
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}