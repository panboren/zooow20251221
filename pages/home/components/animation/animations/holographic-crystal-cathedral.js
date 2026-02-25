/**
 * 💎 全息水晶大教堂特效
 * 传说级视觉特效 - 神圣建筑重现
 *
 * 技术特点:
 * - 晶体折射模拟
 * - 光线追踪效果
 * - 多层玻璃结构
 * - 动态光色变换
 * - 神圣氛围渲染
 *
 * 视觉表现:
 * 水晶柱廊
 - 光线折射
 - 彩虹光晕
 - 晶体碎片
 - 神圣光辉
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建水晶柱
 */
function createCrystalColumn(height, radius, color) {
  const geometry = new THREE.CylinderGeometry(radius * 0.6, radius, height, 32, 32)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uReflection: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uReflection;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normal;
        vPosition = position;
        vViewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);

        vec3 pos = position;

        // 水晶波动
        float crystalWave = sin(pos.y * 0.5 + uTime) * uReflection * 0.05;
        pos += normal * crystalWave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uReflection;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

        // 水晶折射
        float refraction = sin(vPosition.y * 0.3 + uTime * 2.0) * 0.5 + 0.5;

        // 彩虹光晕
        float rainbow = sin(vPosition.y * 0.2 + uTime * 1.5) * 0.5 + 0.5;
        vec3 rainbowColor;
        rainbowColor.r = sin(rainbow * 6.28318) * 0.5 + 0.5;
        rainbowColor.g = sin(rainbow * 6.28318 + 2.094) * 0.5 + 0.5;
        rainbowColor.b = sin(rainbow * 6.28318 + 4.188) * 0.5 + 0.5;

        // 水晶内部光
        float innerLight = 1.0 - abs(dot(vNormal, viewDir));
        innerLight = pow(innerLight, 2.0);

        vec3 finalColor = mix(uColor, rainbowColor, refraction * 0.3);
        finalColor += rainbowColor * fresnel * 0.4;
        finalColor += uColor * innerLight * 0.3;

        float alpha = (fresnel * 0.6 + innerLight * 0.4) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建水晶穹顶
 */
function createCrystalDome(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uRadiance: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uRadiance;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normal;
        vPosition = position;
        vViewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);

        vec3 pos = position;

        // 穹顶波动
        float domeWave = sin(length(pos.xz) * 0.3 + uTime * 2.0) * uRadiance * 0.05;
        pos += normal * domeWave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRadiance;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 光辉扩散
        float radiance = sin(uTime * 1.5 + length(vPosition.xz) * 0.2) * 0.5 + 0.5;
        radiance *= uRadiance;

        // 神圣光晕
        float divineGlow = exp(-pow(length(vPosition - vec3(0.0, 20.0, 0.0)) * 0.1, 2.0));

        // 彩虹色散
        float dispersion = sin(vPosition.y * 0.15 + uTime * 1.2) * 0.5 + 0.5;
        vec3 dispersionColor;
        dispersionColor.r = sin(dispersion * 6.28318) * 0.5 + 0.5;
        dispersionColor.g = sin(dispersion * 6.28318 + 2.094) * 0.5 + 0.5;
        dispersionColor.b = sin(dispersion * 6.28318 + 4.188) * 0.5 + 0.5;

        vec3 finalColor = uColor * (1.0 + radiance * 0.5);
        finalColor += dispersionColor * fresnel * 0.4;
        finalColor += uColor * divineGlow * 0.5;

        float alpha = (fresnel * 0.5 + divineGlow * 0.5) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建水晶碎片
 */
function createCrystalShards(count, radius) {
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

    const hue = Math.random() * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 0.5
    rotations[i * 3] = Math.random() * Math.PI * 2
    rotations[i * 3 + 1] = Math.random() * Math.PI * 2
    rotations[i * 3 + 2] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 3))

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
      attribute vec3 rotation;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 碎片旋转
        float angle = uTime * 0.5;
        vec3 rotatedPos = pos;
        float cosX = cos(angle * rotation.x);
        float sinX = sin(angle * rotation.x);
        vec3 temp = rotatedPos;
        rotatedPos.y = temp.y * cosX - temp.z * sinX;
        rotatedPos.z = temp.y * sinX + temp.z * cosX;

        // 碎片浮动
        float floatWave = sin(uTime * 2.0 + length(pos) * 0.2) * 2.0;
        pos.y += floatWave;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (250.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        // 六边形碎片
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float hex = smoothstep(0.4, 0.3, dist);

        // 水晶折射
        float refraction = sin(gl_PointCoord.x * 6.28318) * 0.5 + 0.5;

        vec3 color = vColor * (1.0 + refraction * 0.3);
        float alpha = hex * uOpacity;

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
 * 水晶大教堂动画主函数
 */
export default function animateHolographicCrystalCathedral(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 10, 80), 75, controls)
  camera.lookAt(0, 20, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-crystal-cathedral' })
    },
    onError,
    '💎 全息水晶大教堂（传说级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0a15)
  scene.fog = new THREE.FogExp2(0x0a0a15, 0.0012)

  // 创建水晶柱
  const columns = []
  const columnColors = [0x88ccff, 0xaaddff, 0xccddff, 0xddeeff]
  for (let i = 0; i < 8; i++) {
    const column = createCrystalColumn(50, 2, columnColors[i % 4])
    const angle = (i / 8) * Math.PI * 2
    column.position.x = Math.cos(angle) * 20
    column.position.z = Math.sin(angle) * 20
    scene.add(column)
    columns.push(column)
  }

  // 创建水晶穹顶
  const dome = createCrystalDome(30, 0xaaddff)
  dome.position.y = 45
  scene.add(dome)

  // 创建水晶碎片
  const crystalShards = createCrystalShards(5000, 60)
  scene.add(crystalShards)

  // 入场动画
  columns.forEach((column, i) => {
    tl.to(
      column.material.uniforms.uOpacity,
      { value: 0.7, duration: 1.5 },
      `start+=${i * 0.15}`
    )
    tl.to(
      column.material.uniforms.uReflection,
      { value: 1, duration: 2 },
      `start+=${i * 0.15 + 0.5}`
    )
  })

  tl.to(
    dome.material.uniforms.uOpacity,
    { value: 0.6, duration: 1.5 },
    'start+=1'
  )
  tl.to(
    dome.material.uniforms.uRadiance,
    { value: 1, duration: 2 },
    'start+=1.5'
  )

  tl.to(
    crystalShards.material.uniforms.uOpacity,
    { value: 0.8, duration: 1.5 },
    'start+=2'
  )

  // 相机动画
  tl.to(camera.position, {
    x: 15,
    y: 25,
    z: 60,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 神圣光辉动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        columns.forEach((column, i) => {
          column.rotation.y = time * 0.2 + i * 0.1
        })
      }
    },
    '+=1'
  )

  // 退出动画
  tl.to(
    columns.map(c => c.material.uniforms.uOpacity),
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    dome.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end-=1'
  )
  tl.to(
    crystalShards.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )

  // 动画循环
  let animId = null
  const animate = (time) => {
    animId = requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新水晶柱
    columns.forEach((column, i) => {
      column.material.uniforms.uTime.value = elapsedTime
      column.rotation.y = elapsedTime * 0.1 + i * 0.2
    })

    // 更新穹顶
    dome.material.uniforms.uTime.value = elapsedTime
    dome.rotation.y = elapsedTime * 0.05

    // 更新碎片
    crystalShards.material.uniforms.uTime.value = elapsedTime
    crystalShards.rotation.y = elapsedTime * 0.08

    renderer.render(scene, camera)
  }

  animate(0)

  // 清理函数
  return () => {
    // 停止动画循环
    if (animId) {
      cancelAnimationFrame(animId)
    }

    columns.forEach(c => {
      scene.remove(c)
      c.geometry.dispose()
      c.material.dispose()
    })
    scene.remove(dome)
    dome.geometry.dispose()
    dome.material.dispose()
    scene.remove(crystalShards)
    crystalShards.geometry.dispose()
    crystalShards.material.dispose()
    scene.background = originalBackground
    scene.fog = originalFog
  }
}
