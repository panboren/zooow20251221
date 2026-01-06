/**
 * effects/cosmic-particle-symphony.js
 * 宇宙粒子交响曲特效
 * 和谐、流动、音乐可视化
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建宇宙粒子交响曲
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 粒子交响曲对象
 */
export function createCosmicParticleSymphony(scene, options = {}) {
  const {
    particleCount = 20000,
    waveLayers = 5
  } = options

  // 音符粒子
  const noteGeometry = new THREE.BufferGeometry()
  const notePositions = new Float32Array(particleCount * 3)
  const noteColors = new Float32Array(particleCount * 3)
  const noteSizes = new Float32Array(particleCount)
  const notePhases = new Float32Array(particleCount)
  const noteAmplitudes = new Float32Array(particleCount)

  const colorPalette = [
    new THREE.Color(0xff6b6b), // 红
    new THREE.Color(0x4ecdc4), // 青
    new THREE.Color(0xffe66d), // 黄
    new THREE.Color(0x95e1d3), // 薄荷
    new THREE.Color(0xf38181), // 珊瑚
    new THREE.Color(0xaa96da), // 紫
    new THREE.Color(0xfcbad3), // 粉
    new THREE.Color(0xa8d8ea)  // 天蓝
  ]

  for (let i = 0; i < particleCount; i++) {
    // 初始位置
    const angle = Math.random() * Math.PI * 2
    const radius = 30 + Math.random() * 50

    notePositions[i * 3] = Math.cos(angle) * radius
    notePositions[i * 3 + 1] = (Math.random() - 0.5) * 60
    notePositions[i * 3 + 2] = Math.sin(angle) * radius

    // 颜色
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    noteColors[i * 3] = color.r
    noteColors[i * 3 + 1] = color.g
    noteColors[i * 3 + 2] = color.b

    noteSizes[i] = 0.5 + Math.random() * 1.5
    notePhases[i] = Math.random() * Math.PI * 2
    noteAmplitudes[i] = 5 + Math.random() * 15
  }

  noteGeometry.setAttribute('position', new THREE.BufferAttribute(notePositions, 3))
  noteGeometry.setAttribute('color', new THREE.BufferAttribute(noteColors, 3))
  noteGeometry.setAttribute('size', new THREE.BufferAttribute(noteSizes, 1))
  noteGeometry.setAttribute('phase', new THREE.BufferAttribute(notePhases, 1))
  noteGeometry.setAttribute('amplitude', new THREE.BufferAttribute(noteAmplitudes, 1))

  const noteMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const notes = new THREE.Points(noteGeometry, noteMaterial)
  scene.add(notes)

  // 原始位置备份
  const originalPositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i++) {
    originalPositions[i] = notePositions[i]
  }

  // 波浪层
  const waveLayersMeshes = []
  for (let layer = 0; layer < waveLayers; layer++) {
    const geometry = new THREE.RingGeometry(20 + layer * 15, 22 + layer * 15, 64)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: colorPalette[layer % colorPalette.length] },
        uLayer: { value: layer }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uLayer;
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // 波浪变形
          float wave = sin(uTime * 3.0 + uLayer * 0.5) * 3.0;
          float ripple = sin(length(pos.xz) * 0.5 - uTime * 5.0) * 2.0;
          pos.y += wave + ripple;

          vPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uLayer;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
          // 同心圆波纹
          float dist = length(vPos.xz);
          float ripple = sin(dist * 0.3 - uTime * 5.0) * 0.5 + 0.5;

          // 边缘发光
          float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
          edge = pow(edge, 2.0);

          vec3 color = uColor * (0.5 + ripple * 0.5);
          float alpha = edge * 0.6;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const waveLayer = new THREE.Mesh(geometry, material)
    waveLayer.rotation.x = Math.PI / 2
    waveLayer.position.y = -10 - layer * 5
    waveLayer.scale.setScalar(0)
    scene.add(waveLayer)
    waveLayersMeshes.push(waveLayer)
  }

  // 中心音符球体
  const noteSphereGeometry = new THREE.SphereGeometry(10, 32, 32)
  const noteSphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;

        // 脉动效果
        float pulse = sin(uTime * 8.0 + length(position) * 0.5) * 0.5;
        vec3 pos = position + normal * pulse;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
        float pulse = sin(uTime * 10.0) * 0.3 + 0.7;

        // 多彩渐变
        float hue = (uTime * 0.1 + length(vPos) * 0.05);
        vec3 color = uColor * (0.5 + fresnel * 0.5);
        color += vec3(0.5, 0.3, 0.8) * fresnel * pulse;

        float alpha = fresnel * 0.8;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  })

  const noteSphere = new THREE.Mesh(noteSphereGeometry, noteSphereMaterial)
  noteSphere.scale.setScalar(0)
  scene.add(noteSphere)

  // 音符连线
  const connections = []
  const connectionCount = 100
  for (let i = 0; i < connectionCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const points = []

    const angle = Math.random() * Math.PI * 2
    const radius = 10 + Math.random() * 40

    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 60,
      Math.sin(angle) * radius
    ))

    points.push(new THREE.Vector3(0, 0, 0))

    geometry.setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const line = new THREE.Line(geometry, material)
    scene.add(line)
    connections.push(line)
  }

  return {
    notes,
    noteGeometry,
    noteMaterial,
    waveLayersMeshes,
    noteSphere,
    connections,
    originalPositions,
    update(deltaTime, time) {
      // 更新波浪层
      waveLayersMeshes.forEach((layer, i) => {
        layer.material.uniforms.uTime.value = time
        layer.rotation.z += deltaTime * 0.2 * (i % 2 === 0 ? 1 : -1)
      })

      // 更新音符球
      noteSphere.material.uniforms.uTime.value = time

      // 更新音符粒子
      const pos = noteGeometry.attributes.position.array
      const phases = noteGeometry.attributes.phase.array
      const amplitudes = noteGeometry.attributes.amplitude.array

      for (let i = 0; i < particleCount; i++) {
        if (noteMaterial.opacity > 0) {
          const baseY = originalPositions[i * 3 + 1]
          pos[i * 3 + 1] = baseY + Math.sin(time * 3 + phases[i]) * amplitudes[i] * 0.3
        }
      }
      noteGeometry.attributes.position.needsUpdate = true

      // 更新连线
      connections.forEach((conn, i) => {
        if (conn.material.opacity > 0) {
          const pulse = Math.sin(time * 5 + i * 0.1) * 0.5 + 0.5
          conn.material.opacity = pulse * 0.3
        }
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 阶段1: 序幕 - 波浪层出现
      waveLayersMeshes.forEach((layer, i) => {
        gsap.to(layer.scale, {
          x: 1, y: 1, z: 1,
          duration: 1,
          delay: i * 0.15,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      // 阶段2: 主旋律 - 音符球体出现
      gsap.to(noteSphere.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        delay: 1,
        ease: 'elastic.out(1, 0.5)'
      })

      // 阶段3: 和声 - 粒子浮现
      gsap.to(noteMaterial, {
        opacity: 1,
        duration: 1.5,
        delay: 1.5,
        ease: 'power2.out'
      })

      // 连线出现
      connections.forEach((conn, i) => {
        gsap.to(conn.material, {
          opacity: 0.3,
          duration: 0.5,
          delay: 2 + i * 0.005,
          ease: 'power2.out'
        })
      })

      // 阶段4: 高潮 - 放大和脉动
      gsap.to(noteSphere.scale, {
        x: 1.5, y: 1.5, z: 1.5,
        duration: 1,
        delay: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      waveLayersMeshes.forEach((layer, i) => {
        gsap.to(layer.material.uniforms.uColor.value, {
          r: 1, g: 1, b: 1,
          duration: 0.5,
          delay: 3 + i * 0.1,
          yoyo: true,
          repeat: 1
        })
      })

      // 阶段5: 终章 - 渐隐
      gsap.to(noteMaterial, {
        opacity: 0,
        duration: 2,
        delay: 5,
        ease: 'power2.in'
      })

      connections.forEach((conn, i) => {
        gsap.to(conn.material, {
          opacity: 0,
          duration: 1,
          delay: 5 + i * 0.005,
          ease: 'power2.in'
        })
      })

      gsap.to(noteSphere.scale, {
        x: 0, y: 0, z: 0,
        duration: 1.5,
        delay: 5.5,
        ease: 'power2.in'
      })

      waveLayersMeshes.forEach((layer, i) => {
        gsap.to(layer.scale, {
          x: 0, y: 0, z: 0,
          duration: 1.5,
          delay: 6 - i * 0.1,
          ease: 'power2.in'
        })
      })

      return tl
    },
    destroy() {
      scene.remove(notes)
      waveLayersMeshes.forEach(layer => {
        scene.remove(layer)
        layer.geometry.dispose()
        layer.material.dispose()
      })
      scene.remove(noteSphere)
      connections.forEach(conn => {
        scene.remove(conn)
        conn.geometry.dispose()
        conn.material.dispose()
      })
      noteGeometry.dispose()
      noteMaterial.dispose()
      noteSphereGeometry.dispose()
      noteSphereMaterial.dispose()
    }
  }
}
