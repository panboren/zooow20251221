/**
 * 特效基类 - 统一特效架构
 * 所有特效都应继承此类，实现代码复用和标准化
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createHighPerformanceParticles } from '~/utils/highPerformanceParticles.js'
import { InstancedParticleSystem } from '~/utils/InstancedParticleSystem.js'

export class BaseEffect {
  constructor(scene, camera, renderer, controls) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.controls = controls
    this.objects = []  // 存储所有创建的对象
    this.timeline = null
    this.animationId = null
    this.isActive = false
  }

  /**
   * 创建粒子系统（子类可覆盖）
   */
  createParticleSystem(count, options = {}) {
    const particleSystem = createHighPerformanceParticles(this.scene, {
      count,
      ...options
    })
    this.objects.push(particleSystem)
    return particleSystem
  }

  /**
   * 创建高性能 InstancedMesh 粒子系统
   */
  createInstancedParticleSystem(count, options = {}) {
    const particleSystem = new InstancedParticleSystem(this.scene, {
      count,
      ...options
    })
    this.objects.push(particleSystem)
    return particleSystem
  }

  /**
   * 创建几何体
   */
  createMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    this.objects.push(mesh)
    return mesh
  }

  /**
   * 创建点云
   */
  createPoints(geometry, material) {
    const points = new THREE.Points(geometry, material)
    this.scene.add(points)
    this.objects.push(points)
    return points
  }

  /**
   * 创建线条
   */
  createLine(geometry, material) {
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
    this.objects.push(line)
    return line
  }

  /**
   * 创建组
   */
  createGroup() {
    const group = new THREE.Group()
    this.scene.add(group)
    this.objects.push(group)
    return group
  }

  /**
   * 创建 GSAP 时间线
   */
  createTimeline(onComplete) {
    this.timeline = gsap.timeline({
      onComplete: () => {
        this.cleanup()
        onComplete?.()
      }
    })
    return this.timeline
  }

  /**
   * 创建缓动动画
   */
  animate(object, properties, options = {}) {
    return gsap.to(object, {
      ...properties,
      ...options
    })
  }

  /**
   * 设置相机动画
   */
  animateCamera(targetPosition, duration = 2) {
    return gsap.to(this.camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 设置相机观察点动画
   */
  animateCameraLookAt(targetPosition, duration = 2) {
    const currentLookAt = new THREE.Vector3()
    this.camera.getWorldDirection(currentLookAt)

    return gsap.to(this.controls.target, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 颜色动画
   */
  animateColor(color, targetColor, duration = 2, onUpdate) {
    const target = typeof targetColor === 'string'
      ? new THREE.Color(targetColor)
      : targetColor

    return gsap.to(color, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        onUpdate?.(color)
      }
    })
  }

  /**
   * 粒子颜色动画
   */
  animateParticleColors(particleSystem, targetColor, duration = 2) {
    const color = new THREE.Color(targetColor)
    return gsap.to(particleSystem.material.color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 粒子大小动画
   */
  animateParticleSize(particleSystem, targetSize, duration = 2) {
    return gsap.to(particleSystem.material, {
      size: targetSize,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 粒子不透明度动画
   */
  animateParticleOpacity(particleSystem, targetOpacity, duration = 2) {
    return gsap.to(particleSystem.material, {
      opacity: targetOpacity,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 启动动画循环
   */
  startAnimationLoop(updateFn) {
    this.isActive = true

    const animate = () => {
      if (!this.isActive) return

      updateFn?.()
      this.animationId = requestAnimationFrame(animate)
    }

    animate()
  }

  /**
   * 停止动画循环
   */
  stopAnimationLoop() {
    this.isActive = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 停止动画循环
    this.stopAnimationLoop()

    // 清理时间线
    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }

    // 清理所有对象
    this.objects.forEach(obj => {
      if (obj.dispose) {
        // 粒子系统有 dispose 方法
        obj.dispose()
      } else if (obj.geometry) {
        // 标准的 Three.js 对象
        this.scene.remove(obj)
        obj.geometry.dispose()
        obj.material?.dispose()
      } else if (obj.group) {
        // 组对象
        this.scene.remove(obj.group)
      } else if (obj.mesh) {
        // 粒子系统对象
        this.scene.remove(obj.mesh)
        obj.geometry?.dispose()
        obj.material?.dispose()
      }
    })

    this.objects = []
  }

  /**
   * 子类必须实现的播放方法
   */
  play() {
    throw new Error('子类必须实现 play 方法')
  }

  /**
   * 子类可选实现的暂停方法
   */
  pause() {
    if (this.timeline) {
      this.timeline.pause()
    }
    this.stopAnimationLoop()
  }

  /**
   * 子类可选实现的恢复方法
   */
  resume() {
    if (this.timeline) {
      this.timeline.resume()
    }
    this.isActive = true
  }

  /**
   * 子类可选实现的停止方法
   */
  stop() {
    this.pause()
    this.cleanup()
  }
}
