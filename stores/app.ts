// ============================================
// 应用状态管理 Store
// ============================================
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // ============================================
  // 状态 (State)
  // ============================================
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isMenuOpen = ref(false)

  // ============================================
  // 计算属性 (Getters)
  // ============================================
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // ============================================
  // 方法 (Actions)
  // ============================================
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  return {
    // State
    loading,
    error,
    isMenuOpen,

    // Getters
    isLoading,
    hasError,

    // Actions
    setLoading,
    setError,
    clearError,
    toggleMenu,
    closeMenu,
  }
})
