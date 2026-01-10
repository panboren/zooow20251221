template
<template>
  <div class="home-page">
    <Home />
  </div>
</template>

<script setup lang="ts">
import Home from './home/home.vue'

const config = useRuntimeConfig()
// SEO 元数据优化
const siteName = 'ZOOOW-AI'
const siteTitle = 'ZOOOW-AI - 专业的AI工具与全景图展示平台 | 3D全景 | 特效工具 | 智能化解决方案'
const siteDescription = 'ZOOOW-AI提供专业的AI工具和3D全景图展示服务，涵盖文本生成、图像处理、数据分析、特效工具、3D全景展示等多个领域。基于最新AI技术和WebGL技术，为企业与个人提供高效的智能服务和沉浸式体验。'
const siteKeywords = 'ZOOOW,AI工具,人工智能,智能助手,文本生成,图像处理,数据分析,3D全景,全景图,WebGL,Three.js,AI解决方案,智能化,AI平台,虚拟现实'
const siteUrl = config.public.siteUrl || 'http://www.zooow.xyz/'

// 安全的URL拼接函数
function safeUrlJoin(baseUrl: string, path: string): string {
  try {
    const url = new URL(path, baseUrl)
    return url.toString()
  } catch (e) {
    console.warn('Invalid URL constructed:', baseUrl, path, e)
    // 返回基础URL加上路径作为备选方案
    if (!baseUrl.endsWith('/') && !path.startsWith('/')) {
      return baseUrl + '/' + path
    }
    return baseUrl + path
  }
}

// 定义结构化数据类型
interface StructuredDataItem {
  [key: string]: any
}

// 缓存结构化数据以避免重复计算
let cachedStructuredData: StructuredDataItem[] | null = null

function generateStructuredData(): StructuredDataItem[] {
  if (cachedStructuredData !== null) {
    return cachedStructuredData
  }

  const currentYear = new Date().getFullYear()

  const structuredData: StructuredDataItem[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      alternateName: 'ZOOOW-AI',
      url: siteUrl,
      description: siteDescription,
      inLanguage: 'zh-CN',
      copyrightYear: currentYear,
      author: {
        '@type': 'Organization',
        name: siteName
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      alternateName: 'ZOOOW-AI',
      url: siteUrl,
      logo: safeUrlJoin(siteUrl, '/images/logo.png'),
      description: siteDescription,
      foundingDate: '2024',
      areaServed: 'CN',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CN'
      },
      sameAs: [
        config.public.twitterUrl || 'https://twitter.com/zooow',
        config.public.githubUrl || 'https://github.com/zooow',
        config.public.linkedinUrl || 'https://www.linkedin.com/company/zooow'
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: config.public.customerServiceEmail || 'contact@zooow.xyz',
          availableLanguage: ['Chinese', 'English'],
          telephone: config.public.customerServicePhone || '+86-400-XXX-XXXX'
        },
        {
          '@type': 'ContactPoint',
          contactType: 'business development',
          email: config.public.businessEmail || 'business@zooow.xyz',
          availableLanguage: ['Chinese', 'English']
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteName,
      alternateName: 'ZOOOW-AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1'
      },
      featureList: [
        'AI文本生成',
        'AI图像处理',
        '3D全景图展示',
        '数据分析',
        '智能问答'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: siteUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'ZOOOW是什么？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ZOOOW是一个专业的AI工具和3D全景图展示平台，提供智能化的AI服务和沉浸式的3D体验。'
          }
        },
        {
          '@type': 'Question',
          name: 'ZOOOW提供哪些服务？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ZOOOW提供AI文本生成、AI图像处理、数据分析、3D全景图展示等多项智能化服务。'
          }
        },
        {
          '@type': 'Question',
          name: '如何使用ZOOOW？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '访问www.zooow.xyz，注册账号后即可免费使用我们的AI工具和3D全景展示服务。'
          }
        }
      ]
    }
  ]

  cachedStructuredData = structuredData
  return structuredData
}

// Open Graph 标签
useSeoMeta({
  title: siteTitle,
  ogTitle: siteTitle,
  description: siteDescription,
  ogDescription: siteDescription,
  ogType: 'website',
  ogSiteName: siteName,
  ogUrl: siteUrl,
  ogImage: safeUrlJoin(siteUrl, '/images/og-image.png'),
  ogImageAlt: siteName + ' - 专业的AI工具与全景图展示平台',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogLocale: 'zh_CN',
  ogLocaleAlternate: ['zh_TW', 'en_US'],

  // Twitter Card 标签
  twitterCard: 'summary_large_image',
  twitterTitle: siteTitle,
  twitterDescription: siteDescription,
  twitterImage: safeUrlJoin(siteUrl, '/images/og-image.png'),
  twitterSite: '@zooow',
  twitterCreator: '@zooow',

  // 额外标签
  keywords: siteKeywords,
  robots: 'index, follow',
  googlebot: 'index, follow',
  author: siteName,
  themeColor: '#6366f1',
  mobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'default',
  formatDetection: 'telephone=no',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
})

// Canonical URL 和结构化数据
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  link: [
    {
      rel: 'canonical',
      href: siteUrl
    },
    {
      rel: 'alternate',
      hreflang: 'zh-CN',
      href: siteUrl
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: siteUrl
    },
    {
      rel: 'dns-prefetch',
      href: 'https://www.google-analytics.com'
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.zooow.xyz'
    }
  ],
  meta: [
    {
      name: 'msapplication-TileColor',
      content: '#6366f1'
    },
    {
      name: 'msapplication-config',
      content: '/browserconfig.xml'
    },
    {
      name: 'application-name',
      content: siteName
    },
    {
      name: 'apple-mobile-web-app-title',
      content: siteName
    },
    {
      name: 'format-detection',
      content: 'telephone=no,email=no,address=no'
    },
    {
      name: 'referrer',
      content: 'origin-when-cross-origin'
    },
    {
      name: 'baidu-site-verification',
      content: config.public.baiduVerificationCode || 'YOUR_BAIDU_VERIFICATION_CODE' // 实际部署时需替换
    },
    {
      name: 'google-site-verification',
      content: config.public.googleVerificationCode || 'YOUR_GOOGLE_VERIFICATION_CODE' // 实际部署时需替换
    },
    {
      name: '360-site-verification',
      content: config.public.threeSixtyVerificationCode || 'YOUR_360_VERIFICATION_CODE' // 实际部署时需替换
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'ie=edge'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateStructuredData())
    }
  ]
})
</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
