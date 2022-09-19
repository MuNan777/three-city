import scene from "./scene"
import { PerspectiveCamera } from "three"

// 创建相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置 xyz
camera.position.set(0, 10, 20)
// 添加到场景
scene.add(camera)

export default camera