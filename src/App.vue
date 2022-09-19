<script  lang="ts">
import { defineComponent } from 'vue'
import textVertex from './shaders/testVertex.glsl'
import Scene from './components/Scene/index.vue'

console.log(textVertex)
export default defineComponent({
  components: {
    Scene
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <h2>测试</h2>
  <Scene></Scene>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
