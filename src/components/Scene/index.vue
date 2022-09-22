<template>
  <div class="scene" ref="refScene"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import eventHub from '../../utils/eventHub'
import { EventItem } from '../BigScreen/index.vue'
import controls from './three/controls'
import { init, remove } from './three/init'
import FlyLineShader from './three/mesh/flyLineShader'
import LightRadar from './three/mesh/lightRadar'
import LightWall from './three/mesh/lightWall'
import WarnSprite from './three/mesh/warnSprite'
import scene from './three/scene'
import gsap from 'gsap'

type Position = { x: number, z: number }

type EventListItem = WarnSprite | LightWall | LightRadar | FlyLineShader

export default defineComponent({
  props: {
    eventList: {
      type: Array as PropType<EventItem[]>,
      default: () => []
    },
  },
  setup(props) {
    const refScene = ref<null | HTMLElement>(null)
    onMounted(() => {
      init(refScene) // 注意需要在组件挂载完成后再进行初始化
    })
    const eventList: EventListItem[] = []

    const mapFn = {
      fire: (position: Position, i: number, scope: number) => {
        const lightWall = new LightWall(position, scope)
        lightWall.eventListIndex = i
        scene.add(lightWall.mesh);
        eventList.push(lightWall);
      },
      police: (position: Position, i: number) => {
        // 添加着色器飞线
        const flyLineShader = new FlyLineShader(position)
        flyLineShader.eventListIndex = i
        scene.add(flyLineShader.mesh);
        eventList.push(flyLineShader);
      },
      electricity: (position: Position, i: number, scope: number) => {
        // 添加雷达
        const lightRadar = new LightRadar(position, scope)
        lightRadar.eventListIndex = i
        scene.add(lightRadar.mesh)
        eventList.push(lightRadar)
      },
    }

    eventHub.on('eventToggle', (index) => {
      const i = index as number
      eventList.forEach((item) => {
        if (item.eventListIndex === i) {
          item.mesh.visible = true;
        } else {
          item.mesh.visible = false;
        }
      })
      const position = {
        x: props.eventList[i].position.x / 5 - 10,
        y: 0,
        z: props.eventList[i].position.y / 5 - 10,
      }
      gsap.to(controls.target, {
        duration: 1,
        x: position.x,
        y: position.y,
        z: position.z,
      })
    })

    watch(() => props.eventList, (val) => {
      eventList.forEach((item) => {
        item.remove()
      })

      val.forEach((item, i) => {
        console.log(item)
        const position = {
          x: item.position.x / 5 - 10,
          z: item.position.y / 5 - 10,
        }
        const warnSprite = new WarnSprite(item.name, { x: position.x, z: position.z, y: 3.2 })
        warnSprite.eventListIndex = i
        eventList.push(warnSprite)
        scene.add(warnSprite.mesh)
        warnSprite.onClick(() => {
          eventHub.emit("spriteClick", { event: item, i })
        })
        if (mapFn[item.name]) {
          mapFn[item.name](position, i, item.scope)
        }
      })
    })

    const eventFn = () => {
      console.log(123)
      eventList.forEach((item) => {
        item.mesh.visible = true
      })
      eventHub.emit("spriteClick", { i: null })
    }

    window.addEventListener('dblclick', eventFn)

    onUnmounted(() => {
      remove()
      window.removeEventListener('dblclick', eventFn)
    })

    return {
      refScene
    }
  },
})
</script>
<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
