<template>
  <div class="home-page">
    home
  </div>
</template>

<script setup lang="ts">
const { setSeoMeta } = useSeo()

setSeoMeta({
  title: '首页',
  description: '专业的企业级产品解决方案，助力企业数字化转型'
})

</script>

<style scoped lang="scss">
.home-page {
  width: 100vw;
  height: 100vh;
}
</style>
