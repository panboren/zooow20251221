// ============================================
// 文章状态管理 Store
// ============================================
import { defineStore } from 'pinia'
import type { Article } from '~/types'

export const useArticleStore = defineStore('article', () => {
  // ============================================
  // 状态 (State)
  // ============================================
  const articles = ref<Article[]>([])
  const featuredArticles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============================================
  // 计算属性 (Getters)
  // ============================================
  const publishedArticles = computed(() => {
    return articles.value.filter(a => a.status === 'published')
  })

  const latestArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
  })

  // ============================================
  // 方法 (Actions)
  // ============================================
  const fetchArticles = async (page: number = 1, limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<{
        data: Article[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>(`/api/articles?page=${page}&limit=${limit}`)
      articles.value = data.data
      return data
    } catch (e) {
      error.value = '获取文章列表失败'
      console.error('[Article Store] fetchArticles error:', e)
      return { data: [], total: 0, page, limit, totalPages: 0 }
    } finally {
      loading.value = false
    }
  }

  const fetchArticle = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Article>(`/api/articles/${slug}`)
      currentArticle.value = data
      return data
    } catch (e) {
      error.value = '获取文章详情失败'
      console.error('[Article Store] fetchArticle error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedArticles = async (limit: number = 3) => {
    try {
      const data = await $fetch<Article[]>(`/api/articles/featured?limit=${limit}`)
      featuredArticles.value = data
    } catch (e) {
      console.error('[Article Store] fetchFeaturedArticles error:', e)
    }
  }

  const getRelatedArticles = (currentArticle: Article, limit: number = 4) => {
    return articles.value
      .filter(a =>
        a.category === currentArticle.category &&
        a.id !== currentArticle.id &&
        a.tags.some(tag => currentArticle.tags.includes(tag))
      )
      .slice(0, limit)
  }

  const resetState = () => {
    articles.value = []
    currentArticle.value = null
    error.value = null
  }

  return {
    // State
    articles,
    featuredArticles,
    currentArticle,
    loading,
    error,

    // Getters
    publishedArticles,
    latestArticles,

    // Actions
    fetchArticles,
    fetchArticle,
    fetchFeaturedArticles,
    getRelatedArticles,
    resetState
  }
})
