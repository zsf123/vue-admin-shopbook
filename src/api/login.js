import request from '@/utils/request'


// 登录功能
export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 拉取用户信息
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 后端退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
