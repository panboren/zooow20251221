/**
 * 时光碎片动画
 * 全新创新特效 - 时间非线性 + 时间碎片理论
 * 实现时间破碎、碎片悬浮、重组融合、时间回溯等梦幻效果
 * 基于时间维度和因果律的打破
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateTimeFragments(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 时间视角
    setupInitialCamera(camera, new THREE.Vector3(0, 80, 100), 140, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-fragments' })
      },
      onError,
      '时光碎片',
      controls
    )

    // 创建时间核心 - 冰晶色彩
    const timeCore = createTimeCore(scene, {
      coreRadius: 30,
      timeLayerCount: 8
    })

    // 创建时间碎片 - 冰晶色彩
    const timeShards = createTimeShards(scene, {
      shardCount: 120,
      shardSize: 8
    })

    // 创建时间波纹 - 冰晶色彩
    const timeRipples = createTimeRipples(scene, {
      rippleCount: 15,
      maxRadius: 160
    })

    // 创建时间漩涡 - 冰晶色彩
    const timeVortex = createTimeVortex(scene, {
      vortexRadius: 110,
      spiralCount: 8
    })

    // 阶段1: 时间破碎 - 碎片分离
    tl.to(camera.position, {
      x: 35,
      y: 70,
      z: 90,
      duration: 3.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间破碎错误'
      )
    })

    tl.call(() => {
      timeCore.shatter()
      timeShards.disperse()
    }, null, 1.5)

    // 阶段2: 碎片悬浮 - 时间暂停
    tl.to(camera.position, {
      x: 25,
      y: 55,
      z: 70,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '碎片悬浮错误'
      )
    }, 3.5)

    tl.call(() => {
      timeRipples.freeze()
      timeVortex.pause()
    }, null, 5)

    // 时间冻结效果
    tl.to(camera, {
      fov: 90,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时间冻结错误'
      )
    }, 5)

    // 阶段3: 碎片漂移 - 时间流逝
    tl.to(camera.position, {
      x: 18,
      y: 40,
      z: 50,
      duration: 2.5,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '碎片漂移错误'
      )
    }, 5.8)

    tl.call(() => {
      timeShards.drift()
      timeRipples.melt()
    }, null, 7.5)

    // 时间流逝效果
    tl.to(camera, {
      fov: 150,
      duration: 0.6,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时间流逝错误'
      )
    }, 7.5)

    // 阶段4: 碎片重组 - 时间逆转
    tl.to(camera.position, {
      x: 10,
      y: 25,
      z: 30,
      duration: 2.8,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '碎片重组错误'
      )
    }, 8.1)

    tl.call(() => {
      timeVortex.reverse()
      timeShards.assemble()
    }, null, 10)

    // 碎片加速效果
    tl.to(timeShards.shardsGroup.scale, {
      x: 2.5,
      y: 0.6,
      z: 2.5,
      duration: 0.5,
      ease: 'power2.in'
    }, 10)

    // 阶段5: 时间融合 - 因果重连
    tl.to(camera.position, {
      x: 5,
      y: 12,
      z: 15,
      duration: 3,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间融合错误'
      )
    }, 10.5)

    tl.call(() => {
      timeCore.restore()
      timeRipples.fuse()
    }, null, 12.5)

    // 时间融合效果
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时间融合错误'
      )
    }, 12.5)

    // 阶段6: 时间回溯 - 逆流而上
    tl.to(camera.position, {
      x: 2,
      y: 6,
      z: 8,
      duration: 2.5,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间回溯错误'
      )
    }, 13)

    tl.call(() => {
      timeVortex.rewind()
      timeShards.coalesce()
    }, null, 15)

    // 时间回溯效果
    tl.to(camera, {
      fov: 95,
      duration: 0.4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时间回溯错误'
      )
    }, 15)

    // 阶段7: 时间重生 - 新纪元
    tl.call(() => {
      timeCore.reborn()
      timeShards.crystallize()
      timeVortex.dissipate()
    }, null, 16.5)

    tl.to(camera.position, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间重生错误'
      )
    }, 16.5)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 16.5)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      timeCore.update(time)
      timeShards.update(time)
      timeRipples.update(time)
      timeVortex.update(time)
    }

    // 清理函数
    const cleanup = () => {
      timeCore.destroy()
      timeShards.destroy()
      timeRipples.destroy()
      timeVortex.destroy()
    }

    tl.call(cleanup, null, 18.5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建时间核心 - 冰晶色彩
 */
function createTimeCore(scene, options) {
  const { coreRadius = 30, timeLayerCount = 8 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 冰晶颜色
  const iceColors = [
    new THREE.Color(0x00FFFF), // 冰青
    new THREE.Color(0x7FFFD4), // 冰绿
    new THREE.Color(0xA0E6FF), // 冰蓝
    new THREE.Color(0xB0E0E6), // 冰银
    new THREE.Color(0xADD8E6), // 浅蓝
    new THREE.Color(0x87CEEB), // 天蓝
    new THREE.Color(0x87CEFA), // 淡天蓝
    new THREE.Color(0x00BFFF)  // 深天蓝
  ]

  const layers = []
  const layerMaterials = []
  const timeRings = []

  for (let i = 0; i < timeLayerCount; i++) {
    // 时间层球体
    const geometry = new THREE.IcosahedronGeometry(coreRadius - i * 3, 1)
    const material = new THREE.MeshBasicMaterial({
      color: iceColors[i],
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const layer = new THREE.Mesh(geometry, material)
    group.add(layer)
    layers.push(layer)
    layerMaterials.push(material)

    // 时间环
    const ringRadius = coreRadius + i * 10
    const ringGeometry = new THREE.TorusGeometry(ringRadius, 1, 8, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: iceColors[i],
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    timeRings.push(ring)
  }

  let isActive = false

  return {
    group,
    shatter() {
      isActive = true
      layers.forEach((layer, i) => {
        gsap.to(layer.scale, {
          x: 1.8,
          y: 1.8,
          z: 1.8,
          duration: 2,
          ease: 'power2.in',
          delay: i * 0.15
        })
        gsap.to(layerMaterials[i], {
          opacity: 0.9,
          duration: 1.5,
          delay: i * 0.15
        })
      })
    },
    restore() {
      layers.forEach((layer, i) => {
        gsap.to(layer.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    reborn() {
      isActive = false
      layers.forEach((layer, i) => {
        gsap.to(layer.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 2,
          ease: 'power2.in',
          delay: i * 0.05
        })
        gsap.to(layerMaterials[i], {
          opacity: 0,
          duration: 1.5
        })
      })
      timeRings.forEach(ring => {
        gsap.to(ring.material, {
          opacity: 0,
          duration: 2
        })
      })
    },
    update(time) {
      if (isActive) {
        layers.forEach((layer, i) => {
          layer.rotation.x = time * (0.2 + i * 0.03)
          layer.rotation.y = time * (0.3 + i * 0.05)
        })
        timeRings.forEach((ring, i) => {
          ring.rotation.z = time * (0.4 + i * 0.05)
          ring.rotation.x = Math.PI / 2 + Math.sin(time * 2 + i) * 0.2
        })
        group.rotation.y = time * 0.12
      }
    },
    destroy() {
      scene.remove(group)
      layers.forEach(layer => {
        layer.geometry.dispose()
        layer.material.dispose()
      })
      timeRings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }
}
/**
 * 创建时间碎片 - 冰晶色彩
 */
function createTimeShards(scene, options) {
  const { shardCount = 120, shardSize = 8 } = options

  const group = new THREE.Group()
  scene.add(group)

  const shards = []
  const shardMaterials = []

  // 冰晶颜色
  const iceColors = [
    new THREE.Color(0x00FFFF), // 冰青
    new THREE.Color(0x7FFFD4), // 冰绿
    new THREE.Color(0xA0E6FF), // 冰蓝
    new THREE.Color(0xB0E0E6), // 冰银
    new THREE.Color(0xADD8E6), // 浅蓝
    new THREE.Color(0x87CEEB), // 天蓝
    new THREE.Color(0x87CEFA), // 淡天蓝
    new THREE.Color(0x00BFFF)  // 深天蓝
  ]

  for (let i = 0; i < shardCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 40 + Math.random() * 60
    const y = (Math.random() - 0.5) * 100
    const z = Math.random() * 30 - 15

    const geometry = new THREE.BoxGeometry(
      shardSize * (0.5 + Math.random()),
      shardSize * (0.5 + Math.random()),
      shardSize * (0.5 + Math.random())
    )
    const color = iceColors[Math.floor(Math.random() * iceColors.length)]
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    const shard = new THREE.Mesh(geometry, material)
    shard.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius + z
    )
    shard.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    group.add(shard)
    shards.push(shard)
    shardMaterials.push(material)
  }

  let speedMultiplier = 1
  let isActive = false

  return {
    group,
    shardsGroup: group,
    disperse() {
      isActive = true
      shards.forEach((shard, i) => {
        gsap.to(shard.position, {
          x: shard.position.x * 3,
          y: shard.position.y * 1.5,
          z: shard.position.z * 3,
          duration: 3,
          ease: 'power2.out',
          delay: i * 0.02
        })
      })
    },
    drift() {
      speedMultiplier = 8
    },
    assemble() {
      shards.forEach((shard, i) => {
        gsap.to(shard.position, {
          x: shard.position.x * 0.3,
          y: shard.position.y * 0.2,
          z: shard.position.z * 0.3,
          duration: 2.5,
          ease: 'power2.in',
          delay: i * 0.015
        })
      })
    },
    coalesce() {
      speedMultiplier = 1
      shards.forEach((shard, i) => {
        gsap.to(shard.material, {
          opacity: 0.9,
          duration: 1.5,
          delay: i * 0.01
        })
      })
    },
    crystallize() {
      isActive = false
      shards.forEach((shard, i) => {
        gsap.to(shard.scale, {
          x: 0.05,
          y: 0.05,
          z: 0.05,
          duration: 2,
          ease: 'power2.in',
          delay: i * 0.01
        })
        gsap.to(shard.material, {
          opacity: 0,
          duration: 1.5
        })
      })
    },
    update(time) {
      if (isActive) {
        shards.forEach((shard, i) => {
          shard.rotation.x += 0.02 + i * 0.001
          shard.rotation.y += 0.03 + i * 0.002
        })
        group.rotation.y = time * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      shards.forEach(shard => {
        shard.geometry.dispose()
        shard.material.dispose()
      })
    }
  }
}


/**
 * 创建时间波纹 - 冰晶色彩
 */
function createTimeRipples(scene, options) {
  const { rippleCount = 15, maxRadius = 160 } = options

  const group = new THREE.Group()
  scene.add(group)

  const ripples = []
  const rippleMaterials = []

  // 冰晶颜色
  const iceColors = [
    new THREE.Color(0x00FFFF), // 冰青
    new THREE.Color(0x7FFFD4), // 冰绿
    new THREE.Color(0xA0E6FF), // 冰蓝
    new THREE.Color(0xB0E0E6), // 冰银
    new THREE.Color(0xADD8E6), // 浅蓝
    new THREE.Color(0x87CEEB), // 天蓝
    new THREE.Color(0x87CEFA), // 淡天蓝
    new THREE.Color(0x00BFFF)  // 深天蓝
  ]

  for (let i = 0; i < rippleCount; i++) {
    const radius = maxRadius / 4 + i * 10
    const geometry = new THREE.RingGeometry(radius - 1, radius, 64)
    const color = iceColors[i % iceColors.length]
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    group.add(ripple)
    ripples.push(ripple)
    rippleMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    freeze() {
      isActive = true
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 2,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.12
        })
        gsap.to(rippleMaterials[i], {
          opacity: 0.8,
          duration: 1.5,
          delay: i * 0.12
        })
      })
    },
    melt() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 2.5,
          y: 2.5,
          z: 2.5,
          duration: 1.8,
          ease: 'power3.out'
        })
      })
    },
    fuse() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 1.8,
          y: 1.8,
          z: 1.8,
          duration: 1.5,
          ease: 'power2.inOut'
        })
      })
    },
    fade() {
      isActive = false
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 0.15,
          y: 0.15,
          z: 0.15,
          duration: 2,
          ease: 'power2.out'
        })
        gsap.to(rippleMaterials[i], {
          opacity: 0,
          duration: 1.5
        })
      })
    },
    update(time) {
      if (isActive) {
        ripples.forEach((ripple, i) => {
          ripple.rotation.z += 0.015 + i * 0.003
          const pulse = Math.sin(time * 3 + i * 0.5) * 0.1 + 1
          ripple.scale.setScalar(pulse * (i > 0 ? 1 : 1.5))
        })
        group.rotation.x = Math.sin(time * 0.3) * 0.08
      }
    },
    destroy() {
      scene.remove(group)
      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })
    }
  }
}

/**
 * 创建时间漩涡 - 冰晶色彩
 */
function createTimeVortex(scene, options) {
  const { vortexRadius = 110, spiralCount = 8 } = options

  const group = new THREE.Group()
  scene.add(group)

  const spirals = []
  const spiralMaterials = []

  // 冰晶颜色
  const iceColors = [
    new THREE.Color(0x00FFFF), // 冰青
    new THREE.Color(0x7FFFD4), // 冰绿
    new THREE.Color(0xA0E6FF), // 冰蓝
    new THREE.Color(0xB0E0E6), // 冰银
    new THREE.Color(0xADD8E6), // 浅蓝
    new THREE.Color(0x87CEEB), // 天蓝
    new THREE.Color(0x87CEFA), // 淡天蓝
    new THREE.Color(0x00BFFF)  // 深天蓝
  ]

  for (let i = 0; i < spiralCount; i++) {
    const points = []
    for (let j = 0; j <= 80; j++) {
      const t = j / 80
      const angle = t * Math.PI * 5 + (i / spiralCount) * Math.PI * 2
      const radius = vortexRadius * (1 - t) * (0.6 + Math.sin(t * Math.PI) * 0.4)
      const x = Math.cos(angle) * radius
      const y = Math.sin(t * Math.PI * 3) * radius * 0.25
      const z = Math.sin(angle) * radius
      points.push(new THREE.Vector3(x, y, z))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const color = iceColors[i % iceColors.length]
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      linewidth: 2
    })
    const spiral = new THREE.Line(geometry, material)
    group.add(spiral)
    spirals.push(spiral)
    spiralMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    pause() {
      isActive = true
      spirals.forEach((spiral, i) => {
        gsap.to(spiralMaterials[i], {
          opacity: 0.8,
          duration: 1.2,
          delay: i * 0.08
        })
      })
    },
    reverse() {
      spirals.forEach((spiral, i) => {
        gsap.to(spiral.rotation, {
          x: spiral.rotation.x + Math.PI * 2,
          duration: 2.5,
          ease: 'power2.in',
          delay: i * 0.06
        })
      })
    },
    rewind() {
      spirals.forEach((spiral, i) => {
        gsap.to(spiral.rotation, {
          y: spiral.rotation.y - Math.PI * 3,
          duration: 3,
          ease: 'power2.inOut'
        })
      })
    },
    dissipate() {
      isActive = false
      spirals.forEach((spiral, i) => {
        gsap.to(spiralMaterials[i], {
          opacity: 0,
          duration: 2,
          delay: i * 0.04
        })
      })
    },
    update(time) {
      if (isActive) {
        spirals.forEach((spiral, i) => {
          spiral.rotation.y += 0.04 + i * 0.008
          spiral.rotation.x += 0.02 + i * 0.004
        })
        group.rotation.y = time * 0.15
      }
    },
    destroy() {
      scene.remove(group)
      spirals.forEach(spiral => {
        spiral.geometry.dispose()
        spiral.material.dispose()
      })
    }
  }
}
