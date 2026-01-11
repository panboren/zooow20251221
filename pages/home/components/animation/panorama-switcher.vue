<template>
  <!-- 全景图切换器 -->
  <div
    v-if="homeOptions.length > 0 && loading"
    class="panorama-switcher"
  >
    <el-carousel
      :autoplay="false"
      type="card"
      height="auto"
      indicator-position="none"
      :pause-on-hover="true"
    >
      <el-carousel-item
        v-for="(item, index) in homeOptions"
        :key="item.id+ '_'+index"
      >
        <el-image
          class="panorama-description-img"
          :class="{ activated: currentPanorama.id === item.id }"
          :src="item.image"
          :alt="item.title"
          :lazy="index > 2"
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
      </el-carousel-item>
    </el-carousel>
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
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  transition: all 0.3s ease;

  .image-slot {
    padding-top: 10px;
    color: rgba(250, 247, 247, 0.28);
    font-size: 12px;
  }

  :deep(.el-carousel__container) {
    height: 100px !important;
  }

  :deep(.el-carousel__item) {
    .panorama-description-img {
      width: 100%;
      height: 100%;
      border-radius: 8px;

      :deep(.el-image__inner) {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
    }
  }

  .panorama-description-img {
    width: 100%;
    height: 100px;

    &.activated {
      border: 2px solid #f5d60a;
      box-sizing: border-box;
    }
  }

  // 平板设备优化
  @media (max-width: 1024px) {
    width: 500px;
    height: 90px;
    padding: 8px;
    bottom: 15px;

    :deep(.el-carousel__container) {
      height: 90px !important;
    }

    .panorama-description-img {
      height: 90px;
    }
  }

  // 移动设备优化
  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    height: 80px;
    padding: 6px;
    bottom: 20px;
    left: 50%;

    :deep(.el-carousel__container) {
      height: 80px !important;
    }

    .panorama-description-img {
      height: 80px;
    }

    .image-slot {
      font-size: 10px;
      padding-top: 8px;
    }

    // 移动端触摸优化
    .panorama-description-img {
      &.activated {
        border-width: 3px; // 移动端加粗边框，更明显
      }
    }

    // 移动端箭头按钮显示
    :deep(.el-carousel__arrow) {
      display: flex !important;
      width: 32px;
      height: 32px;
      background-color: rgba(0, 0, 0, 0.7) !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 16px;

      &.el-carousel__arrow--left {
        left: 5px !important;
      }

      &.el-carousel__arrow--right {
        right: 5px !important;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }

  // 小屏手机优化
  @media (max-width: 480px) {
    width: 95%;
    max-width: 350px;
    height: 70px;
    padding: 5px;
    bottom: 15px;

    :deep(.el-carousel__container) {
      height: 70px !important;
    }

    .panorama-description-img {
      height: 70px;
    }

    .image-slot {
      font-size: 9px;
      padding-top: 6px;
    }

    // 移动端箭头按钮显示
    :deep(.el-carousel__arrow) {
      display: flex !important;
      width: 28px;
      height: 28px;
      background-color: rgba(0, 0, 0, 0.7) !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 14px;

      &.el-carousel__arrow--left {
        left: 4px !important;
      }

      &.el-carousel__arrow--right {
        right: 4px !important;
      }
    }
  }

  // 超小屏手机优化
  @media (max-width: 375px) {
    width: 98%;
    max-width: 320px;
    height: 60px;
    padding: 4px;
    bottom: 10px;

    :deep(.el-carousel__container) {
      height: 60px !important;
    }

    .panorama-description-img {
      height: 60px;
    }

    .image-slot {
      font-size: 8px;
      padding-top: 5px;
    }

    // 移动端箭头按钮显示
    :deep(.el-carousel__arrow) {
      display: flex !important;
      width: 26px;
      height: 26px;
      background-color: rgba(0, 0, 0, 0.7) !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 12px;

      &.el-carousel__arrow--left {
        left: 3px !important;
      }

      &.el-carousel__arrow--right {
        right: 3px !important;
      }
    }
  }

  // 触摸设备优化
  @media (hover: none) and (pointer: coarse) {
    // 增加触摸目标大小
    .panorama-description-img {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:active {
        opacity: 0.8;
        transform: scale(0.98);
        transition: all 0.1s ease;
      }
    }
  }
}
</style>
