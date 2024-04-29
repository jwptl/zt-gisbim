<template>
  <StatisticArea title="今日报警统计">
    <div class="alarmInfo">
      <div class="alarmItem">
        <div class="alarmBg1">
          <span class="font-ysbth" style="font-size: 28px">{{ data.totalCount }}</span>
          <span style="font-size: 16px">报警总量</span>
        </div>
        <div class="count">
          <span>较昨天
            <el-icon v-if="data.totalContrastSymbol===1" size="20" color="#65E8E9"><CaretTop/></el-icon>
            <el-icon v-else size="20" color="#E97865"><CaretBottom/></el-icon>
            {{ data.totalContrast }}</span>
        </div>
      </div>
      <div class="alarmItem">
        <div class="alarmBg2">
          <span class="font-ysbth" style="font-size: 28px">{{ data.handleCount }}</span>
          <span style="font-size: 16px">已处理量</span>
        </div>
        <div class="count">
          <span>较昨天
            <el-icon v-if="data.handleContrastSymbol===1" size="20" color="#65E8E9"><CaretTop/></el-icon>
            <el-icon v-else size="20" color="#E97865"><CaretBottom/></el-icon>
            {{ data.handleContrast }}%</span>
        </div>
      </div>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {CaretTop, CaretBottom} from "@element-plus/icons-vue";

interface DataInfo {
  data?: {
    totalCount: number | string
    totalContrast: number | string
    handleCount: number | string
    handleContrast: number | string
    totalContrastSymbol: number
    handleContrastSymbol: number
  }
}

const props = withDefaults(defineProps<DataInfo>(), {
  data: () => ({
    totalCount: 100,
    totalContrast: 0,
    handleCount: 50,
    handleContrast: '0.00',
    totalContrastSymbol: 1,
    handleContrastSymbol: 0
  })
});


</script>

<style scoped lang="scss">
.alarmInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 30px;
  box-sizing: border-box;

  .alarmItem {
    .alarmBg1 {
      width: 130px;
      height: 100px;
      background: url("@/assets/images/index/alarm-1.png");
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 20px;
      box-sizing: border-box;
    }

    .alarmBg2 {
      width: 130px;
      height: 100px;
      background: url("@/assets/images/index/alarm-2.png");
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 20px;
      box-sizing: border-box;
    }

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;

      span {
        display: flex;
        align-items: center;
      }
    }
  }
}

</style>
