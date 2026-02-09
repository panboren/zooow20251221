/**
 * 🌀 超越级洛可可湍流特效 - 分散版
 * 次世代视觉特效 - Shadertoy风格VFX
 *
 * 创新突破（基于 @XorDev 的 Rocaille Shader）：
 * ✨ 分散式多球体结构 - 多个独立湍流球体
 * ✨ 多层次空间布局 - 远中近三个层次
 * ✨ 旋转轨道系统 - 每层独立旋转
 * ✨ 粒子星尘背景 - 增加空间深度
 * ✨ 连接能量线 - 球体间的能量流动
 * ✨ 动态缩放呼吸 - 整体呼吸效果
 *
 * @author Master VFX Designer
 * @inspired Shadertoy Rocille by @XorDev
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'

/**
 * 创建单个湍流球体
 */
function createTurbulenceSphere(size, colorOffset, turbulenceSpeed) {
  const geometry = new THREE.SphereGeometry(size, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColorOffset: { value: colorOffset },
      uTurbulenceSpeed: { value: turbulenceSpeed }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uTurbulenceSpeed;

      varying vec3 vPosition;

      void main() {
        vPosition = position;

        vec3 pos = position;
        float turbulence = sin(pos.x * 4.0 + uTime * uTurbulenceSpeed) *
                         sin(pos.y * 4.0 + uTime * uTurbulenceSpeed) *
                         sin(pos.z * 4.0 + uTime * uTurbulenceSpeed);
        pos += normal * turbulence * 0.08;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColorOffset;
      uniform float uTurbulenceSpeed;

      varying vec3 vPosition;

      void main() {
        vec2 p = vPosition.xy * 0.6;
        vec2 v = p;

        vec3 color = vec3(0.0);
        
        // 湍流循环
        for(float i = 1.0; i < 7.0; i++) {
          v += sin(v.yx * i + i + uTime * uTurbulenceSpeed * 0.5) / i;
          vec3 layer = 0.5 * (cos(i * 2.0 + vec3(0.0, 2.0, 4.0)) + 1.0);
          color += layer / (length(v) + 0.1) * 0.25;
        }

        color = tanh(color * color);
        color *= uColorOffset;

        // 边缘发光
        float dist = length(vPosition.xy);
        float rim = 1.0 - smoothstep(0.0, 1.0, dist);
        color += vec3(0.3, 0.5, 0.8) * rim * 0.4;

        float alpha = (length(color) + rim * 0.3) * uOpacity;
        alpha = clamp(alpha, 0.0, 1.0);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  return { mesh: new THREE.Mesh(geometry, material), material }
}

/**
 * 创建轨道光环
 */
function createOrbitalRing(radius, tubeRadius, color) {
  const geometry = new THREE.TorusGeometry(radius, tubeRadius, 8, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: color }
    },
    vertexShader: `
      precision highp float;

      varying vec3 vPosition;

      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;

      varying vec3 vPosition;

      void main() {
        float angle = atan(vPosition.y, vPosition.x);
        float offset = sin(angle * 8.0 + uTime * 2.0) * 0.5 + 0.5;
        
        vec3 color = uColor * (0.5 + offset * 0.5);
        
        float alpha = (0.3 + offset * 0.5) * uOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const mesh = new THREE.Mesh(geometry, material)
  return { mesh, material }
}

/**
 * 创建能量连接线
 */
function createEnergyLine(startPos, endPos) {
  const points = []
  const segments = 50
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const pos = new THREE.Vector3().lerpVectors(startPos, endPos, t)
    // 添加波浪变形
    pos.x += Math.sin(t * Math.PI * 4) * 0.2
    pos.y += Math.cos(t * Math.PI * 4) * 0.2
    points.push(pos)
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Line(geometry, material)
}

/**
 * 创建粒子星尘
 */
function createStarDust(count, spread) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = spread * (0.5 + Math.random() * 0.5)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 蓝紫色星尘
    colors[i * 3] = 0.4 + Math.random() * 0.3
    colors[i * 3 + 1] = 0.4 + Math.random() * 0.4
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateTranscendentRocaille(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 设置相机
    setupInitialCamera(camera, new THREE.Vector3(0, 5, 25), 170, controls)
    camera.lookAt(0, 0, 0)

    // 创建多个湍流球体（分散布局）
    const spheres = []
    
    // 中心主球
    const mainSphere = createTurbulenceSphere(2.5, new THREE.Vector3(1.0, 0.7, 0.4), 1.0)
    mainSphere.mesh.position.set(0, 0, 0)
    scene.add(mainSphere.mesh)
    spheres.push(mainSphere)

    // 外围小球体
    const spherePositions = [
      { pos: [6, 3, 2], color: [0.8, 0.5, 1.0], speed: 1.2 },
      { pos: [-5, 4, -1], color: [0.5, 0.8, 1.0], speed: 0.8 },
      { pos: [3, -4, 3], color: [1.0, 0.5, 0.6], speed: 1.5 },
      { pos: [-4, -3, -2], color: [0.6, 1.0, 0.6], speed: 1.0 },
      { pos: [0, 6, -3], color: [0.9, 0.7, 1.0], speed: 1.3 },
      { pos: [5, -2, -4], color: [0.7, 0.9, 1.0], speed: 0.9 }
    ]

    spherePositions.forEach(config => {
      const sphere = createTurbulenceSphere(
        1.2,
        new THREE.Vector3(...config.color),
        config.speed
      )
      sphere.mesh.position.set(...config.pos)
      scene.add(sphere.mesh)
      spheres.push(sphere)
    })

    // 创建轨道光环
    const rings = []
    const gsapTweens = [] // 保存GSAP动画引用
    const ringConfigs = [
      { radius: 8, tube: 0.15, color: new THREE.Vector3(0.5, 0.6, 1.0), axis: 'y' },
      { radius: 11, tube: 0.1, color: new THREE.Vector3(0.8, 0.5, 1.0), axis: 'x' },
      { radius: 14, tube: 0.08, color: new THREE.Vector3(0.6, 0.8, 1.0), axis: 'z' }
    ]

    ringConfigs.forEach(config => {
      const ring = createOrbitalRing(config.radius, config.tube, config.color)
      if (config.axis === 'y') ring.mesh.rotation.x = Math.PI / 2
      if (config.axis === 'x') ring.mesh.rotation.z = Math.PI / 2
      scene.add(ring.mesh)
      rings.push(ring)
    })

    // 创建能量连接线
    const lines = []
    spheres.slice(1).forEach(sphere => {
      const line = createEnergyLine(
        mainSphere.mesh.position,
        sphere.mesh.position
      )
      scene.add(line)
      lines.push({ line, start: mainSphere.mesh, end: sphere.mesh })
    })

    // 创建粒子星尘
    const starDust = createStarDust(2000, 20)
    scene.add(starDust)

    const startTime = Date.now()

    function update() {
      const time = (Date.now() - startTime) / 1000

      // 更新所有球体
      spheres.forEach((sphere, i) => {
        sphere.material.uniforms.uTime.value = time
        sphere.mesh.rotation.y += 0.002 * (i + 1)
        sphere.mesh.rotation.x += 0.001 * (i + 1)
      })

      // 更新光环
      rings.forEach((ring, i) => {
        ring.material.uniforms.uTime.value = time
        ring.mesh.rotation.z += 0.003 * (i + 1)
      })

      // 更新能量线位置
      lines.forEach(({ line, start, end }) => {
        const points = []
        const segments = 50
        for (let j = 0; j <= segments; j++) {
          const t = j / segments
          const pos = new THREE.Vector3().lerpVectors(start.position, end.position, t)
          const wave = Math.sin(t * Math.PI * 3 + time * 3) * 0.15
          pos.x += wave
          pos.y += wave * 0.7
          points.push(pos)
        }
        line.geometry.setFromPoints(points)
      })

      // 更新星尘
      starDust.rotation.y += 0.0005
      starDust.rotation.x += 0.0003

      // 整体呼吸效果
      const breathe = 1.0 + Math.sin(time * 0.5) * 0.05
      spheres[0].mesh.scale.setScalar(breathe)

      renderer.render(scene, camera)
    }

    let animId
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画 - 依次出现
    const tween1 = gsap.to(mainSphere.material.uniforms.uOpacity, {
      value: 1.0,
      duration: 2,
      ease: 'power2.out'
    })
    gsapTweens.push(tween1)

    spheres.slice(1).forEach((sphere, i) => {
      const tween2 = gsap.from(sphere.mesh.position, {
        x: sphere.mesh.position.x * 0.3,
        y: sphere.mesh.position.y * 0.3,
        z: sphere.mesh.position.z * 0.3,
        duration: 1.5,
        delay: 0.5 + i * 0.15,
        ease: 'back.out(1.7)'
      })
      gsapTweens.push(tween2)

      const tween3 = gsap.to(sphere.material.uniforms.uOpacity, {
        value: 0.9,
        duration: 1.5,
        delay: 0.5 + i * 0.15,
        ease: 'power2.out'
      })
      gsapTweens.push(tween3)
    })

    rings.forEach((ring, i) => {
      const tween4 = gsap.to(ring.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 1.5,
        delay: 1 + i * 0.3,
        ease: 'power2.out'
      })
      gsapTweens.push(tween4)
    })

    // 旋转速度动态变化
    const tween5 = gsap.to(spheres[0].mesh.scale, {
      x: 1.1, y: 1.1, z: 1.1,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })
    gsapTweens.push(tween5)

    // 动画
    animate()

    // 自动清理和完成回调
    const duration = 25000
    setTimeout(() => {
      cancelAnimationFrame(animId)

      // 清除所有GSAP动画
      gsapTweens.forEach(tween => tween.kill())
      gsapTweens.length = 0

      // 清理所有对象并释放内存
      spheres.forEach(s => {
        s.mesh.geometry.dispose()
        s.mesh.material.dispose()
        scene.remove(s.mesh)
      })
      spheres.length = 0

      rings.forEach(r => {
        r.mesh.geometry.dispose()
        r.mesh.material.dispose()
        scene.remove(r.mesh)
      })
      rings.length = 0

      lines.forEach(l => {
        l.line.geometry.dispose()
        l.line.material.dispose()
        scene.remove(l.line)
      })
      lines.length = 0

      starDust.geometry.dispose()
      starDust.material.dispose()
      scene.remove(starDust)

      if (onComplete) onComplete({ type: 'transcendent-rocaille' })
    }, duration)

    return () => {
      cancelAnimationFrame(animId)

      // 清除所有GSAP动画
      gsapTweens.forEach(tween => tween.kill())

      // 清理所有对象并释放内存
      spheres.forEach(s => {
        if (s.mesh.geometry) s.mesh.geometry.dispose()
        if (s.mesh.material) s.mesh.material.dispose()
        scene.remove(s.mesh)
      })

      rings.forEach(r => {
        if (r.mesh.geometry) r.mesh.geometry.dispose()
        if (r.mesh.material) r.mesh.material.dispose()
        scene.remove(r.mesh)
      })

      lines.forEach(l => {
        if (l.line.geometry) l.line.geometry.dispose()
        if (l.line.material) l.line.material.dispose()
        scene.remove(l.line)
      })

      if (starDust.geometry) starDust.geometry.dispose()
      if (starDust.material) starDust.material.dispose()
      scene.remove(starDust)
    }

  } catch (error) {
    console.error('洛可可湍流动画错误:', error)
    onError?.(error)
    throw error
  }
}
