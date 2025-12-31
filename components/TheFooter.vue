<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-text">{{ siteName }}</span>
          </div>
          <p class="footer-description">
            专注于为企业提供优质的产品和解决方案，助力企业数字化转型。
          </p>
        </div>

        <div v-for="section in footerSections" :key="section.title" class="footer-section">
          <h3 class="footer-title">{{ section.title }}</h3>
          <ul class="footer-links">
            <li v-for="link in section.links" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <ul class="footer-contact">
            <li v-for="contact in contactInfo" :key="contact.label">
              <span class="contact-icon">{{ contact.icon }}</span>
              <span>{{ contact.value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} {{ siteName }}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteName = config.public.siteName as string
const currentYear = new Date().getFullYear()

const footerSections = [
  {
    title: '产品服务',
    links: [
      { label: '产品中心', to: '/products' },
      { label: '技术支持', to: '/support' },
      { label: '服务条款', to: '/terms' }
    ]
  },
  {
    title: '关于我们',
    links: [
      { label: '公司介绍', to: '/about' },
      { label: '新闻动态', to: '/news' },
      { label: '加入我们', to: '/careers' }
    ]
  }
]

const contactInfo = [
  { icon: '📍', label: '地址', value: '北京市朝阳区XXX大厦' },
  { icon: '📧', label: '邮箱', value: 'contact@example.com' },
  { icon: '📞', label: '电话', value: '400-XXX-XXXX' }
]
</script>

<style scoped lang="scss">
</style>
