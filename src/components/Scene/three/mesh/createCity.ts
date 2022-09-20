import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import modifyCityMaterial from '../modify/modifyCityMaterial'
import scene from '../scene'
import FlyLine from './flyLine'
import FlyLineShader from './flyLineShader'
import LightRadar from './lightRadar'
import LightWall from './lightWall'
import MeshLine from './meshLine'
import WarnSprite from './warnSprite'
const gltfLoader = new GLTFLoader()

export function createCity() {
  gltfLoader.load('./model/city.glb', (glb) => {
    glb.scene.traverse(item => {
      if (item.type === 'Mesh') {
        if (item.name === 'Layerbuildings') {
          createMeshLine(item)
        }
        modifyCityMaterial(item)
      }
    })
    scene.add(glb.scene)
    // scene.add(new FlyLine().mesh)
    scene.add(new FlyLineShader({ x: -12, z: 0 }).mesh)

    scene.add(new LightWall({ x: 5, z: 8 }, 3).mesh)

    scene.add(new LightRadar({ x: 5, z: -8 }).mesh)

    const warnSprite = new WarnSprite('fire', { x: -2.8, z: 10, y: 3.2 })
    warnSprite.onClick((event) => {
      console.log(event)
    })
    scene.add(warnSprite.mesh)
  })
}

// 创建物体边框
function createMeshLine(item: THREE.Object3D<THREE.Event>) {
  const mesh = item as THREE.Mesh
  const meshLine = new MeshLine(mesh.geometry, 0x00ffff)
  let size = mesh.scale.x // 获取物体缩放
  size *= 1.001 // 避免重复部分遮盖问题
  meshLine.mesh.scale.set(size, size, size) // 设置缩放
  scene.add(meshLine.mesh) // 加入场景
}