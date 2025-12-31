// ============================================
// 产品管理组合式函数
// ============================================
import type { Product, ProductCategory, PaginatedResponse } from '~/types'

export const useProducts = () => {
  const products = ref<Product[]>([])
  const categories = ref<ProductCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取产品列表
   * @param category - 产品分类
   * @param page - 页码
   * @param limit - 每页数量
   */
  const fetchProducts = async (
    category?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> => {
    loading.value = true
    error.value = null

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(category && { category })
      })

      const data = await $fetch<PaginatedResponse<Product>>(`/api/products?${query}`)
      products.value = data.data
      return data
    } catch (e) {
      error.value = '获取产品列表失败'
      console.error('[useProducts] fetchProducts error:', e)
      return { data: [], total: 0, page, limit, totalPages: 0 }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单个产品详情
   * @param slug - 产品 slug
   */
  const fetchProduct = async (slug: string): Promise<Product | null> => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Product>(`/api/products/${slug}`)
      return data
    } catch (e) {
      error.value = '获取产品详情失败'
      console.error('[useProducts] fetchProduct error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取产品分类列表
   */
  const fetchCategories = async (): Promise<void> => {
    try {
      const data = await $fetch<ProductCategory[]>('/api/products/categories')
      categories.value = data
    } catch (e) {
      console.error('[useProducts] fetchCategories error:', e)
    }
  }

  /**
   * 获取相关产品
   * @param currentProduct - 当前产品
   * @param limit - 数量限制
   */
  const getRelatedProducts = (
    currentProduct: Product,
    limit: number = 4
  ): Product[] => {
    return products.value
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, limit)
  }

  /**
   * 重置状态
   */
  const resetState = (): void => {
    products.value = []
    error.value = null
  }

  return {
    products: readonly(products),
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    fetchProducts,
    fetchProduct,
    fetchCategories,
    getRelatedProducts,
    resetState
  }
}
