<template>
  <div class="table-v2-cpm" :class="[`w-${width}`, `h-${height}`]">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="_columns" :data="sortList" :width="width" :height="height" fixed :sort-by="sortState"
          @column-sort="({ key }: any) => handleSort(key)" :headerHeight="headerHeight" class="ALPH"
          header-class="text-14px" row-class="text-16px text-#FFF" :rowHeight="rowHeight" />
      </template>
    </el-auto-resizer>
  </div>
</template>
<script setup lang="ts" name="el-table-v2虚拟表格组件">
import { ref, reactive, computed, VNode, watch, h } from 'vue';
import { dayjs, type Column } from 'element-plus'
import { TableV2ColProps, TableV2RowProps, CellRenderProps, HeaderRenderProps } from './config';
import { deepCopy, isValue, minMaxColor } from '@/utils/common';

interface TableV2CpmProp {
  width?: number | string // 表格宽度
  height?: number | string // 表格高度
  data: TableV2RowProps[] // 表格数据
  columns: TableV2ColProps[] // 表格列
  headerHeight?: number // 表头高度
  rowHeight?: number // 行高
}
const props = withDefaults(defineProps<TableV2CpmProp>(), {
  width: '100%',
  height: '100%',
  headerHeight: 24,
  rowHeight: 24
})

// 表格事件
const emit = defineEmits(['clickRow'])

// 根据props.columns生成columns
const _columns = computed(() => {
  return props.columns.map((item: TableV2ColProps) => {
    return {
      ...item,
      key: item.dataKey,
      cellRenderer: (props: CellRenderProps<TableV2ColProps>): VNode | string => {
        const { columnIndex, rowData, rowIndex } = props
        const cellData = rowData[item.dataKey]

        // cell为自定义渲染时
        if (item.cellType == 'custom' && item.cellRender) {
          return item.cellRender(props)
        } else {
          // cell内容
          let cellValue: any = ''
          // cell样式
          let cellStyle: string = ''

          // cell为文本时
          if (item.cellType == 'text') {
            cellValue = cellData
          }
          // cell为数字时
          if (item.cellType == 'number') {
            cellValue = isValue(cellData)
            if (item.numberType == 'percent' && typeof cellValue === 'number') {
              cellValue = (cellValue * 100).toFixed(2) + '%'
            }
            if (item.numberType == 'colorPercent' && typeof cellValue === 'number') {
              cellValue = (cellValue * 100).toFixed(2) + '%'
              cellStyle += `color:${minMaxColor(cellData as unknown as number)}`
            }
          }
          // cell为日期时
          if (item.cellType == 'date') {
            if (item.dateFormat) cellValue = dayjs(cellData).format(item.dateFormat)
            else cellValue = dayjs(cellData).format('YYYY-MM-DD')
          }

          return h(
            'span',
            {
              class: 'cell-body',
              style: cellStyle,
              onClick: () => emit('clickRow', rowData)
            },
            cellValue
          );
        }
      },
      headerCellRenderer: (props: HeaderRenderProps<TableV2ColProps>): VNode | string => {
        const { column, columnIndex, headerIndex } = props;

        if (item.headerRender) return item.headerRender(props)
        else {
          return h(
            'span',
            {
              class: 'cell-header'
            },
            column.title
          );
        }
      }
    }
  })
})

// 状态管理
type SortOrder = 0 | 1 | 2 // 0:默认 1:降序 2:升序
const sortStatus = ref<SortOrder>(0)
const sortingProp = ref<string>('')
const sortState = computed(() => {
  return {
    key: sortingProp.value,
    order: sortStatus.value == 0 ? 'normal' : sortStatus.value == 1 ? 'desc' : 'asc',
  }
})
const localData = ref<TableV2RowProps[]>([])
// 排序逻辑
const handleSort = (prop: string) => {
  let order: SortOrder = 0
  if (sortingProp.value !== prop) {
    order = 1
  } else {
    order = sortStatus.value === 1 ? 2 : 0
  }

  sortStatus.value = order
  sortingProp.value = order ? prop : ''

  // 触发数据排序
  if (order) {
    localData.value.sort((a: any, b: any) =>
      order === 1 ? b[prop] - a[prop] : a[prop] - b[prop]
    )
  } else {
    localData.value = deepCopy(props.data)
  }
}

// 数据监听
watch(() => props.data, (newVal) => {
  localData.value = deepCopy(newVal)
}, { immediate: true, deep: true })
const sortList = computed(() => localData.value)




</script>
<style scoped lang="scss">
:deep(.el-table-v2) {
  --el-table-border-color: rgba(0, 0, 0, .1);
  --el-table-header-text-color: #b4b6b8;
}
</style>