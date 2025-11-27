import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import { useUserStore } from "../pinia/modules/user";

// 登出处理
export function logout() {
  let redirectPath = window.location.pathname + window.location.search;
  if (redirectPath.includes(`/${import.meta.env.VITE_SYS_NAME}`)) {
    redirectPath = redirectPath.replace(
      `/${import.meta.env.VITE_SYS_NAME}`,
      ""
    );
  }
  const userStore = useUserStore();
  userStore.clearState();
  router.push({
    path: "/login",
    query: redirectPath
      ? { redirect: encodeURIComponent(redirectPath) }
      : undefined,
  });
}

// 统一处理认证错误
function handleAuthError(message: string) {
  if (isLoggingOut) return;

  ElMessage.closeAll();
  ElMessage.error(message);
  isLoggingOut = true;
  setTimeout(() => {
    logout();
    // 登出操作完成后重置标志
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }, 2000);
}

// 用于防止多个接口同时触发登出的标志
let isLoggingOut = false;
// 错误码处理映射
const errorHandlers: any = {
  400: () => console.log("Bad Request"),
  401: () => handleAuthError("未授权访问，请重新登录"),
  403: (msg: string) => {
    ElMessage.closeAll();
    ElMessage.warning(msg);
  },
  404: () => console.log("Not Found"),
  405: () => console.log("Method Not Allowed"),
  406: () => console.log("Not Acceptable"),
  408: () => console.log("Request Timeout"),
  500: (msg: string) => {
    ElMessage.closeAll();
    ElMessage.error(msg);
  },
  504: () => console.log("Gateway Timeout"),
  1000: (msg: string) => {
    ElMessage.closeAll();
    ElMessage.warning(msg);
  },
};

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000 * 60 * 10,
});

// 请求拦截
request.interceptors.request.use(
  (config) => {
    const authorization = sessionStorage.getItem("authorization");
    config.headers["Login-Source"] = import.meta.env.VITE_SYS_NAME;
    if (authorization) {
      config.headers["Finance-Token"] = authorization;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const { code } = response.data;

    const handler = errorHandlers[code];
    if (code === 200) {
      return response.data;
    } else {
      if (handler) {
        // 处理code非200的情况
        handler(response.data.msg);
      } else {
        console.log(`Unhandled status code: ${code}`);
      }
      return response.data;
    }
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 执行对应的错误处理
      const handler = errorHandlers[status];
      if (handler) {
        handler();
      } else {
        console.log(`Unhandled status code: ${status}`);
      }

      // 处理服务器错误
      if (/^5\d{2}$/.test(status.toString())) {
        console.log("Server Error");
      }
    } else if (error.message) {
      console.log(`Error: ${error.message}`);
      ElMessage.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default request;
