import request from "../..";
import url from "./url";
import { getFullUrl, HttpResult, REAR } from "../../config";

export interface LoginBody {
  userName: string;
  userPwd: string;
}
/**
 * ## 登录
 * @param data
 * @returns
 */
export const login = async (data: LoginBody): Promise<HttpResult<any>> => {
  const reqUrl = getFullUrl(REAR.后端1, url.login);
  return await request({
    method: "POST",
    url: reqUrl,
    data,
    headers: {
      "Login-Source": import.meta.env.VITE_SYS_NAME,
    },
  });
};
export interface CheckLoginQuery {
  authorization: string;
  userId: number | string;
}
/**
 * ## 检查登录信息
 * @param data
 * @returns
 */
export const checkLogin = async (): Promise<HttpResult<any>> => {
  const reqUrl = getFullUrl(REAR.后端1, url.checkLogin);
  return await request({ method: "GET", url: reqUrl });
};
