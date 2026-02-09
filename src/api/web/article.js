import request from '@/utils/request'

// 1. 取得文章列表
export function getArticleList(){
    console.log('API called: getArticleList') // (選用) 加個 log 看看有沒有被呼叫到
    return request({
        url: '/api/web/articles',// 對應後端的 GET /api/articles
        method: 'get'
    })
}

// 2. 取得單篇文章詳情 (之後會用到)
export function getArticleDetail(id){
    return request({
        url: `/api/web/articles/${id}`,// 對應後端的 GET /api/articles/:id
        method: 'get'
    })
}