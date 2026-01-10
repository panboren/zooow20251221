# Favicon 配置指南

## 当前配置

在 `nuxt.config.ts` 中已配置：
```javascript
link: [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
]
```
文件位置：`public/favicon.ico`

## 推荐的完整favicon方案

### 1. 基础favicon文件
将以下文件放入 `public/` 目录：
- `favicon.ico` (32x32, 传统浏览器)
- `favicon-16x16.png` (16x16, 标签页图标)
- `favicon-32x32.png` (32x32, 高分辨率)
- `apple-touch-icon.png` (180x180, iOS设备)
- `android-chrome-192x192.png` (Android)
- `android-chrome-512x512.png` (Android 大图标)

### 2. 完整配置（推荐）
```javascript
// 在 nuxt.config.ts 的 app.head.link 中添加：
link: [
  // 传统 favicon
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },

  // Apple Touch Icon
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

  // Web App Manifest
  { rel: 'manifest', href: '/site.webmanifest' }
]
```

### 3. 创建 site.webmanifest 文件
```json
{
  "name": "你的网站名称",
  "short_name": "简称",
  "description": "网站描述",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4. 最佳实践
- **格式**: 使用PNG格式以获得更好的质量
- **背景**: 使用透明背景或与网站主题一致
- **尺寸**: 推荐使用矢量工具创建，然后导出多种尺寸
- **测试**: 在不同浏览器和设备上测试显示效果

### 5. 现有配置的优势
- 当前配置简单有效
- favicon.ico位于public目录，不会被打包
- 支持大多数现代浏览器的基本需求

### 6. 扩展建议
如需要更专业的图标支持，可考虑：
- 使用专业图标生成工具（如Favicon Generator）
- 添加SVG格式favicon以获得更好的缩放效果
- 考虑深色/浅色模式适配