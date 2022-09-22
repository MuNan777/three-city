<script  lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Scene from './components/Scene/index.vue'
import BigScreen, { DataInfo } from './components/BigScreen/index.vue'
import { getSmartCityInfo, getSmartCityList } from './api/api'
import gsap from "gsap";

export default defineComponent({
  components: {
    Scene,
    BigScreen
  },
  setup() {
    const dataInfo = reactive<DataInfo>({
      iot: { number: 0, unit: '', name: '' },
      event: { number: 0, unit: '', name: '' },
      power: { number: 0, unit: '', name: '' },
      test: { number: 0, unit: '', name: '' },
    });

    const changeInfo = async () => {
      const res = await getSmartCityInfo()
      const data = res.data as DataInfo
      for (let key of Object.keys(dataInfo)) {
        let k = key as keyof DataInfo
        dataInfo[k].name = data[k].name
        dataInfo[k].unit = data[k].unit
        gsap.to(dataInfo[k], {
          number: data[k].number,
          duration: 1,
        });
      }
    }

    const eventList = ref([])

    const getEventList = async () => {
      let res = await getSmartCityList()
      console.log(res.list)
      eventList.value = res.list
    }

    onMounted(() => {
      changeInfo()
      getEventList()
      setInterval(() => {
        changeInfo()
        getEventList()
      }, 1000 * 60)
    })
    return {
      dataInfo,
      eventList
    }
  },
})
</script>

<template>
  <h2>测试</h2>
  <Scene :eventList="eventList"></Scene>
  <BigScreen :dataInfo="dataInfo" :eventList="eventList"></BigScreen>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
