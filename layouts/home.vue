<template>
  <div class="home-layout">
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.home-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}
</style>
<script setup lang="ts">
</script>
