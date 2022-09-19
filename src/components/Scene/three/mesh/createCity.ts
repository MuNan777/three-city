import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import modifyCityMaterial from '../modify/modifyCityMaterial'
import scene from '../scene'
const gltfLoader = new GLTFLoader()



export function createCity() {
  gltfLoader.load('./model/city.glb', (glb) => {
    glb.scene.traverse(item => {
      if (item.type === 'Mesh') {
        modifyCityMaterial(item)
      }
    })
    scene.add(glb.scene)
  })
}