<template>
  <div class="home-container">
    <header class="navbar">
      <div class="logo">VueBlog</div>
      <div class="user-info">
        <span>Hi, {{ username }}</span>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>
    </header>

    <main class="main-content">
      <div class="action-bar">
        <h2>最新文章</h2>
        <button class="create-btn">＋ 寫文章</button>
      </div>

      <div v-if="loading" class="loading">載入中...</div>

      <div v-else class="article-list">
        <div v-if="articles.length === 0" class="empty-state">
          目前還沒有任何文章，快來寫第一篇吧！
        </div>
        <div v-for="article in articles" :key="article.id" class="article-card">
          <h3>{{ article.title }}</h3>
          <p class="summary">{{ article.summary || article.content?.substring(0, 100) || '' }}...</p>
          <div class="meta">
            <span class="author">作者: {{ article.authorName || '未知' }}</span>
            <span class="date">{{ formatDate(article.createTime) }}</span>
          </div>
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
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.logo { font-size: 24px; font-weight: bold; color: #42b983; }
.logout-btn { background: #ff4d4f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px;}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.create-btn { background: #42b983; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }

.article-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: transform 0.2s;
}
.article-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.article-card h3 { margin: 0 0 10px 0; color: #333; }
.summary { color: #666; font-size: 14px; line-height: 1.6; }
.meta { margin-top: 15px; font-size: 12px; color: #999; display: flex; justify-content: space-between; }
.loading, .empty-state { text-align: center; color: #999; padding: 40px; }
</style>