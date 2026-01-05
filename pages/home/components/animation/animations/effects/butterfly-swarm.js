/**
 * effects/butterfly-swarm.js
 * 蝴蝶飞舞特效
 * 生命、灵动、追光
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

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

    // 运动参数
    butterflyGroup.userData = {
      leftWing,
      rightWing,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 2
      ),
      wingSpeed: 5 + Math.random() * 10,
      target: new THREE.Vector3()
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
        const data = butterfly.userData

        // 翅膀扇动
        const wingAngle = Math.sin(time * data.wingSpeed) * 0.5
        data.leftWing.rotation.z = 0.3 + wingAngle
        data.rightWing.rotation.z = -0.3 - wingAngle

        // 随机飞行目标
        if (Math.random() < 0.02) {
          data.target.set(
            (Math.random() - 0.5) * flyRadius * 2,
            Math.random() * 40 - 20,
            (Math.random() - 0.5) * flyRadius * 2
          )
        }

        // 向目标移动
        const direction = data.target.clone().sub(butterfly.position).normalize()
        data.velocity.lerp(direction.multiplyScalar(3), 0.02)
        butterfly.position.add(data.velocity.clone().multiplyScalar(deltaTime))

        // 飞行姿态
        butterfly.rotation.z = data.velocity.x * 0.2
        butterfly.rotation.x = data.velocity.y * 0.2

        // 光追踪
        if (i === 0) {
          spotlight.target.copy(butterfly.position)
          spotlight.position.y = butterfly.position.y + 20
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
      butterflies.forEach(butterfly => {
        scene.remove(butterfly)
        butterfly.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      scene.remove(spotlight)
    }
  }
}
