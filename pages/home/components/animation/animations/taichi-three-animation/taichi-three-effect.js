/**
 * 太极-Taichi.js 特效（完整实现）
 *
 * 核心架构：
 * - Taichi.js: 高性能粒子物理计算（WebGPU/CPU自动切换）
 * - Three.js: 3D渲染、视觉效果
 * - GSAP: 运镜和过渡动画
 *
 * 特效特色：
 * 1. 真实的物理模拟：使用Taichi.js计算粒子运动
 * 2. 阴阳双螺旋：体现中国传统文化的现代演绎
 * 3. 完善的清理机制：动画结束后完全清理
 * 4. 丰富的运镜：7个阶段的相机运动
 * 5. 高性能渲染：GPU加速的粒子计算
 *
 * 动画流程：
 * 阶段1: 混沌初开 - 粒子聚集
 * 阶段2: 阴阳分离 - 双螺旋展开
 * 阶段3: 阴阳相生 - 螺旋旋转加速
 * 阶段4: 阴阳相克 - 冲突与平衡
 * 阶段5: 太极合一 - 阴阳融合
 * 阶段6: 万物生发 - 能量爆发
 * 阶段7: 太极归一 - 平衡恢复
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../utils'

/**
 * 太极-Taichi.js 特效主函数
 * @param {Object} props - 动画属性 { camera, renderer, scene, controls }
 * @param {Object} callbacks - 回调函数 { onComplete, onError }
 */
/**
 * 太极-Taichi.js 特效主函数
 * @param {Object} props - 动画属性 { camera, renderer, scene, controls, taichiUtils }
 * @param {Object} callbacks - 回调函数 { onComplete, onError }
 */
export default async function animateTaichiThree(props, callbacks) {
  const { camera, renderer, scene, controls, taichiUtils } = props
  const { onComplete, onError } = callbacks || {}

  console.log('🎬 启动太极-Taichi.js 特效')

  // 使用传入的taichiUtils
  let useTaichiUtils = taichiUtils
  let taichiParticleSystem = null
  let useTaichi = false

  // 检查Taichi.js是否就绪，如果没有，尝试初始化
  if (useTaichiUtils && useTaichiUtils.isReady()) {
    console.log('✅ 使用Taichi.js加速 (GPU:', useTaichiUtils.isGPU() ? 'Yes' : 'No', ')')
    useTaichi = true
    taichiParticleSystem = useTaichiUtils.createParticleSystem({
      particleCount: 30000,
      timeStep: 0.016
    })
  } else if (useTaichiUtils && useTaichiUtils.init) {
    // 尝试手动初始化
    console.log('⏳ Taichi.js未就绪，尝试初始化...')
    try {
      await useTaichiUtils.init()
      // 等待一小段时间确保初始化完成
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (useTaichiUtils.isReady()) {
        console.log('✅ Taichi.js初始化成功 (GPU:', useTaichiUtils.isGPU() ? 'Yes' : 'No', ')')
        useTaichi = true
        taichiParticleSystem = useTaichiUtils.createParticleSystem({
          particleCount: 30000,
          timeStep: 0.016
        })
      } else {
        console.warn('⚠️ Taichi.js初始化超时，使用JavaScript模拟')
        useTaichi = false
      }
    } catch (error) {
      console.warn('⚠️ Taichi.js初始化失败，使用JavaScript模拟:', error)
      useTaichi = false
    }
  } else {
    console.warn('⚠️ Taichi.js未就绪，使用JavaScript模拟')
    useTaichi = false
  }

  try {
    // 初始设置 - 远距离俯瞰
    setupInitialCamera(camera, new THREE.Vector3(0, 100, 150), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    // 创建时间轴
    const tl = createTimeline(
      () => {
        // 完整的清理逻辑
        cleanup()
        if (onComplete) onComplete({ type: 'taichi-three' })
      },
      onError,
      '太极-Taichi.js 特效',
      controls
    )

    // 创建太极核心
    const taichiCore = createTaichiCore(scene)

    // 创建阴阳双螺旋粒子系统
    const yinYangSpiral = createYinYangSpiral(scene, {
      particleCount: 20000,
      useTaichi,
      taichiInstance: taichiParticleSystem
    })

    // 创建能量光环
    const energyRings = createEnergyRings(scene, {
      ringCount: 8,
      maxRadius: 80
    })

    // 创建太极外围粒子云
    const taichiCloud = createTaichiCloud(scene, {
      particleCount: 10000,
      useTaichi,
      taichiInstance: taichiParticleSystem
    })

    // 阶段1: 混沌初开 - 粒子聚集
    tl.to(camera.position, {
      x: 30,
      y: 60,
      z: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '混沌初开错误'
      )
    })

    tl.call(() => {
      taichiCore.materialize()
      yinYangSpiral.form()
    }, null, 1)

    // 阶段2: 阴阳分离 - 双螺旋展开
    tl.to(camera.position, {
      x: 20,
      y: 40,
      z: 70,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '阴阳分离错误'
      )
    }, 2.5)

    tl.call(() => {
      yinYangSpiral.separate()
      energyRings.expand()
    }, null, 4)

    // 阴阳分离的动态效果
    tl.to(yinYangSpiral.particles.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 1.5,
      ease: 'elastic.out(1, 0.4)'
    }, 4)

    // 阶段3: 阴阳相生 - 螺旋旋转加速
    tl.to(camera.position, {
      x: 15,
      y: 25,
      z: 50,
      duration: 2,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '阴阳相生错误'
      )
    }, 4.5)

    tl.call(() => {
      yinYangSpiral.accelerate()
      taichiCloud.activate()
    }, null, 6)

    // 旋转加速的视觉冲击
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV变化错误'
      )
    }, 6)

    // 阶段4: 阴阳相克 - 冲突与平衡
    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 35,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '阴阳相克错误'
      )
    }, 6.5)

    tl.call(() => {
      yinYangSpiral.interact()
      energyRings.pulse()
    }, null, 8)

    // 阶段5: 太极合一 - 阴阳融合
    tl.to(camera.position, {
      x: 5,
      y: 8,
      z: 20,
      duration: 2.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '太极合一错误'
      )
    }, 8.5)

    tl.call(() => {
      taichiCore.unify()
      yinYangSpiral.merge()
    }, null, 10.5)

    // 合一时的强烈效果
    tl.to(camera, {
      fov: 130,
      duration: 0.3,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '合一冲击错误'
      )
    }, 10.5)

    // 阶段6: 万物生发 - 能量爆发
    tl.to(camera.position, {
      x: 3,
      y: 5,
      z: 15,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '万物生发错误'
      )
    }, 10.8)

    tl.call(() => {
      taichiCloud.explode()
      energyRings.harmonize()
    }, null, 12)

    // 能量爆发
    tl.to(taichiCloud.particles.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 1,
      ease: 'power2.out'
    }, 12)

    // 阶段7: 太极归一 - 平衡恢复
    tl.to(camera.position, {
      x: 1,
      y: 2,
      z: 10,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '太极归一错误'
      )
    }, 13)

    // 恢复 FOV
    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 13)

    // 更新循环
    const updateHandler = async () => {
      const time = Date.now() * 0.001
      taichiCore.update(time)
      yinYangSpiral.update(time)
      energyRings.update(time)

      // 如果使用Taichi.js，更新粒子系统
      if (useTaichi && taichiParticleSystem) {
        try {
          await taichiParticleSystem.update(0.016, time)

          // 获取Taichi计算的粒子位置并更新到Three.js
          const taichiPositions = taichiParticleSystem.getPositions()
          const taichiColors = taichiParticleSystem.getColors()

          // 更新阴阳双螺旋粒子系统
          if (yinYangSpiral && yinYangSpiral.geometry) {
            const yinYangPositions = yinYangSpiral.geometry.attributes.position.array
            const yinYangColors = yinYangSpiral.geometry.attributes.color.array
            const count = Math.min(taichiPositions.length / 3, yinYangPositions.length / 3)

            for (let i = 0; i < count; i++) {
              const i3 = i * 3
              // 将Taichi计算的平滑运动应用到粒子位置
              const originalX = yinYangPositions[i3]
              const originalY = yinYangPositions[i3 + 1]
              const originalZ = yinYangPositions[i3 + 2]

              // 混合原始位置和Taichi计算的位置（平滑过渡）
              yinYangPositions[i3] = originalX + (taichiPositions[i3] * 0.01)
              yinYangPositions[i3 + 1] = originalY + (taichiPositions[i3 + 1] * 0.01)
              yinYangPositions[i3 + 2] = originalZ + (taichiPositions[i3 + 2] * 0.01)

              // 更新颜色
              yinYangColors[i3] = taichiColors[i3]
              yinYangColors[i3 + 1] = taichiColors[i3 + 1]
              yinYangColors[i3 + 2] = taichiColors[i3 + 2]
            }
            yinYangSpiral.geometry.attributes.position.needsUpdate = true
            yinYangSpiral.geometry.attributes.color.needsUpdate = true
          }

          // 更新太极外围粒子云
          if (taichiCloud && taichiCloud.geometry) {
            const cloudPositions = taichiCloud.geometry.attributes.position.array
            const cloudColors = taichiCloud.geometry.attributes.color.array
            const offset = 10000 // 偏移量，使用不同的Taichi粒子
            const count = Math.min((taichiPositions.length / 3) - offset, cloudPositions.length / 3)

            for (let i = 0; i < count; i++) {
              const i3 = i * 3
              const tiIndex = offset + i
              const ti3 = tiIndex * 3

              // 应用Taichi计算的物理运动
              cloudPositions[i3] += (taichiPositions[ti3] * 0.05)
              cloudPositions[i3 + 1] += (taichiPositions[ti3 + 1] * 0.05)
              cloudPositions[i3 + 2] += (taichiPositions[ti3 + 2] * 0.05)

              // 更新颜色
              cloudColors[i3] = taichiColors[ti3]
              cloudColors[i3 + 1] = taichiColors[ti3 + 1]
              cloudColors[i3 + 2] = taichiColors[ti3 + 2]
            }
            taichiCloud.geometry.attributes.position.needsUpdate = true
            taichiCloud.geometry.attributes.color.needsUpdate = true
          }

          console.log('🔄 Taichi.js 物理计算已应用到渲染')
        } catch (error) {
          console.warn('Taichi更新失败:', error)
        }
      } else {
        // 不使用Taichi时的普通更新
        taichiCloud.update(time)
      }
    }

    // 清理函数
    const cleanup = () => {
      console.log('🧹 清理太极特效资源')
      taichiCore.destroy()
      yinYangSpiral.destroy()
      energyRings.destroy()
      taichiCloud.destroy()

      // 清理Taichi粒子系统
      if (taichiParticleSystem && taichiParticleSystem.destroy) {
        taichiParticleSystem.destroy()
      }
    }

    tl.call(cleanup, null, 15.5)

    return { updateHandler }

  } catch (error) {
    console.error('❌ 太极-Taichi.js 特效启动失败:', error)
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建太极核心
 */
function createTaichiCore(scene) {
  const group = new THREE.Group()
  scene.add(group)

  // 太极符号球体
  const coreGeometry = new THREE.SphereGeometry(10, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 阴鱼（黑色部分）
  const yinGeometry = new THREE.SphereGeometry(5, 32, 32)
  const yinMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0
  })
  const yinSphere = new THREE.Mesh(yinGeometry, yinMaterial)
  yinSphere.position.set(0, 5, 8)
  group.add(yinSphere)

  // 阳鱼（白色部分）
  const yangGeometry = new THREE.SphereGeometry(5, 32, 32)
  const yangMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  })
  const yangSphere = new THREE.Mesh(yangGeometry, yangMaterial)
  yangSphere.position.set(0, -5, 8)
  group.add(yangSphere)

  // 阴眼（白色圆点）
  const yinEyeGeometry = new THREE.SphereGeometry(1.5, 16, 16)
  const yinEyeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  })
  const yinEye = new THREE.Mesh(yinEyeGeometry, yinEyeMaterial)
  yinEye.position.set(0, 5, 12.5)
  group.add(yinEye)

  // 阳眼（黑色圆点）
  const yangEyeGeometry = new THREE.SphereGeometry(1.5, 16, 16)
  const yangEyeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0
  })
  const yangEye = new THREE.Mesh(yangEyeGeometry, yangEyeMaterial)
  yangEye.position.set(0, -5, 12.5)
  group.add(yangEye)

  // 光晕
  const glowGeometry = new THREE.SphereGeometry(12, 32, 32)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  group.add(glow)

  return {
    group,
    materialize() {
      gsap.to(coreMaterial, { opacity: 1, duration: 1.5 })
      gsap.to(yinMaterial, { opacity: 1, duration: 1, delay: 0.3 })
      gsap.to(yangMaterial, { opacity: 1, duration: 1, delay: 0.3 })
      gsap.to(yinEyeMaterial, { opacity: 1, duration: 0.8, delay: 0.5 })
      gsap.to(yangEyeMaterial, { opacity: 1, duration: 0.8, delay: 0.5 })
      gsap.to(glowMaterial, { opacity: 0.3, duration: 1.5 })
    },
    unify() {
      // 核心发光增强
      gsap.to(coreMaterial, {
        opacity: 1,
        duration: 1
      })
      gsap.to(core.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1,
        yoyo: true,
        repeat: 2
      })
      gsap.to(glowMaterial, {
        opacity: 0.6,
        duration: 1
      })
    },
    update(time) {
      // 太极核心旋转
      group.rotation.y = time * 0.5

      // 光晕脉动
      const pulse = Math.sin(time * 2) * 0.1 + 1
      glow.scale.setScalar(pulse)
    },
    destroy() {
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      yinGeometry.dispose()
      yinMaterial.dispose()
      yangGeometry.dispose()
      yangMaterial.dispose()
      yinEyeGeometry.dispose()
      yinEyeMaterial.dispose()
      yangEyeGeometry.dispose()
      yangEyeMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
    }
  }
}

/**
 * 创建阴阳双螺旋粒子系统
 */
function createYinYangSpiral(scene, options) {
  const { particleCount = 20000, useTaichi = false, taichiInstance = null, spiralCount = 2 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 粒子几何体
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const spiralIndex = i % spiralCount
    const progress = i / particleCount

    // 螺旋参数
    const angle = progress * Math.PI * 20
    const radius = 5 + progress * 30
    const height = (spiralIndex === 0 ? 1 : -1) * (progress * 40 - 20)

    positions[i * 3] = radius * Math.cos(angle)
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = radius * Math.sin(angle)

    // 颜色：阴（黑蓝）阳（金橙）
    if (spiralIndex === 0) {
      colors[i * 3] = 0.0
      colors[i * 3 + 1] = 0.3
      colors[i * 3 + 2] = 1.0
    } else {
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.7
      colors[i * 3 + 2] = 0.0
    }

    phases[i] = progress * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let rotationSpeed = 0.5

  return {
    group,
    particles,
    geometry,  // 添加geometry引用
    form() {
      gsap.to(material, { opacity: 1, duration: 2 })
      gsap.to(particles.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'elastic.out(1, 0.4)'
      })
    },
    separate() {
      // 阴阳分离
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const spiralIndex = i % spiralCount
        if (spiralIndex === 0) {
          positions[i * 3] *= 1.2
        } else {
          positions[i * 3] *= 1.2
        }
      }
      geometry.attributes.position.needsUpdate = true
    },
    accelerate() {
      rotationSpeed = 3
    },
    interact() {
      // 阴阳相互作用
      rotationSpeed = 5
    },
    merge() {
      rotationSpeed = 0.5
      gsap.to(particles.scale, {
        x: 0.5,
        y: 0.5,
        z: 0.5,
        duration: 1.5,
        ease: 'power2.in'
      })
    },
    update(time) {
      group.rotation.y += rotationSpeed * 0.02

      // 更新粒子位置
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const phase = phases[i]

        // 螺旋运动
        const angle = Math.atan2(positions[i3 + 2], positions[i3]) + rotationSpeed * 0.01
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2)

        positions[i3] = radius * Math.cos(angle)
        positions[i3 + 2] = radius * Math.sin(angle)

        // 上下波动
        positions[i3 + 1] += Math.sin(time * 3 + phase) * 0.05
      }
      geometry.attributes.position.needsUpdate = true
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建能量光环
 */
function createEnergyRings(scene, options) {
  const { ringCount = 8, maxRadius = 80 } = options

  const group = new THREE.Group()
  scene.add(group)

  const rings = []
  const ringMaterials = []

  for (let i = 0; i < ringCount; i++) {
    const radius = 20 + i * (maxRadius - 20) / ringCount
    const geometry = new THREE.TorusGeometry(radius, 0.8, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.1 + i * 0.1, 0.8, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    rings.push(ring)
    ringMaterials.push(material)
  }

  return {
    group,
    expand() {
      rings.forEach((ring, i) => {
        gsap.to(ringMaterials[i], {
          opacity: 0.5,
          duration: 1,
          delay: i * 0.15
        })
        gsap.to(ring.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.3)',
          delay: i * 0.1
        })
      })
    },
    pulse() {
      rings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 0.5,
          yoyo: true,
          repeat: 3,
          delay: i * 0.05
        })
      })
    },
    harmonize() {
      rings.forEach((ring, i) => {
        gsap.to(ringMaterials[i], {
          opacity: 0.8,
          duration: 1
        })
      })
    },
    update(time) {
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.02 + i * 0.005
        const pulse = Math.sin(time * 2 + i) * 0.1 + 1
        ring.scale.setScalar(pulse)
      })
    },
    destroy() {
      scene.remove(group)
      rings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }
}

/**
 * 创建太极外围粒子云
 */
function createTaichiCloud(scene, options) {
  const { particleCount = 10000, useTaichi = false, taichiInstance = null } = options

  const group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 30 + Math.random() * 50

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 渐变颜色
    const hue = Math.random() * 0.3
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  return {
    group,
    particles,
    geometry,  // 添加geometry引用
    activate() {
      gsap.to(material, { opacity: 1, duration: 2 })
    },
    explode() {
      // 粒子向外爆发
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] *= 1.5
        positions[i * 3 + 1] *= 1.5
        positions[i * 3 + 2] *= 1.5
      }
      geometry.attributes.position.needsUpdate = true
    },
    update(time) {
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // 粒子运动
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // 边界循环
        const dist = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        )
        if (dist > 100) {
          positions[i3] *= 0.1
          positions[i3 + 1] *= 0.1
          positions[i3 + 2] *= 0.1
        }
      }
      geometry.attributes.position.needsUpdate = true

      group.rotation.y = time * 0.1
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}
