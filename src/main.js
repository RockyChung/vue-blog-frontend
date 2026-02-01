import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 1. 建立 App 實體 (注意：這裡絕對不能有 .mount)
const app = createApp(App)

// 2. 安裝插件 (Router)
// 必須在 mount 之前做！這樣 <router-view> 才會有作用
app.use(router)

// 3. 最後一步：掛載到網頁上
app.mount('#app')