// ============================================
// 文章管理组合式函数
// ============================================
import type { Article, PaginatedResponse } from '~/types'

export const useArticles = () => {
  const articles = ref<Article[]>([])
  const featuredArticles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取文章列表
   * @param page - 页码
   * @param limit - 每页数量
   * @param category - 文章分类
   */
  const fetchArticles = async (
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<PaginatedResponse<Article>> => {
    loading.value = true
    error.value = null

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(category && { category })
      })

      const data = await $fetch<PaginatedResponse<Article>>(`/api/articles?${query}`)
      articles.value = data.data
      return data
    } catch (e) {
      error.value = '获取文章列表失败'
      console.error('[useArticles] fetchArticles error:', e)
      return { data: [], total: 0, page, limit, totalPages: 0 }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单篇文章详情
   * @param slug - 文章 slug
   */
  const fetchArticle = async (slug: string): Promise<Article | null> => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Article>(`/api/articles/${slug}`)
      return data
    } catch (e) {
      error.value = '获取文章详情失败'
      console.error('[useArticles] fetchArticle error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取推荐文章
   * @param limit - 数量限制
   */
  const fetchFeaturedArticles = async (limit: number = 3): Promise<void> => {
    try {
      const data = await $fetch<Article[]>(`/api/articles/featured?limit=${limit}`)
      featuredArticles.value = data
    } catch (e) {
      console.error('[useArticles] fetchFeaturedArticles error:', e)
    }
  }

  /**
   * 获取相关文章
   * @param currentArticle - 当前文章
   * @param limit - 数量限制
   */
  const getRelatedArticles = (
    currentArticle: Article,
    limit: number = 4
  ): Article[] => {
    return articles.value
      .filter(a =>
        a.category === currentArticle.category &&
        a.id !== currentArticle.id &&
        a.tags.some(tag => currentArticle.tags.includes(tag))
      )
      .slice(0, limit)
  }

  /**
   * 重置状态
   */
  const resetState = (): void => {
    articles.value = []
    error.value = null
  }

  return {
    articles: readonly(articles),
    featuredArticles: readonly(featuredArticles),
    loading: readonly(loading),
    error: readonly(error),
    fetchArticles,
    fetchArticle,
    fetchFeaturedArticles,
    getRelatedArticles,
    resetState
  }
}
