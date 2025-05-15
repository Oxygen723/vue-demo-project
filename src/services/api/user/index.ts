import request from "../..";
import url from "./url";
import { getFullUrl, HttpResult, REAR } from '../../config'

export interface LoginBody {
  type: number
  userAccount: string,
  userPwd: string,
}
/**
 * ## 登录
 * @param data 
 * @returns 
 */
export const login = async (data: LoginBody): Promise<HttpResult<any>> => {
  const reqUrl = getFullUrl(REAR.后端1, url.login)
  const res = await request({ method: 'POST', url: reqUrl, data })
  return res.data
}



