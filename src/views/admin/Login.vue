<template>
  <div class="auth-content">
    <h2 class="section-title">後台登入</h2>
      
    <div class="auth-form">
      <div class="form-group">
        <label>帳號</label>
        <input type="text" v-model="loginForm.username" placeholder="請輸入管理員帳號" @keyup.enter="handleLogin" />
      </div>
      
      <div class="form-group">
        <label>密碼</label>
        <input type="password" v-model="loginForm.password" placeholder="請輸入密碼" @keyup.enter="handleLogin" />
      </div>

      <button @click="handleLogin" :disabled="loading" class="action-btn">
        {{ loading ? '登入中...' : '登入' }}
      </button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth' // 引入 API

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
      const token = res.data.token
      localStorage.setItem('token', token)
      localStorage.setItem('username', res.data.username)
      if (res.data.nickname) localStorage.setItem('nickname', res.data.nickname)
      
      // 登入成功後，導向後台儀表板
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
/* 統一使用 Home.vue 的風格 */
.section-title { 
  font-size: 42px; 
  font-weight: 900; 
  margin: 0 0 40px 0; 
  color: #000; 
}

.auth-form {
  max-width: 400px; /* 限制寬度，保持美觀 */
}

.form-group { margin-bottom: 25px; }
.form-group label { 
  display: block; 
  margin-bottom: 8px; 
  color: #000; 
  font-weight: bold; 
  font-size: 14px; 
}
input {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 2px solid #eee; /* 改用底線風格 */
  background: transparent;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}
input:focus {
  border-bottom-color: #000;
}

/* 按鈕風格統一 */
.action-btn {
  background: #000;
  color: #fff;
  border: none;
  padding: 12px 36px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  margin-top: 20px;
  transition: background 0.3s;
}
.action-btn:hover { background: #333; }
.action-btn:disabled { background: #ccc; cursor: not-allowed; }

.error { color: red; margin-top: 10px; font-size: 14px; }

.register-link {
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}
.register-link a {
  color: #000;
  font-weight: bold;
  text-decoration: none;
}
</style>