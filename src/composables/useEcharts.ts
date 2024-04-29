import * as echarts from 'echarts'
import {isRef, onMounted, ref, unref, watch} from 'vue'
import type {MaybeRef} from 'vue'
import type {ECBasicOption} from 'echarts/types/src/util/types'

export const useEcharts = (options: MaybeRef<ECBasicOption> = ref({})) => {
    const appRef = ref()
    let myChart: echarts.ECharts

    const init = () => {
        myChart = echarts.init(appRef.value)

        if (Object.keys(unref(options)).length) {
            myChart.setOption(unref(options))
        }
    }

    const getInstance = () => {
      return myChart
    }

    if (isRef(options)) {
        watch(options, () => {
            myChart.setOption(unref(options))
        })
    }

    onMounted(() => {
        init()
    })

    return {
        appRef,
        getInstance
    }
}
