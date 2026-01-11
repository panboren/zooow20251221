/**
 * effects/butterfly-swarm.js
 * 蝴蝶飞舞特效
 * 生命、灵动、追光
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

// 添加 Three.js 模块兼容处理
if (typeof THREE !== 'undefined' && !THREE.Vector3) {
  console.warn('THREE module not properly loaded in butterfly-swarm.js')
}

/**
 * 创建蝴蝶飞舞
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 蝴蝶对象
 */
export function createButterflySwarm(scene, options = {}) {
  const {
    butterflyCount = 300,
    flyRadius = 40
  } = options

  const butterflies = []

  // 蝴蝶颜色
  const wingColors = [
    { left: 0x00bfff, right: 0xff6b6b },
    { left: 0xffd700, right: 0x8b4513 },
    { left: 0x9370db, right: 0xff69b4 },
    { left: 0x00ff7f, right: 0x0000ff },
    { left: 0xffffff, right: 0xffa500 }
  ]

  // 创建蝴蝶
  for (let i = 0; i < butterflyCount; i++) {
    const colorScheme = wingColors[Math.floor(Math.random() * wingColors.length)]

    // 左翅膀
    const leftWingGeo = new THREE.Shape()
    leftWingGeo.moveTo(0, 0)
    leftWingGeo.bezierCurveTo(-0.3, 0.2, -0.5, 0, -0.4, -0.4)
    leftWingGeo.bezierCurveTo(-0.3, -0.6, -0.1, -0.5, 0, 0)

    const leftWing = new THREE.Mesh(
      new THREE.ShapeGeometry(leftWingGeo),
      new THREE.MeshBasicMaterial({
        color: colorScheme.left,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      })
    )
    leftWing.rotation.z = 0.3
    leftWing.position.x = -0.1

    // 右翅膀
    const rightWingGeo = new THREE.Shape()
    rightWingGeo.moveTo(0, 0)
    rightWingGeo.bezierCurveTo(0.3, 0.2, 0.5, 0, 0.4, -0.4)
    rightWingGeo.bezierCurveTo(0.3, -0.6, 0.1, -0.5, 0, 0)

    const rightWing = new THREE.Mesh(
      new THREE.ShapeGeometry(rightWingGeo),
      new THREE.MeshBasicMaterial({
        color: colorScheme.right,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      })
    )
    rightWing.rotation.z = -0.3
    rightWing.position.x = 0.1

    // 身体
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.03, 0.1, 4, 8),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    )

    // 组合蝴蝶
    const butterflyGroup = new THREE.Group()
    butterflyGroup.add(leftWing)
    butterflyGroup.add(rightWing)
    butterflyGroup.add(body)

    // 随机位置
    butterflyGroup.position.set(
      (Math.random() - 0.5) * flyRadius * 2,
      Math.random() * 40 - 20,
      (Math.random() - 0.5) * flyRadius * 2
    )

    // 运动参数 - 使用纯对象避免 THREE.Vector3 在动态导入时的问题
    const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 2
    }

    const target = {
      x: (Math.random() - 0.5) * flyRadius * 2,
      y: Math.random() * 40 - 20,
      z: (Math.random() - 0.5) * flyRadius * 2
    }

    butterflyGroup.userData = {
      leftWing,
      rightWing,
      velocity,
      wingSpeed: 5 + Math.random() * 10,
      target
    }

    scene.add(butterflyGroup)
    butterflies.push(butterflyGroup)
  }

  // 追光灯
  const spotlight = new THREE.SpotLight(0xffffff, 3, 100, Math.PI / 6, 0.5)
  spotlight.position.set(0, 30, 0)
  scene.add(spotlight)

  return {
    butterflies,
    spotlight,
    update(deltaTime, time) {
      butterflies.forEach((butterfly, i) => {
        // 更全面的安全检查
        if (!butterfly || !butterfly.position) {
          return
        }

        const data = butterfly.userData

        // 安全检查
        if (!data || !data.leftWing || !data.rightWing || !data.velocity || !data.target) {
          return
        }

        // 翅膀扇动
        const wingAngle = Math.sin(time * data.wingSpeed) * 0.5
        data.leftWing.rotation.z = 0.3 + wingAngle
        data.rightWing.rotation.z = -0.3 - wingAngle

        // 随机飞行目标
        if (Math.random() < 0.02) {
          data.target.x = (Math.random() - 0.5) * flyRadius * 2
          data.target.y = Math.random() * 40 - 20
          data.target.z = (Math.random() - 0.5) * flyRadius * 2
        }

        // 向目标移动 - 使用纯 JavaScript 对象
        const dx = data.target.x - butterfly.position.x
        const dy = data.target.y - butterfly.position.y
        const dz = data.target.z - butterfly.position.z

        // 更新速度
        data.velocity.x += dx * 0.02
        data.velocity.y += dy * 0.02
        data.velocity.z += dz * 0.02

        // 限制速度
        const maxSpeed = 3
        const speed = Math.sqrt(
          data.velocity.x * data.velocity.x +
          data.velocity.y * data.velocity.y +
          data.velocity.z * data.velocity.z
        )
        if (speed > maxSpeed) {
          data.velocity.x = (data.velocity.x / speed) * maxSpeed
          data.velocity.y = (data.velocity.y / speed) * maxSpeed
          data.velocity.z = (data.velocity.z / speed) * maxSpeed
        }

        // 应用速度
        butterfly.position.x += data.velocity.x * deltaTime
        butterfly.position.y += data.velocity.y * deltaTime
        butterfly.position.z += data.velocity.z * deltaTime

        // 飞行姿态
        butterfly.rotation.z = data.velocity.x * 0.2
        butterfly.rotation.x = data.velocity.y * 0.2

        // 光追踪 - 使用纯对象避免 Vector3 方法调用问题
        if (i === 0 && spotlight && spotlight.target && spotlight.target.position) {
          try {
            spotlight.target.position.x = butterfly.position.x
            spotlight.target.position.y = butterfly.position.y
            spotlight.target.position.z = butterfly.position.z
            spotlight.position.y = butterfly.position.y + 20
          } catch (e) {
            // 静默处理光追踪错误，不影响蝴蝶运动
            console.warn('Spotlight update error:', e)
          }
        }
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 蝴蝶聚集
      butterflies.forEach((butterfly, i) => {
        const delay = Math.random() * 0.5
        gsap.to(butterfly.position, {
          x: Math.sin(i * 0.5) * 15,
          y: 10 + Math.cos(i * 0.3) * 10,
          z: Math.cos(i * 0.5) * 15,
          duration: 2,
          delay,
          ease: 'power2.out'
        })
      })

      // 聚光灯扫描
      tl.to(spotlight, {
        angle: Math.PI / 3,
        intensity: 5,
        duration: 1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      return tl
    },
    destroy() {
      // 标记为已销毁
      this.isDestroyed = true

      butterflies.forEach(butterfly => {
        scene.remove(butterfly)
        if (butterfly && typeof butterfly.traverse === 'function') {
          butterfly.traverse(child => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) child.material.dispose()
          })
        }
      })
      scene.remove(spotlight)
    }
  }
}
