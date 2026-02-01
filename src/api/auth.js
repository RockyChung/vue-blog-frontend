import request from '@/utils/request'

// 登入
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 註冊
export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}