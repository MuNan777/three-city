
import { Ref } from 'vue'
import animate from './animate'
import camera from './camera'
import renderer from './renderer'
import { addAxesHelper } from './axesHelper'
import { createMesh } from './createMesh'

function init(body: Ref<HTMLElement | null>) {
  if (body.value) {
    // 将 webgl 的内容添加到 body
    body.value.appendChild(renderer.domElement)

    // 执行动画
    animate()

    // 添加坐标辅助器
    addAxesHelper()

    // 添加物体
    createMesh()

    window.addEventListener('resize', () => {
      // 更新摄像头
      camera.aspect = window.innerWidth / window.innerHeight;
      // 更新摄像机投影矩阵
      camera.updateProjectionMatrix();
      // 更新渲染器
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    })
  }
}

export default init