import { createRouter, createWebHistory } from 'vue-router'

// 定義路由表
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue') // 懶加載登入頁
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue') // 假設之後有個首頁
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router