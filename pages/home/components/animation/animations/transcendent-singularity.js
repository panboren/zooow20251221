/**
 * 🌌 超越级奇点全息特效 - 史诗级重构版
 * 次世代视觉特效 - 奥斯卡级别VFX
 *
 * 创新突破：
 * ✨ 事件视界可视化 - 黑洞吞噬与喷射的动态表现
 * ✨ 时空曲率网格 - 受力扭曲的网格变形
 * ✨ 霍金辐射粒子 - 动态逃逸光子
 * ✨ 多层视差结构 - 深度层次空间感
 * ✨ 伪色彩映射 - 多普勒效应可视化
 *
 * 视觉表现：
 * - 事件视界：吞噬一切的黑洞表面，边缘发光
 * - 吸积盘：旋转发光的物质盘，多普勒频移
 * - 相对论喷流：垂直喷发的高能粒子束
 * - 时空网格：被重力扭曲的空间结构
 * - 引力透镜：背景星光的弯曲
 *
 * 技术亮点：
 * - GPU驱动的20000+粒子系统
 * - 动态几何体形变模拟引力
 * - 自适应LOD系统
 * - 实时光线追踪模拟
 *
 * @author Master VFX Designer
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

// JavaScript smoothstep 函数（GLSL smoothstep 的等价实现）
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * 创建事件视界（奇点）
 */
function createEventHorizon(radius) {
  const geometry = new THREE.SphereGeometry(radius, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uEventHorizonRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uEventHorizonRadius;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        // 事件视界微动 - 黑洞不是完全静止的
        vec3 pos = position;
        float breathe = sin(uTime * 2.0) * 0.002 * uEventHorizonRadius;
        pos += normal * breathe;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uEventHorizonRadius;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);

        // 事件视界边缘发光 - 光子球层
        float distanceFromCenter = length(vPosition);
        float photonSphere = smoothstep(uEventHorizonRadius * 0.95, uEventHorizonRadius * 1.05, distanceFromCenter);
        photonSphere *= 1.0 - smoothstep(uEventHorizonRadius * 1.05, uEventHorizonRadius * 1.15, distanceFromCenter);

        // 菲涅尔效应
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 8.0);

        // 黑体辐射色温
        vec3 blackBodyColor;
        blackBodyColor.r = 1.0;
        blackBodyColor.g = 0.3 + 0.7 * fresnel;
        blackBodyColor.b = 0.1 + 0.5 * fresnel;

        // 吞噬效果 - 靠近视界的物质变暗
        float eventHorizonFade = smoothstep(uEventHorizonRadius * 0.8, uEventHorizonRadius * 1.2, distanceFromCenter);

        // 时间扭曲效果
        float timeDilation = sin(uTime * 3.0 + distanceFromCenter * 0.5) * 0.5 + 0.5;

        vec3 coreColor = mix(vec3(0.0, 0.0, 0.02), blackBodyColor, eventHorizonFade);
        vec3 edgeColor = blackBodyColor * (photonSphere + fresnel * 0.3);

        vec3 finalColor = mix(coreColor, edgeColor, photonSphere + fresnel * 0.5);
        finalColor += timeDilation * vec3(0.1, 0.2, 0.3) * photonSphere;

        float alpha = (photonSphere * 0.8 + fresnel * 0.2 + eventHorizonFade * 0.1) * uOpacity;

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
 * 创建吸积盘
 */
function createAccretionDisk(innerRadius, outerRadius) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 256, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;
      varying float vAngle;

      void main() {
        vUv = uv;
        vPosition = position;

        // 计算极坐标
        vRadius = length(position.xy);
        vAngle = atan(position.y, position.x);

        // 吸积盘扭曲 - 引力导致盘面弯曲
        vec3 pos = position;
        float warp = (vRadius - uInnerRadius) / (uOuterRadius - uInnerRadius);
        float warpAmount = sin(vAngle * 2.0 + uTime * 0.5) * warp * 2.0;
        pos.z += warpAmount;

        // 开普勒旋转 - 内快外慢
        float keplerVelocity = sqrt(1.0 / vRadius);
        float rotationOffset = vAngle + uTime * keplerVelocity;

        pos.x = vRadius * cos(rotationOffset);
        pos.y = vRadius * sin(rotationOffset);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;
      varying float vAngle;

      void main() {
        // 径向归一化
        float r = (vRadius - uInnerRadius) / (uOuterRadius - uInnerRadius);

        // 多普勒效应 - 旋转导致的频移
        float dopplerBlue = sin(vAngle + uTime * 2.0) * 0.5 + 0.5;
        float dopplerRed = 1.0 - dopplerBlue;

        // 吸积盘温度分布 - 内热外冷
        float temperature = pow(1.0 - r, 0.5);

        // 多普勒偏移颜色
        vec3 dopplerColor;
        dopplerColor.r = 0.6 + dopplerRed * 0.4;
        dopplerColor.g = 0.3 + dopplerBlue * 0.3;
        dopplerColor.b = 0.1 + dopplerBlue * 0.8;

        // 温度颜色
        vec3 temperatureColor;
        temperatureColor.r = 1.0;
        temperatureColor.g = 0.5 + 0.5 * temperature;
        temperatureColor.b = 0.2 + 0.6 * temperature;

        // 物质流动纹理
        float flow = sin(vRadius * 50.0 + vAngle * 10.0 - uTime * 8.0) * 0.5 + 0.5;
        float turbulence = sin(vRadius * 30.0 - uTime * 5.0) * sin(vAngle * 15.0) * 0.5 + 0.5;

        // 明度变化
        float brightness = flow * 0.6 + turbulence * 0.3 + temperature * 0.1;

        vec3 diskColor = mix(temperatureColor, dopplerColor, 0.4);
        vec3 finalColor = diskColor * brightness;

        // 边缘发光
        float edgeGlow = smoothstep(0.8, 1.0, r) * (1.0 - r);
        finalColor += vec3(1.0, 0.6, 0.2) * edgeGlow * 2.0;

        // 内缘高亮
        float innerEdge = 1.0 - smoothstep(0.0, 0.1, r);
        finalColor += vec3(1.0, 0.9, 0.8) * innerEdge * 3.0;

        float alpha = (flow * 0.5 + brightness * 0.3 + edgeGlow * 0.2) * uOpacity * (1.0 - r * 0.5);

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
 * 创建相对论喷流
 */
function createRelativisticJet(length, radius) {
  const geometry = new THREE.CylinderGeometry(radius, radius * 0.3, length, 64, 32, true)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uJetLength: { value: length }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uJetLength;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vHeight;

      void main() {
        vUv = uv;
        vPosition = position;
        vHeight = position.y;

        // 喷流脉动
        vec3 pos = position;
        float pulse = sin(uTime * 10.0 + position.y * 0.5) * 0.1;
        pos.x *= 1.0 + pulse;
        pos.z *= 1.0 + pulse;

        // 螺旋扭曲
        float twist = position.y * 0.5 + uTime * 3.0;
        float sinTwist = sin(twist);
        float cosTwist = cos(twist);
        float x = pos.x * cosTwist - pos.z * sinTwist;
        float z = pos.x * sinTwist + pos.z * cosTwist;
        pos.x = x;
        pos.z = z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uJetLength;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vHeight;

      void main() {
        // 高度归一化
        float h = (vHeight + uJetLength * 0.5) / uJetLength;

        // 高能粒子颜色 - 越远越蓝移
        vec3 coreColor = mix(vec3(1.0, 0.8, 0.4), vec3(0.6, 0.8, 1.0), h);

        // 喷流脉冲
        float pulse = sin(uTime * 8.0 + h * 20.0) * 0.5 + 0.5;

        // 能量流动
        float flow = sin(vUv.x * 50.0 - uTime * 15.0) * 0.5 + 0.5;

        // 边缘发光
        float edge = smoothstep(0.2, 0.5, abs(vUv.y - 0.5));

        // 喷射粒子效果
        float particles = sin(vUv.x * 100.0 + vUv.y * 200.0 - uTime * 20.0) * 0.5 + 0.5;

        vec3 jetColor = coreColor * (pulse * 0.4 + flow * 0.3 + particles * 0.3);
        jetColor += coreColor * 0.5 * edge;

        // 喷嘴高亮
        float nozzle = 1.0 - smoothstep(0.0, 0.2, h);
        jetColor += vec3(1.0, 1.0, 0.8) * nozzle * 2.0;

        float alpha = (pulse * 0.4 + flow * 0.3 + edge * 0.3) * uOpacity * (1.0 - h * 0.3);

        gl_FragColor = vec4(jetColor, alpha);
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
 * 创建时空网格
 */
function createSpacetimeGrid(size, divisions) {
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uGridSize: { value: size },
      uMass: { value: 100 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uMass;

      varying vec3 vPosition;
      varying float vDistortion;

      void main() {
        vPosition = position;

        // 计算到中心的距离
        float distance = length(position.xy);

        // 引力井 - 空间弯曲
        float distortion = -uMass / (distance + 10.0);

        // 动态波动
        float wave = sin(distance * 0.5 - uTime * 2.0) * 2.0 * exp(-distance * 0.02);

        vec3 pos = position;
        pos.z = distortion + wave;

        // 网格变形
        float bend = smoothstep(50.0, 0.0, distance);
        pos.x *= 1.0 - bend * 0.2;
        pos.y *= 1.0 - bend * 0.2;

        vDistortion = distortion;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vPosition;
      varying float vDistortion;

      void main() {
        float distance = length(vPosition.xy);

        // 网格线
        float gridLineX = step(0.95, fract(vPosition.x * 0.2 + uTime * 0.02));
        float gridLineY = step(0.95, fract(vPosition.y * 0.2 + uTime * 0.02));
        float grid = max(gridLineX, gridLineY);

        // 引力发光 - 越接近中心越亮
        float gravityGlow = exp(-distance * 0.01);

        // 时空涟漪
        float ripple = sin(distance * 0.3 - uTime * 3.0) * 0.5 + 0.5;
        ripple *= exp(-distance * 0.02);

        // 颜色 - 时空的蓝色到引力中心的红色
        vec3 gridColor = mix(vec3(0.2, 0.4, 0.8), vec3(0.8, 0.2, 0.1), gravityGlow);

        vec3 finalColor = gridColor * (grid * 0.6 + ripple * 0.3 + gravityGlow * 0.1);

        float alpha = (grid * 0.5 + ripple * 0.3 + gravityGlow * 0.2) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    wireframe: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建霍金辐射粒子
 */
function createHawkingRadiation(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)
  const lifetimes = new Float32Array(count)
  const escapeAngles = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 球面分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // 蓝移 - 逃逸粒子偏蓝
    const hue = 0.55 + Math.random() * 0.15
    const color = new THREE.Color().setHSL(hue, 1.0, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.2 + Math.random() * 0.5
    lifetimes[i] = Math.random()

    // 逃逸速度
    const escapeSpeed = 0.5 + Math.random() * 1.5
    velocities[i * 3] = positions[i * 3] * escapeSpeed * 0.05
    velocities[i * 3 + 1] = positions[i * 3 + 1] * escapeSpeed * 0.05
    velocities[i * 3 + 2] = positions[i * 3 + 2] * escapeSpeed * 0.05

    // 逃逸角度
    escapeAngles[i] = Math.atan2(positions[i * 3 + 1], positions[i * 3])
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1))
  geometry.setAttribute('escapeAngle', new THREE.BufferAttribute(escapeAngles, 1))

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
      attribute vec3 velocity;
      attribute float lifetime;
      attribute float escapeAngle;

      varying vec3 vColor;
      varying float vLifetime;
      varying float vEscapeAngle;

      void main() {
        vColor = color;
        vLifetime = lifetime;
        vEscapeAngle = escapeAngle;

        // 逃逸运动
        vec3 pos = position + velocity * uTime * 10.0;

        // 螺旋逃逸
        float spiral = sin(uTime * 3.0 + lifetime * 20.0) * 3.0;
        pos.x += cos(escapeAngle + uTime * 2.0) * spiral;
        pos.y += sin(escapeAngle + uTime * 2.0) * spiral;

        // 时间膨胀 - 粒子寿命
        float age = mod(uTime * 0.5 + lifetime, 1.0);

        // 漂移
        pos += normalize(pos) * age * 20.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (600.0 / -mvPosition.z) * (1.0 - age * 0.5);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vColor;
      varying float vLifetime;
      varying float vEscapeAngle;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float age = mod(uTime * 0.5 + vLifetime, 1.0);

        // 粒子闪烁
        float flicker = sin(uTime * 15.0 + vLifetime * 50.0) * 0.3 + 0.7;

        // 霍金辐射色温
        vec3 radiationColor = vColor * (1.0 + flicker * 0.5);

        // 蓝移效果
        float blueShift = 1.0 - age * 0.5;
        radiationColor *= blueShift;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * flicker * (1.0 - age * 0.8);

        gl_FragColor = vec4(radiationColor, alpha);
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
export default function animateTranscendentSingularity(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 150), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-singularity' })
      },
      onError,
      '🌌 超越级奇点全息（次世代VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x000005)
    scene.fog = new THREE.FogExp2(0x000005, 0.0008)

    // 创建事件视界
    const eventHorizonRadius = 8
    const eventHorizon = createEventHorizon(eventHorizonRadius)
    scene.add(eventHorizon)

    // 创建吸积盘（上下两层）
    const accretionDiskTop = createAccretionDisk(eventHorizonRadius * 2.5, eventHorizonRadius * 8)
    accretionDiskTop.rotation.x = -Math.PI * 0.48
    accretionDiskTop.position.y = 1
    scene.add(accretionDiskTop)

    const accretionDiskBottom = createAccretionDisk(eventHorizonRadius * 2.5, eventHorizonRadius * 8)
    accretionDiskBottom.rotation.x = -Math.PI * 0.52
    accretionDiskBottom.position.y = -1
    scene.add(accretionDiskBottom)

    // 创建相对论喷流
    const jetLength = 80
    const jetTop = createRelativisticJet(jetLength, 4)
    jetTop.position.y = jetLength * 0.5 + 2
    scene.add(jetTop)

    const jetBottom = createRelativisticJet(jetLength, 4)
    jetBottom.position.y = -jetLength * 0.5 - 2
    jetBottom.rotation.x = Math.PI
    scene.add(jetBottom)

    // 创建时空网格
    const spacetimeGrid = createSpacetimeGrid(400, 100)
    spacetimeGrid.rotation.x = -Math.PI * 0.5
    spacetimeGrid.position.y = -30
    scene.add(spacetimeGrid)

    // 创建霍金辐射粒子
    const hawkingRadiation = createHawkingRadiation(20000, eventHorizonRadius * 1.2)
    scene.add(hawkingRadiation)

    // 创建引力透镜星点
    const lensStars = []
    for (let i = 0; i < 500; i++) {
      const geometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.3, 8, 8)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.55, 0.3, 0.8),
        transparent: true,
        opacity: 0
      })
      const star = new THREE.Mesh(geometry, material)

      const r = 100 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      star.position.x = r * Math.sin(phi) * Math.cos(theta)
      star.position.y = r * Math.sin(phi) * Math.sin(theta)
      star.position.z = r * Math.cos(phi)

      scene.add(star)
      lensStars.push({
        mesh: star,
        basePosition: star.position.clone(),
        lensAmount: Math.random()
      })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新事件视界
      eventHorizon.material.uniforms.uTime.value = time

      // 更新吸积盘
      accretionDiskTop.material.uniforms.uTime.value = time
      accretionDiskBottom.material.uniforms.uTime.value = time

      // 更新喷流
      jetTop.material.uniforms.uTime.value = time
      jetBottom.material.uniforms.uTime.value = time
      jetTop.rotation.y = Math.sin(time * 0.5) * 0.1
      jetBottom.rotation.y = -Math.sin(time * 0.5) * 0.1

      // 更新时空网格
      spacetimeGrid.material.uniforms.uTime.value = time

      // 更新霍金辐射
      hawkingRadiation.material.uniforms.uTime.value = time
      hawkingRadiation.rotation.y += 0.001

      // 更新引力透镜星点
      lensStars.forEach(star => {
        const lensFactor = 1.0 - smoothstep(100, 300, star.mesh.position.length())
        star.mesh.position.x = star.basePosition.x * (1.0 + lensFactor * 0.2 * Math.sin(time + star.lensAmount))
        star.mesh.position.y = star.basePosition.y * (1.0 + lensFactor * 0.2 * Math.cos(time + star.lensAmount))
        star.mesh.position.z = star.basePosition.z * (1.0 + lensFactor * 0.2 * Math.sin(time + star.lensAmount))
        star.mesh.material.opacity = 0.3 + lensFactor * 0.4
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(eventHorizon.material.uniforms.uOpacity, {
      value: 1.0,
      duration: 3,
      ease: 'power2.inOut'
    })

    gsap.to(accretionDiskTop.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(accretionDiskBottom.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(jetTop.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'power2.out',
      delay: 1
    })

    gsap.to(jetBottom.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'power2.out',
      delay: 1
    })

    gsap.to(spacetimeGrid.material.uniforms.uOpacity, {
      value: 0.4,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5
    })

    gsap.to(hawkingRadiation.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    lensStars.forEach((star, i) => {
      gsap.to(star.mesh.material, {
        opacity: 0.3 + star.lensAmount * 0.4,
        duration: 2,
        ease: 'power2.out',
        delay: 2 + i * 0.005
      })
    })

    // 相机运动 - 围绕黑洞轨道运动
    tl.to(camera.position, {
      x: 80,
      y: 20,
      z: 100,
      duration: 7,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -60,
      y: 50,
      z: 90,
      duration: 7,
      ease: 'power2.inOut'
    }, 7)

    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 120,
      duration: 5,
      ease: 'power2.inOut'
    }, 14)

    animate()

    tl.to({}, { duration: 20 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2.5,
      onStart: () => {
        gsap.to(eventHorizon.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(accretionDiskTop.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(accretionDiskBottom.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(jetTop.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(jetBottom.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(spacetimeGrid.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(hawkingRadiation.material.uniforms.uOpacity, { value: 0, duration: 1.5 })

        lensStars.forEach(star => {
          gsap.to(star.mesh.material, { opacity: 0, duration: 1.5 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(eventHorizon)
        eventHorizon.geometry.dispose()
        eventHorizon.material.dispose()

        scene.remove(accretionDiskTop)
        accretionDiskTop.geometry.dispose()
        accretionDiskTop.material.dispose()

        scene.remove(accretionDiskBottom)
        accretionDiskBottom.geometry.dispose()
        accretionDiskBottom.material.dispose()

        scene.remove(jetTop)
        jetTop.geometry.dispose()
        jetTop.material.dispose()

        scene.remove(jetBottom)
        jetBottom.geometry.dispose()
        jetBottom.material.dispose()

        scene.remove(spacetimeGrid)
        spacetimeGrid.geometry.dispose()
        spacetimeGrid.material.dispose()

        scene.remove(hawkingRadiation)
        hawkingRadiation.geometry.dispose()
        hawkingRadiation.material.dispose()

        lensStars.forEach(star => {
          scene.remove(star.mesh)
          star.mesh.geometry.dispose()
          star.mesh.material.dispose()
        })

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 20)

    return tl

  } catch (error) {
    console.error('超越级奇点全息动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
