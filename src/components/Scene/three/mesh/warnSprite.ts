import * as THREE from "three";
import camera from "../camera";
import BassMesh from "./baseMesh";

export type warnType = 'fire' | 'police' | 'electricity'

export type eventFn = (event: { mesh: THREE.Sprite, warn: WarnSprite } & MouseEvent) => void

const textureLoader = new THREE.TextureLoader();

// 创建射线
const raycaster = new THREE.Raycaster()

export default class WarnSprite extends BassMesh {
  material: THREE.SpriteMaterial;
  mesh: THREE.Sprite;
  clickEvents: eventFn[];
  mouse: THREE.Vector2;
  eventFn: (event: MouseEvent) => void;

  constructor(type: warnType, position = { x: 0, z: 0, y: 0 }, color = 0xffffff) {
    super()
    const typeObj = {
      fire: "./textures/tag/fire.png",
      police: "./textures/tag/jingcha.png",
      electricity: "./textures/tag/e.png",
    }
    const map = textureLoader.load(typeObj[type])
    this.material = new THREE.SpriteMaterial({
      map: map,
      color: color,
      transparent: true,
      depthTest: false,
    });

    this.mesh = new THREE.Sprite(this.material)

    // 设置位置
    this.mesh.position.set(position.x, position.y, position.z);

    // 事件数组
    this.clickEvents = [];


    this.mouse = new THREE.Vector2()

    this.eventFn = (event: MouseEvent) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

      // 设置镭射
      raycaster.setFromCamera(this.mouse, camera)

      // 碰撞检查
      const intersects = raycaster.intersectObject(this.mesh)
      if (intersects.length > 0) {
        this.clickEvents.forEach((fn) => {
          fn({ ...event, mesh: this.mesh, warn: this });
        });
      }
    }

    // 事件监听
    window.addEventListener('click', this.eventFn)
  }

  onClick(fn: eventFn) {
    this.clickEvents.push(fn);
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    window.removeEventListener('click', this.eventFn);
  }
}