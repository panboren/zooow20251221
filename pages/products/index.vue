<template>
  <div class="page-content">
    productes
  </div>
</template>

<script setup lang="ts">
const { setSeoMeta } = useSeo()

setSeoMeta({
  title: '产品中心',
  description: '探索我们的全线产品，找到最适合您的解决方案'
})

</script>

<style scoped lang="scss">
.page-content{
  width: 100vw;
  height: 100vh;
}
</style>
