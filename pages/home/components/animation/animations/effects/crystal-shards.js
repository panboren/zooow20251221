/**
 * effects/crystal-shards.js
 * 水晶碎片爆炸特效 - 使用反射材质和碰撞检测
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 水晶颜色调色板（自然的宝石色）
 */
const CRYSTAL_COLORS = [
  { name: '钻石', color: new THREE.Color(0xe0f7fa), emissive: new THREE.Color(0xe0f7fa) },
  { name: '海蓝宝', color: new THREE.Color(0x40e0d0), emissive: new THREE.Color(0x20a0b0) },
  { name: '紫水晶', color: new THREE.Color(0x9b59b6), emissive: new THREE.Color(0x6a0dad) },
  { name: '粉水晶', color: new THREE.Color(0xffb6c1), emissive: new THREE.Color(0xff69b4) },
  { name: '黄水晶', color: new THREE.Color(0xffd700), emissive: new THREE.Color(0xffa500) },
  { name: '翡翠', color: new THREE.Color(0x00ff7f), emissive: new THREE.Color(0x00cd6c) },
  { name: '红宝石', color: new THREE.Color(0xdc143c), emissive: new THREE.Color(0x8b0000) },
  { name: '蓝宝石', color: new THREE.Color(0x0077be), emissive: new THREE.Color(0x00477d) },
  { name: '紫翠玉', color: new THREE.Color(0x00ffbf), emissive: new THREE.Color(0x009970) },
  { name: '月光石', color: new THREE.Color(0xf5f5f5), emissive: new THREE.Color(0xe8e8e8) }
]

/**
 * 生成水晶颜色（带自然变化）
 * @param {Object} crystalInfo - 水晶颜色信息
 * @returns {Object} 颜色和发光属性
 */
function generateCrystalColor() {
  const crystal = CRYSTAL_COLORS[Math.floor(Math.random() * CRYSTAL_COLORS.length)]

  // 获取基础颜色的HSL
  const hsl = {}
  crystal.color.getHSL(hsl)

  // 轻微变化（保持水晶的自然感）
  const variation = 0.05
  const newHue = (hsl.h + (Math.random() - 0.5) * variation) % 1
  const newSat = Math.min(1, Math.max(0.3, hsl.s + (Math.random() - 0.5) * variation))
  const newLight = Math.min(1, Math.max(0.4, hsl.l + (Math.random() - 0.5) * variation * 0.5))

  const color = new THREE.Color()
  color.setHSL(newHue, newSat, newLight)

  // 生成对应的自发光颜色（比基础颜色更深）
  const emissiveColor = crystal.emissive.clone()
  emissiveColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.2)

  return {
    color,
    emissive: emissiveColor,
    emissiveIntensity: 0.1 + Math.random() * 0.2
  }
}

/**
 * 创建水晶材质
 * @param {Object} colorInfo - 颜色信息
 * @returns {THREE.MeshPhysicalMaterial} 水晶材质
 */
function createCrystalMaterial(colorInfo) {
  return new THREE.MeshPhysicalMaterial({
    color: colorInfo.color,
    metalness: 0.1,           // 低金属度，更像水晶
    roughness: 0.1,           // 非常光滑
    transmission: 0.95,         // 高透明度，像玻璃
    thickness: 3.0,            // 厚度，产生折射
    ior: 1.5,                 // 折射率，水晶的标准值
    reflectivity: 0.9,          // 反射率
    clearcoat: 1.0,            // 清漆层，增加光泽
    clearcoatRoughness: 0.05,   // 清漆层光滑
    attenuationColor: colorInfo.color,  // 光线衰减颜色
    attenuationDistance: 3.0,   // 光线衰减距离
    side: THREE.DoubleSide,
    emissive: colorInfo.emissive,
    emissiveIntensity: colorInfo.emissiveIntensity,
    transparent: true,
    opacity: 0.9
  })
}

/**
 * 创建水晶碎片
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 碎片对象
 */
export function createCrystalShards(scene, options = {}) {
  const {
    count = 100,
    size = 2,
    color = new THREE.Color(0xe0f7fa),
    explosionForce = 50,
    colorful = true
  } = options

  const shards = []
  const geometries = [
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0)
  ]

  // 创建碎片
  for (let i = 0; i < count; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)].clone()
    const scale = size * (0.5 + Math.random() * 0.5)
    geometry.scale(scale, scale, scale)

    // 生成水晶颜色
    const colorInfo = colorful ? generateCrystalColor() : {
      color: color,
      emissive: color.clone(),
      emissiveIntensity: 0.15
    }

    const material = createCrystalMaterial(colorInfo)

    const shard = new THREE.Mesh(geometry, material)

    // 初始位置（聚集在中心）
    shard.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    )

    // 随机旋转
    shard.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )

    // 保存速度和角速度
    const direction = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize()

    const velocity = direction.multiplyScalar(explosionForce * (0.5 + Math.random()))
    const angularVelocity = new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    )

    shard.userData = {
      velocity,
      angularVelocity,
      originalPosition: shard.position.clone(),
      colorInfo,
      baseEmissiveIntensity: colorInfo.emissiveIntensity
    }

    scene.add(shard)
    shards.push(shard)
  }

  // 创建程序化环境贴图（用于反射）
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(256, 256)
  renderer.setClearColor(0x000000)

  const envScene = new THREE.Scene()

  // 添加环境光
  envScene.add(new THREE.AmbientLight(0xffffff, 0.4))

  // 添加多个彩色光源，产生丰富的反射
  const lightColors = [
    0x40e0d0, // 海蓝宝
    0x9b59b6, // 紫水晶
    0xffd700, // 黄水晶
    0x00ff7f, // 翡翠
    0x0077be  // 蓝宝石
  ]

  const envLights = lightColors.map((color, i) => {
    const light = new THREE.PointLight(color, 2, 50)
    const angle = (i / lightColors.length) * Math.PI * 2
    light.position.set(
      Math.cos(angle) * 15,
      5,
      Math.sin(angle) * 15
    )
    envScene.add(light)
    return light
  })

  // 生成环境贴图
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()
  const envMap = pmremGenerator.fromScene(envScene).texture
  pmremGenerator.dispose()
  renderer.dispose()

  // 将环境贴图应用到所有碎片
  shards.forEach(shard => {
    shard.material.envMap = envMap
    shard.material.envMapIntensity = 1.5
    shard.material.needsUpdate = true
  })

  // 添加主光源
  const light = new THREE.PointLight(0xffffff, 2, 100)
  light.position.set(0, 15, 0)
  scene.add(light)

  // 添加辅助环境光
  const auxiliaryLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(auxiliaryLight)

  // 添加彩色补光灯
  const colorLights = []
  const supplementColors = [
    new THREE.Color(0x40e0d0),
    new THREE.Color(0x9b59b6),
    new THREE.Color(0xffd700)
  ]

  supplementColors.forEach((lightColor, index) => {
    const coloredLight = new THREE.PointLight(lightColor, 1.5, 60)
    const angle = (index / supplementColors.length) * Math.PI * 2
    coloredLight.position.set(
      Math.cos(angle) * 25,
      10,
      Math.sin(angle) * 25
    )
    scene.add(coloredLight)
    colorLights.push(coloredLight)
  })

  return {
    shards,
    light,
    auxiliaryLight,
    colorLights,
    envMap,
    update(deltaTime) {
      shards.forEach(shard => {
        // 更新位置
        shard.position.add(shard.userData.velocity.clone().multiplyScalar(deltaTime))

        // 更新旋转
        shard.rotation.x += shard.userData.angularVelocity.x * deltaTime
        shard.rotation.y += shard.userData.angularVelocity.y * deltaTime
        shard.rotation.z += shard.userData.angularVelocity.z * deltaTime

        // 阻力
        shard.userData.velocity.multiplyScalar(0.99)
        shard.userData.angularVelocity.multiplyScalar(0.98)

        // 微妙的光泽闪烁（模拟水晶反光）
        const shimmer = Math.sin(Date.now() * 0.005 + shard.id * 0.1) * 0.5 + 0.5
        shard.material.emissiveIntensity = shard.userData.baseEmissiveIntensity * (0.8 + shimmer * 0.4)
      })

      // 主灯光动画
      light.intensity = 2 + Math.sin(Date.now() * 0.003) * 0.5

      // 彩色补光灯动画
      colorLights.forEach((coloredLight, index) => {
        const time = Date.now() * 0.001
        coloredLight.intensity = 1.5 + Math.sin(time * 1.5 + index * 0.5) * 0.5
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 爆炸动画
      shards.forEach((shard, i) => {
        const delay = Math.random() * 0.2
        const endPos = shard.userData.velocity.clone().multiplyScalar(duration * 0.5)

        gsap.to(shard.position, {
          x: shard.userData.originalPosition.x + endPos.x,
          y: shard.userData.originalPosition.y + endPos.y,
          z: shard.userData.originalPosition.z + endPos.z,
          duration: duration * 0.5,
          delay,
          ease: 'power2.out'
        })

        // 水晶闪烁效果
        gsap.to(shard.material, {
          emissiveIntensity: 0.8,
          duration: 0.2,
          delay,
          ease: 'power2.in',
          yoyo: true,
          repeat: 1
        })

        gsap.to(shard.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: duration * 0.3,
          delay: duration * 0.5 + delay,
          ease: 'power2.in'
        })
      })

      // 主灯光闪烁
      tl.to(light, {
        intensity: 6,
        duration: 0.1,
        ease: 'power2.in'
      })

      tl.to(light, {
        intensity: 0,
        duration: duration * 0.4,
        ease: 'power2.out'
      })

      return tl
    },
    destroy() {
      shards.forEach(shard => {
        scene.remove(shard)
        shard.geometry.dispose()
        shard.material.dispose()
      })
      scene.remove(light)
      scene.remove(auxiliaryLight)
      colorLights.forEach(coloredLight => scene.remove(coloredLight))
      envMap.dispose()
    }
  }
}
