<template>
  <StatisticArea title="基本信息">
    <div class="flex flex-col justify-around">
      <el-tooltip
          effect="dark"
          :content="data?.orgPath"
          placement="top-start"
      >
        <div class="title font-semibold truncate cursor-pointer">{{data.orgPath}}</div>
      </el-tooltip>
      <div class="flex justify-around pt-4 pb-4">
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/first-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">{{data.orgForm30Num}}</div>
            <div>子公司</div>
          </div>
        </div>
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/second-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">{{data.orgForm40Num}}</div>
            <div>分公司</div>
          </div>
        </div>
      </div>

      <div class="flex justify-around pt-4 pb-4">
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/project-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">{{data.orgForm60Num}}</div>
            <div>工程项目数</div>
          </div>
        </div>
        <div class="flex flex-1">
          <img src="@/assets/images/regional-introduction/user-icon.png" alt="">
          <div>
            <div class="font-ysbth text-2xl">{{data.orgForm60PeopleNum}}</div>
            <div>总人数</div>
          </div>
        </div>
      </div>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">

import StatisticArea from '@/views/situation/components/StatisticArea.vue'

interface Props {
  data?: {
    orgPath: string,
    orgForm40Num: number
    orgForm30Num: number,
    orgForm60Num: number,
    orgForm60PeopleNum: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    orgPath: "中铁投资/工程总包部/国道109",
    orgForm40Num: 633,
    orgForm30Num: 658,
    orgForm60Num: 24140,
    orgForm60PeopleNum: 100
  })
})
</script>

<style scoped>
.title {
  text-shadow: 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216), 0 0 10px rgb(29 78 216);
}
</style>
