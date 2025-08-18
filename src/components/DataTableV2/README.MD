### DataTableV2

根据 `element plus` 虚拟表格二次封装

### DataTableV2 Attributes

```javascript
interface TableV2CpmProp {
  height: number | string // 表格高度
  data: TableV2RowProps[] // 表格数据
  columns: TableV2ColProps[] // 表格列
  headerHeight?: number // 表头高度
  rowHeight?: number // 行高
}
const props = withDefaults(defineProps<TableV2CpmProp>(), {
  height: '100%',
  headerHeight: 24,
  rowHeight: 24
})
```

### Column Attributes

```javascript
interface TableV2ColProps {
  dataKey: string; // 列的key
  title: string; // 列的标题
  width: number; // 列的宽度
  cellType: "text" | "number" | "date" | "custom"; // 单元格类型
  numberType?: "default" | "percent" | "colorPercent"; // 数字类型
  dateFormat?: string; // 日期格式
  sortable?: boolean; // 是否可排序
  align?: "left" | "center" | "right"; // 列的对齐方式
  class?: string; // 单元格css样式
  headerClass?: string; // 标题css样式
  cellRender?: (props: CellRenderProps<TableV2ColProps>) => VNode | string; // 单元格渲染函数
  headerRender?: (props: HeaderRenderProps<TableV2ColProps>) => VNode | string; // 表头渲染函数
}
```

### Events

| 事件名   | 描述                 | 参数                  |
| -------- | -------------------- | --------------------- |
| clickRow | 点击某一行触发的事件 | (rowData:any) => void |

### Demo

```vue
<template>
  <DataTableV2
    :data="tableData"
    :columns="tableCols"
    :height="'100%'"
    @click-row="handleClickRow"></DataTableV2>
</template>
<script lang="ts" setup>
import DataTableV2 from '@/components/DataTableV2/index.vue';
import { TableV2ColProps, TableV2RowProps } from '@/components/DataTableV2/config';
const tableCols: TableV2ColProps[] = [
  { dataKey: 'idxNum', title: '序号', width: 55, align: 'right', cellType: 'custom', class: 'text-#FE3930', cellRender: ({ rowIndex }) => `${rowIndex + 1}` },
  { dataKey: 'name', title: '姓名', width: 70, cellType: 'text', align: 'right' },
  { dataKey: 'dealDate', title: '交易日期', width: 110, cellType: 'date', dateFormat: 'YYYY.MM.DD', align: 'right', class: 'text-#ABABAB' },
  { dataKey: 'changePercent', title: '涨跌幅', width: 90, cellType: 'number', numberType: 'colorPercent', align: 'right', sortable: true },
]

const tableData: TableV2RowProps[] = [
  { name: '罗嘉俊', dealDate: 1754236800000, changePercent: -0.123 },
  { name: '屈中翔', dealDate: 1754472321000, changePercent: 0.123 },
]

const handleClickRow = (rowData: any) => {
  console.log(rowData)
}
</script>
```
