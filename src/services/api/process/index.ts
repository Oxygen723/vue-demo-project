import request from "../..";
import apiUrl from "./url";
import { getFullUrl, HttpResult, REAR } from "../../config";

export interface userItem {
  conversionDate: number | null;
  deptId: number;
  employmentStatus: number;
  entryDate: number;
  nickName: string;
  probationPeriod: number;
  resignDate: null;
  userName: string;
}

export interface deptItem {
  children: string[];
  deptId: number;
  deptName: string;
  deptNumber: string;
  userInfoDtoList: userItem[];
}

export enum Subarea {
  技术项目区 = "技术项目区",
  投资数据区 = "投资数据区",
  软件开发区 = "软件开发区",
}

export interface TechnicalDeptParTree {
  [Subarea.技术项目区]: deptItem[];
  [Subarea.投资数据区]: deptItem[];
  [Subarea.软件开发区]: deptItem[];
}

/**
 * ## 获取部门分区树
 * @returns
 */
export const getTechnicalDeptParTree = async (): Promise<
  HttpResult<TechnicalDeptParTree>
> => {
  const url = getFullUrl(REAR.后端2, apiUrl.getTechnicalDeptParTree);
  return await request({
    method: "GET",
    url,
  });
};

type TableType = "monthAwardTable";

export interface TableItem {
  id: number | null;
  level: number;
  name: string;
  parentId: number | null;
  sortRank: number;
  tableInfoId: number;
  type: number;
  children: TableItem[];
}

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

export interface SelectionTableRes {
  tableRowHeads: TableItem[];
  tableColHeads: TableItem[];
  tableData: resTableDataItem[];
  tableInfo: {
    createTime: number;
    id: number;
    title: string;
    type: TableType;
  };
}

/**
 * ## 获取表格数据
 * @returns
 */
export const getTable = async (params: {
  type: TableType;
  dealDate: string;
}): Promise<HttpResult<SelectionTableRes>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.getTable);
  return await request({
    method: "GET",
    url,
    params,
  });
};

export interface AddRowHeadBody {
  deptId: number;
  deptName: string;
  nickName: string;
  partition: string;
  userName: string;
}

/**
 * ## 修改用户（横表头）
 * @param params
 * @param data
 * @returns
 */
export const addRowHead = async (
  params: {
    type: TableType;
    tableInfoId: number;
  },
  data: { list: AddRowHeadBody[] }
): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.addRowHead);
  return await request({
    method: "POST",
    url: url + "?type=" + params.type + "&tableInfoId=" + params.tableInfoId,
    data: data.list,
  });
};

export interface GetTableHeadBody {
  type: TableType;
  dealDate: string;
  /**
   * 1横 2竖
   */
  rowOrCol: 1 | 2;
}
/**
 * ##  查询对应月份表头(横/竖)
 * @param params
 * @returns
 */
export const getTableHead = async (
  params: GetTableHeadBody
): Promise<HttpResult<TableItem[]>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.getTableHead);
  return await request({
    method: "GET",
    url,
    params,
  });
};

export interface AddColHeadBody {
  id?: number; //有就更新无就新增
  tableInfoId: number;
  name: string;
  sortRank: number; // 核心修正：改为 "键": 值 格式
  parentId: null | number;
  type: number;
  level: number;
  isDel: boolean; //必填，是否删除
}

/**
 * ## 竖表头的增删改
 * @param params
 * @returns
 */
export const addColHead = async (
  params: {
    type: TableType;
  },
  data: { list: AddColHeadBody[] }
): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.addColHead);
  return await request({
    method: "POST",
    url: `${url}?type=${params.type}`,
    data: data.list,
  });
};

/**
 * ## 导入Excel
 * @param params
 * @param data
 * @returns
 */
export const importExcel = async (
  params: {
    type: TableType;
    tableInfoId: number;
    /**
     * 1 row 2col 3data 4所有
     */
    rowOrColOrData: number;
  },
  data: FormData
): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.importExcel);
  return await request({
    method: "POST",
    url,
    data,
    params,
  });
};
/**
 * ## 新增excel表头--导入excel需用(导入表头确认)
 * @param params
 * @returns
 */
export const addExcelHead = async (params: {
  type: TableType;
  headData: any;
}): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.addExcelHead);
  return await request({
    method: "POST",
    url: url + `?type=${params.type}`,
    data: params.headData,
  });
};

/**
 * ## 复制表头
 * @param params
 * @returns
 */
export const copyColHead = async (params: {
  sourceDate: string;
  targetDate: string;
  type: TableType;
}): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.copyColHead);
  return await request({
    method: "GET",
    url,
    params,
  });
};

export interface AddTableDataBody {
  id?: number; //有就更新无就新增
  tableInfoId: number;
  sideIds: number | string;
  horizontalIds: number | string;
  data: string;
}

/**
 * ## 新增修改表格单元格数据
 * @param params
 * @param data
 * @returns
 */
export const addTableData = async (
  params: { type: TableType },
  data: { list: AddTableDataBody[] }
): Promise<HttpResult<any>> => {
  const url = getFullUrl(REAR.后端2, apiUrl.addTableData);
  return await request({
    method: "POST",
    url: url + "?type=" + params.type,
    data: data.list,
  });
};
