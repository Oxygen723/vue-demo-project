<template>
  <div :id="chartInitId" class="axis-chart w-100% h-100%"></div>
</template>
<script setup lang="ts" name="极坐标系ECharts组件">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { deepCopy } from '@/utils/common';
import { defaultOptions, sizeFun, observeResize, chartTheme } from '@/utils/echartsConfig';
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts';

interface Prop {
  chartKey: string // 图表唯一标识
  option: EChartsOption // 图表配置项
}
const props = withDefaults(defineProps<Prop>(), {
  chartId: '',
  option: () => ({}),
})

echarts.registerTheme('chartTheme', chartTheme);
// 图表随机Number
const RANDOM_NUM = Math.floor(Math.random() * 1000000)

// 图表渲染id
const chartInitId = computed(() => `#${props.chartKey}_${RANDOM_NUM}`)

// 图表渲染DOM
const chartDom: any = computed(() => document.getElementById(chartInitId.value))

// 图表渲染实例
let chartInstance: ECharts | null = null

// 图表渲染Option
const chartOption = computed(() => {
  let newOption = deepCopy(defaultOptions);
  if (props.option) {
    newOption = { ...newOption, ...props.option }
  }
  return newOption
})

// 初始化图表
const initChart = () => {
  nextTick(() => {
    if (!chartDom.value) return;
    if (chartInstance) echarts.dispose(chartInstance)
    chartInstance = echarts.init(chartDom.value, 'chartTheme')
    chartInstance.clear()

    updateChart()

    observeResize(chartDom.value.parentElement, () => (chartInstance as echarts.ECharts).resize());
    document.addEventListener('resize', sizeFun);
  })
}

// 更新图表
const updateChart = () => {
  chartInstance && chartInstance.setOption(chartOption.value)
}

// 监听图表配置项更新
watch(() => props.option, () => {
  if (chartInstance) updateChart()
  else initChart()
}, { deep: true })

</script>
<style scoped lang="scss"></style>