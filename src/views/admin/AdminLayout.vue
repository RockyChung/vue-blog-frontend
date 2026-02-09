<template>
  <div class="admin-container">
    <!-- 左側管理選單 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>Blog Admin</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact-active-class="active">
          📊 儀表板
        </router-link>
        <router-link to="/admin/AdmArticles" class="nav-item" active-class="active">
          📝 文章管理
        </router-link>
        
        <div class="divider"></div>
        
        <router-link to="/" class="nav-item">
          🏠 回前台首頁
        </router-link>
        <button @click="handleLogout" class="nav-item logout-btn">
          🚪 登出
        </button>
      </nav>
    </aside>

    <!-- 右側內容區 -->
    <main class="admin-main">
      <header class="admin-header">
        <span>歡迎回來，管理員</span>
      </header>
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('nickname')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 側邊欄樣式 */
.admin-sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a252f;
}

.sidebar-nav {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  padding: 15px 25px;
  color: #bdc3c7;
  text-decoration: none;
  transition: 0.3s;
  border-left: 4px solid transparent;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
}

.nav-item:hover, .nav-item.active {
  background-color: #34495e;
  color: #fff;
  border-left-color: #42b983;
}

.divider { height: 1px; background: #444; margin: 10px 20px; }

/* 右側內容區樣式 */
.admin-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30px;
}

.content-wrapper {
  padding: 30px;
  overflow-y: auto;
}
</style>