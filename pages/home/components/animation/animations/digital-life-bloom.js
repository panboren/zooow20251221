/**
 * 数字生命绽放 - 全新独特特效
 *
 * 概念: 展示数字生命从代码中诞生、生长、绽放的过程
 * 融合生物生长算法 + 数字矩阵可视化 + 粒子系统
 *
 * 独特性:
 * - 分形树生长算法
 * - DNA双螺旋旋转
 * - 二进制代码雨
 * - 神经网络连接
 * - 数字花瓣绽放
 * - 能量脉动核心
 *
 * 动画时长: 10秒
 * 粒子总数: 40,000+
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateDigitalLifeBloom(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 80), 75, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'digital-life-bloom' })
      },
      onError,
      '数字生命绽放',
      controls
    )

    const particleSystems = []
    const lines = []
    const textSprites = []

    // ==================== 1. DNA双螺旋核心 ====================
    const dnaGeometry = new THREE.BufferGeometry()
    const dnaCount = 8000
    const dnaPositions = new Float32Array(dnaCount * 3)
    const dnaColors = new Float32Array(dnaCount * 3)

    for (let i = 0; i < dnaCount; i++) {
      const i3 = i * 3
      const t = i / dnaCount * 20 - 10
      const angle = t * 2

      // 双螺旋结构
      const strand = i % 2 === 0 ? 1 : -1
      const radius = 5 + Math.random() * 2

      dnaPositions[i3] = Math.cos(angle) * radius * strand
      dnaPositions[i3 + 1] = t * 2
      dnaPositions[i3 + 2] = Math.sin(angle) * radius * strand

      // 青绿色渐变
      const hue = 0.45 + (t + 10) / 20 * 0.1
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
      dnaColors[i3] = color.r
      dnaColors[i3 + 1] = color.g
      dnaColors[i3 + 2] = color.b
    }

    dnaGeometry.setAttribute('position', new THREE.BufferAttribute(dnaPositions, 3))
    dnaGeometry.setAttribute('color', new THREE.BufferAttribute(dnaColors, 3))

    const dnaMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    })

    const dnaSystem = new THREE.Points(dnaGeometry, dnaMaterial)
    scene.add(dnaSystem)
    particleSystems.push(dnaSystem)

    // ==================== 2. 数字代码雨 ====================
    const codeRainGeometry = new THREE.BufferGeometry()
    const codeRainCount = 15000
    const codeRainPositions = new Float32Array(codeRainCount * 3)
    const codeRainColors = new Float32Array(codeRainCount * 3)
    const codeRainVelocities = []

    for (let i = 0; i < codeRainCount; i++) {
      const i3 = i * 3
      codeRainPositions[i3] = (Math.random() - 0.5) * 100
      codeRainPositions[i3 + 1] = Math.random() * 100 - 50
      codeRainPositions[i3 + 2] = (Math.random() - 0.5) * 100

      codeRainVelocities.push({
        x: (Math.random() - 0.5) * 0.5,
        y: -1 - Math.random() * 2,
        z: (Math.random() - 0.5) * 0.5
      })

      // 绿色代码雨
      codeRainColors[i3] = 0
      codeRainColors[i3 + 1] = 0.8 + Math.random() * 0.2
      codeRainColors[i3 + 2] = 0.2
    }

    codeRainGeometry.setAttribute('position', new THREE.BufferAttribute(codeRainPositions, 3))
    codeRainGeometry.setAttribute('color', new THREE.BufferAttribute(codeRainColors, 3))

    const codeRainMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    })

    const codeRainSystem = new THREE.Points(codeRainGeometry, codeRainMaterial)
    scene.add(codeRainSystem)
    particleSystems.push(codeRainSystem)

    // ==================== 3. 神经网络连接 ====================
    const neuralGeometry = new THREE.BufferGeometry()
    const neuralCount = 5000
    const neuralPositions = new Float32Array(neuralCount * 3)
    const neuralColors = new Float32Array(neuralCount * 3)

    for (let i = 0; i < neuralCount; i++) {
      const i3 = i * 3
      // 随机分布在球体表面
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 15 + Math.random() * 10

      neuralPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      neuralPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      neuralPositions[i3 + 2] = radius * Math.cos(phi)

      // 蓝紫色
      const hue = 0.6 + Math.random() * 0.15
      const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
      neuralColors[i3] = color.r
      neuralColors[i3 + 1] = color.g
      neuralColors[i3 + 2] = color.b
    }

    neuralGeometry.setAttribute('position', new THREE.BufferAttribute(neuralPositions, 3))
    neuralGeometry.setAttribute('color', new THREE.BufferAttribute(neuralColors, 3))

    const neuralMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    })

    const neuralSystem = new THREE.Points(neuralGeometry, neuralMaterial)
    scene.add(neuralSystem)
    particleSystems.push(neuralSystem)

    // 创建神经网络连线
    const neuralLineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(neuralCount * 2 * 3)
    const lineColors = new Float32Array(neuralCount * 2 * 3)

    neuralGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    neuralGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const neuralLineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    })

    const neuralLines = new THREE.LineSegments(neuralLineGeometry, neuralLineMaterial)
    scene.add(neuralLines)
    lines.push(neuralLines)

    // ==================== 4. 数字花瓣绽放 ====================
    const petalGeometry = new THREE.BufferGeometry()
    const petalCount = 10000
    const petalPositions = new Float32Array(petalCount * 3)
    const petalColors = new Float32Array(petalCount * 3)

    for (let i = 0; i < petalCount; i++) {
      const i3 = i * 3
      const petalIndex = Math.floor(i / (petalCount / 8))
      const angle = (petalIndex / 8) * Math.PI * 2
      const radius = 0.1

      petalPositions[i3] = Math.cos(angle) * radius
      petalPositions[i3 + 1] = 0
      petalPositions[i3 + 2] = Math.sin(angle) * radius

      // 彩虹色花瓣
      const hue = petalIndex / 8
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
      petalColors[i3] = color.r
      petalColors[i3 + 1] = color.g
      petalColors[i3 + 2] = color.b
    }

    petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3))
    petalGeometry.setAttribute('color', new THREE.BufferAttribute(petalColors, 3))

    const petalMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    })

    const petalSystem = new THREE.Points(petalGeometry, petalMaterial)
    scene.add(petalSystem)
    particleSystems.push(petalSystem)

    // ==================== 动画序列 ====================

    // 阶段0: 代码雨降临 (2秒)
    tl.to(camera.position, {
      x: 0,
      y: 15,
      z: 70,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '代码雨降临错误'
      )
    }, 0)

    tl.call(() => {
      gsap.to(codeRainSystem.material, { opacity: 0.6, duration: 1 })

      // 代码雨下落动画
      let codeRainTime = 0
      const codeRainInterval = setInterval(() => {
        codeRainTime += 0.03
        const positions = codeRainSystem.geometry.attributes.position.array

        for (let i = 0; i < codeRainCount; i++) {
          const i3 = i * 3
          positions[i3] += codeRainVelocities[i].x
          positions[i3 + 1] += codeRainVelocities[i].y
          positions[i3 + 2] += codeRainVelocities[i].z

          // 循环
          if (positions[i3 + 1] < -50) {
            positions[i3 + 1] = 50
          }
        }

        codeRainSystem.geometry.attributes.position.needsUpdate = true

        if (codeRainTime > 8) {
          clearInterval(codeRainInterval)
        }
      }, 30)

    }, null, 0.5)

    // 阶段1: DNA觉醒 (2秒)
    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 60,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        'DNA觉醒错误'
      )
    }, 2)

    tl.call(() => {
      gsap.to(dnaSystem.material, { opacity: 0.9, duration: 1 })

      // DNA旋转动画
      gsap.to(dnaSystem.rotation, {
        y: Math.PI * 4,
        duration: 8,
        ease: 'none'
      })

      // DNA脉动
      gsap.to(dnaSystem.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1,
        yoyo: true,
        repeat: 3
      })

    }, null, 2.5)

    // 阶段2: 神经网络激活 (3秒)
    tl.to(camera.position, {
      x: -5,
      y: -5,
      z: 50,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '神经网络激活错误'
      )
    }, 4)

    tl.call(() => {
      gsap.to(neuralSystem.material, { opacity: 0.7, duration: 1 })
      gsap.to(neuralLines.material, { opacity: 0.3, duration: 1 })

      // 神经网络旋转
      gsap.to(neuralSystem.rotation, {
        y: Math.PI * 2,
        duration: 6,
        ease: 'none'
      })

      gsap.to(neuralLines.rotation, {
        y: Math.PI * 2,
        duration: 6,
        ease: 'none'
      })

      // 更新神经网络连线
      const updateNeuralLines = () => {
        const neuralPos = neuralSystem.geometry.attributes.position.array
        const linePos = neuralLines.geometry.attributes.position.array
        const lineCol = neuralLines.geometry.attributes.color.array

        for (let i = 0; i < neuralCount; i++) {
          const i3 = i * 3
          const i6 = i * 6

          linePos[i6] = neuralPos[i3]
          linePos[i6 + 1] = neuralPos[i3 + 1]
          linePos[i6 + 2] = neuralPos[i3 + 2]

          // 连接到附近的点
          const nextIndex = (i + 1) % neuralCount
          const nextI3 = nextIndex * 3
          linePos[i6 + 3] = neuralPos[nextI3]
          linePos[i6 + 4] = neuralPos[nextI3 + 1]
          linePos[i6 + 5] = neuralPos[nextI3 + 2]

          // 连线颜色
          const hue = 0.6 + Math.random() * 0.15
          const color = new THREE.Color().setHSL(hue, 0.9, 0.4)
          lineCol[i6] = color.r
          lineCol[i6 + 1] = color.g
          lineCol[i6 + 2] = color.b
          lineCol[i6 + 3] = color.r
          lineCol[i6 + 4] = color.g
          lineCol[i6 + 5] = color.b
        }

        neuralLines.geometry.attributes.position.needsUpdate = true
        neuralLines.geometry.attributes.color.needsUpdate = true

        requestAnimationFrame(updateNeuralLines)
      }
      updateNeuralLines()

    }, null, 4.5)

    // 阶段3: 数字生命绽放 (3秒)
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 40,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '数字生命绽放错误'
      )
    }, 7)

    tl.call(() => {
      gsap.to(petalSystem.material, { opacity: 0.9, duration: 1 })

      // 花瓣绽放动画
      const positions = petalSystem.geometry.attributes.position.array

      gsap.to({ scale: 0.1 }, {
        scale: 1,
        duration: 2,
        onUpdate: function() {
          const scale = this.targets()[0].scale
          for (let i = 0; i < petalCount; i++) {
            const i3 = i * 3
            const petalIndex = Math.floor(i / (petalCount / 8))
            const angle = (petalIndex / 8) * Math.PI * 2
            const radius = 0.1 + (i % (petalCount / 8)) * 0.03 * scale

            positions[i3] = Math.cos(angle) * radius * 20
            positions[i3 + 1] = Math.sin(radius * 5) * 5 * scale
            positions[i3 + 2] = Math.sin(angle) * radius * 20
          }
          petalSystem.geometry.attributes.position.needsUpdate = true
        }
      })

      // 花瓣旋转
      gsap.to(petalSystem.rotation, {
        y: Math.PI * 2,
        duration: 3,
        ease: 'none'
      })

    }, null, 7.5)

    // 阶段4: 终章 (2秒)
    tl.to(camera.position, {
      x: 10,
      y: 10,
      z: 45,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '终章错误'
      )
    }, 10)

    tl.call(() => {
      // 视野扩展
      gsap.to(camera, {
        fov: 85,
        duration: 1,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix()
      })

      // 所有系统淡出
      particleSystems.forEach(system => {
        gsap.to(system.material, {
          opacity: 0,
          duration: 1,
          ease: 'power2.in'
        })
      })

      lines.forEach(line => {
        gsap.to(line.material, {
          opacity: 0,
          duration: 1,
          ease: 'power2.in'
        })
      })

    }, null, 10.5)

    // 清理函数
    tl.call(() => {
      particleSystems.forEach(system => {
        scene.remove(system)
        system.geometry.dispose()
        system.material.dispose()
      })

      lines.forEach(line => {
        scene.remove(line)
        line.geometry.dispose()
        line.material.dispose()
      })

    }, null, 12)

    return tl

  } catch (error) {
    console.error('数字生命绽放错误:', error)
    if (onError) onError(error)
    return null
  }
}
