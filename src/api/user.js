// 引入axios(axios的二次封装)
import request from '@/utils/request'

// 登录接口函数
// 发送一个 HTTP 请求到后端服务，用于进行用户登录
// data 是一个对象，包含了用户名和密码  格式：{username: username.trim(), password: password}
export function login(data) {
  return request({
    url: '/login/',
    method: 'post',
    data
  });
}

// 获取用户信息的函数
// 在请求体中携带 access_token
export function getInfo(token) {
  return request({
    url: '/info/',
    method: 'get',
    params: { token }
  });
}

// 退出登录的函数
// 在请求体中携带 refresh_token
export function logout(refreshToken) {
  return request({
    url: '/logout/',
    method: 'post',
    // 通过 data 选项设置请求体中的数据
    data: { refresh_token: refreshToken }
  });
}
