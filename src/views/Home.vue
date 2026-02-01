<template>
  <div class="home-container">
    <h1>🎉 歡迎回來, {{ username }}</h1>
    <p>您已成功登入系統！</p>
    <button @click="handleLogout" class="logout-btn">登出</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || 'User')

const handleLogout = () => {
  // 清除 Token
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  // 回到登入頁
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}
.logout-btn {
  padding: 8px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>