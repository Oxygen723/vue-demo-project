import { Column } from "element-plus";
import { VNode } from "vue";

export type CellRenderProps<T> = {
  cellData: T;
  column: Column<T>;
  columns: Column<T>[];
  columnIndex: number;
  rowData: any;
  rowIndex: number;
};
export type HeaderRenderProps<T> = {
  column: Column<T>;
  columns: Column<T>[];
  columnIndex: number;
  headerIndex: number;
};

/**
 * 表格列属性
 */
export interface TableV2ColProps {
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

/**
 * 表格行属性
 */
export interface TableV2RowProps {
  [key: string]: string | number;
}
