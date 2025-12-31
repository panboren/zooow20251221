// ============================================
// SEO 管理组合式函数
// ============================================
import type { SeoMeta, Breadcrumb } from '~/types'

export const useSeo = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  /**
   * 设置页面 SEO 元数据
   * @param meta - SEO 元数据对象
   */
  const setSeoMeta = (meta: SeoMeta) => {
    const siteName = config.public.siteName as string
    const siteUrl = config.public.siteUrl as string

    const title = meta.title
    const description = meta.description
    const fullTitle = `${title} | ${siteName}`

    useHead({
      title,
      titleTemplate: `%s - ${siteName}`,
      meta: [
        // 基础 SEO
        { name: 'description', content: description },
        { name: 'keywords', content: meta.keywords },
        // Open Graph
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: meta.ogType || 'website' },
        { property: 'og:url', content: `${siteUrl}${route.path}` },
        ...(meta.image ? [{ property: 'og:image', content: meta.image }] : []),
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        ...(meta.image ? [{ name: 'twitter:image', content: meta.image }] : [])
      ],
      link: [
        ...(meta.canonical ? [{ rel: 'canonical', href: meta.canonical }] : [])
      ]
    })
  }

  /**
   * 获取页面面包屑导航
   * @returns 面包屑数组
   */
  const getBreadcrumbs = (): Breadcrumb[] => {
    const routePath = route.path
    const pathSegments = routePath.split('/').filter(Boolean)

    const breadcrumbs: Breadcrumb[] = [
      { title: '首页', to: '/' }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      breadcrumbs.push({
        title: segment.replace(/-/g, ' '),
        to: isLast ? undefined : currentPath
      })
    })

    return breadcrumbs
  }

  return {
    setSeoMeta,
    getBreadcrumbs
  }
}
