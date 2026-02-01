<template>
  <div class="login-container">
    <div class="card">
      <h2>VueBlog 登入</h2>
      
      <div class="form-group">
        <label>帳號</label>
        <input type="text" v-model="loginForm.username" placeholder="請輸入帳號" @keyup.enter="handleLogin" />
      </div>
      
      <div class="form-group">
        <label>密碼</label>
        <input type="password" v-model="loginForm.password" placeholder="請輸入密碼" @keyup.enter="handleLogin" />
      </div>

      <button @click="handleLogin" :disabled="loading">
        {{ loading ? '登入中...' : '登入' }}
      </button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth' // 引入我們寫好的 API

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
    // 呼叫後端 API
    const res = await login(loginForm)
    
    // 假設後端回傳結構是 { code: 200, data: { token: '...' } }
    // 如果您的結構不同，請根據 console.log(res) 調整這裡
    if (res.code === 200) {
      const token = res.data.token
      // 1. 存 Token
      localStorage.setItem('token', token)
      // 2. 存使用者名稱 (選用)
      localStorage.setItem('username', res.data.username)
      
      // 3. 跳轉到首頁
      router.push('/')
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.card {
  width: 350px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}

h2 { margin-bottom: 20px; color: #333; }

.form-group { margin-bottom: 15px; text-align: left; }
.form-group label { display: block; margin-bottom: 5px; color: #666; font-size: 14px; }
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* 重要：防止 padding 撐大寬度 */
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
button:hover { background-color: #3aa876; }
button:disabled { background-color: #ccc; cursor: not-allowed; }

.error { color: red; margin-top: 10px; font-size: 14px; }
</style>