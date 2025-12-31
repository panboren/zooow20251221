// ============================================
// 产品状态管理 Store
// ============================================
import { defineStore } from 'pinia'
import type { Product, ProductCategory } from '~/types'

export const useProductStore = defineStore('product', () => {
  // ============================================
  // 状态 (State)
  // ============================================
  const products = ref<Product[]>([])
  const categories = ref<ProductCategory[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<string>('all')

  // ============================================
  // 计算属性 (Getters)
  // ============================================
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  const availableProducts = computed(() => {
    return products.value.filter(p => p.status === 'available')
  })

  const comingSoonProducts = computed(() => {
    return products.value.filter(p => p.status === 'coming-soon')
  })

  // ============================================
  // 方法 (Actions)
  // ============================================
  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Product[]>('/api/products')
      products.value = data
    } catch (e) {
      error.value = '获取产品列表失败'
      console.error('[Product Store] fetchProducts error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Product>(`/api/products/${slug}`)
      currentProduct.value = data
      return data
    } catch (e) {
      error.value = '获取产品详情失败'
      console.error('[Product Store] fetchProduct error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await $fetch<ProductCategory[]>('/api/products/categories')
      categories.value = data
    } catch (e) {
      console.error('[Product Store] fetchCategories error:', e)
    }
  }

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  const resetState = () => {
    products.value = []
    currentProduct.value = null
    error.value = null
    selectedCategory.value = 'all'
  }

  return {
    // State
    products,
    categories,
    currentProduct,
    loading,
    error,
    selectedCategory,

    // Getters
    filteredProducts,
    availableProducts,
    comingSoonProducts,

    // Actions
    fetchProducts,
    fetchProduct,
    fetchCategories,
    setSelectedCategory,
    resetState
  }
})
