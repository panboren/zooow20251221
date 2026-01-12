<template>
  <!-- 全景图切换器 -->
  <div
    v-if="homeOptions.length > 0 && loading"
    class="panorama-switcher"
  >
    <!-- 左箭头 -->
    <button
      class="arrow-btn arrow-left"
      @click="scrollLeft"
      :disabled="isAtStart"
      aria-label="向左滚动"
    >
      ‹
    </button>

    <!-- 滚动容器 -->
    <div
      class="scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <div class="scroll-content">
        <el-image
          v-for="(item, index) in homeOptions"
          :key="item.id + '_' + index"
          class="panorama-description-img"
          :class="{ activated: currentPanorama.id === item.id }"
          :src="item.image"
          :alt="item.title"
          :lazy="index > 5"
          fit="contain"
          @click="changePanorama(item)"
        >
          <template #placeholder>
            <div class="image-slot">
              加载中...
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              加载失败
            </div>
          </template>
        </el-image>
      </div>
    </div>

    <!-- 右箭头 -->
    <button
      class="arrow-btn arrow-right"
      @click="scrollRight"
      :disabled="isAtEnd"
      aria-label="向右滚动"
    >
      ›
    </button>
  </div>
</template>

<script setup>
// 使用外部图片路径（不打包）
const getImageUrl = (name) => `/images/${name}`

const emits = defineEmits(['prevPanorama', 'nextPanorama', 'change'])
const currentPanorama = defineModel()
const loading = ref(false)
let list=[
  { x: 7.9, y: -2.6, z: 4 },
  { x: 18, y: -1.2, z: 1 },
  { x: 12, y: -2.9, z: -7.55 },
  { x: -0.77, y: -5.3, z: 23.22 },
  { x: 11.65, y: -2.3, z: 4.5 },
  { x: 18.5, y: -5.5, z: -6.33 },
  { x: 15, y: -3.1, z: 3.8 },
  { x: 19.7, y: 1.36, z: -0.52 },
  { x: 12.57, y: 0.04, z: 1.97 },
  { x: 21, y: -3.8, z: 14 },
  { x: 1.25, y: -1.52, z: -9.7 }
]



// 全景图选项数组 - 带 target 字段控制最终定格位置
const homeOptions = [
 /* {
    id: 1,
    image: getImageUrl('home1.png'),
    icon: getImageUrl('home1-a.png'),
    title: 'Home 1',
    description: 'This is the first home image',
    target: {
      x: 7.9,
      y: -2.6,
      z: 4.0,
    }, // 最终定格位置
  },*/
]

for (let i = 1; i <= 37; i++) {
  homeOptions.push( {
    id: i,
    image: getImageUrl(`h-${i}.png`),
    icon: getImageUrl(`h-${i}-a.png`),
    title: 'Home'+i,
    description: 'home'+i,
    target: list[i-1] || {
      x: 7.9,
      y: -2.6,
      z: 4.0,
    }, // 最终定格位置
  })
}

const changePanorama = (item) => {
  currentPanorama.value = item
  emits('change', item)
}

// 滚动相关
const scrollContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const handleScroll = () => {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  isAtStart.value = container.scrollLeft <= 0
  isAtEnd.value = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1
}

const scrollLeft = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.8
  scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

const scrollRight = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.8
  scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

// 支持滚轮横向滚动
const handleWheel = (e) => {
  if (!scrollContainer.value) return
  e.preventDefault()
  scrollContainer.value.scrollLeft += e.deltaY
}

onMounted(() => {
  if (homeOptions.length > 0) {

    const randomNumber = Math.floor(Math.random() * 37) + 1;

    const item = homeOptions[randomNumber] || {}
    changePanorama(item)

    loading.value = false
    const timer = setTimeout(() => {
      clearTimeout(timer)
      loading.value = true
    }, 9000)
  }
})
</script>

<style scoped lang="scss">
.panorama-switcher {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 600px;
  height: 100px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 10px 35px; /* 左右留出箭头空间 */
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;

  // 箭头按钮
  .arrow-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1.1);
    }

    &:active:not(:disabled) {
      transform: translateY(-50%) scale(0.95);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &.arrow-left {
      left: 5px;
    }

    &.arrow-right {
      right: 5px;
    }
  }

  // 滚动容器
  .scroll-container {
    padding: 5px;
    flex: 1;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    // 自定义滚动条
    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;

      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    }

    // 隐藏滚动条但保持滚动功能
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }

  // 滚动内容
  .scroll-content {
    display: flex;
    gap: 10px;
    height: 100%;
    padding: 0 5px;
    align-items: center; // 垂直居中
  }

  .image-slot {
    padding-top: 10px;
    color: rgba(250, 247, 247, 0.28);
    font-size: 12px;
  }

  .panorama-description-img {
    flex-shrink: 0;
    width: 133px; /* 根据容器宽度动态计算 */
    height: 100%;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;

    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    :deep(.el-image__placeholder),
    :deep(.el-image__error) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 12px;
    }

    &.activated {
      position: relative;
      border: 2px solid #f5d60a;
      box-sizing: border-box;

      // 使用伪元素作为边框，确保完整显示
     /* &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid #f5d60a;
        border-radius: 8px;
        pointer-events: none;
        box-sizing: border-box;
      }*/
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  // 平板设备优化
  @media (max-width: 1024px) {
    width: 500px;
    height: 90px;
    padding: 8px 30px;
    bottom: 15px;

    .arrow-btn {
      width: 26px;
      height: 26px;
      font-size: 18px;
    }

    .panorama-description-img {
      width: 111px;
      height: 90px;
    }
  }

  // 移动设备优化
  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    height: 80px;
    padding: 6px 28px;
    bottom: 20px;
    left: 50%;

    .arrow-btn {
      width: 24px;
      height: 24px;
      font-size: 16px;

      &.arrow-left {
        left: 4px;
      }

      &.arrow-right {
        right: 4px;
      }
    }

    .scroll-container::-webkit-scrollbar {
      height: 3px;
    }

    .panorama-description-img {
      width: 100px;
      height: 80px;

      &.activated {
        border-width: 3px;
      }
    }

    .image-slot {
      font-size: 10px;
      padding-top: 8px;
    }
  }

  // 小屏手机优化
  @media (max-width: 480px) {
    width: 95%;
    max-width: 350px;
    height: 70px;
    padding: 5px 25px;
    bottom: 15px;

    .arrow-btn {
      width: 22px;
      height: 22px;
      font-size: 14px;

      &.arrow-left {
        left: 3px;
      }

      &.arrow-right {
        right: 3px;
      }
    }

    .scroll-container::-webkit-scrollbar {
      height: 2px;
    }

    .panorama-description-img {
      width: 88px;
      height: 70px;

      &.activated {
        border-width: 3px;
      }
    }

    .image-slot {
      font-size: 9px;
      padding-top: 6px;
    }
  }

  // 超小屏手机优化
  @media (max-width: 375px) {
    width: 98%;
    max-width: 320px;
    height: 60px;
    padding: 4px 22px;
    bottom: 10px;

    .arrow-btn {
      width: 20px;
      height: 20px;
      font-size: 12px;

      &.arrow-left {
        left: 2px;
      }

      &.arrow-right {
        right: 2px;
      }
    }

    .scroll-container::-webkit-scrollbar {
      display: none;
    }

    .panorama-description-img {
      width: 80px;
      height: 60px;

      &.activated {
        border-width: 2px;
      }
    }

    .image-slot {
      font-size: 8px;
      padding-top: 5px;
    }
  }

  // 触摸设备优化
  @media (hover: none) and (pointer: coarse) {
    // 隐藏箭头按钮，使用手势滑动
    .arrow-btn {
      display: none;
    }

    // 减小左右padding，增加滚动区域
    padding-left: 10px;
    padding-right: 10px;

    // 增加触摸目标大小
    .panorama-description-img {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:active {
        opacity: 0.8;
        transform: scale(0.95);
        transition: all 0.1s ease;
      }
    }
  }

  // 横屏模式优化
  @media (max-width: 768px) and (orientation: landscape) {
    top: 10px;
    bottom: auto;
    height: 60px;
    padding: 4px 28px;
  }
}
</style>
