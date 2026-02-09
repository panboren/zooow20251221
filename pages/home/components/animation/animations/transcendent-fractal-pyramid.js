/**
 * 🔺 超越级分形金字塔特效
 * 次世代视觉特效 - Shadertoy风格VFX
 *
 * 创新突破（基于 Fractal Pyramid Shader）：
 * ✨ 分形迭代折叠 - 8层空间折叠算法
 * ✨ 多轴旋转系统 - XZ和XY轴复合旋转
 * ✨ 绝对值反射 - 创造对称美感
 * ✨ 距离场渲染 - 64步Raymarching
 * ✨ 动态调色板 - 颜色随距离变化
 * ✨ 发光累积 - 体积光效果
 *
 * 视觉表现：
 * - 分形金字塔：迭代折叠形成的金字塔结构
 * - 无限嵌套：8层迭代创造的复杂几何
 * - 动态旋转：多轴复合旋转
 * - 渐变色彩：蓝紫到粉红的平滑过渡
 * - 发光边缘：距离场衰减的边缘光
 *
 * 技术亮点：
 * - 纯数学建模分形（无几何体）
 * - SDF距离场精确渲染
 * - 高效Raymarching算法
 * - 实时动态变形
 *
 * @author Master VFX Designer
 * @inspired Shadertoy Fractal Pyramid
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'

/**
 * 创建分形金字塔
 */
function createFractalPyramid() {
  const geometry = new THREE.PlaneGeometry(30, 30, 1, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uIterations: { value: 8 },
      uRotationSpeed: { value: 1.0 },
      uColorShift: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
      precision highp float;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uIterations;
      uniform float uRotationSpeed;
      uniform float uColorShift;
      uniform vec2 uResolution;

      varying vec2 vUv;
      varying vec3 vPosition;

      // 动态调色板
      vec3 palette(float d) {
        return mix(
          vec3(0.2, 0.7, 0.9),
          vec3(1.0, 0.0, 1.0),
          d + uColorShift
        );
      }

      // 2D旋转
      vec2 rotate(vec2 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return p * mat2(c, s, -s, c);
      }

      // 3D旋转（XZ平面）
      vec3 rotateXZ(vec3 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
      }

      // 3D旋转（XY平面）
      vec3 rotateXY(vec3 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
      }

      // 分形距离场映射
      float map(vec3 p) {
        for (int i = 0; i < 8; i++) {
          float t = uTime * 0.2 * uRotationSpeed;
          
          // 多轴旋转
          p.xz = rotate(p.xz, t + float(i) * 0.1);
          p.xy = rotate(p.xy, t * 1.89 + float(i) * 0.15);
          
          // 绝对值反射创造对称
          p.xz = abs(p.xz);
          p.xz -= 0.5;
        }
        // 金字塔形状
        return dot(sign(p), p) / 5.0;
      }

      // Raymarching渲染
      vec4 raymarch(vec3 ro, vec3 rd) {
        float t = 0.0;
        vec3 col = vec3(0.0);
        float d;

        for (float i = 0.0; i < 64.0; i++) {
          vec3 p = ro + rd * t;
          d = map(p) * 0.5;
          
          if (d < 0.02) {
            break;
          }
          if (d > 100.0) {
            break;
          }
          
          // 发光累积
          col += palette(length(p) * 0.1) / (400.0 * d);
          t += d;
        }

        return vec4(col, 1.0 / (d * 100.0));
      }

      void main() {
        // 屏幕坐标到世界坐标
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.x;
        
        // 相机位置 - 动态旋转
        vec3 ro = vec3(0.0, 0.0, -50.0);
        ro.xz = rotate(ro.xz, uTime * 0.1 * uRotationSpeed);
        
        // 相机朝向
        vec3 cf = normalize(-ro);
        vec3 cs = normalize(cross(cf, vec3(0.0, 1.0, 0.0)));
        vec3 cu = normalize(cross(cf, cs));
        
        // 射线方向
        vec3 rd = normalize(ro + cf * 3.0 + uv.x * cs + uv.y * cu - ro);
        
        // Raymarching渲染
        vec4 col = raymarch(ro, rd);
        
        // 增强对比度
        col.rgb = pow(col.rgb, vec3(0.8));
        
        // 添加边缘光晕
        col.rgb += vec3(0.1, 0.2, 0.3) * (1.0 - col.a);
        
        float alpha = (length(col.rgb) + 0.2) * uOpacity;
        alpha = clamp(alpha, 0.0, 1.0);
        
        gl_FragColor = vec4(col.rgb, alpha);
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
 * 创建外围能量环
 */
function createEnergyRing(radius, thickness) {
  const geometry = new THREE.TorusGeometry(radius, thickness, 16, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        float angle = atan(vPosition.y, vPosition.x);
        
        // 脉冲效果
        float pulse = sin(angle * 12.0 + uTime * 4.0) * 0.5 + 0.5;
        
        // 蓝紫渐变
        vec3 color = mix(
          vec3(0.2, 0.6, 1.0),
          vec3(0.8, 0.3, 1.0),
          pulse
        );
        
        float alpha = (0.2 + pulse * 0.6) * uOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 2
  return { mesh, material }
}

/**
 * 创建粒子星云
 */
function createParticleNebula(count, spread) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 球形分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = spread * Math.pow(Math.random(), 0.5)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 蓝紫粉渐变
    const colorMix = Math.random()
    if (colorMix < 0.33) {
      colors[i * 3] = 0.2 + Math.random() * 0.3
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.4
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    } else if (colorMix < 0.66) {
      colors[i * 3] = 0.7 + Math.random() * 0.3
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.4
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    } else {
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.0 + Math.random() * 0.5
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
    }

    sizes[i] = 0.02 + Math.random() * 0.04
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateTranscendentFractalPyramid(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 设置相机
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 18), 170, controls)
    camera.lookAt(0, 0, 0)

    // 创建分形金字塔
    const fractalPyramid = createFractalPyramid()
    fractalPyramid.mesh.position.z = -5
    scene.add(fractalPyramid.mesh)

    // 创建多层能量环
    const rings = []
    const ringConfigs = [
      { radius: 8, thickness: 0.2, delay: 0.5 },
      { radius: 12, thickness: 0.15, delay: 1.0 },
      { radius: 16, thickness: 0.1, delay: 1.5 }
    ]

    ringConfigs.forEach((config, i) => {
      const ring = createEnergyRing(config.radius, config.thickness)
      ring.mesh.rotation.x = Math.PI / 2 + i * 0.3
      ring.mesh.rotation.z = i * 0.5
      scene.add(ring.mesh)
      rings.push({ ...ring, ...config })
    })

    // 创建粒子星云
    const nebula = createParticleNebula(3000, 15)
    scene.add(nebula)

    const startTime = Date.now()

    function update() {
      const time = (Date.now() - startTime) / 1000

      // 更新分形金字塔
      fractalPyramid.material.uniforms.uTime.value = time
      fractalPyramid.material.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
      fractalPyramid.mesh.rotation.y = time * 0.1
      fractalPyramid.mesh.rotation.x = Math.sin(time * 0.2) * 0.1

      // 更新能量环
      rings.forEach((ring, i) => {
        ring.material.uniforms.uTime.value = time
        ring.mesh.rotation.z += 0.01 * (i + 1)
        ring.mesh.rotation.x += 0.005 * (i + 1)
      })

      // 更新星云
      nebula.rotation.y += 0.0005
      nebula.rotation.z += 0.0003

      renderer.render(scene, camera)
    }

    let animId
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(fractalPyramid.material.uniforms.uOpacity, {
      value: 1.0,
      duration: 3,
      ease: 'power2.inOut'
    })

    rings.forEach((ring, i) => {
      gsap.to(ring.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 2,
        delay: ring.delay,
        ease: 'power2.out'
      })
    })

    // 旋转速度动态变化
    gsap.to(fractalPyramid.material.uniforms.uRotationSpeed, {
      value: 1.5,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 颜色偏移动画
    gsap.to(fractalPyramid.material.uniforms.uColorShift, {
      value: 0.5,
      duration: 8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    animate()

    // 自动清理和完成回调
    const duration = 25000
    setTimeout(() => {
      cancelAnimationFrame(animId)
      scene.remove(fractalPyramid.mesh)
      rings.forEach(r => scene.remove(r.mesh))
      scene.remove(nebula)
      if (onComplete) onComplete({ type: 'transcendent-fractal-pyramid' })
    }, duration)

    return () => {
      cancelAnimationFrame(animId)
      scene.remove(fractalPyramid.mesh)
      rings.forEach(r => scene.remove(r.mesh))
      scene.remove(nebula)
    }

  } catch (error) {
    console.error('分形金字塔动画错误:', error)
    onError?.(error)
    throw error
  }
}
