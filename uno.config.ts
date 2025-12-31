// ============================================
// UnoCSS 配置文件
// ============================================

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWind,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  // 预设配置
  presets: [
    // 默认预设
    presetUno(),
    // Windi CSS 预设
    presetWind(),
    // 属性模式预设
    presetAttributify({
      // 忽略的属性
      ignoreAttributes: ['align', 'valign']
    }),
    // 图标预设
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],

  // 变换器
  transformers: [
    // CSS 指令变换器 (@apply, @screen)
    transformerDirectives(),
    // 变体组合变换器
    transformerVariantGroup()
  ],

  // 主题配置
  theme: {
    // 颜色
    colors: {
      primary: {
        DEFAULT: '#2563eb',
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554'
      },
      secondary: {
        DEFAULT: '#64748b',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      }
    },
    // 字体
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ],
      mono: ['SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    // 间距
    spacing: {
      'xs': '0.25rem',
      'sm': '0.5rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    // 圆角
    borderRadius: {
      'sm': '0.25rem',
      'DEFAULT': '0.5rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem'
    },
    // 阴影
    boxShadow: {
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  },

  // 自定义快捷方式
  shortcuts: {
    // 容器
    'container': 'mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
    // 按钮
    'btn': 'px-4 py-2 rounded-md font-medium transition-all duration-200',
    'btn-primary': 'btn bg-primary-500 text-white hover:bg-primary-600',
    'btn-secondary': 'btn bg-secondary-500 text-white hover:bg-secondary-600',
    'btn-outline': 'btn border border-primary-500 text-primary-500 hover:bg-primary-50',
    // 卡片
    'card': 'bg-white rounded-lg shadow-md p-6',
    // Flex
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    // 文本
    'text-gradient': 'bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent'
  },

  // 规则
  rules: [
    // 自定义规则示例
    ['text-shadow', { 'text-shadow': '0 1px 2px rgba(0,0,0,0.1)' }],
    ['text-shadow-lg', { 'text-shadow': '0 4px 8px rgba(0,0,0,0.15)' }]
  ],

  // 安全列表（允许动态类名）
  safelist: [
    'bg-primary-500',
    'bg-secondary-500',
    'text-primary-500'
  ],

  // 扫描目录
  content: {
    filesystem: [
      '**/*.vue',
      '**/*.md'
    ]
  }
})
