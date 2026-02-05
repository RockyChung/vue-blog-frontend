<template>
  <div class="register-container">
    <div class="card">
      <h2>VueBlog 註冊</h2>
      
      <div class="form-group">
        <label>帳號</label>
        <input type="text" v-model="registerForm.username" placeholder="請輸入帳號" @keyup.enter="handleRegister" />
      </div>

      <div class="form-group">
        <label>信箱</label>
        <input type="text" v-model="registerForm.email" placeholder="請輸入信箱" @keyup.enter="handleRegister" />
      </div>

      <div class="form-group">
        <label>使用者名稱</label>
        <input type="text" v-model="registerForm.nickname" placeholder="使用者名稱" @keyup.enter="handleRegister" />
      </div>
      
      <div class="form-group">
        <label>密碼</label>
        <input type="password" v-model="registerForm.password" placeholder="請輸入密碼" @keyup.enter="handleRegister" />
      </div>

      <div class="form-group">
        <label>確認密碼</label>
        <input type="password" v-model="registerForm.confirmPassword" placeholder="請再次輸入密碼" @keyup.enter="handleRegister" />
      </div>

      <button @click="handleRegister" :disabled="loading">
        {{ loading ? '註冊中...' : '註冊' }}
      </button>

      <p class="login-link">
        已經有帳號了？<router-link to="/login">點此登入</router-link>
      </p>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const registerForm = reactive({
  username: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
    errorMessage.value = '請填寫所有欄位'
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = '兩次輸入的密碼不一致'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await register({
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      nickname: registerForm.nickname
    })

    if (res.code === 200) {
      alert('註冊成功！將導向登入頁。')
      router.push('/login')
    } else {
      errorMessage.value = res.message || '註冊失敗'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '註冊過程中發生錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
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
  box-sizing: border-box;
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

.login-link {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
.login-link a {
  color: #42b983;
  text-decoration: none;
}
.login-link a:hover {
  text-decoration: underline;
}
</style>
