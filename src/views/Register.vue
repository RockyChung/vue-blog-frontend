<template>
  <div class="auth-content">
    <h2 class="section-title">註冊帳號</h2>
    
    <div class="auth-form">
      <div class="form-group">
        <label>帳號</label>
        <input type="text" v-model="registerForm.username" placeholder="設定您的帳號" />
      </div>
      
      <div class="form-group">
        <label>密碼</label>
        <input type="password" v-model="registerForm.password" placeholder="設定您的密碼" />
      </div>

      <div class="form-group">
        <label>暱稱</label>
        <input type="text" v-model="registerForm.nickname" placeholder="您想顯示的名稱" />
      </div>

      <button @click="handleRegister" :disabled="loading" class="action-btn">
        {{ loading ? '註冊中...' : '註冊' }}
      </button>

      <p class="login-link">
        已經有帳號？<router-link to="/login">直接登入</router-link>
      </p>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/admin/auth' // 假設您有這個 API

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const registerForm = reactive({
  username: '',
  password: '',
  nickname: ''
})

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password) {
    errorMessage.value = '請填寫完整資訊'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await register(registerForm)
    if (res.code === 200) {
      alert('註冊成功！請登入')
      router.push('/login')
    } else {
      errorMessage.value = res.message || '註冊失敗'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '連線錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.section-title { 
  font-size: 42px; 
  font-weight: 900; 
  margin: 0 0 40px 0; 
  color: #000; 
}

.auth-form { max-width: 400px; }
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
  border-bottom: 2px solid #eee;
  background: transparent;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}
input:focus { border-bottom-color: #000; }

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

.login-link { margin-top: 30px; font-size: 14px; color: #666; }
.login-link a { color: #000; font-weight: bold; text-decoration: none; }
.login-link a:hover { text-decoration: underline; }
</style>