<template>
  <div
    class="loading-indicator"
    role="status"
    aria-live="polite"
  >
    <div
      class="loading-spinner"
      aria-hidden="true"
    />
    <p>{{ text }}</p>
    <div class="loading-progress">
      {{ progress }}
    </div>
  </div>
</template>

<script setup>
/**
 * LoadingIndicator Component
 * 加载指示器组件，提供友好的加载状态展示
 *
 * @component LoadingIndicator
 * @author ZOOOW-AI Team
 * @version 1.0.0
 * @license MIT
 */

defineProps({
  text: {
    type: String,
    default: '正在加载...'
  },
  progress: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.9);
  padding: 80px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(50, 7, 107, 0.1);
  z-index: 100;
  text-align: center;

  .loading-spinner {
    width: 80px;
    height: 80px;
    position: relative;

    // 创建外圈
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top: 4px solid #6366f1; // 蓝紫色主题
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    }

    // 创建内圈
    &::after {
      content: '';
      position: absolute;
      top: 15%;
      left: 15%;
      width: 70%;
      height: 70%;
      border: 3px solid transparent;
      border-bottom: 3px solid #8b5cf6; // 紫色
      border-radius: 50%;
      animation: spinReverse 1.2s linear infinite;
    }
  }

  p {
    margin: 0;
    font-size: 28px;  // 稍微增大
    font-weight: 800; // 更粗的字体
    opacity: 1;
    letter-spacing: 4px; // 增加字母间距
    text-transform: uppercase;
    // 3D文字效果
    text-shadow:
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 15px #6366f1,
      0 0 20px #6366f1,
      0 0 25px #6366f1,
      0 0 30px #6366f1,
      0 0 35px #6366f1;
    // 添加动画效果
    animation:
      textGlow 2s ease-in-out infinite alternate,
      textPulse 3s ease-in-out infinite;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .loading-progress {
    font-size: 16px;
    opacity: 0.9;
    letter-spacing: 1.5px;
    font-style: normal;
    font-weight: 500;
    animation: pulse 2s ease-in-out infinite;
  }
}

// 3D文字发光动画
@keyframes textGlow {
  0% {
    text-shadow:
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 15px #6366f1,
      0 0 20px #6366f1,
      0 0 25px #6366f1,
      0 0 30px #6366f1,
      0 0 35px #6366f1;
  }
  100% {
    text-shadow:
      0 0 10px #fff,
      0 0 20px #fff,
      0 0 30px #8b5cf6,
      0 0 40px #8b5cf6,
      0 0 50px #8b5cf6,
      0 0 60px #8b5cf6,
      0 0 70px #8b5cf6;
  }
}

// 文字脉动效果
@keyframes textPulse {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.05) translateY(-2px);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinReverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>

