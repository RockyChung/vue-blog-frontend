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
        <a href="#" class="nav-link active">文章列表</a>
        <a href="#" class="nav-link">關於我</a>
        <a href="#" class="nav-link">聯絡資訊</a>
        <button @click="handleLogout" class="nav-link logout-btn">登出</button>
      </nav>

      <div class="sidebar-footer">
        <div class="social-icons">
          <span class="icon">FB</span>
          <span class="icon">IG</span>
          <span class="icon">IN</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="action-bar">
        <h2 class="section-title">最新文章</h2>
        <button class="create-btn">New Post</button>
      </div>

      <div v-if="loading" class="loading">載入中...</div>

      <div v-else class="article-list">
        <div v-if="articles.length === 0" class="empty-state">
          目前還沒有任何文章，快來寫第一篇吧！
        </div>
        <div v-for="article in articles" :key="article.id" class="article-card">
          <div class="card-header">
            <span class="date">{{ formatDate(article.createTime) }}</span>
            <span class="category-tag">BLOG</span>
          </div>
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="summary">{{ article.summary || article.content?.substring(0, 100) || '' }}...</p>
          <button class="read-more-btn">Read More</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article' // 引入剛剛寫的 API

const router = useRouter()
const username = ref(localStorage.getItem('nickname') || localStorage.getItem('username') || 'User')
const articles = ref([]) // 用來存文章資料
const loading = ref(true)

// 登出功能
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}

// 取得文章列表
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await getArticleList()
    // 假設後端回傳格式是 Result.success(data) -> res.data 就是 List<Article>
    if (res.code === 200) {
      // 為了方便除錯，印出完整的後端回應
      console.log('完整的後端回應 (res):', res)

      // 檢查 res.data 是否為陣列。如果不是，它可能是一個包含文章列表的物件 (例如分頁物件)
      if (Array.isArray(res.data)) {
        articles.value = res.data
      } else if (res.data && Array.isArray(res.data.records)) {
        // 常見的分頁物件結構，文章在 records 屬性中
        articles.value = res.data.records
      } else if (res.data && Array.isArray(res.data.content)) {
        // Spring Data JPA 常見結構
        articles.value = res.data.content
      } else if (res.data && Array.isArray(res.data.list)) {
        // PageHelper 或其他常見結構
        articles.value = res.data.list
      } else {
        console.error('從後端取得的文章資料不是預期的陣列格式，請檢查 API 回應。得到的 res.data 是:', res.data)
        articles.value = [] // 確保 articles.value 永遠是陣列，避免模板出錯
      }
    }
  } catch (error) {
    console.error('取得文章失敗:', error)
  } finally {
    loading.value = false
  }
}

// 簡單的日期格式化工具
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

// ★★★ 關鍵：畫面一掛載好，就執行 fetchArticles
onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
/* 簡單又好看的 CSS */
/* 改為左右分割佈局，類似個人作品集/部落格風格 */
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Avenir', 'Helvetica Neue', sans-serif;
}

.navbar {
  width: 35%; /* 側邊欄佔比較大，符合 Wix 履歷範本風格 */
  max-width: 400px;
  min-width: 280px;
  background-color: #F2C94C; /* 經典的履歷黃色 */
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 內容置中 */
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

.logout-btn {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
}

.section-title { 
  font-size: 42px; 
  font-weight: 900; 
  margin: 0; 
  color: #000; 
}

.create-btn { 
  background: #000; 
  color: #fff; 
  border: none; 
  padding: 12px 28px; 
  border-radius: 30px; /* 圓角按鈕 */
  cursor: pointer; 
  font-weight: bold; 
  font-size: 14px;
  transition: background 0.3s;
}
.create-btn:hover { background: #333; }

.article-card {
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #eee;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.date { font-size: 14px; color: #888; font-weight: 500; }
.category-tag { font-size: 12px; background: #F2C94C; padding: 2px 8px; border-radius: 4px; font-weight: bold; }

.article-title { 
  margin: 0 0 20px 0; 
  font-size: 28px; 
  color: #000; 
  font-weight: 800; 
  line-height: 1.3;
}

.summary { 
  color: #555; 
  font-size: 16px; 
  line-height: 1.8; 
  margin-bottom: 25px; 
  max-width: 700px;
}

.read-more-btn { 
  background: transparent;
  border: 2px solid #000;
  padding: 8px 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.read-more-btn:hover { background: #000; color: #fff; }

.loading, .empty-state { text-align: center; color: #999; padding: 40px; }

/* 響應式調整 */
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