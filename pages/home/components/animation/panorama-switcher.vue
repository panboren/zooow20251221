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
      :pause-on-hover="false"
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
          lazy
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

const emits = defineEmits(['prevPanorama', 'nextPanorama', 'change'])
const currentPanorama = defineModel()
const loading = ref(false)

// 全景图选项数组 - 带 target 字段控制最终定格位置
const homeOptions = [
  {
    id: 1,
    image: homeImage1,
    title: 'Home 1',
    description: 'This is the first home image',
    target: {
      x: 7.9,
      y: -2.6,
      z: 4.0,
    }, // 最终定格位置
  },
  {
    id: 2,
    image: homeImage2,
    title: 'Home 2',
    description: 'This is the second home image',
    target: { x: 18, y: -1.2, z: 1 },
  },
  {
    id: 3,
    image: homeImage3,
    title: 'Home 3',
    description: 'This is the third home image',
    target: { x: 12, y: -2.9, z: -7.55 },
  },

  {
    id: 4,
    image: homeImage4,
    title: 'Home 4',
    description: 'This is the fourth home image',
    target: { x: -0.77, y: -5.3, z: 23.22 },
  },
  {
    id: 5,
    image: homeImage5,
    title: 'Home 5',
    description: 'This is the fifth home image',
    target: { x: 11.65, y: -2.3, z: 4.5 },
  },
  {
    id: 6,
    image: homeImage6,
    title: 'Home 6',
    description: 'This is the sixth home image',
    target: { x: 18.5, y: -5.5, z: -6.33 },
  },
  {
    id: 7,
    image: homeImage7,
    title: 'Home 7',
    description: 'This is the seventh home image',
    target: { x: 15, y: -3.1, z: 3.8 },
  },
  {
    id: 8,
    image: homeImage8,
    title: 'Home 8',
    description: 'This is the eighth home image',
    target: { x: 19.7, y: 1.36, z: -0.52 },
  },
  {
    id: 9,
    image: homeImage9,
    title: 'Home 9',
    description: 'This is the ninth home image',
    target: { x: 12.57, y: 0.04, z: 1.97 },
  },
  {
    id: 10,
    image: homeImage10,
    title: 'Home 10',
    description: 'This is the tenth home image',
    target: { x: 21, y: -3.8, z: 14 },
  },
  {
    id: 11,
    image: homeImage11,
    title: 'Home 11',
    description: 'This is the eleventh home image',
    target: { x: 1.25, y: -1.52, z: -9.7 },
  },
]

const changePanorama = (item) => {
  currentPanorama.value = item
  emits('change', item)
}

onMounted(() => {
  if (homeOptions.length > 0) {
    const item = homeOptions[0] || {}
    changePanorama(item)

    loading.value = false
    const timer = setTimeout(() => {
      clearTimeout(timer)
      loading.value = true
    }, 5000)
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
}
</style>
