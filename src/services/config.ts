export interface HttpResult<T> {
  code: number;
  data: T;
  msg: string;
}
export interface resultPage<T> {
  current: number;
  pages: number;
  records: T;
  size: number;
  total: number;
}
export enum REAR {
  "后端1" = "后端1",
  "后端2" = "后端2",
  "后端3" = "后端3",
}

// 默认生产服务器地址
const prodBaseUrl = "https://dz.szdjct.com";
// 默认测试服务器地址
const testBaseUrl = "http://test46.szdjct.com";

// 各个后端服务器地址
const baseUrl = {
  开发: {
    [REAR.后端1]: "rearDevUrl",
    [REAR.后端2]: "rearDevUrl",
    [REAR.后端3]: "rearDevUrl",
  },
  生产: {
    [REAR.后端1]: "rearProdUrl",
    [REAR.后端2]: "rearProdUrl",
    [REAR.后端3]: "rearProdUrl",
  },
  测试: {
    [REAR.后端1]: "rearTestUrl",
    [REAR.后端2]: "rearTestUrl",
    [REAR.后端3]: "rearTestUrl",
  },
};

// 端口
const ports = {
  开发: {
    [REAR.后端1]: "",
    [REAR.后端2]: "",
    [REAR.后端3]: "",
  },
  生产: {
    [REAR.后端1]: "",
    [REAR.后端2]: "",
    [REAR.后端3]: "",
  },
  测试: {
    [REAR.后端1]: "",
    [REAR.后端2]: "",
    [REAR.后端3]: "",
  },
};

export const getFullUrl = (rear: REAR, url: string, port?: string): string => {
  let fullStr = "";
  const env = import.meta.env.MODE;
  const modeMap = {
    development: "开发",
    production: "生产",
    test: "测试",
  } as const;

  // 2. 取出固定字面量类型
  const mode: keyof typeof baseUrl = modeMap[env as keyof typeof modeMap];
  fullStr = `${baseUrl[mode][rear]}:${port ? port : ports[mode][rear]}${url}`;
  return fullStr;
};
