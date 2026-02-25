/**
 * WebGPU 特效基类
 * 支持 WebGL2 和 WebGPU 的特效基类
 * 提供统一的特效接口，自动适配不同的渲染器
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createHighPerformanceParticles } from '~/utils/highPerformanceParticles.js'
import { InstancedParticleSystem } from '~/utils/InstancedParticleSystem.js'
import { createCompatibleShaderMaterial } from '~/utils/WebGPURendererFactory.js'

export class WebGPUBaseEffect {
  constructor(scene, camera, renderer, rendererType = 'webgl2') {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.rendererType = rendererType
    this.controls = null
    this.objects = []  // 存储所有创建的对象
    this.timeline = null
    this.animationId = null
    this.isActive = false
    this.uniforms = {}  // 统一管理着色器 uniforms
  }

  /**
   * 创建着色器材质（自动适配渲染器类型）
   */
  createShaderMaterial(vertexShader, fragmentShader, uniforms = {}) {
    const material = createCompatibleShaderMaterial(
      vertexShader,
      fragmentShader,
      uniforms,
      this.rendererType
    )

    // 存储 uniforms 以便统一更新
    Object.assign(this.uniforms, uniforms)
    return material
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
   * Uniform 动画
   */
  animateUniform(uniformObject, targetValue, duration = 2) {
    return gsap.to(uniformObject, {
      value: targetValue,
      duration: duration,
      ease: 'power2.inOut'
    })
  }

  /**
   * 批量更新 uniforms（WebGPU 优化）
   */
  updateUniforms(time, delta) {
    for (const key in this.uniforms) {
      const uniform = this.uniforms[key]
      if (uniform && typeof uniform.value !== 'undefined') {
        // 如果 uniform 有 update 方法，调用它
        if (typeof uniform.update === 'function') {
          uniform.update(time, delta)
        }
      }
    }
  }

  /**
   * 启动动画循环
   */
  startAnimationLoop(updateFn) {
    this.isActive = true

    const animate = (time) => {
      if (!this.isActive) return

      // WebGPU 需要传入时间参数
      const seconds = time * 0.001
      updateFn?.(seconds, 0.016)

      // 批量更新 uniforms
      this.updateUniforms(seconds, 0.016)

      this.animationId = requestAnimationFrame(animate)
    }

    animate(0)
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

    // 清理 uniforms
    this.uniforms = {}

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

  /**
   * 获取渲染器类型
   */
  getRendererType() {
    return this.rendererType
  }

  /**
   * 判断是否为 WebGPU
   */
  isWebGPU() {
    return this.rendererType === 'webgpu'
  }

  /**
   * 判断是否为 WebGL2
   */
  isWebGL2() {
    return this.rendererType === 'webgl2'
  }
}
