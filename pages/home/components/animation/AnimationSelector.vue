<template>
  <div
      class="animation-selector"
      role="region"
      aria-label="动画控制"
  >
    <label for="animation-type">动画类型:</label>

    <el-select
        style="width: 200px;"
        :model-value="sanitizedValue"
        @update:model-value="handleModelUpdate"
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
  </div>
</template>


<script setup>
import { computed, ref } from 'vue'  // 添加 ref 导入
import {isPc} from '../../../../utils/index.js'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

// 判断是否为PC端环境
let isPcEnvironment = ref(isPc())
const emit = defineEmits(['update:modelValue', 'reset', 'change'])

// 动画选项数组 - 只包含实际存在的动画
const animationOptions = [
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
  { value: 'dimensional-resonance', label: '🎼 维度共鸣交响曲' },
  { value: 'void-creation', label: '🌌 虚空创世交响曲' },
  { value: 'quantum-entanglement', label: '🔮 量子纠缠交响曲' },
  { value: 'cosmic-epic', label: '🌟 宇宙史诗交响曲' },
  { value: 'time-sand', label: '⏳ 时间之沙' },
  { value: 'wind-flower-snow-moon', label: '🌸 风花雪月' },
  { value: 'fireworks-moon-night', label: '🎆 烟花月夜' },
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
  { value: 'orbital-rotation', label: '🛰️ 轨道环绕' },
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
]

const validValues = computed(() => new Set(animationOptions.map(item => item.value)))

const sanitizedValue = computed(() => {
  return validValues.value.has(props.modelValue) ? props.modelValue : animationOptions[0]?.value || ''
})

const handleModelUpdate = (value) => {
  if (validValues.value.has(value)) {
    emit('update:modelValue', value)
  }
}

const handleChange = (value) => {
  if (validValues.value.has(value)) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}

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
      'dimensional-resonance'
  ]
  // const randomIndex = getRandomIndex()
  handleChange(list[0])
  return list[0]
}

// 暴露给父组件调用
defineExpose({
  selectRandomAnimation,
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

  label {
    font-weight: 500;
    white-space: nowrap;
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
    position: fixed;  // 改为固定定位便于居中
    top: 10px;
    left: 50%;
    transform: translateX(-50%);  // 实现居中
    width: 85vw;      // 宽度调整为视窗宽度的85%
    max-width: 300px; // 限制最大宽度
    padding: 4px 8px; // 减少内边距
    font-size: 12px;   // 字体缩小
    gap: 5px;
    height: auto;
    min-height: 32px;

    // 调整子元素尺寸
    label {
      font-size: 12px;
    }

    :deep(.el-select) {
      flex: 1;  // 使用 flex 布局自适应
      min-width: 120px !important;
      max-width: none !important;

      :deep(.el-input__wrapper) {
        padding: 2px 5px !important; // 减少输入框内边距
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
  }

  // 小屏手机优化
  @media (max-width: 480px) {
    top: 8px;
    padding: 3px 6px;
    font-size: 11px;
    gap: 4px;
    max-width: 280px;
    min-height: 28px;

    label {
      display: none;
    }

    :deep(.el-select) {
      flex: 1;
      min-width: 100px !important;
      max-width: none !important;
      font-size: 11px;

      :deep(.el-input__wrapper) {
        padding: 2px 4px !important;
        min-height: 24px;
      }
    }

    :deep(.el-button) {
      font-size: 11px;
      height: 24px;
      padding: 0 6px !important;
      min-width: 40px;

      span {
        line-height: 1;
      }
    }
  }

  // 超小屏手机优化
  @media (max-width: 375px) {
    top: 6px;
    padding: 3px 5px;
    font-size: 10px;
    gap: 3px;
    max-width: 260px;
    border-radius: 6px;
    min-height: 26px;

    label {
      display: none;
    }

    :deep(.el-select) {
      flex: 1;
      min-width: 90px !important;
      max-width: none !important;
      font-size: 10px;

      :deep(.el-input__wrapper) {
        padding: 1px 4px !important;
        min-height: 22px;
      }
    }

    :deep(.el-button) {
      font-size: 10px;
      height: 22px;
      padding: 0 5px !important;
      min-width: 36px;

      span {
        line-height: 1;
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

    :deep(.el-select) {
      flex: 1;
      min-width: 150px !important;
      max-width: none !important;

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
