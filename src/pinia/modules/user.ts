import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { setAuthState } from "@djct/aio-sdk";
import {
  login,
  LoginBody,
  checkLogin,
  CheckLoginQuery,
} from "../../services/api";
import { ElMessage } from "element-plus";
import router from "@/router";
import { SHA512 } from "crypto-js";
export const useUserStore = defineStore("userStore", () => {
  const userInfo = ref<LoginBody>({
    userName: "",
    userPwd: "",
  });

  // 登录
  const handleLogin = async () => {
    if (!userInfo.value.userName || !userInfo.value.userPwd) {
      return ElMessage.error("请输入用户名和密码");
    }
    const { code, data, msg } = await login({
      userName: userInfo.value.userName,
      userPwd: SHA512(userInfo.value.userPwd).toString(),
    });

    if (code === 200) {
      ElMessage.success("登录成功");
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("authorization", data.authorization);
      // router.push("");
      setAuthState(true);
    } else {
      ElMessage.error(msg);
      setAuthState(false);
    }
  };

  // 检查登录信息
  const loginCheck = async (query: CheckLoginQuery) => {
    sessionStorage.setItem("authorization", query.authorization);
    const resData = await checkLogin();
    if (resData.code === 200) {
      setAuthState(true);
      sessionStorage.setItem("userId", String(resData.data.userId));
      sessionStorage.setItem("authorization", resData.data.token);
    } else {
      setAuthState(false);
      clearState();
    }
    return resData;
  };

  const clearState = () => {
    userInfo.value = { userName: "", userPwd: "" };
    sessionStorage.removeItem("authorization");
    localStorage.removeItem("userId");
  };

  return {
    userInfo,
    handleLogin,
    loginCheck,
    clearState,
  };
});
