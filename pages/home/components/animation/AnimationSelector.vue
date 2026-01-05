<!-- src/components/AnimationSelector.vue -->
<template>
  <div
    class="animation-selector"
    role="region"
    aria-label="动画控制"
  >
    <label for="animation-type">动画类型:</label>
    <select
      id="animation-type"
      :value="modelValue"
      aria-label="选择开场动画类型"
      @change="handleChange"
    >
      <option
        v-for="animation in animationOptions"
        :key="animation.value"
        :value="animation.value"
      >
        {{ animation.label }}
      </option>
    </select>
    <button
      aria-label="重新播放动画"
      @click="resetAnimation"
    >
      重新播放
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'reset', 'change'])

// 动画选项数组 - 使用 v-for 渲染
// 修改animationOptions数组，添加新的动画类型
// 动画选项数组 - 使用 v-for 渲染
const animationOptions = ref([
  { value: 'epic-dive', label: '史诗俯冲' },
  { value: 'space-warp', label: '空间扭曲' },
  { value: 'matrix-hack', label: '黑客帝国' },
  { value: 'quantum-shift', label: '量子跃迁' },
  { value: 'dimension-fold', label: '维度折叠' },
  { value: 'energy-wave', label: '能量波动' },
  { value: 'dizzy-cam', label: '眩晕相机' },
  { value: 'hyperspace', label: '超空间跳跃' },
  { value: 'time-rift', label: '时空裂缝' },
  { value: 'planet-explosion', label: '星球爆炸' },
  { value: 'quantum-entanglement', label: '量子纠缠' },
  { value: 'virtual-reality', label: '虚拟现实' },
  { value: 'scene-roaming', label: '场景漫游' },
  { value: 'orbital-rotation', label: '轨道环绕' },
  { value: 'dimensional-portal', label: '维度传送门' },
  { value: 'time-travel', label: '时空穿梭' },
  { value: 'black-hole', label: '黑洞吞噬' },
  { value: 'cosmic-big-bang', label: '宇宙大爆炸' },
  { value: 'dimension-collapse', label: '维度崩溃' },
  { value: 'time-rewind', label: '时空逆流' },
  // 新增高级特效
  { value: 'particle-explosion', label: '🧨 粒子爆炸' },
  { value: 'glitch-effect', label: '📺 故障效果' },
  { value: 'fire-storm', label: '🔥 火焰风暴' },
  { value: 'tunnel-effect', label: '🌀 时空隧道' },
  { value: 'crystal-shards', label: '💎 水晶碎片' },
  { value: 'lightning-chain', label: '⚡ 闪电连锁' },
  { value: 'cherry-blossom', label: '🌸 樱花飘落' },
  { value: 'butterfly-swarm', label: '🦋 蝴蝶飞舞' },
  { value: 'ocean-aurora', label: '🌊 海洋极光' },
  { value: 'galaxy-vortex', label: '🌌 银河漩涡' },
  { value: 'aurora-fluid', label: '🎭 极光流体' },
  { value: 'nebula-vortex', label: '🌌 星云漩涡' },
  { value: 'quantum-rainbow-tunnel', label: '🌈 量子彩虹隧道' },
  { value: 'energy-pulse-ring', label: '💥 能量脉冲环' },
  { value: 'quantum-dimension-break', label: '量子维度分裂动画' },
  { value: 'cosmic-supernova', label: '宇宙超级新星爆炸动画' },
  { value: 'hyperspace-warp-drive', label: '超空间曲速驱动动画' },
  { value: 'animate-nebula-energy-burst', label: '星云能量爆发动画' },
  { value: 'quantum-rainbow-foam', label: '🌈 彩虹量子泡沫' },
  { value: 'time-shards', label: '⏰ 时光碎片' },
  { value: 'cosmic-particle-symphony', label: '🌌 宇宙粒子交响曲' }




])




const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}

const resetAnimation = () => {
  emit('reset')
}
</script>

<style scoped lang="scss">
.animation-selector {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
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

  select, button {
    background: rgba(14, 54, 53, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(9, 82, 89, 0.5);
    }

    &:focus {
      outline: 2px solid rgba(100, 200, 255, 0.5);
      outline-offset: 1px;
    }
  }

  select {
    min-width: 120px;
  }
}
</style>
