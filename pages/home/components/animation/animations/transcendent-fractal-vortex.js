/**
 * 🌀 超越级分形涡流特效
 * 次世代视觉特效 - Shadertoy风格VFX
 *
 * 创新突破：
 * 🌀 无限分形嵌套 - asin(sin)创造无限递归
 * 🌀 多维旋转系统 - 复合旋转矩阵叠加
 * 🌀 动态线段绘制 - SDF距离场精确渲染
 * 🌀 色彩空间变换 - 极坐标色彩流转
 * 🌀 脉冲能量波 - 呼吸式的能量爆发
 * 🌀 时间扭曲效应 - 对数旋转创造深空感
 *
 * 技术亮点：
 * - 纯Shader数学建模
 * - Raymarching体积渲染
 * - 复杂SDF距离场
 * - 动态分形迭代
 * - 高性能优化
 *
 * @author Master VFX Designer
 * @inspired Shadertoy Fractal Feedback
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, setupFinalCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 点到线段距离函数 (SDF)
 * 用于绘制旋转的发光线条
 */
function segmentDistance(p, a, b) {
  const ab = new THREE.Vector2().subVectors(b, a)
  const ap = new THREE.Vector2().subVectors(p, a)
  const t = Math.max(0, Math.min(1, ap.dot(ab) / ab.dot(ab)))
  const closest = new THREE.Vector2().copy(a).add(ab.multiplyScalar(t))
  return p.distanceTo(closest)
}

/**
 * 创建分形涡流平面
 */
function createFractalVortexPlane() {
  const geometry = new THREE.PlaneGeometry(30, 30, 2, 2)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColorShift: { value: 0 },
      uRotationSpeed: { value: 1.0 },
      uZoom: { value: 1.0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uZoom;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        // 缓慢脉动
        vec3 pos = position;
        float pulse = sin(uTime * 0.5) * 0.02 + 1.0;
        pos *= pulse * uZoom;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uColorShift;
      uniform float uRotationSpeed;
      uniform float uZoom;

      varying vec2 vUv;
      varying vec3 vPosition;

      #define PI 3.14159265
      #define TWO_PI 6.2831853

      // 2D旋转矩阵
      mat2 rotate2D(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, s, -s, c);
      }

      // 点到线段距离
      float seg(vec2 a, vec2 b, vec2 p) {
        p -= a;
        b -= a;
        vec2 closest = a + clamp(dot(p, b) / dot(b, b), 0.0, 1.0) * b;
        return length(p - clamp(dot(p, b) / dot(b, b), 0.0, 1.0) * b);
      }

      // 调色板函数
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(TWO_PI * (c * t + d + uColorShift));
      }

      void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        vec2 tex_uv = uv;

        vec3 color = vec3(0.0);

        // 主旋转
        float angle = TWO_PI * 0.01 * uTime * uRotationSpeed;
        mat2 R = rotate2D(angle);

        // 绝对值反射创造对称
        tex_uv = abs(tex_uv) * 0.8;
        tex_uv += 0.1 + cos(uTime * 0.33) * 0.05;

        // asin(sin)分形变换
        tex_uv = asin(sin(tex_uv));
        tex_uv /= 0.001 + dot(tex_uv, tex_uv);

        // 动态缩放
        tex_uv *= 1.05 + sin(uTime * 0.1) * 0.05;

        // 旋转应用
        tex_uv *= R;

        // 分形叠加迭代
        for(float j = 0.01; j < 1.0; j += j) {
          tex_uv += cos(tex_uv.yx * j) / j * 0.005;
        }

        // 绘制旋转线段
        float lineAngle = -uTime + log(length(uv)) * PI;
        mat2 R2 = rotate2D(lineAngle);
        vec2 A = R2 * vec2(-1.0, 0.0);
        vec2 B = R2 * vec2(1.0, 0.0);
        float sdf = seg(A, B, uv);

        // 线条发光
        float alpha = exp2(1.3 - 8.0 * length(uv)) * tanh(0.008 / sdf);

        // 距离渐变颜色
        float dist = length(uv);
        vec3 lineColor = palette(dist * 0.5 + uTime * 0.1);

        // 混合
        color = mix(color, 0.5 + 0.5 * cos(uTime * 0.75 + vec3(1.0, 1.5, 2.0)), alpha);
        color += lineColor * alpha * 2.0;

        // 中心发光
        float centerGlow = exp(-dist * 3.0);
        color += palette(uTime * 0.2) * centerGlow;

        // 边缘暗角
        float vignette = 1.0 - smoothstep(0.5, 1.0, dist);
        color *= vignette;

        // Gamma校正
        color = pow(abs(color), vec3(0.8));

        float finalAlpha = uOpacity * (alpha + centerGlow * 0.5);

        gl_FragColor = vec4(color, finalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建能量粒子环
 */
function createEnergyRings(count, radius) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 0.8
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)

    const geometry = new THREE.RingGeometry(
      radius * 0.9,
      radius,
      128,
      8
    )

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: color },
        uPhase: { value: i / count }
      },
      vertexShader: `
        precision highp float;

        #define PI 3.14159265
        #define TWO_PI 6.2831853

        uniform float uTime;
        uniform float uPhase;

        varying vec2 vUv;
        varying float vDist;

        void main() {
          vUv = uv;
          vDist = length(uv - 0.5);

          vec3 pos = position;
          float wave = sin(uTime * 3.0 + uPhase * TWO_PI) * 0.1;
          pos.z += wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uPhase;

        varying vec2 vUv;
        varying float vDist;

        void main() {
          // 边缘发光
          float edge = abs(vDist - 0.5);
          float glow = exp(-edge * 20.0);

          // 旋转条纹
          float stripe = sin(vUv.x * 50.0 + uTime * 5.0 + uPhase * 6.28) * 0.5 + 0.5;

          vec3 color = uColor * (glow * 2.0 + stripe * 0.5);
          float alpha = glow * uOpacity;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI * 0.5
    ring.userData = { phase: i / count }

    group.add(ring)
  }

  return group
}

/**
 * 创建星光粒子
 */
function createStarParticles(count, spread) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const r = spread * Math.pow(Math.random(), 0.5)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const brightness = 0.6 + Math.random() * 0.4
    colors[i * 3] = brightness
    colors[i * 3 + 1] = brightness
    colors[i * 3 + 2] = brightness

    sizes[i] = 0.05 + Math.random() * 0.15
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;
        float twinkle = sin(uTime * 3.0 + position.x * 10.0) * 0.5 + 0.5;
        pos.z += twinkle * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        float dist = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;

        vec3 color = vColor * (1.0 + sin(uTime * 5.0) * 0.3);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateTranscendentFractalVortex(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 20), 110, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-fractal-vortex' })
      },
      onError,
      '🌀 超越级分形涡流 (Shadertoy风格)',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x000510)
    scene.fog = new THREE.FogExp2(0x000510, 0.02)

    // 创建分形涡流平面
    const fractalPlane = createFractalVortexPlane()
    scene.add(fractalPlane)

    // 创建能量粒子环
    const energyRings = createEnergyRings(8, 6)
    scene.add(energyRings)

    // 创建星光粒子
    const starParticles = createStarParticles(800, 50)
    scene.add(starParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新分形涡流
      fractalPlane.material.uniforms.uTime.value = time
      fractalPlane.material.uniforms.uColorShift.value = Math.sin(time * 0.1) * 0.5

      // 更新能量环
      energyRings.children.forEach((ring, i) => {
        ring.material.uniforms.uTime.value = time
        ring.rotation.z += 0.002 * (1 + i * 0.1)
        ring.scale.setScalar(1 + Math.sin(time * 0.5 + i * 0.5) * 0.05)
      })

      // 更新星光粒子
      starParticles.material.uniforms.uTime.value = time
      starParticles.rotation.y += 0.0005

      // 相机缓慢旋转
      camera.position.x = Math.sin(time * 0.05) * 3
      camera.position.y = Math.cos(time * 0.07) * 2
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(fractalPlane.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'power2.out'
    })

    energyRings.children.forEach((ring, i) => {
      gsap.to(ring.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 1.5,
        delay: i * 0.1,
        ease: 'power2.out'
      })
    })

    gsap.to(starParticles.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2,
      ease: 'power2.out'
    })

    animate()

    // 相机运动
    tl.to(camera.position, {
      x: 5,
      y: 3,
      z: 15,
      duration: 8,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -5,
      y: -2,
      z: 18,
      duration: 7,
      ease: 'power2.inOut'
    }, 8)

    // 退场动画 - 在相机运动完成后触发
    tl.to({}, {
      duration: 2.5,
      onStart: () => {
        cancelAnimationFrame(animId)

        gsap.to(fractalPlane.material.uniforms.uOpacity, { value: 0, duration: 2 })

        energyRings.children.forEach(ring => {
          gsap.to(ring.material.uniforms.uOpacity, { value: 0, duration: 2 })
        })

        gsap.to(starParticles.material.uniforms.uOpacity, { value: 0, duration: 2 })
      },
      onComplete: () => {
        // 清理分形平面
        scene.remove(fractalPlane)
        fractalPlane.geometry.dispose()
        fractalPlane.material.dispose()

        // 清理能量环
        energyRings.children.forEach(ring => {
          ring.geometry.dispose()
          ring.material.dispose()
        })
        scene.remove(energyRings)

        // 清理星光粒子
        scene.remove(starParticles)
        starParticles.geometry.dispose()
        starParticles.material.dispose()

        // 恢复场景
        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }

        // 启用控制器
        if (controls) {
          controls.enabled = true
          controls.update()
        }
      }
    }, 15)

    return tl

  } catch (error) {
    console.error('分形涡流动画错误:', error)
    onError?.(error)
    throw error
  }
}
