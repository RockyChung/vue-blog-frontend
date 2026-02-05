import axios from 'axios'

// 1. 建立 axios 實體
const service = axios.create({
  // ⚠️ 請確認這是您後端的網址
  baseURL: 'http://localhost:8080', 
  timeout: 5000 
})

// 2. Request 攔截器：每次發請求前，自動貼上 Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // ⚠️ 後端 SecurityConfig 規定要 'Bearer ' 開頭 (注意有個空白)
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 3. Response 攔截器：處理後端回傳的資料
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果想要在 Console 看到後端回傳什麼，可以把這行打開
    console.log('後端回應:', res)
    return res
  },
  error => {
    console.error('請求錯誤:', error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 (權限不足)，就踢回登入頁
          localStorage.removeItem('token')
          // 這裡建議依您的路由設定調整，通常是導回 /login
          // location.href = '/login'
          break
        case 403:
          // 403 (禁止訪問)，通常是權限不夠，或後端有安全設定 (如 CSRF)
          console.error('收到 403 Forbidden 錯誤。您可能沒有權限訪問此資源，或請檢查後端 CORS、CSRF 安全設定。')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default service