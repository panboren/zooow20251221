# 图片处理指南

## 图片不打包处理方案

为了实现图片不被打包，采用了以下策略：

### 1. 将图片移至 public 目录
- 所有图片文件从 `assets/image/` 移动到 `public/images/`
- Nuxt的public目录下的文件不会被webpack/vite打包，直接原样复制到输出目录

### 2. 修改图片引用方式
在代码中使用绝对路径引用图片：
```javascript
// 之前（打包到JS bundle中）
import homeImage from '~/assets/image/home1.png'

// 之后（外部资源，不打包）
const imageUrl = '/images/home1.png'
```

### 3. 已修改的文件
- `pages/home/components/animation/panorama-switcher.vue`
- `pages/index.vue`

### 4. 部署注意事项
- 生产环境部署时，确保`public/images/`目录被正确部署
- 图片会以静态资源形式提供，不会包含在JS bundle中

### 5. 性能优势
- 减少JS bundle体积
- 图片可以独立缓存
- 并行加载图片资源

### 6. 添加新图片的流程
1. 将图片放入 `public/images/` 目录
2. 在代码中使用 `/images/图片文件名` 路径引用
3. 无需重新构建即可更新图片（生产环境需确保CDN缓存更新）