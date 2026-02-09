import { createRouter, createWebHistory } from 'vue-router'

// 定義路由表
const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout.vue'), // 使用新的佈局組件
    children: [
      {
        path: '', // 當網址是 / 時，顯示 Home
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'about', // 當網址是 /about 時，顯示 About
        name: 'About',
        component: () => import('@/views/About.vue')
      }
    ]
  },
  // --- 後台路由區塊 (Admin) ---
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true }, // 進入此區塊需要登入
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue')
      },
      // 未來可以在這裡新增 'articles', 'settings' 等子路由
      {
        path: '/admin/AdminArticles',
        name: 'AdminArticles',
        component: () => import('@/views/admin/AdminArticles.vue')
      }
    ]
  },
  {
        path: '/admin/login',
        name: 'Login',
        component: () => import('@/views/admin/AdminLogin.vue'),
        meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- 👮‍♂️ 路由守衛 (Router Guard) 開始 ---
router.beforeEach((to, from, next) => {
  // 1. 每次換頁前，先去皮夾看看有沒有 Token
  const token = localStorage.getItem('token')

  // 2. 判斷邏輯
  if (to.meta.requiresAuth && !token) {
    // 情況 A：要去「需要權限」的頁面 (如首頁)，但身上「沒有 Token」
    // -> 擋下來，踢去登入頁
    alert('請先登入！') // (選用) 跳個提示比較友善
    next('/admin/login')
  
  } else if (to.meta.guestOnly && token) {
    // 情況 B：(選用) 已經登入了，還想去登入頁
    // -> 不需要，直接送去首頁
    next('/admin')
    
  } else {
    // 情況 C：符合規則，放行！
    next()
  }
})
// --- 路由守衛結束 ---

export default router