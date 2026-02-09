<template>
  <div class="login-container">
    <div class="bg-circle-1"></div>
    <div class="bg-circle-2"></div>

    <div class="auth-card">
      <div class="card-header">
        <h1 class="brand-logo">VueBlog Admin</h1>
        <p class="subtitle">後台管理系統</p>
      </div>
      
      <div class="auth-form">
        <div class="form-group">
          <label>帳號</label>
          <input 
            type="text" 
            v-model="loginForm.username" 
            placeholder="請輸入管理員帳號" 
            @keyup.enter="handleLogin" 
          />
        </div>
        
        <div class="form-group">
          <label>密碼</label>
          <input 
            type="password" 
            v-model="loginForm.password" 
            placeholder="請輸入密碼" 
            @keyup.enter="handleLogin" 
          />
        </div>

        <button 
          @click="handleLogin" 
          :disabled="loading" 
          class="action-btn"
        >
          {{ loading ? '驗證中...' : '登入後台' }}
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="footer-links">
          <router-link to="/" class="back-link">← 返回部落格首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/admin/auth'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    errorMessage.value = '請輸入帳號密碼'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await login(loginForm)
    
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      if (res.data.nickname) localStorage.setItem('nickname', res.data.nickname)
      
      // 登入成功，進入後台儀表板
      router.push('/admin') 
    } else {
      errorMessage.value = res.message || '登入失敗'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '連線錯誤或帳號密碼不正確'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* --- 全頁佈局設定 --- */
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6; /* 淺灰背景，類似 Mac 風格 */
  position: relative;
  overflow: hidden;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* --- 卡片本體 --- */
.auth-card {
  background: white;
  width: 100%;
  max-width: 420px; /* 限制卡片寬度 */
  padding: 50px 40px;
  border-radius: 16px; /* 圓角 */
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); /* 輕微陰影 */
  z-index: 10;
  position: relative;
}

/* --- 標題區塊 --- */
.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand-logo {
  font-size: 28px;
  font-weight: 900;
  color: #1f2937;
  margin: 0 0 5px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* --- 表單樣式 (延續極簡風) --- */
.form-group { 
  margin-bottom: 25px; 
}

.form-group label { 
  display: block; 
  margin-bottom: 8px; 
  color: #374151; 
  font-weight: 600; 
  font-size: 14px; 
}

input {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 2px solid #e5e7eb; /* 淺灰底線 */
  background: transparent;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
  color: #1f2937;
}

input:focus {
  border-bottom-color: #000; /* 聚焦時變黑 */
}

input::placeholder {
  color: #9ca3af;
}

/* --- 按鈕樣式 --- */
.action-btn {
  width: 100%; /* 按鈕滿版 */
  background: #000;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
  transition: transform 0.2s, background 0.3s;
}

.action-btn:hover { 
  background: #333; 
  transform: translateY(-1px);
}

.action-btn:disabled { 
  background: #9ca3af; 
  cursor: not-allowed; 
  transform: none;
}

/* --- 錯誤訊息 --- */
.error { 
  color: #ef4444; 
  margin-top: 15px; 
  font-size: 14px; 
  text-align: center;
}

/* --- 底部連結 --- */
.footer-links {
  margin-top: 30px;
  text-align: center;
}

.back-link {
  color: #6b7280;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s;
}

.back-link:hover {
  color: #000;
}

/* --- 背景裝飾圓圈 (增加設計感) --- */
.bg-circle-1, .bg-circle-2 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
}

.bg-circle-1 {
  width: 300px;
  height: 300px;
  background: #e5e7eb;
  top: -50px;
  left: -50px;
}

.bg-circle-2 {
  width: 200px;
  height: 200px;
  background: #eab308; /* 使用網站的主題黃色 */
  bottom: -50px;
  right: -50px;
  opacity: 0.2;
}
</style>