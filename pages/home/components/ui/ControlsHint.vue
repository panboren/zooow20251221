<template>
  <div class="controls-hint">
    <p>🖱️ 左键拖拽旋转 | 🔍 滚轮缩放 | 📱 触摸手势控制</p>
    <p>🔄 双击切换自动旋转 | 🎯 使用视角按钮快速定位</p>
     </div>
</template>

<script setup>
/**
 * ControlsHint Component
 * 控制提示组件，显示用户交互提示
 *
 * @component ControlsHint
 * @author ZOOOW Team
 * @version 1.0.0
 * @license MIT
 */
</script>

<style scoped lang="scss">
.controls-hint {
  position: absolute;
  bottom: 20px;
  left: 20px;
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

  // 移动端隐藏
  @media (max-width: 768px) {
    display: none;
  }
}

// 悬停时显示完整提示
.home-content:hover .controls-hint {
  opacity: 1;
}
</style>
