import { TableItem } from "@/services/api/process";
import { resTableDataItem } from "./types";
import { VxeColumnProps, VxeGridPropTypes, VxeTableDefines } from "vxe-table";

/**
 * ## 深拷贝函数
 * @param value 待拷贝的值
 * @param hashMap 用于处理循环引用的对象
 * @returns 拷贝后的值
 */
export const deepCopy = (value: any, hashMap = new WeakMap()) => {
  // 处理null、undefined、基本数据类型（string, number, boolean）以及函数和Symbol
  if (
    value === null ||
    typeof value !== "object" ||
    typeof value === "function" ||
    typeof value === "symbol"
  ) {
    return value;
  }

  // 检查是否已经处理过该对象（循环引用检测）
  if (hashMap.has(value)) {
    return hashMap.get(value);
  }

  let copy: any;

  // 根据值的类型创建新的实例
  if (Array.isArray(value)) {
    copy = [];
  } else if (value instanceof Date) {
    copy = new Date(value);
  } else if (value instanceof RegExp) {
    copy = new RegExp(value);
  } else if (value instanceof Map) {
    copy = new Map();
    value.forEach((item, key) => {
      copy.set(deepCopy(key, hashMap), deepCopy(item, hashMap));
    });
  } else if (value instanceof Set) {
    copy = new Set();
    value.forEach((item) => {
      copy.add(deepCopy(item, hashMap));
    });
  } else {
    copy = {};
  }

  // 将新实例存入hashMap，以处理可能的循环引用
  hashMap.set(value, copy);

  // 递归复制所有可枚举属性
  Reflect.ownKeys(value).forEach((key) => {
    copy[key] = deepCopy(value[key], hashMap);
  });

  return copy;
};

/**
 * ## 根据单元格横竖表头id查找对应单元格详情
 * @param resTableData
 * @param cell
 * @returns
 */
export const findCellData = (
  resTableData: resTableDataItem[],
  cell: { horizontalIds: string; sideIds: string },
) => {
  return (
    resTableData.find(
      (item) =>
        item.horizontalIds === cell.horizontalIds &&
        item.sideIds === cell.sideIds,
    ) || null
  );
};

export interface TargetItem extends VxeColumnProps {
  subarea?: string;
  children?: TargetItem[];
}

/**
 * 统计指定节点的所有叶子节点（最深层级节点）数量
 * @param data 树形结构数据
 * @param targetName 目标项的名称
 * @returns 叶子节点数量，如果未找到返回0
 */
export function countLeafDescendantsByName(
  data: TableItem[],
  targetName: string,
): number {
  // 查找目标节点
  function findNodeByName(nodes: TableItem[]): TableItem | null {
    for (const node of nodes) {
      if (node.name === targetName) {
        return node;
      }

      if (node.children && node.children.length > 0) {
        const found = findNodeByName(node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // 统计叶子节点
  function countLeaves(node: TableItem): number {
    if (!node.children || node.children.length === 0) {
      return 1; // 当前节点就是叶子节点
    }

    let leafCount = 0;

    // 遍历所有子节点
    for (const child of node.children) {
      leafCount += countLeaves(child);
    }

    return leafCount;
  }

  // 查找目标节点
  const targetNode = findNodeByName(data);

  if (!targetNode) {
    console.warn(`未找到名称为"${targetName}"的节点`);
    return 0;
  }

  // 统计叶子节点
  return countLeaves(targetNode);
}

/**
 * ## 根据后端横表头树型数据生成表格column配置和长度
 * @param data 树形结构的表头数据
 * @returns
 */
export function transformTableDataToTargetFormat(data: TableItem[]): {
  data: TargetItem[];
  lengths: number[][];
} {
  let dataLengths: number[][] = [];
  // 先按 sortRank 排序，确保顺序一致
  const sortData = (items: TableItem[]): TableItem[] => {
    return [...items].sort((a, b) => a.sortRank - b.sortRank);
  };

  let currentLength = 0;
  const transformNode = (node: TableItem, subarea: string): TargetItem => {
    const result: TargetItem = {
      title: node.name,
      align: "center",
    };
    // 如果有子节点
    if (node.children && node.children.length > 0) {
      if (node.level == 1) {
        const childrenCount = countLeafDescendantsByName(data, node.name);
        dataLengths.push([currentLength, childrenCount]);
        currentLength += childrenCount;
      }
      const sortedChildren = node.children;
      result.children = sortedChildren.map((child) =>
        transformNode(child, subarea),
      );
    } else {
      // 叶子节点（没有子节点）才添加 field
      result.field = `col_${node.id}`;
      result.width = 85;
      result.subarea = subarea;
    }
    return result;
  };

  // 对根节点排序并转换
  const sortedData = data;

  return {
    data: sortedData.map((item) => transformNode(item, item.name)),
    lengths: dataLengths,
  };
}

export interface RowDataItem {
  id: number;
  [key: string]: any;
}

export interface MergeConfigItem extends VxeTableDefines.MergeOptions {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
}

export interface ProcessedResult {
  rowData: RowDataItem[];
  mergeData: MergeConfigItem[];
  maxLevel: number;
}

/**
 * 动态处理任意层级竖表头的通用函数
 * @param data 树形结构的表头数据
 * @returns 处理后的表格数据和合并配置
 */
export function processTableDataDynamic(data: TableItem[]): ProcessedResult {
  const rowData: RowDataItem[] = [];
  const mergeData: MergeConfigItem[] = [];

  // 收集所有节点，建立映射
  const allNodes: TableItem[] = [];
  const idToNodeMap = new Map<number, TableItem>();
  const parentToChildrenMap = new Map<number | null, TableItem[]>();
  let maxLevel = 0; // 动态计算最大层级

  // 递归收集所有节点并计算最大层级
  function collectNodes(nodes: TableItem[], currentLevel: number = 1) {
    maxLevel = Math.max(maxLevel, currentLevel);

    nodes.forEach((node) => {
      allNodes.push(node);
      idToNodeMap.set(node.id as number, node);

      // 建立父节点到子节点的映射
      if (!parentToChildrenMap.has(node.id)) {
        parentToChildrenMap.set(node.id, []);
      }

      if (node.parentId !== null) {
        if (!parentToChildrenMap.has(node.parentId)) {
          parentToChildrenMap.set(node.parentId, []);
        }
        parentToChildrenMap.get(node.parentId)!.push(node);
      }

      if (node.children && node.children.length > 0) {
        collectNodes(node.children, currentLevel + 1);
      }
    });
  }

  collectNodes(data);

  // 获取节点的祖先链
  function getAncestorChain(node: TableItem): TableItem[] {
    const chain: TableItem[] = [node];
    let current = node;

    while (current.parentId !== null) {
      const parent = idToNodeMap.get(current.parentId);
      if (parent) {
        chain.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return chain;
  }

  // 计算叶子节点数量（递归）
  function countLeafNodes(node: TableItem): number {
    if (!node.children || node.children.length === 0) {
      return 1;
    }

    let count = 0;
    for (const child of node.children) {
      count += countLeafNodes(child);
    }
    return count;
  }

  // 动态计算列索引
  function getColumnIndex(level: number): number {
    return level - 1;
  }

  // 动态计算colspan
  function getColspan(node: TableItem): number {
    if (!node.children || node.children.length === 0) {
      // 叶子节点：跨列数 = 总列数 - 当前层级 + 1
      return maxLevel - (node.level - 1);
    }
    return 1;
  }

  // 1. 生成rowData - 动态处理任意层级
  allNodes.forEach((node) => {
    if (!node.children || node.children.length === 0) {
      // 只处理叶子节点
      const ancestors = getAncestorChain(node);
      const rowItem: RowDataItem = {
        id: node.id as number,
      } as RowDataItem;

      // 动态创建字段 - 根据最大层级创建相应数量的字段
      for (let i = 1; i <= maxLevel; i++) {
        rowItem[`customField_${i}`] = "";
      }

      // 按层级填充对应的字段
      ancestors.forEach((ancestor) => {
        const fieldIndex = ancestor.level;
        if (fieldIndex <= maxLevel) {
          rowItem[`customField_${fieldIndex}`] = ancestor.name;
        }
      });

      // 如果是当前节点层级，也填充自己的名称
      const currentNodeFieldIndex = node.level;
      if (currentNodeFieldIndex <= maxLevel) {
        rowItem[`customField_${currentNodeFieldIndex}`] = node.name;
      }

      rowData.push(rowItem);
    }
  });

  // 2. 生成mergeData - 动态处理任意层级
  // 只处理有子节点或叶子节点（用于显示自身内容）
  const processedNodes = allNodes.filter(
    (node) =>
      (node.children && node.children.length > 0) ||
      !node.children ||
      node.children.length === 0,
  );

  // 计算每个节点的行位置
  const nodeRowStartMap = new Map<number, number>();
  const nodeRowspanMap = new Map<number, number>();

  // 先计算每个节点的rowspan
  processedNodes.forEach((node) => {
    const rowspan = countLeafNodes(node);
    nodeRowspanMap.set(node.id as number, rowspan);
  });

  // 按层级分组处理节点
  const nodesByLevel = new Map<number, TableItem[]>();
  processedNodes.forEach((node) => {
    if (!nodesByLevel.has(node.level)) {
      nodesByLevel.set(node.level, []);
    }
    nodesByLevel.get(node.level)!.push(node);
  });

  // 从顶层到底层动态处理
  for (let level = 1; level <= maxLevel; level++) {
    const levelNodes = nodesByLevel.get(level) || [];
    const parentGroups = new Map<number, TableItem[]>();

    // 按父节点分组
    levelNodes.forEach((node) => {
      const parentId = node.parentId === null ? 0 : node.parentId;
      if (!parentGroups.has(parentId)) {
        parentGroups.set(parentId, []);
      }
      parentGroups.get(parentId)!.push(node);
    });

    // 处理每个父节点下的子节点
    parentGroups.forEach((nodes, parentId) => {
      // 排序，保持原始顺序
      nodes.sort((a, b) => {
        const children =
          parentToChildrenMap.get(parentId === 0 ? null : parentId) || [];
        return (
          children.findIndex((n) => n.id === a.id) -
          children.findIndex((n) => n.id === b.id)
        );
      });

      let currentRow = 0;

      // 如果是顶层节点，从0开始
      if (parentId === 0) {
        currentRow = 0;
      } else {
        // 从父节点的起始行开始
        const parentRow = nodeRowStartMap.get(parentId) || 0;
        currentRow = parentRow;
      }

      // 为每个节点分配行号
      nodes.forEach((node, index) => {
        // 如果有同级的先前节点，需要累加它们的rowspan
        if (index > 0) {
          const prevNode = nodes[index - 1];
          const prevRowspan = nodeRowspanMap.get(prevNode.id as number) || 0;
          currentRow += prevRowspan;
        }

        nodeRowStartMap.set(node.id as number, currentRow);
      });
    });
  }

  // 生成mergeData
  processedNodes.forEach((node) => {
    const row = nodeRowStartMap.get(node.id as number) || 0;
    const col = getColumnIndex(node.level);
    const rowspan = nodeRowspanMap.get(node.id as number) || 0;
    const colspan = getColspan(node);

    mergeData.push({
      row,
      col,
      rowspan,
      colspan,
    });
  });

  return {
    rowData,
    mergeData,
    maxLevel,
  };
}

/**
 * ## 根据竖表头最大层级生成默认列配置
 * @param maxLevel 最大层级
 * @param colName 列名（字符串数组或单个字符串）
 * @param colWidth 列宽度数组，第一个值为非末级宽度，第二个值为末级宽度
 * @returns VxeGrid 列配置数组
 */
export const getDefaultColumns = (
  maxLevel: number,
  colName: string[] | string = "",
  colWidth: [number, number] = [120, 340],
): VxeGridPropTypes.Columns => {
  // 使用 map 方法替代 for 循环，更简洁且函数式
  return Array.from({ length: maxLevel }, (_, index) => {
    const level = index + 1;
    const isLastLevel = level === maxLevel;

    // 确定当前列的标题
    let title = "";
    if (Array.isArray(colName)) {
      title = colName[index] || "";
    } else if (typeof colName === "string") {
      title = isLastLevel ? colName : "";
    }

    return {
      field: `customField_${level}`,
      title,
      align: "center",
      fixed: "left",
      width: isLastLevel ? colWidth[1] : colWidth[0],
    };
  });
};
