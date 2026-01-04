// ============================================
// 类型定义文件
// ============================================

// ============================================
// SEO 相关类型
// ============================================
export interface SeoMeta {
  title: string
  description: string
  keywords?: string
  image?: string
  ogType?: 'website' | 'article' | 'product'
  canonical?: string
}

export interface Breadcrumb {
  title: string
  to?: string
}

// ============================================
// 通用类型
// ============================================
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Dict<T = unknown> = Record<string, T>
