/**
 * 全息特效测试文件
 * 用于验证全息特效是否正常工作
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createHolographicCube,
  createHolographicScanlines,
  updateHolographicObjects
} from './holographic-factory.js'

/**
 * 简单的全息测试动画
 */
export function testHolographicEffect(scene, camera, renderer, controls) {
  const tl = gsap.timeline()

  // 创建测试对象
  const cube = createHolographicCube(10, {
    color: new THREE.Color(0x00ffff),
    glowIntensity: 1.5
  })
  scene.add(cube)

  const scanlines = createHolographicScanlines(100, {
    color: new THREE.Color(0x00ffff)
  })
  scene.add(scanlines)

  console.log('✅ 全息特效测试：对象创建成功')

  // 动画变量
  let time = 0

  // 更新函数
  function update() {
    time += 0.016
    updateHolographicObjects(scene, time)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }

  // 启动动画循环
  const animate = () => {
    update()
    requestAnimationFrame(animate)
  }
  animate()

  // 简单动画
  tl.to(cube.scale, { x: 2, y: 2, z: 2, duration: 2, ease: 'power2.inOut' })
  tl.to(cube.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'power2.inOut' })

  // 清理
  tl.to({}, {
    duration: 4,
    onComplete: () => {
      console.log('✅ 全息特效测试：动画完成')
      scene.remove(cube, scanlines)
      cube.geometry.dispose()
      cube.material.dispose()
      scanlines.geometry.dispose()
      scanlines.material.dispose()
    }
  })

  return tl
}

console.log('✅ 全息特效测试模块加载成功')
