<template>
  <StatisticArea title="监测点报警统计">
    <div class="flex flex-col justify-around h-4/5">
      <div class="title font-semibold pt-2 pb-2 text-center">中铁股份/中铁投资/工程总包部/国道109 拷贝</div>
      <div class="flex justify-around pt-4 pb-4">
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/first-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">21</div>
            <div>速度报警</div>
          </div>
        </div>
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/second-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">21</div>
            <div>温度报警</div>
          </div>
        </div>
      </div>

      <div class="flex justify-around pt-4 pb-4">
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/project-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">2345</div>
            <div>一级报警</div>
          </div>
        </div>
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/user-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">14985</div>
            <div>二级报警</div>
          </div>
        </div>
      </div>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">

import StatisticArea from '@/views/situation/components/StatisticArea.vue'

type Data = {
  count: number
  type: string
  alarmType: string
}

const props = withDefaults(defineProps<{
  data?: Data[]
}>(), {
  data: () => ([
    {
      count: 11,
      type: 'sos',
      alarmType: 'SOS报警'
    },
    {
      count: 2,
      type: 'fall',
      alarmType: '跌落报警'
    }
  ])
})

</script>

<style scoped>
.title {
  text-shadow: 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216);
}
</style>
