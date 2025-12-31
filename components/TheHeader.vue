<template>
  <header class="header" :class="{ 'header-scrolled': scrolled }">
    <div class="container">
      <div class="header-inner">
        <NuxtLink to="/" class="logo">
          <span class="logo-text">{{ siteName }}</span>
        </NuxtLink>

        <nav class="nav-desktop">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="header-actions">
          <button @click="toggleColorMode" class="theme-toggle">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>

          <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-toggle">
            <span class="hamburger-icon">
              <span :class="{ active: mobileMenuOpen }"></span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <Transition name="slide-down">
      <nav v-show="mobileMenuOpen" class="nav-mobile">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteName = config.public.siteName as string

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const navItems = [
  { label: '首页', to: '/' },
  { label: '产品中心', to: '/products' },
  { label: '新闻动态', to: '/news' },
  { label: '关于我们', to: '/about' },
  { label: '联系我们', to: '/contact' }
]

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped lang="scss">
</style>
