/**
 * 增强版全息特效动画集（修复版）
 * 修复了参数传递、循环管理和场景背景问题
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 全息数据流动画（增强版）
 */
export function animateHolographicDataStream(props, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  const tl = gsap.timeline({
    onComplete: () => {
      cancelAnimationFrame(animId)
      const payload = { success: true, animationType: 'holographic-glitch' }
      onComplete?.(payload)
    },
    onError: (err) => onError?.(err)
  })

  // 保存原始背景
  const originalBackground = scene.background
  const originalFog = scene.fog

  // 设置深色背景以增强全息效果
  scene.background = new THREE.Color(0x000510)

  // 创建多条垂直数据流
  const dataStreams = []
  const streamCount = 20

  for (let s = 0; s < streamCount; s++) {
    const geometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const hue = 0.3 + (s / streamCount) * 0.2

    for (let i = 0; i < particleCount; i++) {
      const x = ((s - streamCount / 2) / streamCount) * 80
      const y = -60 + (i / particleCount) * 120
      const z = (Math.random() - 0.5) * 20

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const color = new THREE.Color().setHSL(hue, 1.0, 0.5 + Math.random() * 0.3)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    dataStreams.push({ points, speed: 20 + Math.random() * 30 })
  }

  // 创建网格地面
  const gridHelper = new THREE.GridHelper(200, 40, 0x00ff00, 0x004400)
  gridHelper.position.y = -50
  gridHelper.material.transparent = true
  gridHelper.material.opacity = 0
  scene.add(gridHelper)

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    dataStreams.forEach(stream => {
      const positions = stream.points.geometry.attributes.position.array
      for (let i = 0; i < 100; i++) {
        positions[i * 3 + 1] += stream.speed * 0.01
        if (positions[i * 3 + 1] > 60) {
          positions[i * 3 + 1] = -60
        }
      }
      stream.points.geometry.attributes.position.needsUpdate = true
    })

    gridHelper.position.y = -50 + Math.sin(time * 2) * 2
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  tl.fromTo(
    camera.position,
    { x: 0, y: 0, z: 150 },
    { x: 0, y: 10, z: 80, duration: 3, ease: 'power2.inOut' },
    0
  )

  dataStreams.forEach((stream, i) => {
    tl.to(
      stream.points.material,
      { opacity: 0.8, duration: 1.5, ease: 'power2.out' },
      0.2 + i * 0.05
    )
  })

  tl.to(gridHelper.material, { opacity: 0.3, duration: 2, ease: 'power2.out' }, 0.5)

  animate()

  tl.to({}, { duration: 10 }, 0)

  tl.to({}, {
    duration: 2,
    onStart: () => {
      dataStreams.forEach(stream => {
        tl.to(stream.points.material, { opacity: 0, duration: 1 }, 0)
      })
      tl.to(gridHelper.material, { opacity: 0, duration: 1 }, 0)
    },
    onComplete: () => {
      cancelAnimationFrame(animId)
      dataStreams.forEach(s => {
        scene.remove(s.points)
        s.points.geometry.dispose()
        s.points.material.dispose()
      })
      scene.remove(gridHelper)
      gridHelper.material.dispose()
      gridHelper.geometry.dispose()

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 10)

  return tl
}

/**
 * 全息环形阵列动画（增强版）
 */
export function animateHolographicRingArray(props, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  const tl = gsap.timeline({
    onComplete: () => {
      cancelAnimationFrame(animId)
      const payload = { success: true, animationType: 'holographic-glitch' }
      onComplete?.(payload)
    },
    onError: (err) => onError?.(err)
  })

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0015)

  const ringLayers = []
  const layers = 5

  for (let l = 0; l < layers; l++) {
    const ringsPerLayer = 8 + l * 2
    const radius = 15 + l * 10
    const layerGroup = new THREE.Group()

    for (let i = 0; i < ringsPerLayer; i++) {
      const geometry = new THREE.TorusGeometry(radius, 0.5, 8, 64)
      const hue = 0.5 + (l / layers) * 0.15 + (i / ringsPerLayer) * 0.1
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ring = new THREE.Mesh(geometry, material)
      const angle = (i / ringsPerLayer) * Math.PI * 2

      ring.position.x = Math.cos(angle) * radius * 0.3
      ring.position.y = Math.sin(angle) * radius * 0.3
      ring.rotation.z = angle

      layerGroup.add(ring)
    }

    scene.add(layerGroup)
    ringLayers.push({ group: layerGroup, rotationSpeed: 0.005 + l * 0.002 })
  }

  const coreGeometry = new THREE.IcosahedronGeometry(8, 2)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  scene.add(core)

  const particleCount = 3000
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 40 + Math.random() * 40

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = r * Math.cos(phi)

    const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5)
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    ringLayers.forEach((layer, i) => {
      layer.group.rotation.y += layer.rotationSpeed * (1 + Math.sin(time + i) * 0.5)
      layer.group.rotation.x = Math.sin(time * 0.5 + i) * 0.1
    })

    const coreScale = 1 + Math.sin(time * 3) * 0.2
    core.scale.set(coreScale, coreScale, coreScale)
    core.rotation.x += 0.01
    core.rotation.y += 0.015

    particles.rotation.y -= 0.002
    particles.rotation.x += 0.001
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  tl.fromTo(
    camera.position,
    { x: 0, y: 0, z: 150 },
    { x: 30, y: 20, z: 80, duration: 4, ease: 'power2.inOut' },
    0
  )

  ringLayers.forEach((layer, i) => {
    layer.group.children.forEach(ring => {
      tl.to(ring.material, { opacity: 0.7, duration: 1.5, ease: 'power2.out' }, 0.3 + i * 0.2)
    })
  })

  tl.to(core.material, { opacity: 0.9, duration: 2, ease: 'elastic.out(1, 0.5)' }, 0.5)
  tl.to(particleMaterial, { opacity: 0.6, duration: 2, ease: 'power2.out' }, 0.5)

  tl.to(core.material.color, { r: 0, g: 1, b: 1, duration: 3 }, 2)
  tl.to(core.material.color, { r: 1, g: 1, b: 0, duration: 3 }, 5)

  animate()

  tl.to({}, { duration: 10 }, 0)

  tl.to({}, {
    duration: 2,
    onStart: () => {
      ringLayers.forEach(layer => {
        layer.group.children.forEach(ring => {
          tl.to(ring.material, { opacity: 0, duration: 1 }, 0)
        })
      })
      tl.to(core.material, { opacity: 0, duration: 1 }, 0)
      tl.to(particleMaterial, { opacity: 0, duration: 1 }, 0)
    },
    onComplete: () => {
      cancelAnimationFrame(animId)
      scene.remove(core, particles)
      ringLayers.forEach(layer => {
        scene.remove(layer.group)
        layer.group.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) obj.material.dispose()
        })
        layer.group.clear()
        layer.group = null
      })
      core.geometry.dispose()
      core.material.dispose()
      particles.geometry.dispose()
      particles.material.dispose()

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 10)

  return tl
}

/**
 * 全息螺旋动画（增强版）
 */
export function animateHolographicSpiral(props, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  const tl = gsap.timeline({
    onComplete: () => {
      cancelAnimationFrame(animId)
      const payload = { success: true, animationType: 'holographic-glitch' }
      onComplete?.(payload)
    },
    onError: (err) => onError?.(err)
  })

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x150010)

  const strands = []
  const pointsPerStrand = 200
  const turns = 8

  for (let s = 0; s < 2; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(pointsPerStrand * 3)
    const colors = new Float32Array(pointsPerStrand * 3)

    for (let i = 0; i < pointsPerStrand; i++) {
      const t = i / pointsPerStrand
      const angle = t * turns * Math.PI * 2 + (s * Math.PI)
      const radius = 15

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (t - 0.5) * 100
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const hue = s === 0 ? 0.83 : 0.5
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5 + t * 0.3)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    strands.push({ points, phase: s * Math.PI })
  }

  const connections = []
  for (let i = 0; i < 50; i++) {
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 8)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const connection = new THREE.Mesh(geometry, material)
    scene.add(connection)
    connections.push({ mesh: connection, t: i / 50 })
  }

  const beams = []
  for (let i = 0; i < 8; i++) {
    const geometry = new THREE.PlaneGeometry(3, 80)
    const hue = 0.8 + Math.random() * 0.2
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(hue, 1.0, 0.5),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(geometry, material)
    const angle = (i / 8) * Math.PI * 2
    beam.position.x = Math.cos(angle) * 30
    beam.position.z = Math.sin(angle) * 30
    beam.rotation.z = angle

    scene.add(beam)
    beams.push({ beam, angle, baseDist: 30 })
  }

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    strands.forEach(strand => {
      strand.points.rotation.y += 0.01
    })

    connections.forEach(conn => {
      const t = conn.t
      const angle = t * turns * Math.PI * 2 + time * 2
      const radius = 15
      const y = (t - 0.5) * 100

      conn.mesh.position.x = Math.cos(angle) * radius
      conn.mesh.position.y = y
      conn.mesh.position.z = Math.sin(angle) * radius
      conn.mesh.rotation.z = angle + Math.PI / 2
    })

    beams.forEach((beam, i) => {
      const currentAngle = beam.angle + time * 0.5
      const dist = beam.baseDist + Math.sin(time * 2 + i) * 10
      beam.beam.position.x = Math.cos(currentAngle) * dist
      beam.beam.position.z = Math.sin(currentAngle) * dist
      beam.beam.rotation.z = currentAngle
    })
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  tl.fromTo(
    camera.position,
    { x: 0, y: 0, z: 150 },
    { x: 0, y: 0, z: 70, duration: 3, ease: 'power2.inOut' },
    0
  )

  strands.forEach((strand, i) => {
    tl.to(strand.points.material, { opacity: 1, duration: 2, ease: 'power2.out' }, 0.5 + i * 0.3)
  })

  connections.forEach((conn, i) => {
    tl.to(conn.mesh.material, { opacity: 0.8, duration: 1, ease: 'power2.out' }, 1 + i * 0.02)
  })

  beams.forEach((beam, i) => {
    tl.to(beam.beam.material, { opacity: 0.6, duration: 1.5, ease: 'power2.out' }, 1.5 + i * 0.1)
  })

  animate()

  tl.to(camera.position, { x: 50, y: 20, z: 50, duration: 4, ease: 'power2.inOut' }, 3)
  tl.to(camera.position, { x: -50, y: -20, z: 50, duration: 4, ease: 'power2.inOut' }, 7)

  tl.to({}, { duration: 12 }, 0)

  tl.to({}, {
    duration: 2,
    onStart: () => {
      strands.forEach(s => tl.to(s.points.material, { opacity: 0, duration: 1 }, 0))
      connections.forEach(c => tl.to(c.mesh.material, { opacity: 0, duration: 1 }, 0))
      beams.forEach(b => tl.to(b.beam.material, { opacity: 0, duration: 1 }, 0))
    },
    onComplete: () => {
      cancelAnimationFrame(animId)
      strands.forEach(s => {
        scene.remove(s.points)
        s.points.geometry.dispose()
        s.points.material.dispose()
      })
      connections.forEach(c => {
        scene.remove(c.mesh)
        c.mesh.geometry.dispose()
        c.mesh.material.dispose()
      })
      beams.forEach(b => {
        scene.remove(b.beam)
        b.beam.geometry.dispose()
        b.beam.material.dispose()
      })

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 12)

  return tl
}

/**
 * 全息球体阵列动画（增强版）
 */
export function animateHolographicSphereArray(props, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  const tl = gsap.timeline({
    onComplete: () => {
      cancelAnimationFrame(animId)
      const payload = { success: true, animationType: 'holographic-glitch' }
      onComplete?.(payload)
    },
    onError: (err) => onError?.(err)
  })

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x050515)

  const sphereArray = new THREE.Group()
  const spheres = []
  const gridSize = 5
  const spacing = 12

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const geometry = new THREE.SphereGeometry(2, 16, 16)
        const hue = (x + y + z) / (gridSize * 3) * 0.3 + 0.5
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(hue, 1.0, 0.5),
          wireframe: true,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        })

        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.x = (x - gridSize / 2 + 0.5) * spacing
        sphere.position.y = (y - gridSize / 2 + 0.5) * spacing
        sphere.position.z = (z - gridSize / 2 + 0.5) * spacing

        sphereArray.add(sphere)
        spheres.push({
          mesh: sphere,
          basePos: sphere.position.clone(),
          phase: Math.random() * Math.PI * 2
        })
      }
    }
  }
  scene.add(sphereArray)

  const scanlineGeometry = new THREE.PlaneGeometry(200, 200)
  const scanlineMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float scanline = sin(vUv.y * 50.0 - uTime * 5.0) * 0.5 + 0.5;
        float line = pow(scanline, 20.0);
        vec3 color = uColor * line;
        float alpha = line * 0.3;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  const scanlines = new THREE.Mesh(scanlineGeometry, scanlineMaterial)
  scanlines.position.z = 50
  scene.add(scanlines)

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    scanlineMaterial.uniforms.uTime.value = time

    sphereArray.rotation.y += 0.003
    sphereArray.rotation.x = Math.sin(time * 0.3) * 0.1

    spheres.forEach((sphere, i) => {
      const wave = Math.sin(time * 2 + sphere.phase) * 3
      sphere.mesh.scale.setScalar(1 + wave * 0.1)
    })
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  tl.fromTo(
    camera.position,
    { x: 0, y: 0, z: 150 },
    { x: 0, y: 20, z: 70, duration: 3, ease: 'power2.inOut' },
    0
  )

  spheres.forEach((sphere, i) => {
    tl.to(sphere.mesh.material, { opacity: 0.8, duration: 1, ease: 'power2.out' }, 0.5 + (i / spheres.length) * 2)
  })

  tl.to(scanlineMaterial, { opacity: 1, duration: 2, ease: 'power2.out' }, 1)

  animate()

  tl.to({}, {
    duration: 10,
    onUpdate: function() {
      const progress = this.progress()
      spheres.forEach(sphere => {
        const baseHue = (sphere.mesh.position.x + sphere.mesh.position.y + sphere.mesh.position.z) / 100 + 0.5
        const hue = (baseHue + progress * 0.5) % 1
        sphere.mesh.material.color.setHSL(hue, 1.0, 0.5)
      })
    }
  }, 0)

  tl.to({}, { duration: 12 }, 0)

  tl.to({}, {
    duration: 2,
    onStart: () => {
      spheres.forEach(s => tl.to(s.mesh.material, { opacity: 0, duration: 1 }, 0))
      tl.to(scanlineMaterial, { opacity: 0, duration: 1 }, 0)
    },
    onComplete: () => {
      cancelAnimationFrame(animId)
      scene.remove(sphereArray, scanlines)
      spheres.forEach(s => {
        s.mesh.geometry.dispose()
        s.mesh.material.dispose()
      })
      sphereArray.clear()
      scanlineGeometry.dispose()
      scanlineMaterial.dispose()

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 12)

  return tl
}

/**
 * 全息故障艺术动画（增强版）
 */
export function animateHolographicGlitch(props, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  const tl = gsap.timeline({
    onComplete: () => {
      cancelAnimationFrame(animId)
      const payload = { success: true, animationType: 'holographic-glitch' }
      onComplete?.(payload)
    },
    onError: (err) => onError?.(err)
  })

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a000a)

  const shapes = []

  const cubeGeometry = new THREE.BoxGeometry(15, 15, 15)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.x = -20
  scene.add(cube)
  shapes.push({ mesh: cube, rotSpeed: { x: 0.02, y: 0.02, z: 0.01 } })

  const sphereGeometry = new THREE.SphereGeometry(10, 32, 32)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.x = 20
  scene.add(sphere)
  shapes.push({ mesh: sphere, rotSpeed: { x: -0.01, y: -0.01, z: 0 } })

  const torusGeometry = new THREE.TorusGeometry(10, 2, 16, 100)
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const torus = new THREE.Mesh(torusGeometry, torusMaterial)
  torus.position.y = 25
  scene.add(torus)
  shapes.push({ mesh: torus, rotSpeed: { x: 0.03, y: 0, z: 0.02 } })

  const octaGeometry = new THREE.OctahedronGeometry(8)
  const octaMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const octa = new THREE.Mesh(octaGeometry, octaMaterial)
  octa.position.y = -25
  scene.add(octa)
  shapes.push({ mesh: octa, rotSpeed: { x: 0.015, y: 0.025, z: -0.01 } })

  const glitchParticles = 500
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(glitchParticles * 3)
  const particleColors = new Float32Array(glitchParticles * 3)

  for (let i = 0; i < glitchParticles; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 100
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 100

    const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5)
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  let time = 0
  let globalGlitch = 0
  let animId = null

  function update() {
    time += 0.016

    shapes.forEach(shape => {
      shape.mesh.rotation.x += shape.rotSpeed.x
      shape.mesh.rotation.y += shape.rotSpeed.y
      shape.mesh.rotation.z += shape.rotSpeed.z

      if (globalGlitch > 0.5) {
        shape.mesh.position.x += (Math.random() - 0.5) * globalGlitch * 2
        shape.mesh.position.y += (Math.random() - 0.5) * globalGlitch * 2
      }
    })

    if (globalGlitch > 0.5) {
      const positions = particles.geometry.attributes.position.array
      for (let i = 0; i < glitchParticles; i++) {
        positions[i * 3] += (Math.random() - 0.5) * globalGlitch * 5
        positions[i * 3 + 1] += (Math.random() - 0.5) * globalGlitch * 5
        positions[i * 3 + 2] += (Math.random() - 0.5) * globalGlitch * 5
      }
      particles.geometry.attributes.position.needsUpdate = true
    }

    particles.rotation.y += 0.005
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  tl.fromTo(
    camera.position,
    { x: 0, y: 0, z: 100 },
    { x: 0, y: 10, z: 70, duration: 2, ease: 'power2.inOut' },
    0
  )

  shapes.forEach((shape, i) => {
    tl.to(shape.mesh.material, { opacity: 0.9, duration: 0.5, ease: 'back.out(1.7)' }, 0.5 + i * 0.2)
  })

  tl.to(particleMaterial, { opacity: 0.7, duration: 1 }, 1)

  animate()

  tl.to({}, {
    duration: 12,
    onUpdate: function() {
      const progress = this.progress()
      globalGlitch = Math.sin(progress * 30) > 0.9 ? 1.0 : 0.0
    }
  }, 0)

  tl.to(shapes[0].mesh.position, { x: 20, duration: 2, ease: 'power2.inOut' }, 3)
  tl.to(shapes[1].mesh.position, { x: -20, duration: 2, ease: 'power2.inOut' }, 3)

  tl.to(shapes[0].mesh.material.color, { r: 1, g: 0, b: 0, duration: 0.1 }, 4)
  tl.to(shapes[0].mesh.material.color, { r: 0, g: 1, b: 1, duration: 0.1 }, 4.1)
  tl.to(shapes[0].mesh.material.color, { r: 1, g: 0, b: 1, duration: 0.1 }, 4.2)

  tl.to({}, { duration: 12 }, 0)

  tl.to({}, {
    duration: 2,
    onStart: () => {
      shapes.forEach(s => tl.to(s.mesh.material, { opacity: 0, duration: 1 }, 0))
      tl.to(particleMaterial, { opacity: 0, duration: 1 }, 0)
    },
    onComplete: () => {
      cancelAnimationFrame(animId)
      scene.remove(particles)
      shapes.forEach(s => {
        scene.remove(s.mesh)
        s.mesh.geometry.dispose()
        s.mesh.material.dispose()
      })
      particles.geometry.dispose()
      particles.material.dispose()

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 12)

  return tl
}

export default {
  'holographic-data-stream': animateHolographicDataStream,
  'holographic-ring-array': animateHolographicRingArray,
  'holographic-spiral': animateHolographicSpiral,
  'holographic-sphere-array': animateHolographicSphereArray,
  'holographic-glitch': animateHolographicGlitch
}
