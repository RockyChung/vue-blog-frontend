<template>
  <div class="home-container">
    <header class="navbar">
      <div class="profile-section">
        <div class="avatar-circle">
          <span class="avatar-text">{{ username.charAt(0).toUpperCase() }}</span>
        </div>
        <h1 class="profile-name">{{ username }}</h1>
        <div class="separator"></div>
        <p class="profile-role">EDITOR & WRITER</p>
      </div>
      
      <nav class="nav-menu">
        <!-- 使用 router-link 並設定 active-class -->
        <router-link to="/" class="nav-link" exact-active-class="active">文章列表</router-link>
        <router-link to="/about" class="nav-link" active-class="active">關於我</router-link>
        <a href="#" class="nav-link">聯絡資訊</a>
      </nav>

      <div class="sidebar-footer">
        <div class="social-icons">
          <span class="icon">FB</span>
          <span class="icon">IG</span>
          <span class="icon">IN</span>
        </div>
      </div>
    </header>

    <!-- 右側內容變動區 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('nickname') || localStorage.getItem('username') || 'User')

const handleLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 佈局相關 CSS */
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Avenir', 'Helvetica Neue', sans-serif;
}

.navbar {
  width: 35%;
  max-width: 400px;
  min-width: 280px;
  background-color: #F2C94C;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
}

.profile-section {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.profile-name {
  font-size: 32px;
  font-weight: 800;
  margin: 10px 0;
  color: #000;
  letter-spacing: 1px;
}

.separator {
  width: 40px;
  height: 2px;
  background-color: #000;
  margin: 15px 0;
}

.profile-role {
  font-size: 14px;
  letter-spacing: 2px;
  color: #333;
  font-weight: 500;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-bottom: auto;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-link:hover, .nav-link.active {
  border-bottom: 1px solid #000;
}

.login-btn {
  margin-top: 20px;
  font-family: inherit;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.icon {
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon:hover { transform: scale(1.1); }

.main-content {
  flex-grow: 1;
  padding: 80px 8%;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .home-container { flex-direction: column; }
  .navbar { 
    width: 100%; 
    max-width: none;
    height: auto; 
    padding: 40px 20px; 
    position: relative; 
  }
  .profile-section { margin-bottom: 30px; }
  .nav-menu { flex-direction: row; justify-content: center; gap: 20px; flex-wrap: wrap; }
  .social-icons { display: none; }
  .main-content { padding: 40px 20px; }
}
</style>