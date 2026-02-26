<template>
  <div
      class="animation-selector"
      role="region"
      aria-label="动画控制"
  >
    <label for="animation-type">特效类型：</label>

    <el-select
        style="width: 200px;"
        v-model="sanitizedValue"
        @change="handleChange"
        :filterable="isPcEnvironment"
        placeholder="选择开场动画类型"
        popper-class="custom-animation-select-dropdown"
    >
      <el-option
          v-for="(item,index) in animationOptions"
          :key="`${item.value}-${index}`"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button
        aria-label="重新播放动画"
        @click="resetAnimation"
    >
      重新播放
    </el-button>
    <span class="speed-label">速度:</span>
    <el-slider
        v-model="animationSpeed"
        :min="0.1"
        :max="3"
        :step="0.1"
        :show-tooltip="true"
        :format-tooltip="formatTooltip"
        :marks="speedMarks"
        @change="handleSpeedChange"
        style="width: 150px;"
    />
    <el-button
        @click="resetSpeed"
        :icon="RefreshLeft"
        title="重置速度"
    />
  </div>
</template>


<script setup>
import { computed, ref } from 'vue'  // 添加 ref 导入
import { RefreshLeft } from '@element-plus/icons-vue'
import {isPc} from '../../../../utils/index.js'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  }
})

// 判断是否为PC端环境
let isPcEnvironment = ref(isPc())
const emit = defineEmits(['update:modelValue', 'reset', 'change', 'speed-change'])

// 动画速度控制
const animationSpeed = ref(1.5)
const speedMarks = {
  0.1: '慢',
  0.5: '',
  1: '1x',
  1.5: '',
  2: '2x',
  3: '快'
}

// 格式化速度显示
const formatTooltip = (value) => {
  return `${value}x`
}

// 处理速度变化
const handleSpeedChange = (value) => {
  console.log('动画速度变化:', value)
  emit('speed-change', parseFloat(value))
}

// 重置速度
const resetSpeed = () => {
  animationSpeed.value = 1.0
  handleSpeedChange(1.0)
}

// 动画选项数组 - 只包含实际存在的动画
const animationOptions = [
  { value: 'holographic-neural-network', label: '🧠 全息神经网络' },




  // 🌌 全息宇宙创世交响曲 - 融合所有精华的终极超越
  { value: 'holographic-creation-symphony', label: '🌌 全息宇宙创世交响曲' },

  // 🕸️ 全息时空织机 - 量子编织
  { value: 'holographic-loom', label: '🕸️ 全息时空织机' },

  // 🌀 量子分形涡旋 - 无限递归
  { value: 'quantum-fractal-vortex', label: '🌀 量子分形涡旋' },

  // 🌌 极光之息 - 宇宙呼吸
  { value: 'ethereal-aurora', label: '🌌 极光之息' },

  // 🌌 量子宇宙交响曲 - 终极特效
  { value: 'quantum-universe-symphony', label: '🌌 量子宇宙交响曲' },

  { value: 'holographic-nexus-rift', label: '🌌 全息时空裂缝' },
  { value: 'holographic-quantum-flux', label: '⚛️ 全息量子涨落' },
  { value: 'holographic-dimension-fold', label: '🔮 全息维度折叠' },
  { value: 'holographic-void-cosmos', label: '🌌 全息虚空宇宙' },

  // ✨ 传说级全息特效（奇迹重现）
  { value: 'holographic-aurora-borealis', label: '🌌 全息极光' },
  { value: 'holographic-bioluminescence', label: '🌊 全息生物发光' },
  { value: 'holographic-crystal-cathedral', label: '💎 全息水晶大教堂' },
  { value: 'holographic-phoenix-rebirth', label: '🔥 全息凤凰重生' },
  { value: 'holographic-ethereal-garden', label: '🌸 全息灵空花园' },

  // 🌟 神话级全息特效（传说超越）
  { value: 'holographic-creation', label: '🌟 全息宇宙创世' },
  { value: 'holographic-dragon-awakening', label: '🐲 全息神龙觉醒' },

  // 🧘 禅意全息特效（东方美学）
  { value: 'holographic-zenith-mandala', label: '🧘 全息禅意曼陀罗' },

  // 🆕 全新超越级特效（2026年创作）

  // 🆕 全新超越级特效（2026年创作）
  { value: 'quantum-storm-singularity', label: '🌀 量子风暴奇点' },



  // ★★★ 超越级特效（全新突破）★★★
  { value: 'cyber-space-rift', label: '🌌 赛博时空裂缝 (优化版)' },
  { value: 'interstellar-supernova', label: '💥 星际超新星爆发 (优化版)' },
  { value: 'quantum-dream-weaver', label: '🔮 量子梦境编织' },
  { value: 'eternal-return', label: '⏳ 永恒轮回之轮 (优化版)' },
  { value: 'aurora-fantasy', label: '🌌 极光幻境' },
  { value: 'dimension-genesis', label: '🚀 维度创世交响曲' },
  { value: 'digital-life-bloom', label: '🌸 数字生命绽放' },
  // 🔮 全息投影特效系统（全新技术栈）
  { value: 'holographic-data-stream', label: '🔮 全息数据流' },
  { value: 'holographic-ring-array', label: '💫 全息环形阵列' },
  { value: 'holographic-spiral', label: '🌀 全息螺旋' },
  { value: 'holographic-sphere-array', label: '⚪ 全息球体阵列' },
  { value: 'holographic-glitch', label: '📺 全息故障艺术' },

  // 🎭 专业级全息多边形特效（全新电影级VFX）
  { value: 'holographic-polygon-prism', label: '🎭 全息多边形棱镜' },
  { value: 'holographic-geometric-nexus', label: '🔮 全息几何核心' },
  { value: 'holographic-polyphonic-matrix', label: '🎹 全息多声部矩阵' },
  { value: 'holographic-crystalline-formation', label: '💎 全息晶体形成' },
  { value: 'holographic-sacred-geometry', label: '✨ 全息神圣几何' },



  { value: 'orbital-rotation', label: '🛰️ 轨道环绕' },
  { value: 'wind-flower-snow-moon', label: '🌸 风花雪月' },


  // 🌌 超越级全息特效（次世代VFX - 奥斯卡级别）

  // { value: 'transcendent-fractal-vortex', label: '🌀 超越级分形涡流 (Shadertoy风格)' },
  // { value: 'transcendent-fractal-pyramid', label: '🔺 超越级分形金字塔 (Shadertoy风格)' },
  // { value: 'transcendent-rocaille', label: '🌀 超越级洛可可湍流 (Shadertoy风格)' },
  { value: 'transcendent-raymarching-tunnel', label: '🌀 Raymarching无限隧道 (Shadertoy风格)' },
  { value: 'transcendent-synthwave-terrain', label: '🌅 Synthwave复古地形 (增强版Vaporwave)' },
  { value: 'transcendent-vaporwave-city', label: '🌆 Vaporwave霓虹城市 (音频响应)' },
  { value: 'transcendent-consciousness', label: '🧠 超越级意识涌现 (次世代VFX)' },
  { value: 'transcendent-singularity', label: '🌌 超越级奇点全息 (次世代VFX)' },
  { value: 'transcendent-entropy', label: '⚛️ 超越级熵增奇点 (次世代VFX)' },
  { value: 'transcendent-meta-orb', label: '🌐 超越级元球体 (SDF Shadertoy)' },
  { value: 'transcendent-kaleidosphere', label: '🌌 超越级万花球 (Danilo风格)' },
  { value: 'transcendent-volumetric-cloud', label: '🌫️ 超越级体积云 (FBM Raymarching)' },
  { value: 'transcendent-sdf-architecture', label: '🏗️ 超越级SDF建筑体 (胶囊体SDF)' },
  { value: 'transcendent-fractal-hue-scape', label: '🌈 超越级分形色相风景 (YIQ色相偏移)' },
  { value: 'transcendent-ultimate-synthesis', label: '✨ 超越级终极融合 (5大技术合成)' },


  { value: 'dimensional-resonance', label: '🎼 维度共鸣交响曲 (优化版)' },
  { value: 'void-creation', label: '🌌 虚空创世交响曲 (优化版)' },
  { value: 'quantum-entanglement', label: '🔮 量子纠缠交响曲 (优化版)' },
  { value: 'cosmic-epic', label: '🌟 宇宙史诗交响曲 (优化版)' },
  { value: 'time-sand', label: '⏳ 时间之沙' },

  { value: 'fireworks-moon-night', label: '🎆 烟花月夜' },

  // 组合动画 (创新特效组合)
  { value: 'cosmic-rainfall', label: '🌌 宇宙雨落' },
  { value: 'hyperspace-portal', label: '🚪 超空间传送门' },
  { value: 'cyber-energy-explosion', label: '💥 赛博能量爆炸' },
  { value: 'galaxy-time-portal', label: '⏰ 银河时光传送门' },
  // 新增组合动画
  { value: 'crystal-aurora-dream', label: '🔮 极光水晶梦境' },
  { value: 'quantum-fire-storm', label: '🔥 量子火焰风暴' },
  { value: 'butterfly-nebula-dance', label: '🦋 蝴蝶星云之舞' },
  { value: 'ancient-lightning-awakening', label: '⚡ 远古雷电觉醒' },
  { value: 'dna-quantum-evolution', label: '🧬 DNA量子进化' },
  // 基础动画
  { value: 'spectral-waves', label: '🔮 光谱音波动画' },
  { value: 'quantum-matrix', label: '💻 量子矩阵' },
  { value: 'time-weaver', label: '⏳ 时空编织者' },
  { value: 'stellar-whisperer', label: '⭐ 星语者' },
  { value: 'galactic-vortex', label: '🌌 星际漩涡' },
  { value: 'quantum-leap', label: '🚀 量子跃迁' },

  // 其他动画
  { value: 'epic-dive', label: '🎬 史诗俯冲' },
  { value: 'space-warp', label: '🌀 空间扭曲' },
  { value: 'quantum-shift', label: '⚛️ 量子跃迁' },
  { value: 'dimension-fold', label: '🔄 维度折叠' },
  { value: 'energy-wave', label: '🌊 能量波动' },
  { value: 'dizzy-cam', label: '😵 眩晕相机' },
  { value: 'hyperspace', label: '🚀 超空间跳跃' },
  { value: 'time-rift', label: '⏱️ 时空裂缝' },
  { value: 'planet-explosion', label: '💥 星球爆炸' },
  { value: 'virtual-reality', label: '👓 虚拟现实' },
  { value: 'scene-roaming', label: '🚶 场景漫游' },

  { value: 'dimensional-portal', label: '🚪 维度传送门' },
  { value: 'time-travel', label: '⏰ 时空穿梭' },
  { value: 'time-rewind', label: '⏪ 时空逆流' },
  // 特效动画
  { value: 'particle-explosion', label: '🧨 粒子爆炸' },
  { value: 'glitch-effect', label: '📺 故障效果' },
  { value: 'crystal-shards', label: '💎 水晶碎片' },
  // { value: 'lightning-chain', label: '⚡ 闪电连锁' },
  { value: 'cherry-blossom', label: '🌸 樱花飘落' },
  { value: 'butterfly-swarm', label: '🦋 蝴蝶飞舞' },
  { value: 'ocean-aurora', label: '🌊 海洋极光' },
  { value: 'galaxy-vortex', label: '🌌 银河漩涡' },
  { value: 'aurora-fluid', label: '🎭 极光流体' },
  { value: 'nebula-vortex', label: '🌌 星云漩涡' },
  { value: 'quantum-rainbow-tunnel', label: '🌈 量子彩虹隧道' },
  { value: 'quantum-dimension-break', label: '💥 量子维度分裂' },
  { value: 'cosmic-supernova', label: '💫 宇宙超级新星' },
  { value: 'hyperspace-warp-drive', label: '🚀 超空间曲速驱动' },
  { value: 'animate-nebula-energy-burst', label: '💥 星云能量爆发' },
  { value: 'quantum-rainbow-foam', label: '🌈 彩虹量子泡沫' },
  { value: 'time-shards', label: '⏰ 时光碎片' },
  { value: 'cosmic-particle-symphony', label: '🎼 宇宙粒子交响曲' },
  { value: 'cyber-grid-city', label: '🏙️ 赛博网格城市' },
  { value: 'dna-helix', label: '🧬 DNA双螺旋' },
  { value: 'ancient-ruins', label: '🏛️ 远古遗迹' },
  { value: 'digital-rain', label: '💻 数字雨' },
  { value: 'portal-gate', label: '🚪 传送门' },
  { value: 'energy-sphere', label: '⚡ 能量球' },
  { value: 'crystal-pyramid', label: '🔮 水晶金字塔' },

  { value: 'big-bang-genesis', label: '🧨 宇宙大爆炸 (优化版)' },
  { value: 'taichi-three', label: '☯️ 太极融合特效' },
  { value: 'taichi-youth', label: '💕 青春绚丽' },
  { value: 'dewdrop-lens-prairie', label: '💧 露珠透镜草原' },
  { value: 'galaxy-butterfly', label: '🦋 银河蝴蝶' },
  { value: 'elegant-snow-moon', label: '🌙 风华雪月' },




]

const validValues = computed(() => new Set(animationOptions.map(item => item.value)))

const sanitizedValue = computed({
  get() {
    return validValues.value.has(props.modelValue) ? props.modelValue : animationOptions[0]?.value || ''
  },
  set(value) {
    if (validValues.value.has(value)) {
      emit('update:modelValue', value)
    }
  }
})

const handleChange = (value) => {

  console.log(156169, value);

  if (validValues.value.has(value)) {
    emit('change', value)
  }
}

let inx=0
let test=()=>{
  inx++
  console.log(88889, inx);
  if(inx>animationOptions.length+1){
    alert('完成')
    return
  }
  setTimeout(()=>{
    let {value} = animationOptions[inx] || {}
    if(value){
      test()
      handleChange(value)
      emit('update:modelValue', value)
    }
  },30000)

}
// test()


const resetAnimation = () => {
  emit('reset')
}

// 移除 onMounted 中的随机动画切换
// 动画应该由父组件在纹理加载完成后控制启动
// 避免在纹理未加载时触发动画导致性能问题

// 如果需要随机选择动画类型，可以在父组件中调用此函数
const selectRandomAnimation = () => {
  // const getRandomIndex = () => Math.floor(Math.random() * 9)
  const list = [
/*    'cosmic-rainfall',
    'hyperspace-portal',
    'cyber-energy-explosion',
    'galaxy-time-portal',
    'crystal-aurora-dream',
    'quantum-fire-storm',
    'butterfly-nebula-dance',
    'ancient-lightning-awakening',
    'dna-quantum-evolution'*/
    /* 'taichi-three',*/
      'holographic-neural-network',
      'wind-flower-snow-moon',
      "orbital-rotation",
  ]
  // const randomIndex = getRandomIndex()
  handleChange(list[0])
  return list[0]
}

// 暴露给父组件调用
defineExpose({
  selectRandomAnimation,
  animationSpeed,
  setAnimationSpeed: (speed) => {
    animationSpeed.value = speed
    handleSpeedChange(speed)
  }
})

</script>


<style scoped lang="scss">
.animation-selector {
  $bg-color: rgba(0, 0, 0, 0.8);
  $select-bg: rgba(14, 54, 53, 0.5);
  $select-hover-bg: rgba(9, 82, 89, 0.5);
  $border-color: rgba(255, 255, 255, 0.2);
  $focus-outline: rgba(100, 200, 255, 0.5);

  position: absolute;
  top: 20px;
  left: 20px;
  background: $bg-color;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  label {
    font-weight: 500;
    white-space: nowrap;
  }

  .speed-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
  }

  :deep(.el-slider) {
    --el-slider-main-bg-color: rgba(255, 255, 255, 0.2);
    --el-slider-runway-bg-color: rgba(255, 255, 255, 0.1);
    --el-slider-button-bg-color: #4ade80;
    --el-slider-button-hover-color: #22c55e;
    --el-slider-stop-bg-color: rgba(255, 255, 255, 0.5);

    .el-slider__button {
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .el-slider__marks-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 11px;
    }
  }

  :deep(.custom-animation-select-dropdown) {
    background: $select-bg !important;
    border: 1px solid $border-color !important;
    border-radius: 4px !important;
  }

  :deep(.el-select__wrapper) {
    background: $select-bg !important;
    border: 1px solid $border-color !important;
    border-radius: 4px !important;

    &:hover {
      box-shadow: 0 0 0 1px $select-hover-bg inset !important;
    }
  }

  :deep(.el-input__wrapper) {
    background: $select-bg !important;
    border: none !important;
    box-shadow: 0 0 0 1px $border-color inset !important;

    &:hover {
      box-shadow: 0 0 0 1px $select-hover-bg inset !important;
    }
  }

  :deep(.el-input__inner) {
    color: white !important;
    background: transparent !important;

    &::placeholder {
      color: rgba(255, 255, 255, 0.6) !important;
    }
  }

  :deep(.el-button) {
    background: $select-bg;
    color: white;
    border: 1px solid $border-color;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 12px;

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      background: $select-hover-bg;
    }

    &:focus {
      outline: 2px solid $focus-outline;
      outline-offset: 1px;
    }
  }

    // 移动端适配
  @media (max-width: 768px) {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    max-width: 450px;
    padding: 6px 10px;
    font-size: 12px;
    gap: 6px;
    height: auto;
    min-height: 32px;

    label {
      font-size: 12px;
    }

    .speed-label {
      font-size: 11px;
    }

    :deep(.el-select) {
      flex: 1 1 140px;
      min-width: 120px !important;
      max-width: 160px !important;

      :deep(.el-input__wrapper) {
        padding: 2px 5px !important;
        min-height: 26px;
      }
    }

    :deep(.el-button) {
      font-size: 12px;
      flex-shrink: 0;
      white-space: nowrap;
      height: 26px;
      padding: 0 7px !important;

      span {
        line-height: 1;
      }
    }

    :deep(.el-slider) {
      flex: 1 1 100px;
      min-width: 80px !important;
      max-width: 120px !important;

      .el-slider__button {
        width: 12px;
        height: 12px;
      }

      .el-slider__marks-text {
        font-size: 9px;
      }
    }

    :deep(.el-input-number) {
      width: 60px !important;

      .el-input__wrapper {
        padding: 2px 3px !important;
        min-height: 24px;

        .el-input__inner {
          font-size: 12px;
        }
      }
    }
  }

  // 小屏手机优化
  @media (max-width: 480px) {
    top: 8px;
    padding: 4px 6px;
    font-size: 11px;
    gap: 4px;
    max-width: 350px;
    min-height: 28px;

    label {
      display: none;
    }

    .speed-label {
      font-size: 10px;
    }

    :deep(.el-select) {
      flex: 1 1 100px;
      min-width: 90px !important;
      max-width: 120px !important;
      font-size: 10px;

      :deep(.el-input__wrapper) {
        padding: 2px 4px !important;
        min-height: 22px;
      }
    }

    :deep(.el-button) {
      font-size: 11px;
      height: 24px;
      padding: 0 6px !important;
      min-width: 36px;

      span {
        line-height: 1;
      }
    }

    :deep(.el-slider) {
      flex: 1 1 80px;
      min-width: 60px !important;
      max-width: 90px !important;

      .el-slider__button {
        width: 10px;
        height: 10px;
      }

      .el-slider__marks {
        display: none;
      }
    }
  }

  // 超小屏手机优化
  @media (max-width: 375px) {
    top: 6px;
    padding: 3px 5px;
    font-size: 10px;
    gap: 3px;
    max-width: 320px;
    border-radius: 6px;
    min-height: 26px;

    label {
      display: none;
    }

    .speed-label {
      display: none;
    }

    :deep(.el-select) {
      flex: 1 1 80px;
      min-width: 70px !important;
      max-width: 90px !important;
      font-size: 10px;

      :deep(.el-input__wrapper) {
        padding: 1px 3px !important;
        min-height: 20px;
      }
    }

    :deep(.el-button) {
      font-size: 10px;
      height: 22px;
      padding: 0 5px !important;
      min-width: 34px;

      span {
        line-height: 1;
      }
    }

    :deep(.el-slider) {
      flex: 1 1 60px;
      min-width: 50px !important;
      max-width: 70px !important;

      .el-slider__button {
        width: 9px;
        height: 9px;
      }

      .el-slider__marks {
        display: none;
      }
    }
  }

  // 横屏模式优化
  @media (max-width: 768px) and (orientation: landscape) {
    top: 8px;
    padding: 4px 6px;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 4px;
    min-height: 30px;

    label {
      display: none;
    }

    .speed-label {
      font-size: 10px;
    }

    :deep(.el-select) {
      flex: 1 1 120px;
      min-width: 100px !important;
      max-width: 140px !important;

      :deep(.el-input__wrapper) {
        padding: 2px 5px !important;
        min-height: 24px;
      }
    }

    :deep(.el-button) {
      height: 24px;
      padding: 0 7px !important;

      span {
        line-height: 1;
      }
    }

    :deep(.el-slider) {
      flex: 1 1 100px;
      min-width: 80px !important;
      max-width: 120px !important;

      .el-slider__button {
        width: 11px;
        height: 11px;
      }

      .el-slider__marks {
        display: none;
      }
    }
  }

  // 触摸设备优化
  @media (hover: none) and (pointer: coarse) {
    :deep(.el-button) {
      -webkit-tap-highlight-color: transparent;
      user-select: none;

      &:active {
        opacity: 0.7;
        transform: scale(0.95);
        transition: all 0.1s ease;
      }
    }

    :deep(.el-select__wrapper) {
      -webkit-tap-highlight-color: transparent;
    }
  }
}
</style>

<!-- 全局样式，专门用于覆盖下拉菜单样式 -->
<style lang="scss">
.custom-animation-select-dropdown {
  background: rgba(14, 54, 53, 0.5) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 4px !important;

  .el-select-dropdown__list {
    padding: 4px 0 !important;
  }

  .el-select-dropdown__item {
    color: white !important; /* 确保未选中项为白色 */
    background: transparent !important;
    margin: 2px 4px !important;
    border-radius: 3px !important;

    &:not(.selected):not([aria-selected="true"]):hover,
    &:not(.selected):not([aria-selected="true"]).hover {
      background: rgba(9, 82, 89, 0.5) !important;
      color: white !important; /* 确保悬停时文字仍为白色 */
    }

    &.selected,
    &.selected.hover,
    &[aria-selected="true"] {
      background: rgba(9, 82, 89, 0.8) !important;
      color: #f5d60a !important; /* 选中项为亮黄色 */
      font-weight: bold;
    }

    &.is-disabled {
      color: rgba(255, 255, 255, 0.4) !important;
      background: transparent !important;
    }
  }

  // 移动端下拉菜单优化
  @media (max-width: 768px) {
    .el-select-dropdown__list {
      max-height: 250px !important;
      padding: 3px 0 !important;
    }

    .el-select-dropdown__item {
      font-size: 13px;
      padding: 8px 12px !important;
      margin: 1px 3px !important;
      min-height: 44px;
      display: flex;
      align-items: center;
    }
  }

  // 小屏手机下拉菜单优化
  @media (max-width: 480px) {
    .el-select-dropdown__list {
      max-height: 200px !important;
    }

    .el-select-dropdown__item {
      font-size: 12px;
      padding: 6px 10px !important;
      min-height: 40px;
    }
  }
}
</style>
