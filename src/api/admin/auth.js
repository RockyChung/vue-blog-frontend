import request from '@/utils/request'

// 登入 API
export function login(data) {
  return request({
    url: '/api/admin/auth/login',
    method: 'post',
    data
  })
}

// 註冊
export function register(data) {
  return request({
    url: '/api/admin/auth/register',
    method: 'post',
    data
  })
}