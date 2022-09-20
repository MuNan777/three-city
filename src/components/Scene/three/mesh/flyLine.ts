import * as THREE from 'three'
import gsap from 'gsap'

const textureLoader = new THREE.TextureLoader()

export default class FlyLine {
  lineCurve: THREE.CatmullRomCurve3
  geometry: THREE.TubeGeometry
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>
  texture: THREE.Texture

  constructor(position = { x: 0, z: 0 }) {
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, 5, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z),
    ]
    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
    // 创建管道几何体
    this.geometry = new THREE.TubeGeometry(
      this.lineCurve, // 路线
      100, // 管道的分段数
      0.2, // 管道的半径，默认值为1
      2, // 横截面的分段数目
      false // 两端是否闭合
    )
    // 材质
    // 加载纹理
    this.texture = textureLoader.load('./textures/z_11.png')
    this.texture.repeat.set(1, 2) // 设置重复，管道存在正反面，纹理会被切成一半
    // 包裹模式，使正反两面贴合
    this.texture.wrapS = THREE.RepeatWrapping // 重复（水平方向）
    this.texture.wrapT = THREE.MirroredRepeatWrapping // 镜像（垂直方向）
    this.material = new THREE.MeshBasicMaterial({
      // color: 0xffff00
      map: this.texture,
      transparent: true
    })
    // 创建飞线
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    // 动画
    gsap.to(this.texture.offset, { // 设置纹理的偏移量，使纹理运动
      x: -1,
      duration: 2,
      repeat: -1,
    })
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}