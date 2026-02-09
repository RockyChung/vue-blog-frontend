import request from '@/utils/request'

// 登入 API
export function login(data) {
  return request({
    url: '/api/adm/auth/login',
    method: 'post',
    data
  })
}

// 註冊
export function register(data) {
  return request({
    url: '/api/adm/auth/register',
    method: 'post',
    data
  })
}