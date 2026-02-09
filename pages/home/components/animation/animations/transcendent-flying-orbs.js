/**
 * ✨ 超越级满天飞舞特效
 * 次世代视觉特效 - Shadertoy风格VFX
 *
 * 创新突破（基于发光环Shader）：
 * ✨ 波浪环系统 - 动态变形的发光环
 * ✨ 多层叠加 - 数十个飞舞光球
 * ✨ 随机运动 - 布朗运动式飞舞
 * ✨ 发光累积 - 加法混合的光晕效果
 * ✨ 颜色渐变 - 多种颜色随机分布
 * ✨ 呼吸效果 - 脉冲式大小变化
 *
 * 视觉表现：
 * - 满天飞舞：数十个光球在空间中漂浮
 * - 发光环：每个光球都有动态波浪边缘
 * - 彩虹色：红橙黄绿青蓝紫随机分布
 * - 动态运动：随机方向的速度和加速度
 * - 呼吸效果：光球大小随时间脉动
 *
 * 技术亮点：
 * - 100+独立光球对象
 * - GPU加速的Shader渲染
 * - 正弦波边缘算法
 * - 加法混合发光
 *
 * @author Master VFX Designer
 * @inspired Shadertoy Glowing Ring
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'

/**
 * 创建飞舞光球
 */
function createFlyingOrb(size, color, speedScale) {
  const geometry = new THREE.PlaneGeometry(size * 2, size * 2)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: color },
      uSize: { value: size },
      uWaveSpeed: { value: speedScale },
      uWaveFreq: { value: 3.0 + Math.random() * 4.0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uSize;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;
      uniform float uWaveSpeed;
      uniform float uWaveFreq;

      varying vec2 vUv;

      #define PI 3.1415926
      #define TWO_PI 6.2831852

      // 圆形SDF
      float sdCircle(float r, float radius, float thickness) {
        return abs(r - radius) - thickness;
      }

      void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        
        float a = atan(uv.y, uv.x);
        
        // 归一化角度到 0 - 1
        a = (a + PI) / TWO_PI + PI;
        
        float r = length(uv) * 1.5;
        
        // 波浪效果 - 双重正弦波
        float wave = sin(a * TWO_PI * uWaveFreq + uTime * uWaveSpeed) *
                     cos(a * TWO_PI * 2.0 + uTime * uWaveSpeed * 1.5) * 0.25;
        
        // 动态环
        float ring = sdCircle(r, 0.4 + wave, 0.03);
        float mask = smoothstep(0.2, 0.0, ring);
        
        // 发光效果
        float glow = exp(-8.0 * (1.0 - mask));
        
        vec3 light = glow * uColor;
        vec3 core = mask * uColor * 1.5;
        
        vec3 col = core + light;
        
        float alpha = (mask + glow * 0.5) * uOpacity;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const mesh = new THREE.Mesh(geometry, material)
  
  // 随机运动参数
  const motion = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    acceleration: new THREE.Vector3(
      (Math.random() - 0.5) * 0.0005,
      (Math.random() - 0.5) * 0.0005,
      (Math.random() - 0.5) * 0.0005
    ),
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    breatheSpeed: 1.0 + Math.random() * 2.0,
    baseSize: size
  }

  return { mesh, material, motion }
}

/**
 * 创建背景星空
 */
function createBackgroundStars(count, spread) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = spread * Math.pow(Math.random(), 0.5)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 白色星星
    const brightness = 0.5 + Math.random() * 0.5
    colors[i * 3] = brightness
    colors[i * 3 + 1] = brightness
    colors[i * 3 + 2] = brightness

    sizes[i] = 0.02 + Math.random() * 0.05
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 创建能量连接线
 */
function createConnectionLines(orbs, maxDistance) {
  const lines = []
  
  for (let i = 0; i < orbs.length; i++) {
    for (let j = i + 1; j < orbs.length; j++) {
      const dist = orbs[i].mesh.position.distanceTo(orbs[j].mesh.position)
      if (dist < maxDistance && Math.random() > 0.7) {
        const points = [orbs[i].mesh.position.clone(), orbs[j].mesh.position.clone()]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color().lerpColors(
            orbs[i].material.uniforms.uColor.value,
            orbs[j].material.uniforms.uColor.value,
            0.5
          ),
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending
        })
        lines.push({
          line: new THREE.Line(geometry, material),
          orbA: orbs[i],
          orbB: orbs[j]
        })
      }
    }
  }
  
  return lines
}

/**
 * 主动画函数
 */
export default function animateTranscendentFlyingOrbs(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 设置相机
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 20), 170, controls)
    camera.lookAt(0, 0, 0)

    // 创建颜色调色板
    const colorPalette = [
      new THREE.Color(1.0, 0.2, 0.2),    // 红
      new THREE.Color(1.0, 0.6, 0.1),    // 橙
      new THREE.Color(1.0, 1.0, 0.2),    // 黄
      new THREE.Color(0.2, 1.0, 0.4),    // 绿
      new THREE.Color(0.2, 0.8, 1.0),    // 蓝
      new THREE.Color(0.6, 0.3, 1.0),    // 紫
      new THREE.Color(1.0, 0.3, 0.8),    // 粉
      new THREE.Color(1.0, 1.0, 1.0)      // 白
    ]

    // 创建飞舞光球 (150个)
    const orbs = []
    const orbCount = 150
    const gsapTweens = [] // 保存GSAP动画引用

    for (let i = 0; i < orbCount; i++) {
      const size = 0.3 + Math.random() * 0.5
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      const speedScale = 1.0 + Math.random() * 2.0

      const orb = createFlyingOrb(size, color, speedScale)

      // 随机初始位置
      orb.mesh.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      )

      // 随机初始旋转
      orb.mesh.rotation.z = Math.random() * Math.PI * 2

      scene.add(orb.mesh)
      orbs.push(orb)
    }

    // 创建连接线（部分球体之间）
    const lines = []

    // 创建背景星空
    const stars = createBackgroundStars(500, 30)
    scene.add(stars)

    const startTime = Date.now()

    function update() {
      const time = (Date.now() - startTime) / 1000

      // 更新每个光球
      orbs.forEach((orb, i) => {
        // 更新shader时间
        orb.material.uniforms.uTime.value = time
        
        // 运动模拟（布朗运动）
        orb.motion.velocity.add(orb.motion.acceleration)
        orb.mesh.position.add(orb.motion.velocity)
        
        // 旋转
        orb.mesh.rotation.z += orb.motion.rotationSpeed
        
        // 呼吸效果
        const breathe = 1.0 + Math.sin(time * orb.motion.breatheSpeed) * 0.15
        orb.mesh.scale.setScalar(breathe)
        
        // 边界反弹
        const bounds = { x: 15, y: 10, z: 10 }
        if (Math.abs(orb.mesh.position.x) > bounds.x) {
          orb.motion.velocity.x *= -0.8
          orb.mesh.position.x = Math.sign(orb.mesh.position.x) * bounds.x
        }
        if (Math.abs(orb.mesh.position.y) > bounds.y) {
          orb.motion.velocity.y *= -0.8
          orb.mesh.position.y = Math.sign(orb.mesh.position.y) * bounds.y
        }
        if (Math.abs(orb.mesh.position.z) > bounds.z) {
          orb.motion.velocity.z *= -0.8
          orb.mesh.position.z = Math.sign(orb.mesh.position.z) * bounds.z
        }
        
        // 随机改变加速度
        if (Math.random() > 0.98) {
          orb.motion.acceleration.set(
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001
          )
        }
      })

      // 更新连接线（动态重建）
      lines.forEach(line => scene.remove(line.line))
      lines.length = 0
      
      // 每10帧重建一次连接线
      if (Math.floor(time * 60) % 10 === 0) {
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const dist = orbs[i].mesh.position.distanceTo(orbs[j].mesh.position)
            if (dist < 5 && Math.random() > 0.85) {
              const points = [
                orbs[i].mesh.position.clone(),
                orbs[j].mesh.position.clone()
              ]
              const geometry = new THREE.BufferGeometry().setFromPoints(points)
              const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().lerpColors(
                  orbs[i].material.uniforms.uColor.value,
                  orbs[j].material.uniforms.uColor.value,
                  0.5
                ),
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
              })
              const line = new THREE.Line(geometry, material)
              scene.add(line)
              lines.push(line)
            }
          }
        }
      }

      // 更新星空
      stars.rotation.y += 0.0002
      stars.rotation.x += 0.0001

      // 相机轻微移动
      camera.position.x = Math.sin(time * 0.1) * 0.5
      camera.position.y = Math.cos(time * 0.15) * 0.3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    let animId
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画 - 依次出现
    orbs.forEach((orb, i) => {
      const delay = i * 0.01
      const tween1 = gsap.to(orb.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out'
      })
      gsapTweens.push(tween1)

      // 入场飞入
      const targetPos = orb.mesh.position.clone()
      orb.mesh.position.addScalar(10)
      const tween2 = gsap.to(orb.mesh.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1,
        delay: delay,
        ease: 'back.out(1.2)'
      })
      gsapTweens.push(tween2)
    })

    animate()

    // 自动清理和完成回调
    const duration = 15000
    setTimeout(() => {
      cancelAnimationFrame(animId)

      // 清除所有GSAP动画
      gsapTweens.forEach(tween => tween.kill())
      gsapTweens.length = 0

      // 清理连接线
      lines.forEach(l => {
        l.line.geometry.dispose()
        l.line.material.dispose()
        scene.remove(l.line)
      })
      lines.length = 0

      // 清理光球
      orbs.forEach(o => {
        o.mesh.geometry.dispose()
        o.mesh.material.dispose()
        scene.remove(o.mesh)
      })
      orbs.length = 0

      // 清理星空
      stars.geometry.dispose()
      stars.material.dispose()
      scene.remove(stars)

      if (onComplete) onComplete({ type: 'transcendent-flying-orbs' })
    }, duration)

    return () => {
      cancelAnimationFrame(animId)

      // 清除所有GSAP动画
      gsapTweens.forEach(tween => tween.kill())

      // 清理连接线
      lines.forEach(l => {
        if (l.line.geometry) l.line.geometry.dispose()
        if (l.line.material) l.line.material.dispose()
        scene.remove(l.line)
      })

      // 清理光球
      orbs.forEach(o => {
        if (o.mesh.geometry) o.mesh.geometry.dispose()
        if (o.mesh.material) o.mesh.material.dispose()
        scene.remove(o.mesh)
      })

      // 清理星空
      if (stars.geometry) stars.geometry.dispose()
      if (stars.material) stars.material.dispose()
      scene.remove(stars)
    }

  } catch (error) {
    console.error('满天飞舞动画错误:', error)
    onError?.(error)
    throw error
  }
}
