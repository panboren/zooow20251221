<template>
   <div class="loading-container-layer">
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
.loading-container-layer{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

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

// 平板适配
@media (max-width: 768px) {
  .loading-indicator {
    padding: 50px 40px;
    border-radius: 16px;
    gap: 16px;

    .loading-spinner {
      width: 60px;
      height: 60px;

      &::before {
        border-top-width: 3px;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
      }

      &::after {
        top: 12.5%;
        left: 12.5%;
        border-bottom-width: 2.5px;
      }
    }

    p {
      font-size: 22px;
      letter-spacing: 3px;
    }

    .loading-progress {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
}

// 手机大屏适配
@media (max-width: 480px) {
  .loading-indicator {
    padding: 40px 30px;
    border-radius: 12px;
    gap: 14px;
    width: 85%;
    max-width: 320px;

    .loading-spinner {
      width: 50px;
      height: 50px;

      &::before {
        border-top-width: 3px;
      }

      &::after {
        top: 10%;
        left: 10%;
        border-bottom-width: 2px;
      }
    }

    p {
      font-size: 18px;
      letter-spacing: 2px;
    }

    .loading-progress {
      font-size: 13px;
      letter-spacing: 0.8px;
    }
  }
}

// 手机小屏适配
@media (max-width: 375px) {
  .loading-indicator {
    padding: 30px 24px;
    gap: 12px;
    width: 90%;
    max-width: 280px;

    .loading-spinner {
      width: 45px;
      height: 45px;

      &::before {
        border-top-width: 2.5px;
      }

      &::after {
        border-bottom-width: 2px;
      }
    }

    p {
      font-size: 16px;
      letter-spacing: 1.5px;
    }

    .loading-progress {
      font-size: 12px;
    }
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

