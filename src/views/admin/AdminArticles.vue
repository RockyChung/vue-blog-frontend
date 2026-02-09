<template>
  <div class="article-manager">
    <div class="page-header">
      <h2 class="title">文章管理</h2>
      <button class="create-btn" @click="router.push('/admin/editor')">
        + 新增文章
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-state">資料載入中...</div>

    <!-- 空狀態 -->
    <div v-else-if="articles.length === 0" class="empty-state">
      目前沒有文章，點擊右上角新增第一篇文章。
    </div>

    <!-- 文章列表 (Grid 佈局：一列三個) -->
    <div v-else class="article-grid">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="card-content">
          <div class="card-header-row">
            <span class="date">{{ formatDate(article.createTime) }}</span>
            <span class="status-badge">已發布</span>
          </div>
          
          <h3 class="article-title" :title="article.title">{{ article.title }}</h3>
          
          <p class="article-summary">
            {{ article.summary || article.content?.substring(0, 60) || '暫無摘要' }}...
          </p>
        </div>
        
        <div class="card-actions">
          <button class="btn-action btn-edit" @click="handleEdit(article.id)">
            ✏️ 編輯
          </button>
          <button class="btn-action btn-delete" @click="handleDelete(article.id)">
            🗑️ 刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, deleteArticle } from '@/api/admin/article' // 請確保 api 有 deleteArticle

const router = useRouter()
const articles = ref([])
const loading = ref(false)

// 取得文章列表 (邏輯參考 Home.vue)
const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticleList()
    if (res.code === 200) {
      // 兼容各種後端分頁結構
      if (Array.isArray(res.data)) {
        articles.value = res.data
      } else if (res.data && Array.isArray(res.data.records)) {
        articles.value = res.data.records
      } else if (res.data && Array.isArray(res.data.content)) {
        articles.value = res.data.content
      } else if (res.data && Array.isArray(res.data.list)) {
        articles.value = res.data.list
      } else {
        articles.value = []
      }
    }
  } catch (error) {
    console.error('獲取文章列表失敗', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const handleEdit = (id) => {
  // 導向到編輯頁面 (假設路由為 /admin/editor/:id)
  router.push(`/admin/editor/${id}`)
}

const handleDelete = async (id) => {
  if (!confirm('確定要刪除這篇文章嗎？此動作無法復原。')) return
  
  try {
    // 呼叫刪除 API
    const res = await deleteArticle(id)
    if (res.code === 200) {
      alert('刪除成功')
      fetchArticles() // 重新整理列表
    } else {
      alert(res.message || '刪除失敗')
    }
  } catch (error) {
    console.error(error)
    // 如果沒有 deleteArticle API，這裡會報錯，僅供示範
    alert('刪除功能尚未實作或發生錯誤')
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title { font-size: 24px; color: #2c3e50; margin: 0; }

.create-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}
.create-btn:hover { background-color: #34495e; }

/* --- Grid 佈局核心 (一列三個) --- */
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 強制 3 欄 */
  gap: 25px;
}

/* 響應式：螢幕變小時自動調整 */
@media (max-width: 1200px) {
  .article-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .article-grid { grid-template-columns: 1fr; }
}

/* --- 卡片樣式 --- */
.article-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  border: 1px solid #eee;
  overflow: hidden;
}
.article-card:hover { transform: translateY(-5px); }

.card-content { padding: 20px; flex-grow: 1; }

.card-header-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #888; }
.status-badge { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }

.article-title { font-size: 18px; margin: 0 0 10px 0; color: #2c3e50; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-summary { font-size: 14px; color: #666; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.card-actions { display: flex; border-top: 1px solid #f0f0f0; }
.btn-action { flex: 1; padding: 12px 0; border: none; background: #fff; cursor: pointer; font-size: 14px; transition: background 0.2s; color: #555; }
.btn-action:hover { background: #f9fafb; color: #000; }
.btn-edit { border-right: 1px solid #f0f0f0; }
.btn-delete { color: #ef5350; }
.btn-delete:hover { background: #ffebee; color: #d32f2f; }

.loading-state, .empty-state { text-align: center; padding: 60px; color: #999; font-size: 16px; grid-column: 1 / -1; }
</style>