<template>
  <StatisticArea title="北斗设备概况">
    <div class="equipment">
      <ul>
        <li>
          <img :src='Device'>
          <div class="middle">
            <span style="font-size: 14px">Beidou Equipment Total</span>
            <span>北斗设备总数</span>
          </div>
          <span class="font-ysbth count">{{data.totalCount}}</span>
        </li>
        <li>
          <img :src='DeviceErr'>
          <div class="middle">
            <span style="font-size: 14px">Equipment Not Active</span>
            <span>未激活北斗设备数</span>
          </div>
          <span class="font-ysbth count">{{data.unActivatedCount}}</span>
        </li>
        <li>
          <img :src='DeviceWarn'>
          <div class="middle">
            <span style="font-size: 14px">Equipment Alarm Total</span>
            <span>报警北斗设备数</span>
          </div>
          <span class="font-ysbth count">{{data.alarmCount}}</span>
        </li>
      </ul>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">
import Device from '@/assets/images/index/device.png'
import DeviceErr from '@/assets/images/index/device-err.png'
import DeviceWarn from '@/assets/images/index/device-warn.png'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'

interface Props {
  data?: {
    alarmCount: number
    totalCount: number
    unActivatedCount: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    alarmCount: 120,
    totalCount: 520,
    unActivatedCount: 134,
  })
})
</script>

<style scoped lang="scss">
.equipment {
  ul {
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;

      .middle {
        span {
          display: block;
          font-size: 16px;
        }

        flex: 1;
        margin-left: 10px;
      }

      .count {
        text-shadow: 1px 4px 12px #057ffd;
        font-size: 20px;
      }
    }
  }
}
</style>
