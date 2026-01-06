<template>
  <div class="bei-an">
    ZOOOW © 2026 {{ formattedIcpNumber }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 配置化的ICP备案号
const ICP_NUMBER = '桂ICP备2025078677号'

// 验证ICP备案号格式的函数
const validateIcpFormat = (icp) => {
  // ICP备案号格式：省份简称 + ICP备 + 8位数字 + 号
  const icpRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]+ICP备\d{8,9}号$/
  return icpRegex.test(icp)
}

// 格式化并验证ICP号的计算属性
const formattedIcpNumber = computed(() => {
  if (!validateIcpFormat(ICP_NUMBER)) {
    console.warn('ICP备案号格式可能不正确:', ICP_NUMBER)
    // 可以选择抛出错误或返回默认值，这里选择返回原值但记录警告
  }
  return ICP_NUMBER
})
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
