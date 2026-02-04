/**
 * ## 单元格数据结构
 */
export interface resTableDataItem {
  /**
   * 单元格数据
   */
  data: string;
  /**
   * 横表头id（成员）
   */
  horizontalIds: string;
  /**
   * 单元格id
   */
  id: number;
  /**
   * 竖表头id
   */
  sideIds: string;
  /**
   * 表格id
   */
  tableInfoId: number;
}

/**
 * ## 表头数据结构
 */
export interface HeadItem {
  id: number | null;
  level: number;
  name: string;
  parentId: number | null;
  sortRank: number;
  tableInfoId: number;
  type: number;
  children: HeadItem[];
}
