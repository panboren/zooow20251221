/**
 * 全息特效测试页面
 * 用于独立测试和调试全息动画效果
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { gsap } from 'gsap'
import {
  animateHolographicDataStream,
  animateHolographicRingArray,
  animateHolographicSpiral,
  animateHolographicSphereArray,
  animateHolographicGlitch
} from './holographic-animations-enhanced.js'

class HolographicTest {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.container = null
    this.currentAnimation = null
  }

  init(container) {
    this.container = container || document.body

    // 创建场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 100

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)

    // 创建控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    // 响应窗口大小变化
    window.addEventListener('resize', () => this.onResize())

    // 开始渲染循环
    this.animate()

    // 创建测试UI
    this.createTestUI()

    console.log('全息特效测试系统已初始化')
  }

  createTestUI() {
    const ui = document.createElement('div')
    ui.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 20, 40, 0.9);
      padding: 20px;
      border-radius: 10px;
      color: white;
      font-family: Arial, sans-serif;
      z-index: 1000;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
      border: 1px solid rgba(0, 255, 255, 0.3);
    `

    const title = document.createElement('h3')
    title.textContent = '🔮 全息特效测试'
    title.style.margin = '0 0 15px 0'
    title.style.color = '#00ffff'
    ui.appendChild(title)

    const animations = [
      { key: 'data-stream', label: '🔮 全息数据流', fn: animateHolographicDataStream },
      { key: 'ring-array', label: '💫 全息环形阵列', fn: animateHolographicRingArray },
      { key: 'spiral', label: '🌀 全息螺旋', fn: animateHolographicSpiral },
      { key: 'sphere-array', label: '⚪ 全息球体阵列', fn: animateHolographicSphereArray },
      { key: 'glitch', label: '📺 全息故障艺术', fn: animateHolographicGlitch }
    ]

    animations.forEach(anim => {
      const btn = document.createElement('button')
      btn.textContent = anim.label
      btn.style.cssText = `
        display: block;
        width: 100%;
        margin: 8px 0;
        padding: 10px 15px;
        background: rgba(0, 100, 150, 0.6);
        border: 1px solid rgba(0, 255, 255, 0.5);
        color: white;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 14px;
      `
      btn.onmouseenter = () => {
        btn.style.background = 'rgba(0, 150, 200, 0.8)'
        btn.style.transform = 'scale(1.02)'
      }
      btn.onmouseleave = () => {
        btn.style.background = 'rgba(0, 100, 150, 0.6)'
        btn.style.transform = 'scale(1)'
      }
      btn.onclick = () => this.playAnimation(anim.fn, anim.label)
      ui.appendChild(btn)
    })

    const resetBtn = document.createElement('button')
    resetBtn.textContent = '🔄 重置场景'
    resetBtn.style.cssText = `
      display: block;
      width: 100%;
      margin: 15px 0 0 0;
      padding: 10px 15px;
      background: rgba(150, 50, 50, 0.6);
      border: 1px solid rgba(255, 100, 100, 0.5);
      color: white;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;
    `
    resetBtn.onclick = () => this.resetScene()
    ui.appendChild(resetBtn)

    this.container.appendChild(ui)
  }

  playAnimation(animFn, label) {
    console.log(`开始播放: ${label}`)

    // 重置场景
    this.resetScene()

    // 禁用控制器
    this.controls.enabled = false

    // 重置相机位置
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)

    // 播放动画
    try {
      const props = {
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
        controls: this.controls
      }

      this.currentAnimation = animFn(props, {
        onComplete: () => {
          console.log(`${label} 动画完成`)
          this.controls.enabled = true
        },
        onError: (err) => {
          console.error(`${label} 动画错误:`, err)
          this.controls.enabled = true
        }
      })
    } catch (error) {
      console.error(`播放 ${label} 失败:`, error)
      this.controls.enabled = true
    }
  }

  resetScene() {
    // 取消当前动画
    if (this.currentAnimation) {
      this.currentAnimation.kill()
      this.currentAnimation = null
    }

    // 清理场景中的所有对象
    const objectsToRemove = []
    this.scene.traverse((child) => {
      if (child.isMesh || child.isPoints) {
        objectsToRemove.push(child)
      }
    })

    objectsToRemove.forEach(obj => {
      this.scene.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    })

    // 重置背景
    this.scene.background = new THREE.Color(0x000000)
    this.scene.fog = null

    // 重置相机
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)

    // 启用控制器
    this.controls.enabled = true
    this.controls.update()

    console.log('场景已重置')
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

// 导出
export default HolographicTest

// 如果在浏览器中直接运行此文件
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const test = new HolographicTest()
    test.init()
    console.log('提示：使用右上角的UI测试各个全息特效')
  })
}
