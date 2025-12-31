// ============================================
// 联系表单组合式函数
// ============================================
import type { ContactForm } from '~/types'

export const useContact = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  /**
   * 提交联系表单
   * @param formData - 表单数据
   */
  const submitContactForm = async (formData: ContactForm): Promise<boolean> => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: formData
      })
      success.value = true
      return true
    } catch (e: any) {
      error.value = e.data?.message || '提交失败，请稍后重试'
      console.error('[useContact] submitContactForm error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const resetState = (): void => {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    submitContactForm,
    resetState
  }
}
