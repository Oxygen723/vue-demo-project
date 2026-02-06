<template>
  <div class="evaluation-table w-100% h-100%">
    <VxeGrid ref="gridRef" v-bind="gridOptions" v-on="gridEvents">
    </VxeGrid>
  </div>
</template>
<script setup lang="ts" name="评优表格组件">
import { ref, reactive, watch, nextTick } from 'vue';
import { VxeColumnPropTypes, VxeGridInstance, VxeGridListeners, VxeGridProps, VxeTableDefines } from 'vxe-table';
import { VxeComponentSizeType, VxeInputProps } from 'vxe-pc-ui'
import { deepCopy, findCellData, getDefaultColumns, MergeConfigItem, processTableDataDynamic, TargetItem, transformTableDataToTargetFormat } from './tools';
import { HeadItem, resTableDataItem } from './types';

const props = withDefaults(defineProps<{
  // 横/竖模式
  layout?: 'vertical' | 'horizontal'
  size?: VxeComponentSizeType
  data?: {
    // 表格数据
    tableData: any[]
    // 竖表头数据
    colHeads: HeadItem[]
    // 横表头数据
    rowHeads: HeadItem[]
  };
  // 固定列标题
  colName?: string[] | string
  // 固定列宽度
  colWidth?: [number, number]
  // 结束单元格编辑的回调
  endEdit?: (data: { row: any, rowIndex: number, column: VxeTableDefines.ColumnInfo<any>, columnIndex: number, resCellData: resTableDataItem | null }) => Promise<void>
  // 单元格是否能触发编辑
  cellEditSetting?: (data: { row: any, rowIndex: number, column: VxeTableDefines.ColumnInfo<any>, columnIndex: number }) => boolean
  // 自定义单元格类名
  cellClassName?: (data: { row: any, rowIndex: number, $rowIndex: number, column: VxeTableDefines.ColumnInfo<any>, columnIndex: number, $columnIndex: number }) => string
  // 自定义表头类名
  headerCellClassName?: (data: { $rowIndex: number, column: VxeTableDefines.ColumnInfo<any>, columnIndex: number, $columnIndex: number }) => string
  // 表格行列合并补充配置
  mergeAddition?: (data: { column: VxeTableDefines.ColumnInfo<any>, rowData: any[], columnsLength: number[][] }) => MergeConfigItem[]
}>(), {
  layout: 'vertical',
  isEdit: false,
  data: () => {
    return {
      tableData: [],
      colHeads: [],
      rowHeads: []
    }
  },
  colWidth: () => [120, 340]
}) 

const gridRef = ref<VxeGridInstance<any>>()

// grid表格配置
const gridOptions = reactive<VxeGridProps<any>>({
  border: true,
  height: '100%',
  size: props.size,
  headerCellClassName: ({ $rowIndex, column, columnIndex, $columnIndex }) => {
    let defaultClass = 'ALPH';
    const newClass = props.headerCellClassName?.({ $rowIndex, column, columnIndex, $columnIndex }) ?? ''
    return defaultClass + ' ' + newClass
  },
  showHeaderOverflow: true,
  cellClassName: 'ALPH',
  editConfig: {
    trigger: 'dblclick',
    mode: 'cell',
    enabled: false,
    beforeEditMethod: ({ row, rowIndex, column, columnIndex }) => {
      return props.cellEditSetting?.({ row, rowIndex, column, columnIndex }) ?? true;
    }
  },
  columns: [],
  data: [],
  mergeCells: [],
})

// 是否编辑模式
const _isEdit = defineModel<boolean>('isEdit', {
  default: false
})

// 激活单元格编辑时保存的单元格旧数据
const cellOldData = ref<string>('')

// grid表格事件
const gridEvents: VxeGridListeners<any> = {
  // 激活单元格编辑
  editActivated({ column, row }) {
    cellOldData.value = row[column.field]
    console.log(`激活编辑 field=${column.field} rowId=${row.id} oldData=${cellOldData.value}`)
  },
  // 单元格编辑结束
  async editClosed({ row, rowIndex, column, columnIndex }) {
    const horizontalIds = props.layout == 'vertical' ? column.field?.split('_')[1] as string : row.id.toString()
    const sideIds = props.layout == 'vertical' ? row.id.toString() : column.field?.split('_')[1] as string
    const resCellData = findCellData(props.data?.tableData, {
      horizontalIds,
      sideIds,
    });
    const oldValue = cellOldData.value
    // 判断是否有修改
    if (row[column.field] == oldValue) return;

    if (!props.endEdit) return true;
    // 👇调用结束编辑回调函数
    try {
      props.endEdit({ row, rowIndex, column, columnIndex, resCellData }).then(() => {
        cellOldData.value = ''
      }).catch(() => {
        row[column.field] = oldValue
      })
    } catch (error) {
      console.log(error);
      row[column.field] = oldValue
    }
  }
}

/**
 * ## 导出excel表格数据
 * @param filename 文件名
 */
const exportExcel = async (filename: string) => {
  const _table = gridRef.value
  if (!_table) return
  await _table.exportData({
    type: 'xlsx',
    filename: `${filename}`
  })
}

// 单元格编辑组件
const editInputRender = reactive<VxeColumnPropTypes.EditRender<any, VxeInputProps>>({
  name: 'VxeInput'
})

// 扁平化的columns数据
let columnsFlat: TargetItem[] = []

/**
 * 递归遍历列配置树，保留原始结构并对叶子节点进行处理
 * @param items 列配置数组
 * @returns 处理后的新树形结构
 */
function flattenColumns(items: TargetItem[]): TargetItem[] {
  return items.map((item) => {
    // 创建一个新的对象副本，避免修改原始数据
    const newItem = { ...item };

    if (newItem.children && newItem.children.length > 0) {
      // 如果有子节点，递归处理
      newItem.children = flattenColumns(newItem.children);
    } else {
      // 叶子节点 - 添加编辑和样式配置,可自定义添加更多配置
      newItem.editRender = editInputRender;
      // 添加单元格样式 禁用编辑样式类名：disabled-edit
      newItem.className = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) => {
        return props.cellClassName?.({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) ?? '';
      };
      columnsFlat.push(newItem); // 保留对 columnsFlat 的处理
    }

    return newItem;
  });
}

// 初始化表格配置
const initTable = async () => {
  const { tableData, colHeads, rowHeads } = props.data;
  // 格式化表格列配置
  const { data: columns, lengths: columnsLength } = transformTableDataToTargetFormat(props.layout == 'vertical' ? colHeads : rowHeads)
  // console.log(columns, columnsLength);
  // 格式化表格行配置
  const { rowData, mergeData, maxLevel } = processTableDataDynamic(props.layout == 'vertical' ? rowHeads : colHeads)
  // console.log(rowData, mergeData, maxLevel);
  // 获取默认列配置
  const defaultColumns = getDefaultColumns(maxLevel, props.colName, props.colWidth)

  // 完善列配置
  const _columns = flattenColumns(columns)

  // 完善行配置(赋值单元格数据)
  rowData.forEach((item) => {
    columnsFlat.forEach((itm) => {
      if (itm.field) { // 添加字段存在性检查
        const horizontalIds = props.layout == 'vertical' ? itm.field?.split('_')[1] as string : item.id.toString()
        const sideIds = props.layout == 'vertical' ? item.id.toString() : itm.field?.split('_')[1] as string
        const cellData = findCellData(tableData, {
          horizontalIds,
          sideIds,
        });
        item[itm.field] = cellData?.data || ''
      }
    })
  })

  // 初始化表格列配置
  gridOptions.columns = [...defaultColumns, ..._columns] as any
  // console.log(gridOptions.columns);

  // 初始化表格行配置
  gridOptions.data = rowData
  // console.log(gridOptions.data);

  // 调用补充合并单元格配置
  const mergeDataAddition = props.mergeAddition?.({ rowData, column: deepCopy(gridOptions.columns), columnsLength }) || []

  // 先清空合并状态，再设置合并单元格配置(不然合并渲染会有错误)
  await gridRef.value?.clearMergeCells()
  gridOptions.mergeCells = [...mergeData, ...mergeDataAddition]
}

// 监听表格数据更新
watch(() => props.data, (newVal) => {
  initTable()
}, { deep: true })

// 监听表格布局更新
watch(() => props.layout, (newVal) => {
  initTable()
})

// 监听isEdit属性
watch(() => _isEdit.value, (newVal) => {
  _isEdit.value = newVal
  if (gridOptions.editConfig) {
    gridOptions.editConfig.enabled = newVal
  }
}, { immediate: true })

defineExpose({
  gridRef,
  columnsFlat,
  exportExcel
})

</script>
<style scoped lang="scss">
.evaluation-table {
  --hover-border-color: v-bind("_isEdit ? 'var(--theme-color)' : 'rgba(255, 255, 255, 0.5)'");
  --vxe-ui-table-border-color: rgba(238, 238, 238, 0.41);
  --vxe-ui-table-header-font-color: #B4B4B4;
  --vxe-ui-table-header-background-color: rgba(197, 229, 255, 0.1);
  --vxe-ui-layout-background-color: #000;
  --vxe-ui-font-color: #B4B4B4;

  --cell-disabled-edit-bgColor: rgba(238, 238, 238, 0.14);
  --cell-disabled-edit-borderColor: rgba(255, 255, 255, 0.5);

  :deep(.vxe-body--column:hover) {
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border: 1px solid var(--hover-border-color);
    }
  }
}

:deep(.disabled-edit) {
  background-color: var(--cell-disabled-edit-bgColor);

  &:hover {
    &::before {
      border: 1px solid var(--cell-disabled-edit-borderColor) !important;
    }
  }
}
</style>