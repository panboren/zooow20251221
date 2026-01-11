<template>
  <div class="bei-an">
    ZOOOW © 2026 {{ ICP_NUMBER }}
  </div>
</template>

<script setup>

// 配置化的ICP备案号
const ICP_NUMBER = '桂ICP备2025078677号'

</script>

<style scoped lang="scss">
.bei-an {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  p {
    margin: 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  // 移动端优化
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 10px 12px;
    bottom: 15px;
    left: 15px;
  }
}

// 悬停时显示完整提示
.home-content:hover .controls-hint {
  opacity: 1;
}
</style>
