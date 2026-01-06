/**
 * effects/cyber-grid-city.js
 * 赛博网格城市特效
 * 未来感、数字矩阵、霓虹风格
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建赛博网格城市
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 赛博城市对象
 */
export function createCyberGridCity(scene, options = {}) {
  const {
    gridSize = 200,
    gridCells = 20,
    buildingCount = 100
  } = options

  // 网格地面
  const gridHelper = new THREE.GridHelper(gridSize, gridCells, 0x00ffff, 0x004444)
  gridHelper.position.y = -20
  gridHelper.material.transparent = true
  gridHelper.material.opacity = 0
  scene.add(gridHelper)

  // 垂直网格墙
  const wallGeometry = new THREE.PlaneGeometry(gridSize, 100, gridCells, 10)
  const wallMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPos;

      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(pos.x * 0.1 + uTime * 2.0) * 5.0;
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vPos;

      void main() {
        // 网格线效果
        float gridX = step(0.95, fract(vUv.x * float(20)));
        float gridY = step(0.9, fract(vUv.y * float(10)));
        float grid = max(gridX, gridY);

        // 扫描线
        float scan = sin(vPos.y * 0.2 - uTime * 5.0) * 0.5 + 0.5;

        vec3 color = uColor * (0.3 + grid * 0.7);
        color += vec3(0.0, 1.0, 1.0) * scan * 0.3;

        float alpha = uOpacity * (0.1 + grid * 0.9);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })

  const walls = []
  for (let i = 0; i < 4; i++) {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial.clone())
    wall.position.y = 30
    wall.rotation.y = (i / 4) * Math.PI * 2
    wall.position.x = Math.sin(wall.rotation.y) * (gridSize / 2)
    wall.position.z = Math.cos(wall.rotation.y) * (gridSize / 2)
    wall.visible = false
    scene.add(wall)
    walls.push(wall)
  }

  // 霓虹建筑
  const buildings = []
  const neonColors = [0xff00ff, 0x00ffff, 0x00ff00, 0xffff00, 0xff6600]

  for (let i = 0; i < buildingCount; i++) {
    const height = 10 + Math.random() * 50
    const width = 2 + Math.random() * 4

    const geometry = new THREE.BoxGeometry(width, height, width)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(neonColors[Math.floor(Math.random() * neonColors.length)]) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPos;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;
          vPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vPos;
        varying vec3 vNormal;

        void main() {
          float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float scan = sin(vUv.y * 20.0 + uTime * 3.0) * 0.5 + 0.5;

          vec3 color = uColor * (0.5 + scan * 0.5);
          color *= edge;

          float alpha = uOpacity * (0.3 + edge * 0.7);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    const building = new THREE.Mesh(geometry, material)
    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 60

    building.position.x = Math.cos(angle) * radius
    building.position.z = Math.sin(angle) * radius
    building.position.y = -20 + height / 2
    building.scale.y = 0
    building.visible = false
    scene.add(building)
    buildings.push(building)
  }

  // 数据流粒子
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 5000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = []

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * gridSize
    positions[i * 3 + 1] = Math.random() * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * gridSize

    const color = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities.push({
      x: 0,
      y: 10 + Math.random() * 20,
      z: 0
    })
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  // 全息中心
  const hologramGeometry = new THREE.IcosahedronGeometry(15, 2)
  const hologramMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;
        float wave = sin(uTime * 5.0 + length(pos) * 0.5) * 2.0;
        pos += normal * wave;
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        float scan = sin(uTime * 10.0 + vPos.y * 0.3) * 0.5 + 0.5;

        vec3 color = uColor * (0.5 + scan * 0.5);
        color += vec3(0.0, 1.0, 1.0) * edge * scan;

        float alpha = uOpacity * edge * 0.6;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    wireframe: true,
    blending: THREE.AdditiveBlending
  })

  const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial)
  hologram.position.y = 30
  hologram.visible = false
  scene.add(hologram)

  return {
    gridHelper,
    walls,
    buildings,
    particles,
    particleGeometry,
    hologram,
    update(deltaTime, time) {
      // 更新墙壁
      walls.forEach(wall => {
        wall.material.uniforms.uTime.value = time
      })

      // 更新建筑
      buildings.forEach(building => {
        building.material.uniforms.uTime.value = time
        building.rotation.y += deltaTime * 0.2
      })

      // 更新全息
      if (hologram.visible) {
        hologram.material.uniforms.uTime.value = time
        hologram.rotation.x += deltaTime
        hologram.rotation.y += deltaTime * 0.7
      }

      // 更新粒子
      if (particleMaterial.opacity > 0) {
        const pos = particleGeometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += velocities[i].y * deltaTime
          if (pos[i * 3 + 1] > 80) {
            pos[i * 3 + 1] = -20
            pos[i * 3] = (Math.random() - 0.5) * gridSize
            pos[i * 3 + 2] = (Math.random() - 0.5) * gridSize
          }
        }
        particleGeometry.attributes.position.needsUpdate = true
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 网格出现
      gsap.to(gridHelper.material, {
        opacity: 0.5,
        duration: 1
      })

      // 墙壁出现
      walls.forEach((wall, i) => {
        gsap.delayedCall(0.5 + i * 0.2, () => {
          wall.visible = true
          gsap.to(wall.material.uniforms.uOpacity, {
            value: 0.6,
            duration: 1,
            ease: 'power2.out'
          })
        })
      })

      // 建筑升起
      buildings.forEach((building, i) => {
        gsap.delayedCall(1 + i * 0.01, () => {
          building.visible = true
          gsap.to(building.scale, {
            y: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
          })
          gsap.to(building.material.uniforms.uOpacity, {
            value: 0.8,
            duration: 1,
            delay: 0.5
          })
        })
      })

      // 粒子流
      gsap.to(particleMaterial, {
        opacity: 0.8,
        duration: 1,
        delay: 1.5
      })

      // 全息出现
      gsap.delayedCall(2.5, () => {
        hologram.visible = true
        gsap.to(hologram.material.uniforms.uOpacity, {
          value: 1,
          duration: 1,
          ease: 'power2.out'
        })
      })

      // 旋转建筑
      gsap.to(buildings[0].rotation, {
        y: Math.PI * 2,
        duration: 5,
        delay: 3,
        ease: 'power2.inOut'
      })

      return tl
    },
    destroy() {
      scene.remove(gridHelper)
      walls.forEach(wall => {
        scene.remove(wall)
        wall.geometry.dispose()
        wall.material.dispose()
      })
      buildings.forEach(building => {
        scene.remove(building)
        building.geometry.dispose()
        building.material.dispose()
      })
      scene.remove(particles)
      scene.remove(hologram)
      wallGeometry.dispose()
      wallMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      hologramGeometry.dispose()
      hologramMaterial.dispose()
    }
  }
}
