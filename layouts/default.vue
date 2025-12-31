<template>
  <div class="default-layout">
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '企业产品官网',
  description: '专业的企业产品展示官网'
})
</script>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}
</style>
