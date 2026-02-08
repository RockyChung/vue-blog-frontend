<template>
  <div class="home-content">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArticleList } from '@/api/article' // 引入剛剛寫的 API

const articles = ref([]) // 用來存文章資料
const loading = ref(true)

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
</style>