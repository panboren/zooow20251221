<!-- src/components/CameraControls.vue -->
<template>
  <div
    class="view-controls"
    role="region"
    aria-label="视角控制面板"
  >
    <h4>视角控制</h4>
    <div class="view-buttons">
      <button
        class="view-btn"
        aria-label="正前方视角"
        @click="setView('front')"
      >
        正前方
      </button>
      <button
        class="view-btn"
        aria-label="右侧视角"
        @click="setView('right')"
      >
        右侧
      </button>
      <button
        class="view-btn"
        aria-label="左侧视角"
        @click="setView('left')"
      >
        左侧
      </button>
      <button
        class="view-btn"
        aria-label="后方视角"
        @click="setView('back')"
      >
        后方
      </button>
      <button
        class="view-btn"
        aria-label="仰视角"
        @click="setView('up')"
      >
        仰视
      </button>
      <button
        class="view-btn"
        aria-label="俯视角"
        @click="setView('down')"
      >
        俯视
      </button>
      <button
        class="view-btn default"
        aria-label="默认视角"
        @click="setView('default')"
      >
        默认
      </button>
    </div>
  </div>
</template>

<script setup>

import * as THREE from 'three'
import { gsap } from 'gsap'
const emit = defineEmits(['set-camera-view'])

const props = defineProps({
  camera: {
    type: Object,
    required: true
  },
  controls: {
    type: Object,
    required: true
  }
})

/**
 * 预设视角函数 - 从当前位置平滑过渡
 */
const setCameraView = (preset) => {
  try {
    if (!props.camera || !props.controls) return

    // 确保目标点在球心
    props.controls.target.set(0, 0, 0)

    // 根据预设设置目标球坐标
    let targetTheta = 0
    let targetPhi = Math.PI / 2

    switch(preset) {
    case 'front':
      // 正前方视角
      targetTheta = 0
      targetPhi = Math.PI / 2
      break
    case 'right':
      // 右侧视角 (90度)
      targetTheta = Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'left':
      // 左侧视角 (-90度)
      targetTheta = -Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'back':
      // 后方视角 (180度)
      targetTheta = Math.PI
      targetPhi = Math.PI / 2
      break
    case 'up':
      // 仰视视角 (向上30度)
      targetTheta = 0
      targetPhi = Math.PI / 2 - Math.PI / 6
      break
    case 'down':
      // 俯视视角 (向下30度)
      targetTheta = 0
      targetPhi = Math.PI / 2 + Math.PI / 6
      break
    case 'default':
    default:
      // 默认视角
      targetTheta = Math.PI / 2.5
      targetPhi = Math.PI / 1.9
      break
    }

    // 获取当前球坐标
    const currentSpherical = new THREE.Spherical()
    const offset = new THREE.Vector3()
    offset.copy(props.controls.object.position).sub(props.controls.target)
    currentSpherical.setFromVector3(offset)

    // 处理角度差异（选择最短路径）
    let thetaDiff = targetTheta - currentSpherical.theta
    while (thetaDiff > Math.PI) thetaDiff -= 2 * Math.PI
    while (thetaDiff < -Math.PI) thetaDiff += 2 * Math.PI

    const targetThetaAdjusted = currentSpherical.theta + thetaDiff

    // 使用GSAP创建流畅动画，保持当前半径
    gsap.to(currentSpherical, {
      theta: targetThetaAdjusted,
      phi: targetPhi,
      duration: 1.5, // 1.5秒动画
      ease: 'power2.inOut', // GSAP的缓动函数
      onUpdate: () => {
        try {
          // 限制极角在控制器范围内
          currentSpherical.phi = Math.max(props.controls.minPolarAngle, Math.min(props.controls.maxPolarAngle, currentSpherical.phi))
          currentSpherical.makeSafe()

          // 从当前位置平滑过渡到新位置
          props.controls.object.position.setFromSpherical(currentSpherical)
          props.controls.object.lookAt(props.controls.target)
          props.controls.update()
        } catch (error) {
          console.error('视角更新错误:', error)
        }
      },
      onComplete: () => {
        console.log(`从当前位置切换到预设视角: ${preset}`)
      }
    })
  } catch (error) {
    console.error('设置预设视角失败:', error)
  }
}









const setView = (view) => {
  setCameraView(view)
  emit('set-camera-view', view)
}
</script>

<style scoped lang="scss">
.view-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: white;
  z-index: 100;
  min-width: 200px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.9;
    text-align: center;
  }

  .view-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;

    .view-btn {
      padding: 8px 4px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      &.default {
        grid-column: span 3;
        background: rgba(76, 175, 80, 0.3);
        border-color: rgba(76, 175, 80, 0.5);

        &:hover {
          background: rgba(76, 175, 80, 0.4);
        }
      }
    }
  }

  // 移动端优化
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    padding: 12px;
    min-width: 160px;

    h4 {
      font-size: 12px;
    }

    .view-buttons {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;

      .view-btn {
        padding: 6px 3px;
        font-size: 11px;
      }
    }
  }
}
</style>
