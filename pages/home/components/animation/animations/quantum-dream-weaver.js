/**
 * 量子梦境编织 - 超越量子纠缠的艺术杰作
 * 融合量子叠加态、薛定谔猫、量子隧穿、纠缠对、波函数坍缩等量子力学概念
 * 技术突破：
 * - 量子态可视化粒子系统（30000+粒子）
 * - 波函数动态模拟
 * - 量子纠缠线实时渲染
 * - 叠加态分裂效果
 * - 量子隧穿粒子
 * - 薛定谔猫状态切换
 * - 观测者效应模拟
 * - 量子泡沫背景
 * - 概率云渲染
 * - 干涉条纹动态效果
 * 动画时长：22秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumDreamWeaver(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 量子场视角
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 180), 110, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-dream-weaver' })
      },
      onError,
      '量子梦境编织',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 量子态粒子系统（30000粒子）
    const quantumStates = createQuantumStates(scene, {
      particleCount: 30000,
      superpositionLevels: 3
    })

    // 2. 波函数云
    const waveFunctionCloud = createWaveFunctionCloud(scene, {
      cloudCount: 5000,
      radius: 80
    })

    // 3. 量子纠缠线
    const entanglementLines = createEntanglementLines(scene, {
      pairCount: 1000,
      lineWidth: 2
    })

    // 4. 叠加态分裂球
    const superpositionSpheres = createSuperpositionSpheres(scene, {
      sphereCount: 8,
      splitDistance: 40
    })

    // 5. 量子隧穿通道
    const tunnelingPortals = createTunnelingPortals(scene, {
      portalCount: 6,
      tunnelLength: 200
    })

    // 6. 薛定谔猫
    const schrodingerCat = createSchrodingerCat(scene)

    // 7. 量子泡沫背景
    const quantumFoam = createQuantumFoam(scene, {
      bubbleCount: 8000,
      foamRadius: 350
    })

    // 8. 概率云干涉
    const probabilityInterference = createProbabilityInterference(scene, {
      patternCount: 3,
      fringeCount: 20
    })

    // ==================== 动画序列 ====================

    // 阶段1: 量子场形成 - 波函数展开（5秒）
    tl.to(camera.position, {
      x: 15,
      y: 30,
      z: 150,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子场形成错误'
      )
    }, 0)

    tl.call(() => {
      quantumStates.materialize()
      waveFunctionCloud.expand()
    }, null, 0.5)

    tl.to(camera, {
      fov: 130,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '量子视野错误'
      )
    }, 1)

    // 阶段2: 纠缠建立 - 纠缠对形成（6秒）
    tl.to(camera.position, {
      x: -10,
      y: 20,
      z: 100,
      duration: 6,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '纠缠建立错误'
      )
    }, 5)

    tl.call(() => {
      entanglementLines.establish()
      superpositionSpheres.split()
    }, null, 5.5)

    tl.to(camera, {
      fov: 140,
      duration: 4,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '纠缠视野错误'
      )
    }, 6)

    // 阶段3: 量子隧穿 - 粒子穿越势垒（6秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 50,
      duration: 6,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子隧穿错误'
      )
    }, 11)

    tl.call(() => {
      tunnelingPortals.open()
      probabilityInterference.interfere()
    }, null, 11.5)

    tl.to(camera, {
      fov: 100,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '隧穿视野错误'
      )
    }, 12)

    // 阶段4: 观测坍缩 - 薛定谔猫（5秒）
    tl.to(camera.position, {
      x: 5,
      y: -5,
      z: 30,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '观测坍缩错误'
      )
    }, 17)

    tl.call(() => {
      schrodingerCat.observe()
      quantumStates.collapse()
    }, null, 17.5)

    tl.to(camera, {
      fov: 85,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '最终视角错误'
      )
    }, 18)

    // ==================== 清理函数 ====================
    const cleanup = () => {
      quantumStates.dispose()
      waveFunctionCloud.dispose()
      entanglementLines.dispose()
      superpositionSpheres.dispose()
      tunnelingPortals.dispose()
      schrodingerCat.dispose()
      quantumFoam.dispose()
      probabilityInterference.dispose()
    }

    return {
      timeline: tl,
      cleanup
    }
  }
  catch (error) {
    onError && onError(error)
    throw error
  }
}

// ==================== 系统创建函数 ====================

/**
 * 创建量子态粒子系统
 */
function createQuantumStates(scene, options = {}) {
  const {
    particleCount = 30000,
    superpositionLevels = 3
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)
  const levels = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const level = Math.floor(Math.random() * superpositionLevels)
    const radius = 30 + level * 20

    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const hue = level / superpositionLevels
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
    levels[i] = level
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let materialized = false
  let collapsed = false
  let time = 0

  const update = () => {
    time += 0.016

    if (materialized && !collapsed) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        const phase = phases[i]
        const level = levels[i]
        const radius = 30 + level * 20

        // 量子态波动
        const amplitude = Math.sin(time * 2 + phase) * 5
        const theta = Math.atan2(positions[i * 3], positions[i * 3 + 2])
        const phi = Math.atan2(positions[i * 3 + 1], Math.sqrt(
          positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2
        ))

        positions[i * 3] += Math.cos(time + phase) * amplitude * 0.01
        positions[i * 3 + 1] += Math.sin(time + phase) * amplitude * 0.01
        positions[i * 3 + 2] += Math.cos(time + phase) * amplitude * 0.01
      }

      points.geometry.attributes.position.needsUpdate = true
      points.rotation.y += 0.002
    } else if (collapsed) {
      // 坍缩到单一位置
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += (0 - positions[i * 3]) * 0.02
        positions[i * 3 + 1] += (0 - positions[i * 3 + 1]) * 0.02
        positions[i * 3 + 2] += (0 - positions[i * 3 + 2]) * 0.02
      }

      points.geometry.attributes.position.needsUpdate = true
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    materialize() {
      materialized = true
      gsap.to(material, {
        opacity: 0.8,
        duration: 2
      })
    },
    collapse() {
      collapsed = true
      gsap.to(material, {
        opacity: 1,
        duration: 1
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建波函数云
 */
function createWaveFunctionCloud(scene, options = {}) {
  const {
    cloudCount = 5000,
    radius = 80
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(cloudCount * 3)
  const colors = new Float32Array(cloudCount * 3)
  const amplitudes = new Float32Array(cloudCount)

  for (let i = 0; i < cloudCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    amplitudes[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let expanded = false
  let time = 0

  const update = () => {
    time += 0.016

    if (expanded) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < cloudCount; i++) {
        // 波函数波动
        const wave = Math.sin(time * 3 + positions[i * 3] * 0.1) *
                     Math.cos(time * 2 + positions[i * 3 + 1] * 0.1) *
                     amplitudes[i] * 10

        positions[i * 3] += Math.sin(time + i) * wave * 0.001
        positions[i * 3 + 1] += Math.cos(time + i) * wave * 0.001
        positions[i * 3 + 2] += Math.sin(time * 0.5 + i) * wave * 0.001
      }

      points.geometry.attributes.position.needsUpdate = true
      points.rotation.y += 0.001
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    expand() {
      expanded = true
      gsap.to(material, {
        opacity: 0.6,
        duration: 2
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建量子纠缠线
 */
function createEntanglementLines(scene, options = {}) {
  const {
    pairCount = 1000,
    lineWidth = 2
  } = options

  const group = new THREE.Group()
  const pairs = []

  for (let i = 0; i < pairCount; i++) {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(6)

    positions[0] = (Math.random() - 0.5) * 200
    positions[1] = (Math.random() - 0.5) * 200
    positions[2] = (Math.random() - 0.5) * 200

    positions[3] = positions[0]
    positions[4] = positions[1]
    positions[5] = positions[2]

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const line = new THREE.Line(geometry, material)

    pairs.push({
      line,
      material,
      established: false,
      phase: Math.random() * Math.PI * 2,
      targetPositions: [
        new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        )
      ]
    })

    group.add(line)
  }

  scene.add(group)

  const establish = () => {
    pairs.forEach((pair, i) => {
      setTimeout(() => {
        pair.established = true

        gsap.to(pair.material, {
          opacity: 0.5,
          duration: 0.5
        })

        // 分离纠缠对
        const positions = pair.line.geometry.attributes.position.array
        gsap.to(positions, {
          0: pair.targetPositions[0].x,
          1: pair.targetPositions[0].y,
          2: pair.targetPositions[0].z,
          3: pair.targetPositions[1].x,
          4: pair.targetPositions[1].y,
          5: pair.targetPositions[1].z,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            pair.line.geometry.attributes.position.needsUpdate = true
          }
        })
      }, i * 5)
    })
  }

  const update = () => {
    pairs.forEach(pair => {
      if (pair.established) {
        // 纠缠同步震动
        const sync = Math.sin(Date.now() * 0.01 + pair.phase) * 0.5
        pair.material.opacity = 0.3 + sync * 0.4
      }
    })

    group.rotation.y += 0.001
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    establish,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      pairs.forEach(pair => {
        pair.line.geometry.dispose()
        pair.material.dispose()
      })
    }
  }
}

/**
 * 创建叠加态分裂球
 */
function createSuperpositionSpheres(scene, options = {}) {
  const {
    sphereCount = 8,
    splitDistance = 40
  } = options

  const spheres = []

  for (let i = 0; i < sphereCount; i++) {
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / sphereCount, 0.8, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(0, 0, 0)

    spheres.push({
      mesh: sphere,
      split: false,
      phase: Math.random() * Math.PI * 2,
      direction: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize()
    })

    scene.add(sphere)
  }

  const split = () => {
    spheres.forEach((sphere, i) => {
      setTimeout(() => {
        sphere.split = true

        gsap.to(sphere.mesh.material, {
          opacity: 0.6,
          duration: 1
        })

        // 创建分裂副本
        const duplicate = sphere.mesh.clone()
        duplicate.material = sphere.mesh.material.clone()
        scene.add(duplicate)

        const targetPos1 = sphere.direction.clone().multiplyScalar(splitDistance)
        const targetPos2 = sphere.direction.clone().multiplyScalar(-splitDistance)

        gsap.to(sphere.mesh.position, {
          x: targetPos1.x,
          y: targetPos1.y,
          z: targetPos1.z,
          duration: 2,
          ease: 'power2.out'
        })

        gsap.to(duplicate.position, {
          x: targetPos2.x,
          y: targetPos2.y,
          z: targetPos2.z,
          duration: 2,
          ease: 'power2.out'
        })

        sphere.duplicate = duplicate
      }, i * 200)
    })
  }

  const update = () => {
    spheres.forEach(sphere => {
      if (sphere.split) {
        const pulse = Math.sin(Date.now() * 0.003 + sphere.phase)
        sphere.mesh.scale.setScalar(1 + pulse * 0.2)

        if (sphere.duplicate) {
          sphere.duplicate.scale.setScalar(1 + pulse * 0.2)
        }
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    split,
    dispose() {
      cancelAnimationFrame(animationId)
      spheres.forEach(sphere => {
        scene.remove(sphere.mesh)
        sphere.mesh.geometry.dispose()
        sphere.mesh.material.dispose()
        if (sphere.duplicate) {
          scene.remove(sphere.duplicate)
          sphere.duplicate.geometry.dispose()
          sphere.duplicate.material.dispose()
        }
      })
    }
  }
}

/**
 * 创建量子隧穿通道
 */
function createTunnelingPortals(scene, options = {}) {
  const {
    portalCount = 6,
    tunnelLength = 200
  } = options

  const portals = []

  for (let i = 0; i < portalCount; i++) {
    const geometry = new THREE.TorusGeometry(15, 2, 16, 32)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / portalCount, 1, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const portal = new THREE.Mesh(geometry, material)
    portal.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    )
    portal.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    portals.push({
      mesh: portal,
      open: false,
      particles: createTunnelingParticles(portal.position, 500)
    })

    scene.add(portal)
  }

  const open = () => {
    portals.forEach((portal, i) => {
      setTimeout(() => {
        portal.open = true

        gsap.to(portal.mesh.material, {
          opacity: 0.7,
          duration: 1
        })

        portal.particles.start()
      }, i * 500)
    })
  }

  const update = () => {
    portals.forEach(portal => {
      if (portal.open) {
        portal.mesh.rotation.z += 0.02
        const pulse = Math.sin(Date.now() * 0.005)
        portal.mesh.scale.setScalar(1 + pulse * 0.1)
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    open,
    dispose() {
      cancelAnimationFrame(animationId)
      portals.forEach(portal => {
        scene.remove(portal.mesh)
        portal.mesh.geometry.dispose()
        portal.mesh.material.dispose()
        portal.particles.dispose()
      })
    }
  }
}

/**
 * 创建隧穿粒子
 */
function createTunnelingParticles(position, particleCount) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = position.x + (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 10

    const color = new THREE.Color().setHSL(Math.random(), 1, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const speed = 2 + Math.random() * 3

    velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
    velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
    velocities[i * 3 + 2] = Math.cos(phi) * speed
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  return {
    points,
    velocities,
    started: false,

    start() {
      this.started = true
      gsap.to(material, {
        opacity: 0.8,
        duration: 0.5
      })
    },

    update() {
      if (this.started) {
        const positions = points.geometry.attributes.position.array

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3]
          positions[i * 3 + 1] += velocities[i * 3 + 1]
          positions[i * 3 + 2] += velocities[i * 3 + 2]

          // 循环
          const dist = Math.sqrt(
            (positions[i * 3] - position.x) ** 2 +
            (positions[i * 3 + 1] - position.y) ** 2 +
            (positions[i * 3 + 2] - position.z) ** 2
          )

          if (dist > 30) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 5
            positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 5
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 5
          }
        }

        points.geometry.attributes.position.needsUpdate = true
      }
    },

    dispose() {
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建薛定谔猫
 */
function createSchrodingerCat(scene) {
  const group = new THREE.Group()

  // 猫的外形（简化的抽象表现）
  const bodyGeometry = new THREE.SphereGeometry(10, 32, 32)
  const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

  const headGeometry = new THREE.SphereGeometry(6, 32, 32)
  const headMaterial = bodyMaterial.clone()
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 12

  const earGeometry = new THREE.ConeGeometry(2, 4, 16)
  const earMaterial = bodyMaterial.clone()
  const ear1 = new THREE.Mesh(earGeometry, earMaterial)
  ear1.position.set(4, 18, 0)
  const ear2 = new THREE.Mesh(earGeometry, earMaterial)
  ear2.position.set(-4, 18, 0)

  group.add(body, head, ear1, ear2)
  scene.add(group)

  let observed = false
  let alive = true

  const observe = () => {
    observed = true
    alive = Math.random() > 0.5

    gsap.to(bodyMaterial, {
      opacity: 0.6,
      duration: 1
    })

    gsap.to(headMaterial, {
      opacity: 0.6,
      duration: 1
    })

    gsap.to(earMaterial, {
      opacity: 0.6,
      duration: 1
    })

    // 根据观测结果改变颜色
    const color = alive ? new THREE.Color(0x00ff00) : new THREE.Color(0xff0000)
    gsap.to(bodyMaterial.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 2
    })
    gsap.to(headMaterial.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 2
    })
    gsap.to(earMaterial.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 2
    })
  }

  const update = () => {
    if (!observed) {
      // 叠加态：在生和死之间波动
      const flux = Math.sin(Date.now() * 0.003)
      bodyMaterial.opacity = Math.abs(flux) * 0.3
      headMaterial.opacity = Math.abs(flux) * 0.3
      earMaterial.opacity = Math.abs(flux) * 0.3

      bodyMaterial.color.setHSL(0.83 + flux * 0.17, 1, 0.5)
      headMaterial.color.setHSL(0.83 + flux * 0.17, 1, 0.5)
      earMaterial.color.setHSL(0.83 + flux * 0.17, 1, 0.5)
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    observe,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      bodyGeometry.dispose()
      bodyMaterial.dispose()
      headGeometry.dispose()
      headMaterial.dispose()
      earGeometry.dispose()
      earMaterial.dispose()
    }
  }
}

/**
 * 创建量子泡沫背景
 */
function createQuantumFoam(scene, options = {}) {
  const {
    bubbleCount = 8000,
    foamRadius = 350
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(bubbleCount * 3)
  const sizes = new Float32Array(bubbleCount)

  for (let i = 0; i < bubbleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = foamRadius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    sizes[i] = 1 + Math.random() * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 2,
    color: 0x4466ff,
    transparent: true,
    opacity: 0.2
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const update = () => {
    points.rotation.x += 0.0002
    points.rotation.y += 0.0003
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建概率云干涉
 */
function createProbabilityInterference(scene, options = {}) {
  const {
    patternCount = 3,
    fringeCount = 20
  } = options

  const group = new THREE.Group()
  const rings = []

  for (let p = 0; p < patternCount; p++) {
    for (let i = 0; i < fringeCount; i++) {
      const geometry = new THREE.RingGeometry(i * 10 + 20, i * 10 + 22, 64)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + p * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })

      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.x = p * Math.PI / 3
      ring.rotation.y = p * Math.PI / 4

      rings.push({
        mesh: ring,
        interfering: false,
        delay: i * 0.1
      })

      group.add(ring)
    }
  }

  scene.add(group)

  const interfere = () => {
    rings.forEach(ring => {
      setTimeout(() => {
        ring.interfering = true

        gsap.to(ring.mesh.material, {
          opacity: 0.5,
          duration: 1
        })

        gsap.to(ring.mesh.material, {
          opacity: 0,
          duration: 2,
          delay: 1
        })
      }, ring.delay * 1000)
    })
  }

  const update = () => {
    rings.forEach(ring => {
      if (ring.interfering) {
        ring.mesh.rotation.z += 0.005
      }
    })

    group.rotation.y += 0.002
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    interfere,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      rings.forEach(ring => {
        ring.mesh.geometry.dispose()
        ring.mesh.material.dispose()
      })
    }
  }
}
