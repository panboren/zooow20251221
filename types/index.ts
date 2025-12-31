// ============================================
// 类型定义文件
// ============================================

// ============================================
// 产品相关类型
// ============================================
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  category: string
  image: string
  images: string[]
  features: string[]
  specs: ProductSpec[]
  price?: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductSpec {
  key: string
  label: string
  value: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  order: number
}

export type ProductStatus = 'available' | 'coming-soon' | 'discontinued'

// ============================================
// 文章相关类型
// ============================================
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  coverImage?: string
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  status: ArticleStatus
}

export type ArticleStatus = 'draft' | 'published'

// ============================================
// 客户评价类型
// ============================================
export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  avatar: string
  content: string
  rating: number
}

// ============================================
// 合作伙伴类型
// ============================================
export interface Partner {
  id: string
  name: string
  logo: string
  website: string
  description?: string
}

// ============================================
// 联系表单类型
// ============================================
export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}

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
// API 响应类型
// ============================================
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// 通用类型
// ============================================
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Dict<T = any> = Record<string, T>
