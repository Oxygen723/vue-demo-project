import dayjs from "dayjs";

/**
 * ## 当天日期
 */
export const CURRENT_DATE = dayjs().format("YYYY-MM-DD");

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
 * 过滤空值
 * @param value 待过滤的值
 * @returns
 */
export const isValue = (value: number | string) => {
  return value === null || value === undefined || value === "" ? "--" : value;
};

/**
 * ## 根据文件类型获取对应的MIME类型
 * @param fileType 文件类型
 * @returns 对应的MIME类型字符串
 */
const getMimeType = (fileType: "xlsx" | "docx" | "pdf"): string => {
  const mimeMap = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
  };

  return mimeMap[fileType] || "application/octet-stream";
};

/**
 * ## 通过Blob数据下载文件
 * @param filename 文件名（不需要带后缀）
 * @param fileType 文件类型，支持 'xlsx' | 'docx' | 'pdf'
 * @param blobData 文件的Blob数据
 */
export const downloadFileByBlob = (
  filename: string,
  fileType: "xlsx" | "docx" | "pdf",
  blobData: Blob
): void => {
  // 确保文件名不包含后缀
  const cleanFilename = filename.replace(/\.(xlsx|docx|pdf)$/i, "");

  // 创建Blob对象，根据类型设置正确的MIME类型
  const blob = new Blob([blobData], {
    type: getMimeType(fileType),
  });

  // 创建下载链接
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // 设置下载属性
  link.href = downloadUrl;
  link.download = `${cleanFilename}.${fileType}`;
  link.style.display = "none";

  // 添加到DOM并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};

/**
 * ## 判断数字是否为正数，并返回对应的颜色
 * @param number
 * @returns
 */
export const minMaxColor = (number: number) => {
  return number <= 0 ? "#26E28E" : "#FE3930";
};
