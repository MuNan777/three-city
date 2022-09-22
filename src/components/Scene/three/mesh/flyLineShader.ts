import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../../../../shaders/flyLineShader/vertex.glsl'
import fragmentShader from '../../../../shaders/flyLineShader/fragment.glsl'
import { BufferAttribute, IUniform } from 'three'
import BassMesh from './baseMesh'

const textureLoader = new THREE.TextureLoader()

export default class FlyLineShader extends BassMesh {
  lineCurve: THREE.CatmullRomCurve3
  geometry: THREE.BufferGeometry
  material: THREE.ShaderMaterial
  mesh: THREE.Points

  constructor(position = { x: 0, z: 0 }, color = 0x00ffff) {
    super()
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, 5, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z),
    ]
    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
    const points = this.lineCurve.getPoints(1000)
    // 2/创建几何顶点
    this.geometry = new THREE.BufferGeometry().setFromPoints(points)

    // 给每一个顶点设置属性
    const aSizeArray = new Float32Array(points.length)
    for (let i = 0; i < points.length; i++) {
      aSizeArray[i] = i
    }

    this.geometry.setAttribute("aSize", new BufferAttribute(aSizeArray, 1))

    // 材质 PointsMaterial / ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(color),
        },
        uLength: {
          value: points.length
        }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    // 创建飞线
    this.mesh = new THREE.Points(this.geometry, this.material)

    // 动画
    gsap.to(this.material.uniforms.uTime, {
      value: 1000,
      duration: 2,
      repeat: -1,
      ease: "none",
    });
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
  }
}