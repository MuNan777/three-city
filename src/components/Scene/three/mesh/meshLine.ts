import * as THREE from 'three'
import BassMesh from './baseMesh'

export default class MeshLine extends BassMesh {
  material: THREE.MeshBasicMaterial
  geometry: THREE.EdgesGeometry<THREE.BufferGeometry>
  mesh: THREE.LineSegments<THREE.EdgesGeometry<THREE.BufferGeometry>, THREE.MeshBasicMaterial>

  constructor(geometry: THREE.BufferGeometry, color: number = 0xffffff) {
    super()
    const edges = new THREE.EdgesGeometry(geometry)
    this.material = new THREE.MeshBasicMaterial({
      color,
    })
    const line = new THREE.LineSegments(edges, this.material)
    this.geometry = edges;
    this.mesh = line
  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}