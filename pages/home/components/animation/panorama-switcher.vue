<template>
  <!-- 全景图切换器 -->
  <div
    v-if="!isLoading && homeOptions.length > 0"
    class="panorama-switcher"
  >
    <button
      class="switch-button prev-button"
      :disabled="isChangingPanorama || homeOptions.length <= 1"
      title="上一张 (←)"
      @click="prevPanorama"
    >
      <span class="arrow">‹</span>
    </button>
    <div class="panorama-info">
      <div class="panorama-description">
        <!--        {{ currentPanorama.description }}-->
        <img
          class="panorama-description-img"
          :src="currentPanorama.image"
          :alt="currentPanorama.title"
        >
      </div>
      <div class="panorama-title">
        {{ currentPanorama.title }}
      </div>
      <div class="panorama-index">
        {{ currentPanoramaIndex + 1 }} / {{ homeOptions.length }}
      </div>
    </div>
    <button
      class="switch-button next-button"
      :disabled="isChangingPanorama || homeOptions.length <= 1"
      title="下一张 (→)"
      @click="nextPanorama"
    >
      <span class="arrow">›</span>
    </button>
  </div>
</template>
<script setup>
let props = defineProps({
  isChangingPanorama: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
let emits = defineEmits(['prevPanorama', 'nextPanorama','change'])
let currentPanoramaIndex = ref(0)
let currentPanorama = defineModel()
// 导入全景图资源
import homeImage1 from '~/assets/image/home1.png'
import homeImage2 from '~/assets/image/home2.png'
import homeImage3 from '~/assets/image/home3.png'
import homeImage4 from '~/assets/image/home4.png'
import homeImage5 from '~/assets/image/home5.png'
import homeImage6 from '~/assets/image/home6.png'
import homeImage7 from '~/assets/image/home7.png'
import homeImage8 from '~/assets/image/home8.png'
import homeImage9 from '~/assets/image/home9.png'
import homeImage10 from '~/assets/image/home10.png'
import homeImage11 from '~/assets/image/home11.png'

// 全景图选项数组 - 带 target 字段控制最终定格位置
const homeOptions = [
  {
    image: homeImage1,
    title: 'Home 1',
    description: 'This is the first home image',
    target: {
      x: 7.9,
      y: -2.6,
      z: 4.0
    }  // 最终定格位置
  },
  {
    image: homeImage2,
    title: 'Home 2',
    description: 'This is the second home image',
    target: { x: 18, y: -1.2, z: 1 }
  },
  {
    image: homeImage3,
    title: 'Home 3',
    description: 'This is the third home image',
    target: { x: 12, y: -2.9, z: -7.55 }
  },


  {
    image: homeImage4,
    title: 'Home 4',
    description: 'This is the fourth home image',
    target: { x: -0.77, y: -5.3, z: 23.22 }
  },
  {
    image: homeImage5,
    title: 'Home 5',
    description: 'This is the fifth home image',
    target: { x:11.65, y: -2.3, z: 4.5 }
  },
  {
    image: homeImage6,
    title: 'Home 6',
    description: 'This is the sixth home image',
    target: { x: 18.5, y: -5.5, z: -6.33 }
  },
  {
    image: homeImage7,
    title: 'Home 7',
    description: 'This is the seventh home image',
    target: { x: 15, y: -3.1, z: 3.8 }
  },
  {
    image: homeImage8,
    title: 'Home 8',
    description: 'This is the eighth home image',
    target: { x: 19.7, y: 1.36, z: -0.52 }
  },
  {
    image: homeImage9,
    title: 'Home 9',
    description: 'This is the ninth home image',
    target: { x: 12.57, y: 0.04, z: 1.97 }
  },
  {
    image: homeImage10,
    title: 'Home 10',
    description: 'This is the tenth home image',
    target: { x: 21, y: -3.8, z: 14 }
  },
  {
    image: homeImage11,
    title: 'Home 11',
    description: 'This is the eleventh home image',
    target: { x: 1.25, y: -1.52, z: -9.7 }
  }
]


/**
 * 切换到下一个全景图
 */
const nextPanorama = () => {
  if (homeOptions.length === 0) return

  const nextIndex = (currentPanoramaIndex.value + 1) % homeOptions.length
  let cur = homeOptions[nextIndex] || {}

  currentPanoramaIndex.value = nextIndex

  currentPanorama.value = cur
  emits('nextPanorama',cur,nextIndex)
  emits('change',cur,nextIndex)
}

/**
 * 切换到上一个全景图
 */
const prevPanorama = () => {
  if (homeOptions.length === 0) return

  const prevIndex = (currentPanoramaIndex.value - 1 + homeOptions.length) % homeOptions.length
  let cur = homeOptions[prevIndex] || {}
  currentPanoramaIndex.value = prevIndex
  currentPanorama.value = cur
  emits('prevPanorama',cur,prevIndex)
  emits('change',cur, prevIndex)
}


onMounted(() => {
  if (homeOptions.length > 0) {
    currentPanoramaIndex.value = 0
    currentPanorama.value = homeOptions[0]
  }
})
</script>

<style scoped lang="scss">

// 全景图切换器样式
.panorama-switcher {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 8px 15px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
  }


  // 移动端优化
  @media (max-width: 768px) {
    bottom: 60px;
    padding: 10px 16px;
    gap: 12px;
  }
}

.switch-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  outline: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .arrow {
    line-height: 1;
    display: block;
  }
}

.panorama-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 200px;



  .panorama-description {
    position: relative;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    text-align: center;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .panorama-description-img{
      display: inline-block;
      width: 150px;
      height: 80px;
      border-radius: 5px;
    }
  }
  .panorama-title {
    position: absolute;
    top: 30%;
    color: white;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  .panorama-index {
    position: absolute;
    bottom: 20px;
    color: rgb(63, 194, 217);
    font-size: 16px;
  }
}
// 移动端优化
@media (max-width: 768px) {
  .switch-button {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .panorama-info {
    min-width: 120px;

    .panorama-title {
      font-size: 14px;
    }

    .panorama-description {
      font-size: 10px;
      max-width: 150px;
    }
  }
}

</style>
