import request from '@/utils/request'

// 1. 取得文章列表
export function getArticleList(){
    return request({
        url: '/api/articles',// 對應後端的 GET /api/articles
        method: 'get'
    })
}

// 2. 取得單篇文章詳情 (之後會用到)
export function getArticleDetail(id){
    return request({
        url: `/api/articles/${id}`,// 對應後端的 GET /api/articles/:id
        method: 'get'
    })
}

// 3. 發布文章 (之後會用到)
export function createArticle(data){
    return request({
        url: '/api/articles',// 對應後端的 POST /api/articles
        method: 'post',
        data
    })
}