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
 * @author ZOOOW Team
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
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  text-align: center;

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }

  p {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    opacity: 1;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .loading-progress {
    font-size: 12px;
    opacity: 0.7;
    letter-spacing: 1px;
    font-style: italic;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>
