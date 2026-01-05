<template>
  <div
    v-if="!isLoading && !animationComplete"
    class="cinematic-intro"
    :class="`cinematic-intro--${animationType}`"
    aria-hidden="true"
  >
    <div class="cinematic-intro__fade-out" />
    <div class="cinematic-intro__title-card">
      <div
        class="cinematic-intro__particles-container"
        aria-hidden="true"
      >
        <div
          v-for="i in particleCount"
          :key="i"
          class="cinematic-intro__particle"
          :style="getParticleStyle(i)"
          :aria-hidden="true"
        />
      </div>
      <h1 class="cinematic-intro__title">
        ZOOOW
      </h1>
      <p class="cinematic-intro__subtitle">
        IMMERSIVE EXPERIENCE
      </p>
      <div
        class="cinematic-intro__scanlines"
        aria-hidden="true"
      />
      <div
        class="cinematic-intro__lens-flare"
        aria-hidden="true"
      />
    </div>

    <!-- 史诗俯冲效果 -->
    <div
      v-if="animationType === 'epic-dive'"
      class="cinematic-intro__dynamic-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__speed-lines" />
      <div class="cinematic-intro__vignette" />
      <div class="cinematic-intro__motion-blur" />
    </div>

    <!-- 维度折叠效果 -->
    <div
      v-if="animationType === 'dimension-fold'"
      class="cinematic-intro__dimension-fold-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__fold-lines" />
      <div class="cinematic-intro__dimension-shift" />
      <div class="cinematic-intro__reality-glitch" />
    </div>

    <!-- 能量波效果 -->
    <div
      v-if="animationType === 'energy-wave'"
      class="cinematic-intro__energy-wave-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__energy-ring" />
      <div class="cinematic-intro__shockwave" />
      <div class="cinematic-intro__energy-particles" />
    </div>

    <!-- 眩晕相机效果 -->
    <div
      v-if="animationType === 'dizzy-cam'"
      class="cinematic-intro__dizzy-cam-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__spinning-overlay" />
      <div class="cinematic-intro__color-shift" />
      <div class="cinematic-intro__motion-trail" />
    </div>

    <!-- 超空间跳跃效果 -->
    <div
      v-if="animationType === 'hyperspace'"
      class="cinematic-intro__hyperspace-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__star-stretch" />
      <div class="cinematic-intro__tunnel-vision" />
      <div class="cinematic-intro__light-burst" />
    </div>

    <!-- 时空裂缝效果 -->
    <div
      v-if="animationType === 'time-rift'"
      class="cinematic-intro__time-rift-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__rift-cracks" />
      <div class="cinematic-intro__time-fragments" />
      <div class="cinematic-intro__reality-reassemble" />
    </div>

    <!-- 星球爆炸效果 -->
    <div
      v-if="animationType === 'planet-explosion'"
      class="cinematic-intro__planet-explosion-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__explosion-core" />
      <div class="cinematic-intro__debris-field" />
      <div class="cinematic-intro__shockwave-sphere" />
    </div>

    <!-- 量子纠缠效果 -->
    <div
      v-if="animationType === 'quantum-entanglement'"
      class="cinematic-intro__quantum-entanglement-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__parallel-worlds" />
      <div class="cinematic-intro__quantum-bridge" />
      <div class="cinematic-intro__reality-merge" />
    </div>

    <!-- 虚拟现实效果 -->
    <div
      v-if="animationType === 'virtual-reality'"
      class="cinematic-intro__virtual-reality-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__pixelation" />
      <div class="cinematic-intro__digital-noise" />
      <div class="cinematic-intro__reality-materialize" />
    </div>

    <!-- 场景漫游效果 -->
    <div
      v-if="animationType === 'scene-roaming'"
      class="cinematic-intro__scene-roaming-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__viewfinder" />
      <div class="cinematic-intro__path-indicator" />
      <div class="cinematic-intro__scene-transition" />
    </div>

    <!-- 轨道环绕效果 -->
    <div
      v-if="animationType === 'orbital-rotation'"
      class="cinematic-intro__orbital-rotation-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__orbit-path" />
      <div class="cinematic-intro__gravity-well" />
      <div class="cinematic-intro__ascending-spiral" />
    </div>

    <!-- 维度传送门效果 -->
    <div
      v-if="animationType === 'dimensional-portal'"
      class="cinematic-intro__dimensional-portal-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__portal-ring" />
      <div class="cinematic-intro__dimension-shift" />
      <div class="cinematic-intro__portal-particles" />
    </div>

    <!-- 时空穿梭效果 -->
    <div
      v-if="animationType === 'time-travel'"
      class="cinematic-intro__time-travel-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__time-ripples" />
      <div class="cinematic-intro__past-future-shift" />
      <div class="cinematic-intro__temporal-distortion" />
    </div>

    <!-- 黑洞吞噬效果 -->
    <div
      v-if="animationType === 'black-hole'"
      class="cinematic-intro__black-hole-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__event-horizon" />
      <div class="cinematic-intro__accretion-disk" />
      <div class="cinematic-intro__gravitational-lensing" />
    </div>

    <!-- 宇宙大爆炸效果 -->
    <div
      v-if="animationType === 'cosmic-big-bang'"
      class="cinematic-intro__cosmic-big-bang-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__singularity" />
      <div class="cinematic-intro__explosion-wave" />
      <div class="cinematic-intro__universe-formation" />
    </div>

    <!-- 维度崩溃效果 -->
    <div
      v-if="animationType === 'dimension-collapse'"
      class="cinematic-intro__dimension-collapse-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__reality-fracture" />
      <div class="cinematic-intro__dimensional-shards" />
      <div class="cinematic-intro__chaos-vortex" />
    </div>

    <!-- 时空逆流效果 -->
    <div
      v-if="animationType === 'time-rewind'"
      class="cinematic-intro__time-rewind-effects"
      aria-hidden="true"
    >
      <div class="cinematic-intro__reverse-flow" />
      <div class="cinematic-intro__temporal-fragments" />
      <div class="cinematic-intro__causality-loop" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { animations } from './animations'
import './animations/styles/index.scss'  // 导入样式入口文件

/**
 * Props定义
 */
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  scene: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isScene === 'function'
  },
  camera: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isCamera === 'function'
  },
  renderer: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isWebGLRenderer === 'function'
  },
  controls: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.update === 'function'
  },
  animationType: {
    type: String,
    default: 'epic-dive',
    validator: (value) => Object.keys(animations).includes(value)
  }
})

/**
 * Emits定义
 */
const emit = defineEmits({
  'animation-complete': (payload) => payload !== undefined,
  'animation-error': (error) => error instanceof Error
})

/**
 * 响应式状态
 */
const animationComplete = ref(false)
const particleCount = ref(50)

/**
 * 获取粒子样式
 * @param {Number} index - 粒子索引
 * @returns {Object} 样式对象
 */
const getParticleStyle = (index) => {
  const size = Math.random() * 3 + 1
  const x = (Math.random() - 0.5) * 500
  const y = (Math.random() - 0.5) * 300
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 5

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

/**
 * 动画完成回调
 * @param {Object} payload - 完成载荷
 */
const onAnimationComplete = (payload) => {
  console.log(`${props.animationType} 动画完成`, payload)
  animationComplete.value = true

  // 重新启用控制器
  if (props.controls) {
    props.controls.enabled = true
    props.controls.update()
  }

  // 触发完成事件
  emit('animation-complete', payload)
}

/**
 * 动画错误回调
 * @param {Error} error - 错误对象
 */
const onAnimationError = (error) => {
  console.error(`${props.animationType} 动画执行错误:`, error)
  animationComplete.value = true

  // 确保控制器启用
  if (props.controls) {
    props.controls.enabled = true
  }

  // 触发错误事件
  emit('animation-error', error)
}

/**
 * 启动动画
 */
const startAnimation = () => {
  // 重置完成状态
  animationComplete.value = false

  // 确保目标点在球心
  if (props.controls) {
    props.controls.target.set(0, 0, 0)
  }

  // 获取对应的动画函数
  const animationFn = animations[props.animationType]

  if (animationFn) {
    // 执行动画
    animationFn(props, {
      onComplete: onAnimationComplete,
      onError: onAnimationError
    })
  } else {
    console.error(`未知的动画类型: ${props.animationType}`)
    onAnimationError(new Error(`未知的动画类型: ${props.animationType}`))
  }
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  animationComplete.value = false
  setTimeout(() => {
    startAnimation()
  }, 100)
}


/**
 * 动画到默认视图
 * 将相机平滑过渡到默认观看位置
 */
const animateToDefaultView = () => {
  const { camera, controls } = props

  if (!camera) {
    console.error('相机不可用，无法执行动画')
    return
  }

  // 禁用控制器，防止用户在动画期间操作
  if (controls) {
    controls.enabled = false
    controls.target.set(0, 0, 0)
  }

  // 使用球坐标系统定位最终位置
  const spherical = new THREE.Spherical(
    5, // 半径
    Math.PI / 2.5, // theta
    Math.PI / 1.9 // phi
  )

  const targetPosition = new THREE.Vector3()
  targetPosition.setFromSpherical(spherical)

  // 使用 GSAP 平滑过渡相机位置
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (controls) {
        controls.update()
      }
    },
    onComplete: () => {
      // 设置最终 FOV
      gsap.to(camera, {
        fov: 75,
        duration: 0.5,
        ease: 'power1.out',
        onUpdate: () => {
          camera.updateProjectionMatrix()
          if (controls) {
            controls.update()
          }
        },
        onComplete: () => {
          // 重新启用控制器
          if (controls) {
            controls.enabled = true
            controls.update()
          }
        }
      })
    }
  })
}


/**
 * 组件挂载时启动动画
 */
onMounted(() => {
  if (!props.isLoading && !animationComplete.value) {
    startAnimation()
  }
})

/**
 * 监听动画类型变化
 */
watch(() => props.animationType, () => {
  startAnimation()
})











/**
 * 暴露给父组件的方法
 */
defineExpose({
  resetAnimation,
  animateToDefaultView
})
</script>


<!--
<style scoped lang="scss">
/* 电影级开场效果 - 使用BEM命名规范 */
.cinematic-intro {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  pointer-events: none;

  &__fade-out {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    animation: fadeOut 2s ease-out forwards;
  }

  &__title-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    animation: titleCard 3s ease-out forwards;
    z-index: 10;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  &__title {
    font-size: 4rem;
    font-weight: 100;
    letter-spacing: 8px;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    transform: translateZ(20px);
    font-family: 'Orbitron', 'Arial', sans-serif;
    position: relative;

    &::before {
      content: "ZOOOW";
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      color: rgba(100, 200, 255, 0.5);
      filter: blur(8px);
      transform: scale(1.05);
      animation: glowPulse 2s infinite alternate;
    }

    &::after {
      content: "ZOOOW";
      position: absolute;
      left: 2px;
      top: 2px;
      z-index: -2;
      color: rgba(0, 100, 255, 0.3);
      transform: translateZ(-5px);
    }

    text-stroke: 1px rgba(100, 200, 255, 0.3);
    -webkit-text-stroke: 1px rgba(100, 200, 255, 0.3);
  }

  &__subtitle {
    font-size: 1rem;
    letter-spacing: 4px;
    margin: 0;
    opacity: 0.8;
    text-transform: uppercase;
    transform: translateZ(10px);
    font-family: 'Orbitron', 'Arial', sans-serif;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 3s steps(30) forwards;
    max-width: 0;
    margin: 0 auto;
  }

  &__particles-container {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: -1;
  }

  &__particle {
    position: absolute;
    background: rgba(100, 200, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(100, 200, 255, 0.8);
    animation: float 3s infinite ease-in-out;
  }

  &__scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(100, 200, 255, 0.03) 2px,
            rgba(100, 200, 255, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  &__lens-flare {
    position: absolute;
    top: 20%;
    left: 30%;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(100,200,255,0.4) 40%, transparent 70%);
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0;
    animation: flare 2s ease-out forwards;
    z-index: 2;
  }

  &__dynamic-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__speed-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            0deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 45%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.03) 55%,
            transparent 100%
    );
    opacity: 0;
    animation: speedLinesFlash 8s ease-in-out forwards;
  }

  &__vignette {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 300px rgba(0, 0, 0, 0);
    animation: vignetteAppear 8s ease-in-out forwards;
  }

  &__motion-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0px);
    animation: motionBlurEffect 8s ease-in-out forwards;
  }

  // 新增：维度折叠效果
  &__dimension-fold-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__fold-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 20px
    );
    opacity: 0;
    animation: foldLinesFlash 7s ease-in-out forwards;
  }

  &__dimension-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(100, 0, 255, 0) 0%,
            rgba(100, 0, 255, 0.1) 50%,
            rgba(0, 255, 255, 0) 100%
    );
    opacity: 0;
    animation: dimensionShiftEffect 7s ease-in-out forwards;
  }

  &__reality-glitch {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(255, 0, 255, 0) 0%,
            rgba(255, 0, 255, 0.05) 50%,
            rgba(255, 0, 255, 0) 100%
    );
    opacity: 0;
    animation: realityGlitchEffect 7s ease-in-out forwards;
  }

  // 新增：能量波效果
  &__energy-wave-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__energy-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 10px solid transparent;
    border-radius: 50%;
    box-shadow: 0 0 100px rgba(0, 255, 255, 0.5);
    animation: energyRingExpand 6s ease-out forwards;
  }

  &__shockwave {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 255, 0.8) 0%,
            rgba(0, 255, 255, 0.5) 10%,
            rgba(0, 255, 255, 0.2) 30%,
            transparent 70%
    );
    opacity: 0;
    animation: shockwaveExpand 6s ease-out forwards;
  }

  &__energy-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: energyParticlesAppear 6s ease-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: particleFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: particleFloat2 2.5s infinite ease-in-out;
    }
  }

  // 新增：眩晕相机效果
  &__dizzy-cam-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__spinning-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 0, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(0, 0, 255, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: spinningOverlayEffect 5s ease-in-out forwards;
  }

  &__color-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(255, 0, 0, 0.1) 0%,
            rgba(0, 255, 0, 0.1) 25%,
            rgba(0, 0, 255, 0.1) 50%,
            rgba(255, 255, 0, 0.1) 75%,
            rgba(255, 0, 255, 0.1) 100%
    );
    opacity: 0;
    animation: colorShiftEffect 5s ease-in-out forwards;
  }

  &__motion-trail {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0px);
    animation: motionTrailEffect 5s ease-in-out forwards;
  }

  // 新增：超空间跳跃效果
  &__hyperspace-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__star-stretch {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0px,
            rgba(255, 255, 255, 0.1) 1px,
            rgba(255, 255, 255, 0) 2px,
            rgba(255, 255, 255, 0) 10px
    );
    opacity: 0;
    animation: starStretchEffect 5s ease-in-out forwards;
  }

  &__tunnel-vision {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
    animation: tunnelVisionEffect 5s ease-in-out forwards;
  }

  &__light-burst {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.8) 5%,
            rgba(255, 255, 255, 0.5) 10%,
            rgba(255, 255, 255, 0.2) 20%,
            transparent 40%
    );
    opacity: 0;
    animation: lightBurstEffect 5s ease-in-out forwards;
  }

  // 动画类型变体
  &&#45;&#45;space-warp &__title {
    animation: titleGlitch 0.5s infinite;
  }

  &&#45;&#45;matrix-hack {
    .cinematic-intro__title {
      color: #0f0;
      text-shadow: 0 0 10px #0f0;

      &::before {
        color: rgba(0, 255, 0, 0.5);
        animation: matrixGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0f0;
    }
  }

  &&#45;&#45;quantum-shift &__particle {
    animation: quantumFloat 1s infinite ease-in-out;
  }

  &&#45;&#45;quantum-shift &__title {
    animation: titleFlicker 0.2s infinite;
  }

  &&#45;&#45;epic-dive &__title {
    animation: titleShake 8s ease-in-out forwards;
  }

  // 新增动画类型变体
  &&#45;&#45;dimension-fold {
    .cinematic-intro__title {
      color: #f0f;
      text-shadow: 0 0 10px #f0f;

      &::before {
        color: rgba(255, 0, 255, 0.5);
        animation: dimensionGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f0f;
    }
  }

  &&#45;&#45;energy-wave {
    .cinematic-intro__title {
      color: #0ff;
      text-shadow: 0 0 10px #0ff;

      &::before {
        color: rgba(0, 255, 255, 0.5);
        animation: energyGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0ff;
    }
  }

  &&#45;&#45;dizzy-cam {
    .cinematic-intro__title {
      animation: dizzyTitleSpin 0.5s infinite;
    }
  }

  &&#45;&#45;hyperspace {
    .cinematic-intro__title {
      animation: hyperspaceTitleStretch 0.8s ease-in-out forwards;
    }
  }




  // 新增：时空裂缝效果
  &__time-rift-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__rift-cracks {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(255, 0, 255, 0.1) 5px,
            rgba(255, 0, 255, 0.1) 10px
    );
    opacity: 0;
    animation: riftCracksAppear 6s ease-in-out forwards;
  }

  &__time-fragments {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: timeFragmentsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 0, 255, 0.7);
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
    }

    &::before {
      top: 25%;
      left: 30%;
      animation: fragmentFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 35%;
      animation: fragmentFloat2 2.5s infinite ease-in-out;
    }
  }

  &__reality-reassemble {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(255, 0, 255, 0) 0%,
            rgba(255, 0, 255, 0.1) 50%,
            rgba(255, 0, 255, 0) 100%
    );
    opacity: 0;
    animation: realityReassembleEffect 6s ease-in-out forwards;
  }

  // 新增：星球爆炸效果
  &__planet-explosion-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__explosion-core {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 100, 0, 0.8) 0%,
            rgba(255, 200, 0, 0.5) 10%,
            rgba(255, 255, 0, 0.2) 30%,
            transparent 70%
    );
    opacity: 0;
    animation: explosionCoreEffect 5s ease-in-out forwards;
  }

  &__debris-field {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: debrisFieldEffect 5s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 150, 0, 0.7);
      box-shadow: 0 0 10px rgba(255, 150, 0, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: debrisFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: debrisFloat2 2.5s infinite ease-in-out;
    }
  }

  &__shockwave-sphere {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 200, 0, 0) 0%,
            rgba(255, 200, 0, 0.2) 20%,
            rgba(255, 200, 0, 0.1) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: shockwaveSphereEffect 5s ease-in-out forwards;
  }

  // 新增：量子纠缠效果
  &__quantum-entanglement-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__parallel-worlds {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: parallelWorldsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 50%;
      height: 50%;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
    }

    &::before {
      top: 10%;
      left: 10%;
      animation: parallelFloat1 3s infinite ease-in-out;
    }

    &::after {
      bottom: 10%;
      right: 10%;
      animation: parallelFloat2 3.5s infinite ease-in-out;
    }
  }

  &__quantum-bridge {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: quantumBridgeEffect 6s ease-in-out forwards;
  }

  &__reality-merge {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 255, 0.2) 0%,
            rgba(0, 255, 255, 0.1) 20%,
            rgba(0, 255, 255, 0.05) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: realityMergeEffect 6s ease-in-out forwards;
  }

  // 新增：虚拟现实效果
  &__virtual-reality-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__pixelation {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(45deg, rgba(0, 255, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05)),
    linear-gradient(-45deg, rgba(0, 255, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05));
    background-size: 20px 20px;
    opacity: 0;
    animation: pixelationEffect 6s ease-in-out forwards;
  }

  &__digital-noise {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 255, 0, 0.1) 1px,
            rgba(0, 255, 0, 0.1) 2px
    );
    opacity: 0;
    animation: digitalNoiseEffect 6s ease-in-out forwards;
  }

  &__reality-materialize {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: realityMaterializeEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &&#45;&#45;time-rift {
    .cinematic-intro__title {
      color: #f0f;
      text-shadow: 0 0 10px #f0f;

      &::before {
        color: rgba(255, 0, 255, 0.5);
        animation: timeRiftGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f0f;
    }
  }

  &&#45;&#45;planet-explosion {
    .cinematic-intro__title {
      color: #f50;
      text-shadow: 0 0 10px #f50;

      &::before {
        color: rgba(255, 100, 0, 0.5);
        animation: explosionGlow 0.7s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f50;
    }
  }

  &&#45;&#45;quantum-entanglement {
    .cinematic-intro__title {
      color: #0ff;
      text-shadow: 0 0 10px #0ff;

      &::before {
        color: rgba(0, 255, 255, 0.5);
        animation: entanglementGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0ff;
    }
  }

  &&#45;&#45;virtual-reality {
    .cinematic-intro__title {
      color: #0f0;
      text-shadow: 0 0 10px #0f0;

      &::before {
        color: rgba(0, 255, 0, 0.5);
        animation: virtualRealityGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0f0;
    }
  }





  // 新增：场景漫游效果
  &__scene-roaming-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__viewfinder {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 20px solid transparent;
    opacity: 0;
    animation: viewfinderEffect 7s ease-in-out forwards;
  }

  &__path-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(100, 200, 255, 0.1) 25%,
            transparent 50%,
            rgba(100, 200, 255, 0.1) 75%,
            transparent 100%
    );
    opacity: 0;
    animation: pathIndicatorEffect 7s ease-in-out forwards;
  }

  &__scene-transition {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: sceneTransitionEffect 7s ease-in-out forwards;
  }

  // 新增：轨道环绕效果
  &__orbital-rotation-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__orbit-path {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px dashed rgba(100, 200, 255, 0.3);
    opacity: 0;
    animation: orbitPathEffect 6s ease-in-out forwards;
  }

  &__gravity-well {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(100, 200, 255, 0) 0%,
            rgba(100, 200, 255, 0.2) 20%,
            rgba(100, 200, 255, 0.1) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: gravityWellEffect 6s ease-in-out forwards;
  }

  &__ascending-spiral {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(100, 200, 255, 0.1) 90deg,
            transparent 180deg,
            rgba(100, 200, 255, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: ascendingSpiralEffect 6s ease-in-out forwards;
  }

  // 新增：维度传送门效果
  &__dimensional-portal-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__portal-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid transparent;
    opacity: 0;
    animation: portalRingEffect 9s ease-in-out forwards;
  }

  &__dimension-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(0, 255, 255, 0) 0%,
            rgba(0, 255, 255, 0.2) 50%,
            rgba(0, 255, 255, 0) 100%
    );
    opacity: 0;
    animation: dimensionShiftEffect 9s ease-in-out forwards;
  }

  &__portal-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: portalParticlesEffect 9s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }

    &::before {
      top: 25%;
      left: 30%;
      animation: portalParticleFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 35%;
      animation: portalParticleFloat2 2.5s infinite ease-in-out;
    }
  }

  // 新增：时空穿梭效果
  &__time-travel-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__time-ripples {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: timeRipplesEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid rgba(136, 68, 255, 0.5);
    }

    &::before {
      animation: rippleExpand1 3s infinite ease-out;
    }

    &::after {
      animation: rippleExpand2 3s infinite ease-out;
      animation-delay: 1.5s;
    }
  }

  &__past-future-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(136, 68, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(68, 136, 255, 0.2) 100%
    );
    opacity: 0;
    animation: pastFutureShiftEffect 6s ease-in-out forwards;
  }

  &__temporal-distortion {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(136, 68, 255, 0.1) 2px,
            rgba(136, 68, 255, 0.1) 4px
    );
    opacity: 0;
    animation: temporalDistortionEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &&#45;&#45;scene-roaming {
    .cinematic-intro__title {
      color: #64b5f6;
      text-shadow: 0 0 10px #64b5f6;

      &::before {
        color: rgba(100, 181, 246, 0.5);
        animation: roamingGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #64b5f6;
    }
  }

  &&#45;&#45;orbital-rotation {
    .cinematic-intro__title {
      color: #7b1fa2;
      text-shadow: 0 0 10px #7b1fa2;

      &::before {
        color: rgba(123, 31, 162, 0.5);
        animation: orbitalGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #7b1fa2;
    }
  }

  &&#45;&#45;dimensional-portal {
    .cinematic-intro__title {
      color: #00bcd4;
      text-shadow: 0 0 10px #00bcd4;

      &::before {
        color: rgba(0, 188, 212, 0.5);
        animation: portalGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #00bcd4;
    }
  }

  &&#45;&#45;time-travel {
    .cinematic-intro__title {
      color: #8844ff;
      text-shadow: 0 0 10px #8844ff;

      &::before {
        color: rgba(136, 68, 255, 0.5);
        animation: timeGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #8844ff;
    }
  }




  // 新增：黑洞吞噬效果
  &__black-hole-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__event-horizon {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 10%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 0.2) 30%,
            transparent 50%
    );
    opacity: 0;
    animation: eventHorizonEffect 6s ease-in-out forwards;
  }

  &__accretion-disk {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 20px solid transparent;
    opacity: 0;
    animation: accretionDiskEffect 6s ease-in-out forwards;
  }

  &__gravitational-lensing {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 100, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(255, 100, 0, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: gravitationalLensingEffect 6s ease-in-out forwards;
  }

  // 新增：宇宙大爆炸效果
  &__cosmic-big-bang-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__singularity {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.8) 5%,
            rgba(255, 200, 100, 0.5) 10%,
            rgba(255, 150, 50, 0.2) 20%,
            transparent 40%
    );
    opacity: 0;
    animation: singularityEffect 6s ease-in-out forwards;
  }

  &__explosion-wave {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 20%,
            rgba(255, 200, 100, 0.5) 40%,
            rgba(255, 150, 50, 0.2) 60%,
            transparent 80%
    );
    opacity: 0;
    animation: explosionWaveEffect 6s ease-in-out forwards;
  }

  &__universe-formation {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 0, 50, 0.2) 0%,
            rgba(0, 0, 100, 0.1) 30%,
            rgba(0, 50, 200, 0.05) 60%,
            transparent 90%
    );
    opacity: 0;
    animation: universeFormationEffect 6s ease-in-out forwards;
  }

  // 新增：维度崩溃效果
  &__dimension-collapse-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__reality-fracture {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(255, 0, 0, 0.1) 5px,
            rgba(255, 0, 0, 0.1) 10px
    );
    opacity: 0;
    animation: realityFractureEffect 6s ease-in-out forwards;
  }

  &__dimensional-shards {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: dimensionalShardsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      background: rgba(255, 0, 0, 0.7);
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
    }

    &::before {
      top: 20%;
      left: 30%;
      animation: shardFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: shardFloat2 2.5s infinite ease-in-out;
    }
  }

  &__chaos-vortex {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 0, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(255, 0, 0, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: chaosVortexEffect 6s ease-in-out forwards;
  }

  // 新增：时空逆流效果
  &__time-rewind-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__reverse-flow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(136, 68, 255, 0.1) 10px,
            rgba(136, 68, 255, 0.1) 20px
    );
    opacity: 0;
    animation: reverseFlowEffect 6s ease-in-out forwards;
  }

  &__temporal-fragments {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: temporalFragmentsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 25px;
      height: 25px;
      background: rgba(136, 68, 255, 0.7);
      box-shadow: 0 0 10px rgba(136, 68, 255, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: temporalFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 25%;
      animation: temporalFloat2 2.5s infinite ease-in-out;
    }
  }

  &__causality-loop {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(136, 68, 255, 0.05) 5px,
            rgba(136, 68, 255, 0.05) 10px
    );
    opacity: 0;
    animation: causalityLoopEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &&#45;&#45;black-hole {
    .cinematic-intro__title {
      color: #f50;
      text-shadow: 0 0 10px #f50;

      &::before {
        color: rgba(255, 50, 0, 0.5);
        animation: blackHoleGlow 0.7s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f50;
    }
  }

  &&#45;&#45;cosmic-big-bang {
    .cinematic-intro__title {
      color: #fff;
      text-shadow: 0 0 10px #fff;

      &::before {
        color: rgba(255, 255, 255, 0.5);
        animation: bigBangGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #fff;
    }
  }

  &&#45;&#45;dimension-collapse {
    .cinematic-intro__title {
      color: #f00;
      text-shadow: 0 0 10px #f00;

      &::before {
        color: rgba(255, 0, 0, 0.5);
        animation: collapseGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f00;
    }
  }

  &&#45;&#45;time-rewind {
    .cinematic-intro__title {
      color: #88f;
      text-shadow: 0 0 10px #88f;

      &::before {
        color: rgba(136, 136, 255, 0.5);
        animation: rewindGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #88f;
    }
  }




}

// 原有动画定义
@keyframes fadeOut {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
}

@keyframes titleCard {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%);
    filter: blur(10px);
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -50%);
    filter: blur(0px);
  }
  70% {
    opacity: 1;
    transform: translate(-50%, -50%);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60%);
    filter: blur(5px);
  }
}

@keyframes glowPulse {
  0% {
    filter: blur(8px);
    opacity: 0.5;
  }
  100% {
    filter: blur(12px);
    opacity: 0.8;
  }
}

@keyframes typing {
  0% { max-width: 0; }
  70% { max-width: 100%; }
  100% { max-width: 100%; }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(0, -20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes quantumFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(0, -30px) scale(1.5);
    opacity: 1;
  }
}

@keyframes titleGlitch {
  0%, 100% { transform: translateZ(20px); }
  20% { transform: translateX(-5px) translateZ(20px); }
  40% { transform: translateX(5px) translateZ(20px); }
}

@keyframes matrixGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(10px);
    opacity: 0.7;
  }
}

@keyframes titleFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes titleShake {
  0%, 20% { transform: translateZ(20px); }
  40%, 45% { transform: translateZ(20px) translateX(2px); }
  50%, 55% { transform: translateZ(20px) translateX(-2px); }
  60% { transform: translateZ(20px) translateX(1px); }
  70% { transform: translateZ(20px); }
  100% { transform: translateZ(20px) translateY(-10px); }
}

@keyframes flare {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

@keyframes speedLinesFlash {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  70% { opacity: 0.4; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes vignetteAppear {
  0% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
  20% { box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3); }
  60% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5); }
  100% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
}

@keyframes motionBlurEffect {
  0% { backdrop-filter: blur(0px); }
  20% { backdrop-filter: blur(0px); }
  50% { backdrop-filter: blur(2px); }
  70% { backdrop-filter: blur(1px); }
  100% { backdrop-filter: blur(0px); }
}

// 新增动画定义：维度折叠效果
@keyframes foldLinesFlash {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes dimensionShiftEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityGlitchEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：能量波效果
@keyframes energyRingExpand {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  20% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: scale(2);
    opacity: 0.4;
  }
  80% {
    transform: scale(5);
    opacity: 0.1;
  }
  100% {
    transform: scale(10);
    opacity: 0;
  }
}

@keyframes shockwaveExpand {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.4;
    transform: scale(2);
  }
  80% {
    opacity: 0.1;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes energyParticlesAppear {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes particleFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -30px);
  }
}

@keyframes particleFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -20px);
  }
}

// 新增动画定义：眩晕相机效果
@keyframes spinningOverlayEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(360deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(720deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(1080deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1440deg);
  }
}

@keyframes colorShiftEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes motionTrailEffect {
  0% { backdrop-filter: blur(0px); }
  20% { backdrop-filter: blur(0px); }
  40% { backdrop-filter: blur(2px); }
  60% { backdrop-filter: blur(1px); }
  80% { backdrop-filter: blur(0.5px); }
  100% { backdrop-filter: blur(0px); }
}

// 新增动画定义：超空间跳跃效果
@keyframes starStretchEffect {
  0% {
    opacity: 0;
    background-size: 10px 100%;
  }
  20% {
    opacity: 0;
    background-size: 10px 100%;
  }
  40% {
    opacity: 0.8;
    background-size: 1px 100%;
  }
  60% {
    opacity: 0.4;
    background-size: 5px 100%;
  }
  80% {
    opacity: 0.1;
    background-size: 20px 100%;
  }
  100% {
    opacity: 0;
    background-size: 100px 100%;
  }
}

@keyframes tunnelVisionEffect {
  0% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
  20% { box-shadow: inset 0 0 100px rgba(0, 0, 0, 0); }
  40% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.7); }
  60% { box-shadow: inset 0 0 300px rgba(0, 0, 0, 0.3); }
  80% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.1); }
  100% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
}

@keyframes lightBurstEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 0.5; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes dimensionGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes energyGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes dizzyTitleSpin {
  0% { transform: translateZ(20px) rotateY(0deg); }
  25% { transform: translateZ(20px) rotateY(90deg); }
  50% { transform: translateZ(20px) rotateY(180deg); }
  75% { transform: translateZ(20px) rotateY(270deg); }
  100% { transform: translateZ(20px) rotateY(360deg); }
}

@keyframes hyperspaceTitleStretch {
  0% { transform: translateZ(20px) scaleX(1); }
  50% { transform: translateZ(20px) scaleX(1.5); }
  100% { transform: translateZ(20px) scaleX(1); }
}




// 新增动画定义：时空裂缝效果
@keyframes riftCracksAppear {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes timeFragmentsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes fragmentFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -20px);
  }
}

@keyframes fragmentFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -15px);
  }
}

@keyframes realityReassembleEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：星球爆炸效果
@keyframes explosionCoreEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 1;
    transform: scale(0.5);
  }
  40% {
    opacity: 0.7;
    transform: scale(1);
  }
  70% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    opacity: 0;
    transform: scale(5);
  }
}

@keyframes debrisFieldEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes debrisFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -15px);
  }
}

@keyframes debrisFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-15px, -10px);
  }
}

@keyframes shockwaveSphereEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.5);
  }
  80% {
    opacity: 0.1;
    transform: scale(3);
  }
  100% {
    opacity: 0;
    transform: scale(5);
  }
}

// 新增动画定义：量子纠缠效果
@keyframes parallelWorldsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes parallelFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, -10px);
  }
}

@keyframes parallelFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-10px, -15px);
  }
}

@keyframes quantumBridgeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityMergeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：虚拟现实效果
@keyframes pixelationEffect {
  0% {
    opacity: 0;
    background-size: 20px 20px;
  }
  20% {
    opacity: 0.8;
    background-size: 30px 30px;
  }
  40% {
    opacity: 0.6;
    background-size: 25px 25px;
  }
  60% {
    opacity: 0.3;
    background-size: 15px 15px;
  }
  80% {
    opacity: 0.1;
    background-size: 10px 10px;
  }
  100% {
    opacity: 0;
    background-size: 5px 5px;
  }
}

@keyframes digitalNoiseEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityMaterializeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes timeRiftGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes explosionGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes entanglementGlow {
  0% {
    filter: blur(7px);
    opacity: 0.35;
  }
  100% {
    filter: blur(11px);
    opacity: 0.75;
  }
}

@keyframes virtualRealityGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}




// 新增动画定义：场景漫游效果
@keyframes viewfinderEffect {
  0% {
    opacity: 0;
    border-width: 20px;
  }
  20% {
    opacity: 0.8;
    border-width: 15px;
  }
  40% {
    opacity: 0.6;
    border-width: 10px;
  }
  70% {
    opacity: 0.3;
    border-width: 5px;
  }
  100% {
    opacity: 0;
    border-width: 0px;
  }
}

@keyframes pathIndicatorEffect {
  0% { opacity: 0; }
  20% { opacity: 0.7; }
  40% { opacity: 0.5; }
  70% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes sceneTransitionEffect {
  0% { opacity: 0; }
  15% { opacity: 0; }
  20% { opacity: 0.8; }
  25% { opacity: 0; }
  55% { opacity: 0; }
  60% { opacity: 0.8; }
  65% { opacity: 0; }
  100% { opacity: 0; }
}

// 新增动画定义：轨道环绕效果
@keyframes orbitPathEffect {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.5;
    transform: scale(1);
  }
  80% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(0.1);
  }
}

@keyframes gravityWellEffect {
  0% { opacity: 0; }
  30% { opacity: 0; }
  50% { opacity: 0.7; }
  70% { opacity: 0.3; }
  100% { opacity: 0; }
}

@keyframes ascendingSpiralEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  30% {
    opacity: 0.6;
    transform: rotate(180deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(540deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1080deg);
  }
}

// 新增动画定义：维度传送门效果
@keyframes portalRingEffect {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  10% {
    opacity: 0.8;
    transform: scale(1);
  }
  25% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  40% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    opacity: 0.8;
    transform: scale(1);
  }
  75% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  90% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes dimensionShiftEffect {
  0% { opacity: 0; }
  10% { opacity: 0; }
  25% { opacity: 0.8; }
  40% { opacity: 0; }
  50% { opacity: 0; }
  60% { opacity: 0.8; }
  75% { opacity: 0; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes portalParticlesEffect {
  0% { opacity: 0; }
  10% { opacity: 0; }
  25% { opacity: 0.8; }
  40% { opacity: 0.4; }
  50% { opacity: 0; }
  60% { opacity: 0.8; }
  75% { opacity: 0.4; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes portalParticleFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, -20px);
  }
}

@keyframes portalParticleFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, -15px);
  }
}

// 新增动画定义：时空穿梭效果
@keyframes rippleExpand1 {
  0% {
    transform: scale(0.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes rippleExpand2 {
  0% {
    transform: scale(0.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes timeRipplesEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes pastFutureShiftEffect {
  0% { opacity: 0; }
  30% { opacity: 0.7; }
  50% { opacity: 0; }
  70% { opacity: 0.7; }
  100% { opacity: 0; }
}

@keyframes temporalDistortionEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes roamingGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes orbitalGlow {
  0% {
    filter: blur(7px);
    opacity: 0.35;
  }
  100% {
    filter: blur(11px);
    opacity: 0.75;
  }
}

@keyframes portalGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes timeGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}







// 新增动画定义：黑洞吞噬效果
@keyframes eventHorizonEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.7;
    transform: scale(2);
  }
  80% {
    opacity: 0.5;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes accretionDiskEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg) scale(0.5);
  }
  20% {
    opacity: 0.8;
    transform: rotate(180deg) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: rotate(720deg) scale(1.5);
  }
  80% {
    opacity: 0.3;
    transform: rotate(1440deg) scale(2);
  }
  100% {
    opacity: 0;
    transform: rotate(2160deg) scale(3);
  }
}

@keyframes gravitationalLensingEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(180deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(360deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(540deg);
  }
  100% {
    opacity: 0;
    transform: rotate(720deg);
  }
}

// 新增动画定义：宇宙大爆炸效果
@keyframes singularityEffect {
  0% {
    opacity: 0;
    transform: scale(0.01);
  }
  10% {
    opacity: 1;
    transform: scale(0.1);
  }
  30% {
    opacity: 0.8;
    transform: scale(1);
  }
  60% {
    opacity: 0.5;
    transform: scale(3);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes explosionWaveEffect {
  0% {
    opacity: 0;
    transform: scale(0.01);
  }
  10% {
    opacity: 0;
    transform: scale(0.01);
  }
  30% {
    opacity: 1;
    transform: scale(2);
  }
  60% {
    opacity: 0.5;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes universeFormationEffect {
  0% {
    opacity: 0;
    background-size: 10% 10%;
  }
  30% {
    opacity: 0;
    background-size: 10% 10%;
  }
  60% {
    opacity: 0.8;
    background-size: 50% 50%;
  }
  80% {
    opacity: 0.4;
    background-size: 80% 80%;
  }
  100% {
    opacity: 0;
    background-size: 100% 100%;
  }
}

// 新增动画定义：维度崩溃效果
@keyframes realityFractureEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes dimensionalShardsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes shardFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -20px);
  }
}

@keyframes shardFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -15px);
  }
}

@keyframes chaosVortexEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(360deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(720deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(1080deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1440deg);
  }
}

// 新增动画定义：时空逆流效果
@keyframes reverseFlowEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.6; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes temporalFragmentsEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes temporalFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(25px, -20px);
  }
}

@keyframes temporalFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, -15px);
  }
}

@keyframes causalityLoopEffect {
  0% { opacity: 0; }
  20% { opacity: 0.7; }
  40% { opacity: 0.5; }
  60% { opacity: 0.7; }
  80% { opacity: 0.3; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes blackHoleGlow {
  0% {
    filter: blur(7px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes bigBangGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes collapseGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(13px);
    opacity: 0.7;
  }
}

@keyframes rewindGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(11px);
    opacity: 0.8;
  }
}










</style>



-->

































