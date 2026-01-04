// ============================================
// Nuxt 配置文件
// ============================================

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ============================================
  // 兼容性配置
  // ============================================
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // ============================================
  // 应用配置
  // ============================================
  app: {
    head: {
      title: '企业产品官网',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专业的企业产品展示官网' },
        { name: 'keywords', content: '企业,产品,官网' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  // ============================================
  // 模块配置
  // ============================================
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint'
  ],

  // ============================================
  // UnoCSS 配置 (详见 uno.config.ts)
  // ============================================

  // ============================================
  // Element Plus 配置
  // ============================================
  elementPlus: {
    // 是否自动导入组件
    autoImport: true,
    // 是否导入样式
    importStyle: 'scss',
    // 图标配置
    icons: ['ElementPlus']
  },

  // ============================================
  // Pinia 配置
  // ============================================
  pinia: {
    storesDirs: ['./stores/**']
  },

  // ============================================
  // 样式配置
  // ============================================
  css: [
    // Normalize.css 重置样式（由 UnoCSS 内置）
    '~/assets/styles/main.scss'
  ],

  // ============================================
  // 组件自动导入配置
  // ============================================
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: true
    }
  ],

  // ============================================
  // 运行时配置
  // ============================================
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    private: {
      apiSecret: ''
    },
    // 公共配置（客户端可用）
    public: {
      siteName: '企业产品官网',
      siteUrl: 'https://your-domain.com',
      apiBase: '/api'
    }
  },

  // ============================================
  // Vite 配置
  // ============================================
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      }
    }
  },

  // ============================================
  // Nitro 配置
  // ============================================
  nitro: {
    // 路由规则
    routeRules: {
      // 首页：ISR 60秒
      '/': { isr: 60 },
      // 产品页面：ISR 1小时
      '/products/**': { isr: 3600 },
      // 新闻页面：ISR 5分钟
      '/news/**': { isr: 300 },
      // API：SWR（每次重新验证）
      '/api/**': { cache: { maxAge: 0 } }
    }
  },

  // ============================================
  // 开发工具配置
  // ============================================
  sourcemap: {
    server: true,
    client: false
  },

  // ============================================
  // ESLint 配置
  // ============================================
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false
      }
    }
  },

  // ============================================
  // 实验性功能
  // ============================================
  experimental: {
    typedPages: true
  }
})
