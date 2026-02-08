/**
 * 🔮 全息维度折叠特效
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 维度空间折叠
 * - 莫比乌斯带变换
 * - 克莱因瓶拓扑
 * - 超立方体投影
 * - 空间扭曲模拟
 *
 * 视觉表现:
 * 多维空间展开
 * 拓扑结构变形
 * 维度穿越效果
 * 空间折叠动画
 * 维度碎片重组
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建超立方体(4D立方体投影)
 */
function createTesseract(radius, color) {
  const group = new THREE.Group()

  // 8个顶点的坐标(4D立方体的3D投影)
  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
  ].map(v => new THREE.Vector3(...v).multiplyScalar(radius))

  // 创建内部立方体
  const innerVertices = vertices.map(v => v.clone().multiplyScalar(0.5))

  // 创建连接线
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uFold: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uFold;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        float twist = sin(pos.y * 0.5 + uTime * 2.0) * uFold * 5.0;
        pos.x += twist;
        pos.z += twist * 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uFold;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 维度能量
        float dimensionEnergy = sin(vPosition.x * 2.0 + uTime * 3.0) *
                               sin(vPosition.y * 2.0 + uTime * 2.5) *
                               sin(vPosition.z * 2.0 + uTime * 2.0);
        dimensionEnergy = dimensionEnergy * 0.5 + 0.5;

        // 折叠强度
        float foldIntensity = uFold * 0.5 + 0.5;

        // 高维光谱
        vec3 spectrum;
        spectrum.r = sin(uTime * 2.0 + 0.0) * 0.5 + 0.5;
        spectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        spectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        vec3 color = mix(uColor, spectrum, dimensionEnergy * 0.4);
        color += uColor * dimensionEnergy * foldIntensity * 0.3;

        float alpha = (0.3 + dimensionEnergy * 0.7) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  // 外部立方体边框
  const outerLines = []
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const diff = vertices[i].distanceTo(vertices[j])
      if (Math.abs(diff - radius * 2) < 0.01) {
        outerLines.push(vertices[i].clone(), vertices[j].clone())
      }
    }
  }

  const outerGeometry = new THREE.BufferGeometry().setFromPoints(outerLines)
  const outerCube = new THREE.LineSegments(outerGeometry, material)
  group.add(outerCube)

  // 内部立方体边框
  const innerLines = []
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const diff = innerVertices[i].distanceTo(innerVertices[j])
      if (Math.abs(diff - radius) < 0.01) {
        innerLines.push(innerVertices[i].clone(), innerVertices[j].clone())
      }
    }
  }

  const innerGeometry = new THREE.BufferGeometry().setFromPoints(innerLines)
  const innerCube = new THREE.LineSegments(innerGeometry, material.clone())
  group.add(innerCube)

  // 连接内外立方体的边
  const connectionLines = []
  for (let i = 0; i < 8; i++) {
    connectionLines.push(vertices[i].clone(), innerVertices[i].clone())
  }

  const connectionGeometry = new THREE.BufferGeometry().setFromPoints(connectionLines)
  const connections = new THREE.LineSegments(connectionGeometry, material.clone())
  group.add(connections)

  return { group, materials: [material, innerCube.material, connections.material] }
}

/**
 * 创建莫比乌斯带
 */
function createMobiusStrip(radius, color) {
  const geometry = new THREE.TorusGeometry(radius * 0.7, radius * 0.15, 16, 100)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uTwist: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uTwist;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        float twistAngle = vUv.x * 6.28 * uTwist;
        float c = cos(twistAngle);
        float s = sin(twistAngle);

        vec3 twistedPos;
        twistedPos.x = pos.x * c - pos.y * s;
        twistedPos.y = pos.x * s + pos.y * c;
        twistedPos.z = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(twistedPos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTwist;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 莫比乌斯拓扑
        float topology = sin(vUv.x * 6.28 + uTime * 3.0) * 0.5 + 0.5;

        // 单侧表面效果
        float surface = sin(vUv.y * 6.28 + uTime * 2.5) * 0.5 + 0.5;

        // 扭曲能量
        float twistEnergy = uTwist * 0.5 + 0.5;

        // 连续颜色流动
        vec3 flowColor;
        flowColor.r = sin(uTime * 1.5 + vUv.x * 6.28) * 0.5 + 0.5;
        flowColor.g = sin(uTime * 1.5 + vUv.x * 6.28 + 2.094) * 0.5 + 0.5;
        flowColor.b = sin(uTime * 1.5 + vUv.x * 6.28 + 4.188) * 0.5 + 0.5;

        vec3 color = mix(uColor, flowColor, topology * 0.6);
        color += surface * uColor * twistEnergy * 0.4;

        float alpha = (topology * 0.5 + surface * 0.5) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 4
  mesh.rotation.y = Math.PI / 6
  return mesh
}

/**
 * 创建维度碎片
 */
function createDimensionFragments(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const rotations = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.5 + 0.4
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.5 + Math.random() * 1.5
    rotations[i * 3] = Math.random() * Math.PI
    rotations[i * 3 + 1] = Math.random() * Math.PI
    rotations[i * 3 + 2] = Math.random() * Math.PI
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 3))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uFold: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uFold;

      attribute float size;
      attribute vec3 color;
      attribute vec3 rotation;

      varying vec3 vColor;
      varying float vFold;

      void main() {
        vColor = color;
        vFold = uFold;

        vec3 pos = position;
        float fold = sin(uTime * 2.0 + position.x * 0.1) * uFold * 3.0;
        pos += normalize(pos) * fold;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z) * (0.6 + 0.4 * uFold);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;
      uniform float uFold;

      varying vec3 vColor;
      varying float vFold;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 维度闪烁
        float dimensionFlash = sin(uOpacity * 10.0 + vFold * 20.0) * 0.2 + 0.8;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * dimensionFlash;
        gl_FragColor = vec4(vColor * 1.2, alpha);
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
export default function animateHolographicDimensionFold(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 25, 120), 95, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-dimension-fold' })
      },
      onError,
      '🔮 全息维度折叠（超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x050515)
    scene.fog = new THREE.FogExp2(0x050515, 0.0016)

    // 创建超立方体
    const tesseractData = createTesseract(25, 0x9400d3)
    scene.add(tesseractData.group)

    // 创建莫比乌斯带
    const mobiusStrips = []
    for (let i = 0; i < 4; i++) {
      const radius = 30 + i * 15
      const hue = (i / 4) * 0.4 + 0.5
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
      const strip = createMobiusStrip(radius, color)
      strip.position.y = (i - 1.5) * 20
      scene.add(strip)
      mobiusStrips.push({
        mesh: strip,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        phase: i * 0.5
      })
    }

    // 创建维度碎片
    const dimensionFragments = createDimensionFragments(7000, 100)
    scene.add(dimensionFragments)

    // 创建空间扭曲环
    const spaceWarpRings = []
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.TorusGeometry(20 + i * 8, 0.8, 8, 100)
      const hue = i / 8
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(hue, 0.9, 0.6) },
          uOpacity: { value: 0 },
          uWarp: { value: 0 }
        },
        vertexShader: `
          precision highp float;
          precision highp int;

          uniform float uTime;
          uniform float uWarp;

          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            vUv = uv;
            vPosition = position;

            vec3 pos = position;
            float warp = sin(pos.x * 0.3 + uTime * 2.0) * uWarp * 2.0;
            pos += normal * warp;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          precision highp int;

          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uWarp;

          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            // 空间扭曲
            float distortion = sin(vPosition.z * 0.5 + uTime * 3.0) * 0.5 + 0.5;

            // 维度波动
            float dimensionWave = sin(uTime * 4.0 + vUv.x * 10.0) * 0.5 + 0.5;

            vec3 color = uColor * (distortion * 0.5 + dimensionWave * 0.5);
            float alpha = (distortion * 0.6 + dimensionWave * 0.4) * uOpacity;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.3 : -0.3)
      ring.rotation.z = i * 0.2
      scene.add(ring)
      spaceWarpRings.push({
        mesh: ring,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        phase: i * 0.3
      })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新超立方体
      tesseractData.group.rotation.x += 0.008
      tesseractData.group.rotation.y += 0.012
      tesseractData.group.rotation.z += 0.006
      tesseractData.materials.forEach((mat, i) => {
        mat.uniforms.uTime.value = time
        mat.uniforms.uFold.value = 0.5 + 0.5 * Math.sin(time * 1.5 + i * 0.5)
      })

      // 更新莫比乌斯带
      mobiusStrips.forEach((strip, i) => {
        strip.mesh.rotation.x += strip.rotSpeed
        strip.mesh.rotation.y += strip.rotSpeed * 1.5
        strip.mesh.material.uniforms.uTime.value = time
        strip.mesh.material.uniforms.uTwist.value = 0.5 + 0.5 * Math.sin(time * 2 + strip.phase)
      })

      // 更新维度碎片
      dimensionFragments.material.uniforms.uTime.value = time
      dimensionFragments.material.uniforms.uFold.value = 0.6 + 0.4 * Math.sin(time * 1.8)
      dimensionFragments.rotation.y += 0.004
      dimensionFragments.rotation.x = Math.sin(time * 0.3) * 0.06

      // 更新空间扭曲环
      spaceWarpRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = Math.PI / 2 + Math.sin(time + ring.phase) * 0.15
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uWarp.value = 0.5 + 0.5 * Math.sin(time * 1.2 + ring.phase)
        const warpScale = 1 + 0.1 * Math.sin(time * 2 + ring.phase)
        ring.mesh.scale.setScalar(warpScale)
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    tesseractData.materials.forEach((mat, i) => {
      gsap.to(mat.uniforms.uOpacity, {
        value: 0.8,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.2
      })
    })

    mobiusStrips.forEach((strip, i) => {
      gsap.to(strip.mesh.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(dimensionFragments.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    spaceWarpRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.5 + i * 0.15
      })
    })

    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 25,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -60,
      y: -5,
      z: 90,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        tesseractData.materials.forEach(mat => {
          gsap.to(mat.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        mobiusStrips.forEach(strip => {
          gsap.to(strip.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(dimensionFragments.material.uniforms.uOpacity, { value: 0, duration: 1 })

        spaceWarpRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(tesseractData.group)
        tesseractData.materials.forEach(mat => mat.dispose())
        tesseractData.materials.forEach(mat => scene.remove(mat))

        mobiusStrips.forEach(strip => {
          scene.remove(strip.mesh)
          strip.mesh.geometry.dispose()
          strip.mesh.material.dispose()
        })

        scene.remove(dimensionFragments)
        dimensionFragments.geometry.dispose()
        dimensionFragments.material.dispose()

        spaceWarpRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 18)

    return tl

  } catch (error) {
    console.error('全息维度折叠动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
