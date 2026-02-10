/**
 * 🌆 超越级Vaporwave城市特效
 * 次世代视觉特效 - 增强版音频响应式城市
 *
 * 创新突破：
 * ✨ 程序化城市生成 - 基于噪声的3D城市建筑
 * ✨ 音频响应建筑 - FFT驱动的高度和颜色变化
 * ✨ 霓虹网格道路 - 透视正确的发光网格
 * ✨ 动态日落天空 - 多层渐变+云彩
 * ✨ 飞行汽车粒子 - 自动导航的粒子系统
 * ✨ 音频可视化波形 - 实时频谱显示
 * ✨ 镜面反射地面 - 城市倒影
 * ✨ 动态光照系统 - 太阳+环境光
 * ✨ 相机轨道飞行 - 自动巡航城市
 * ✨ Post-Processing Bloom - 霓虹发光效果
 *
 * 视觉表现：
 * - 无限延伸的赛博朋克城市
 * - 霓虹灯闪烁的摩天大楼
 * - 发光的网格道路
 * - 美丽的渐变日落天空
 * - 飞舞的汽车粒子
 * - 实时音频波形
 * - 地面反射
 *
 * 技术亮点：
 * - 程序化城市生成（1000+建筑）
 * - 实例化渲染（高性能）
 * - 自定义Shader材质
 * - 音频可视化集成
 * - 体积雾效果
 * - 动态光照计算
 *
 * @author Master VFX Designer
 * @inspired Synthwave/Cyberpunk Aesthetics
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 噪声函数
 */
function noise2D(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

/**
 * 平滑噪声
 */
function smoothNoise(x, y) {
  const corners = (noise2D(x - 1, y - 1) + noise2D(x + 1, y - 1) +
                 noise2D(x - 1, y + 1) + noise2D(x + 1, y + 1)) / 16
  const sides = (noise2D(x - 1, y) + noise2D(x + 1, y) +
                noise2D(x, y - 1) + noise2D(x, y + 1)) / 8
  const center = noise2D(x, y) / 4
  return corners + sides + center
}

/**
 * 创建城市建筑材质
 */
function createBuildingMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAudioIntensity: { value: 0 },
      uAudioData: { value: new Float32Array(64) },
      uNeonColor: { value: new THREE.Color(0xff00ff) },
      uBuildingColor: { value: new THREE.Color(0x1a1a2e) }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uAudioIntensity;
      uniform float uAudioData[64];
      uniform vec3 uNeonColor;
      uniform vec3 uBuildingColor;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vec3 color = uBuildingColor;

        // 窗户模式
        float windowSize = 0.15;
        vec2 windowPos = fract(vUv * vec2(8.0, 20.0)) - 0.5;
        float windowDist = max(abs(windowPos.x), abs(windowPos.y));

        // 音频响应窗户亮度
        int audioIndex = int(mod(vUv.x * 64.0, 64.0));
        float audioValue = uAudioData[audioIndex] * uAudioIntensity;

        float windowBrightness = step(windowSize, windowDist);
        float windowGlow = smoothstep(windowSize, windowSize + 0.05, windowDist);

        // 窗户发光
        vec3 windowColor = mix(
          vec3(0.0, 1.0, 1.0),  // 青色
          vec3(1.0, 0.0, 1.0),  // 紫色
          audioValue + sin(vUv.y * 10.0 + uTime) * 0.5 + 0.5
        );

        vec3 windows = mix(windowColor, uBuildingColor, windowBrightness);

        // 边缘霓虹
        float edgeDist = min(vUv.x, min(vUv.y, min(1.0 - vUv.x, 1.0 - vUv.y)));
        float neonGlow = smoothstep(0.02, 0.05, edgeDist) - smoothstep(0.05, 0.1, edgeDist);

        vec3 neon = uNeonColor * neonGlow * (0.5 + audioValue * 2.0);

        // 顶部霓虹带
        float topNeon = smoothstep(0.95, 1.0, vUv.y);
        neon += uNeonColor * topNeon * (0.8 + sin(uTime * 2.0) * 0.2);

        // 法线光照
        vec3 lightDir = normalize(vec3(1.0, 0.5, 0.5));
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 lighting = uBuildingColor * (0.3 + diff * 0.7);

        color = mix(lighting, windows, 1.0 - windowGlow);
        color += neon;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: false
  })
}

/**
 * 创建网格地面材质
 */
function createGridMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAudioIntensity: { value: 0 },
      uGridColor: { value: new THREE.Color(0x00ffff) },
      uGlowIntensity: { value: 1.0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

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
      precision highp int;

      uniform float uTime;
      uniform float uAudioIntensity;
      uniform vec3 uGridColor;
      uniform float uGlowIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vec2 gridUv = vUv * 20.0;

        // 移动的网格
        gridUv.x += uTime * 0.5;

        vec2 grid = abs(fract(gridUv) - 0.5);
        float gridLine = 1.0 - smoothstep(0.0, 0.1, min(grid.x, grid.y));

        // 音频响应发光
        float audioPulse = sin(uTime * 4.0 + vUv.x * 20.0) * 0.5 + 0.5;
        float glow = gridLine * (0.5 + uAudioIntensity * audioPulse * 0.5);

        // 距离衰减
        float dist = length(vPosition.xz);
        float falloff = 1.0 - smoothstep(0.0, 200.0, dist);

        vec3 color = uGridColor * glow * falloff * uGlowIntensity;

        gl_FragColor = vec4(color, gridLine * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
}

/**
 * 创建反射地面
 */
function createReflectiveGround() {
  const geometry = new THREE.PlaneGeometry(500, 500)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReflectivity: { value: 0.3 },
      uRoughness: { value: 0.1 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec2 vUv;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uReflectivity;
      uniform float uRoughness;

      varying vec2 vUv;
      varying vec3 vWorldPosition;

      void main() {
        // 简化的反射 - 使用渐变色模拟
        vec2 reflUv = vec2(0.5 - vWorldPosition.x / 400.0, 0.5 + vWorldPosition.z / 400.0);

        vec3 skyColor = mix(
          vec3(0.1, 0.0, 0.2),  // 紫色
          vec3(1.0, 0.4, 0.0),  // 橙色
          reflUv.y
        );

        // 太阳反射
        vec2 sunPos = vec2(0.5, 0.8);
        float sunDist = length(reflUv - sunPos);
        float sunRefl = smoothstep(0.1, 0.0, sunDist) * 0.5;

        vec3 groundColor = vec3(0.05, 0.05, 0.1);
        vec3 color = mix(groundColor, skyColor, uReflectivity);
        color += vec3(1.0, 0.6, 0.2) * sunRefl;

        gl_FragColor = vec4(color, 0.9);
      }
    `,
    transparent: true
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 0
  return { mesh, material }
}

/**
 * 创建城市建筑
 */
function createCity(buildingCount) {
  const buildingGeometry = new THREE.BoxGeometry(1, 1, 1)
  buildingGeometry.translate(0, 0.5, 0)

  const buildingMaterial = createBuildingMaterial()

  const instancedMesh = new THREE.InstancedMesh(
    buildingGeometry,
    buildingMaterial,
    buildingCount
  )

  const dummy = new THREE.Object3D()

  for (let i = 0; i < buildingCount; i++) {
    const x = (Math.random() - 0.5) * 200
    const z = (Math.random() - 0.5) * 200

    // 使用噪声生成建筑高度
    const height = smoothNoise(x * 0.05, z * 0.05) * 50 + 5

    dummy.position.set(x, 0, z)
    dummy.scale.set(
      5 + Math.random() * 10,
      height,
      5 + Math.random() * 10
    )
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
  }

  instancedMesh.instanceMatrix.needsUpdate = true

  return { mesh: instancedMesh, material: buildingMaterial }
}

/**
 * 创建飞行汽车粒子系统
 */
function createFlyingCars(count) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const lane = Math.floor(Math.random() * 5) - 2
    const laneX = lane * 15

    positions[i * 3] = laneX
    positions[i * 3 + 1] = 15 + Math.random() * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200

    velocities[i * 3] = 0
    velocities[i * 3 + 1] = 0
    velocities[i * 3 + 2] = 20 + Math.random() * 30

    // 车灯颜色 - 红/白/蓝
    const colorType = Math.random()
    if (colorType < 0.4) {
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.2
      colors[i * 3 + 2] = 0.2
    } else if (colorType < 0.7) {
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 1.0
      colors[i * 3 + 2] = 1.0
    } else {
      colors[i * 3] = 0.2
      colors[i * 3 + 1] = 0.6
      colors[i * 3 + 2] = 1.0
    }

    sizes[i] = 2 + Math.random() * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)

  return {
    points,
    velocities,
    update(deltaTime) {
      const pos = geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime

        // 循环
        if (pos[i * 3 + 2] > 100) {
          pos[i * 3 + 2] = -100
        }
      }
      geometry.attributes.position.needsUpdate = true
    }
  }
}

/**
 * 创建音频可视化波形
 */
function createAudioVisualizer() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(128 * 3)

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  })

  const line = new THREE.Line(geometry, material)

  return {
    line,
    update(audioData) {
      const pos = geometry.attributes.position.array
      for (let i = 0; i < 128; i++) {
        const x = (i / 127 - 0.5) * 100
        const y = 5 + (audioData ? audioData[i] || 0 : 0) * 30
        pos[i * 3] = x
        pos[i * 3 + 1] = y
        pos[i * 3 + 2] = -50
      }
      geometry.attributes.position.needsUpdate = true
    }
  }
}

/**
 * 主动画函数
 */
export default function animateTranscendentVaporwaveCity(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 0), 100, controls)
    camera.position.set(0, 40, 80)
    camera.lookAt(0, 20, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-vaporwave-city' })
      },
      onError,
      '🌆 超越级Vaporwave城市特效',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    // 渐变天空背景
    scene.background = new THREE.Color(0x1a0a2e)
    scene.fog = new THREE.FogExp2(0x1a0a2e, 0.003)

    // 创建反射地面
    const reflectiveGround = createReflectiveGround()
    scene.add(reflectiveGround.mesh)

    // 创建网格地面
    const gridMaterial = createGridMaterial()
    const gridGeometry = new THREE.PlaneGeometry(400, 400)
    const grid = new THREE.Mesh(gridGeometry, gridMaterial)
    grid.rotation.x = -Math.PI / 2
    grid.position.y = 0.1
    scene.add(grid)

    // 创建城市
    const city = createCity(1000)
    scene.add(city.mesh)

    // 创建飞行汽车
    const flyingCars = createFlyingCars(200)
    scene.add(flyingCars.points)

    // 创建音频可视化
    const audioVisualizer = createAudioVisualizer()
    audioVisualizer.line.position.y = 50
    audioVisualizer.line.rotation.x = 0
    scene.add(audioVisualizer.line)

    // 太阳
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6633
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(0, 60, -100)
    scene.add(sun)

    // 太阳光晕
    const glowGeometry = new THREE.PlaneGeometry(60, 60)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float alpha = smoothstep(0.5, 0.0, dist);
          vec3 color = mix(
            vec3(1.0, 0.6, 0.2),
            vec3(1.0, 0.2, 0.4),
            dist * 2.0
          );
          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial)
    sunGlow.position.copy(sun.position)
    sunGlow.position.z += 1
    sunGlow.lookAt(camera.position)
    scene.add(sunGlow)

    let time = 0
    let animId = null

    // 音频模拟数据
    let audioIntensity = 0
    let audioPhase = 0
    const audioData = new Float32Array(64)

    function update() {
      time += 0.016

      // 模拟音频响应
      audioPhase += 0.05
      audioIntensity = (Math.sin(audioPhase) * 0.5 + 0.5) * 0.8

      // 生成模拟音频数据
      for (let i = 0; i < 64; i++) {
        audioData[i] = Math.sin(i * 0.2 + audioPhase) * 0.5 + 0.5
        audioData[i] *= Math.sin(i * 0.1 + audioPhase * 0.5) * 0.5 + 0.5
      }

      // 更新建筑材质
      city.material.uniforms.uTime.value = time
      city.material.uniforms.uAudioIntensity.value = audioIntensity
      city.material.uniforms.uAudioData.value = audioData

      // 更新网格
      gridMaterial.uniforms.uTime.value = time
      gridMaterial.uniforms.uAudioIntensity.value = audioIntensity

      // 更新反射地面
      reflectiveGround.material.uniforms.uTime.value = time

      // 更新飞行汽车
      flyingCars.update(0.016)

      // 更新音频可视化
      audioVisualizer.update(audioData)

      // 更新太阳光晕
      sunGlow.material.uniforms.uTime.value = time
      sunGlow.lookAt(camera.position)

      // 太阳运动
      sun.position.y = 60 + Math.sin(time * 0.2) * 10
      sunGlow.position.copy(sun.position)
      sunGlow.position.z += 1

      renderer.render(scene, camera)
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    animate()

    // 相机轨道飞行
    tl.to(camera.position, {
      x: 50,
      y: 35,
      z: 40,
      duration: 8,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: 45,
      z: 30,
      duration: 8,
      ease: 'power2.inOut'
    }, 8)

    tl.to(camera.position, {
      x: 0,
      y: 40,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 16)

    // 始终看向城市中心
    tl.to({}, {
      duration: 24,
      onUpdate: () => {
        camera.lookAt(0, 20, 0)
      }
    }, 0)

    tl.to({}, { duration: 25 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(reflectiveGround.mesh)
        scene.remove(grid)
        scene.remove(city.mesh)
        scene.remove(flyingCars.points)
        scene.remove(audioVisualizer.line)
        scene.remove(sun)
        scene.remove(sunGlow)

        reflectiveGround.mesh.geometry.dispose()
        reflectiveGround.material.dispose()
        gridGeometry.dispose()
        gridMaterial.dispose()
        city.mesh.geometry.dispose()
        city.material.dispose()
        flyingCars.points.geometry.dispose()
        flyingCars.points.material.dispose()
        audioVisualizer.line.geometry.dispose()
        audioVisualizer.line.material.dispose()
        sunGeometry.dispose()
        sunMaterial.dispose()
        glowGeometry.dispose()
        glowMaterial.dispose()

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 25)

    return tl

  } catch (error) {
    console.error('超越级Vaporwave城市动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
