/**
 * effects/lightning-chain.js
 * 闪电连锁特效 - 递归生成闪电分支
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建闪电
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 闪电对象
 */
export function createLightningChain(scene, options = {}) {
  const {
    maxDepth = 4,
    maxBranches = 5,
    branchChance = 0.7,
    length = 50,
    color = new THREE.Color(0x88ccff),
    glowColor = new THREE.Color(0xffffff),
    thickness = 0.2
  } = options

  const lightningGroups = []

  /**
     * 生成闪电分支
     */
  function createBranch(startPoint, direction, depth, parentThickness) {
    if (depth > maxDepth) return null

    const currentThickness = parentThickness * 0.6
    const segmentLength = length / maxDepth

    // 创建折线路径
    const points = [startPoint.clone()]
    const segments = 5 + Math.floor(Math.random() * 5)

    for (let i = 0; i < segments; i++) {
      const point = startPoint.clone()
        .add(direction.clone().multiplyScalar(segmentLength * (i + 1) / segments))

      // 添加随机偏移
      point.x += (Math.random() - 0.5) * segmentLength * 0.3
      point.y += (Math.random() - 0.5) * segmentLength * 0.3
      point.z += (Math.random() - 0.5) * segmentLength * 0.3

      points.push(point)
    }

    // 创建线条
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    })

    const line = new THREE.Line(geometry, material)
    scene.add(line)

    // 创建发光效果
    const glowGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const glowMaterial = new THREE.LineBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.5,
      linewidth: thickness * 3,
      blending: THREE.AdditiveBlending
    })
    const glowLine = new THREE.Line(glowGeometry, glowMaterial)
    scene.add(glowLine)

    const branch = { line, glowLine, children: [] }
    lightningGroups.push(branch)

    // 递归创建子分支
    if (Math.random() < branchChance && depth < maxDepth) {
      const numBranches = 1 + Math.floor(Math.random() * maxBranches)

      for (let i = 0; i < numBranches; i++) {
        const branchDirection = direction.clone()
        branchDirection.x += (Math.random() - 0.5) * 0.8
        branchDirection.y += (Math.random() - 0.5) * 0.8
        branchDirection.z += (Math.random() - 0.5) * 0.8
        branchDirection.normalize()

        const childBranch = createBranch(
          points[points.length - 1],
          branchDirection,
          depth + 1,
          currentThickness
        )

        if (childBranch) {
          branch.children.push(childBranch)
        }
      }
    }

    return branch
  }

  // 创建主干闪电
  const startPoint = new THREE.Vector3(0, 30, 0)
  const direction = new THREE.Vector3(0, -1, 0)
  const mainBranch = createBranch(startPoint, direction, 0, thickness)

  // 添加点光源
  const light = new THREE.PointLight(color, 5, 50)
  light.position.copy(startPoint)
  scene.add(light)

  return {
    lightningGroups,
    light,
    update(time) {
      // 更新透明度实现闪烁
      const flicker = 0.5 + Math.random() * 0.5
      lightningGroups.forEach(branch => {
        branch.line.material.opacity = flicker
        branch.glowLine.material.opacity = flicker * 0.5
      })
      light.intensity = flicker * 5
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 闪电闪烁
      const flickers = 5
      for (let i = 0; i < flickers; i++) {
        tl.to(light, {
          intensity: 10,
          duration: 0.05,
          ease: 'power1.in',
          onComplete: () => {
            lightningGroups.forEach(branch => {
              branch.line.material.opacity = 1
              branch.glowLine.material.opacity = 0.8
            })
          }
        })

        tl.to(light, {
          intensity: 1,
          duration: 0.05,
          ease: 'power1.out',
          onComplete: () => {
            lightningGroups.forEach(branch => {
              branch.line.material.opacity = 0.3
              branch.glowLine.material.opacity = 0.15
            })
          }
        })
      }

      // 最终消退
      tl.to({}, {
        duration: duration * 0.3
      })

      return tl
    },
    destroy() {
      lightningGroups.forEach(branch => {
        scene.remove(branch.line)
        scene.remove(branch.glowLine)
        branch.line.geometry.dispose()
        branch.line.material.dispose()
        branch.glowLine.geometry.dispose()
        branch.glowLine.material.dispose()
      })
      scene.remove(light)
    }
  }
}
