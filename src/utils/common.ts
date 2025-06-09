import dayjs from "dayjs";

export const CURRENT_DATE = dayjs().format("YYYY-MM-DD");

export function deepCopy(value: any, hashMap = new WeakMap()) {
  // 处理null、undefined、基本数据类型（string, number, boolean）以及函数和Symbol
  if (
    value === null ||
    typeof value !== 'object' ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  ) {
    return value
  }

  // 检查是否已经处理过该对象（循环引用检测）
  if (hashMap.has(value)) {
    return hashMap.get(value)
  }

  let copy: any

  // 根据值的类型创建新的实例
  if (Array.isArray(value)) {
    copy = []
  } else if (value instanceof Date) {
    copy = new Date(value)
  } else if (value instanceof RegExp) {
    copy = new RegExp(value)
  } else if (value instanceof Map) {
    copy = new Map()
    value.forEach((item, key) => {
      copy.set(deepCopy(key, hashMap), deepCopy(item, hashMap))
    })
  } else if (value instanceof Set) {
    copy = new Set()
    value.forEach((item) => {
      copy.add(deepCopy(item, hashMap))
    })
  } else {
    copy = {}
  }

  // 将新实例存入hashMap，以处理可能的循环引用
  hashMap.set(value, copy)

  // 递归复制所有可枚举属性
  Reflect.ownKeys(value).forEach((key) => {
    copy[key] = deepCopy(value[key], hashMap)
  })

  return copy
}