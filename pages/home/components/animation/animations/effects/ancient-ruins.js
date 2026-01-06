/**
 * effects/ancient-ruins.js
 * 远古遗迹特效
 * 神秘、古老、历史重现
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建远古遗迹
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 遗迹对象
 */
export function createAncientRuins(scene, options = {}) {
  const {
    pillarCount = 12,
    ruinCount = 30
  } = options

  // 石柱
  const pillars = []
  for (let i = 0; i < pillarCount; i++) {
    const height = 20 + Math.random() * 30
    const geometry = new THREE.CylinderGeometry(2, 2.5, height, 8)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x8B4513) },
        uOpacity: { value: 0 },
        uDamage: { value: Math.random() }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uDamage;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;

          // 破损效果
          pos.x += sin(pos.y * 0.3) * uDamage * 2.0;
          pos.z += cos(pos.y * 0.3) * uDamage * 2.0;
          pos.x += noise(pos) * uDamage;

          vElevation = pos.y;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }

        float noise(vec3 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0) * 0.5;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uDamage;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          // 石头纹理
          float texture = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.5 + 0.5;
          float cracks = step(0.97, fract(vUv.x * 50.0)) + step(0.97, fract(vUv.y * 30.0));

          // 苔藓效果
          float moss = step(0.7, vUv.y) * 0.3;

          vec3 color = uColor * (0.6 + texture * 0.4);
          color += vec3(0.2, 0.4, 0.2) * moss;
          color *= (1.0 - uDamage * 0.3);

          float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float alpha = uOpacity * (0.7 + edge * 0.3);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true
    })

    const pillar = new THREE.Mesh(geometry, material)
    const angle = (i / pillarCount) * Math.PI * 2
    const radius = 30 + Math.random() * 10

    pillar.position.x = Math.cos(angle) * radius
    pillar.position.z = Math.sin(angle) * radius
    pillar.position.y = height / 2 - 10
    pillar.rotation.y = Math.random() * Math.PI * 0.1
    pillar.scale.y = 0
    scene.add(pillar)
    pillars.push(pillar)
  }

  // 破碎遗迹
  const ruins = []
  for (let i = 0; i < ruinCount; i++) {
    const size = 2 + Math.random() * 5
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshPhongMaterial({
      color: 0x6B4423,
      transparent: true,
      opacity: 0,
      flatShading: true
    })
    const ruin = new THREE.Mesh(geometry, material)

    ruin.position.set(
      (Math.random() - 0.5) * 80,
      Math.random() * 10,
      (Math.random() - 0.5) * 80
    )
    ruin.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    ruin.scale.setScalar(0)
    scene.add(ruin)
    ruins.push(ruin)
  }

  // 古老符文粒子
  const runeGeometry = new THREE.BufferGeometry()
  const runeCount = 500
  const runePositions = new Float32Array(runeCount * 3)
  const runeColors = new Float32Array(runeCount * 3)

  for (let i = 0; i < runeCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 40

    runePositions[i * 3] = Math.cos(angle) * radius
    runePositions[i * 3 + 1] = 5 + Math.random() * 30
    runePositions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.6, 0.6)
    runeColors[i * 3] = color.r
    runeColors[i * 3 + 1] = color.g
    runeColors[i * 3 + 2] = color.b
  }

  runeGeometry.setAttribute('position', new THREE.BufferAttribute(runePositions, 3))
  runeGeometry.setAttribute('color', new THREE.BufferAttribute(runeColors, 3))

  const runeMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const runes = new THREE.Points(runeGeometry, runeMaterial)
  scene.add(runes)

  // 神秘光柱
  const lightPillars = []
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 16)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xFFD700) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(uTime * 2.0 + vUv.y * 10.0) * 0.5;
          pos.x += wave;
          pos.z += wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          float beam = sin(vUv.y * 20.0 - uTime * 5.0) * 0.5 + 0.5;
          vec3 color = uColor * (0.3 + beam * 0.7);
          float alpha = uOpacity * beam;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    const lightPillar = new THREE.Mesh(geometry, material)
    const angle = (i / 4) * Math.PI * 2
    lightPillar.position.set(
      Math.cos(angle) * 25,
      25,
      Math.sin(angle) * 25
    )
    lightPillar.visible = false
    scene.add(lightPillar)
    lightPillars.push(lightPillar)
  }

  // 中心祭坛
  const altarGeometry = new THREE.CylinderGeometry(10, 12, 3, 8)
  const altarMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B4513,
    transparent: true,
    opacity: 0
  })
  const altar = new THREE.Mesh(altarGeometry, altarMaterial)
  altar.position.y = -8.5
  altar.scale.setScalar(0)
  scene.add(altar)

  // 灯光
  const sunLight = new THREE.DirectionalLight(0xFFD700, 0)
  sunLight.position.set(50, 80, 50)
  scene.add(sunLight)

  const ambientLight = new THREE.AmbientLight(0x404040, 0)
  scene.add(ambientLight)

  return {
    pillars,
    ruins,
    runes,
    runeGeometry,
    lightPillars,
    altar,
    sunLight,
    ambientLight,
    update(deltaTime, time) {
      // 更新符文
      if (runeMaterial.opacity > 0) {
        const pos = runeGeometry.attributes.position.array
        for (let i = 0; i < runeCount; i++) {
          pos[i * 3 + 1] += Math.sin(time * 2 + i) * deltaTime * 0.5
        }
        runeGeometry.attributes.position.needsUpdate = true
      }

      // 更新光柱
      lightPillars.forEach(pillar => {
        if (pillar.visible) {
          pillar.material.uniforms.uTime.value = time
        }
      })

      // 日光变化
      if (sunLight.intensity > 0) {
        sunLight.intensity = 0.8 + Math.sin(time * 0.5) * 0.2
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 日光出现
      gsap.to(sunLight, {
        intensity: 0.8,
        duration: 2
      })

      gsap.to(ambientLight, {
        intensity: 0.4,
        duration: 2
      })

      // 祭坛升起
      gsap.to(altar.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        delay: 0.5,
        ease: 'power2.out'
      })
      gsap.to(altar.material, {
        opacity: 1,
        duration: 1.5,
        delay: 0.5
      })

      // 石柱升起
      pillars.forEach((pillar, i) => {
        gsap.delayedCall(1 + i * 0.1, () => {
          gsap.to(pillar.scale, {
            y: 1,
            duration: 2,
            ease: 'power2.out'
          })
          gsap.to(pillar.material.uniforms.uOpacity, {
            value: 1,
            duration: 1,
            delay: 0.5
          })
        })
      })

      // 遗迹浮现
      ruins.forEach((ruin, i) => {
        gsap.delayedCall(1.5 + i * 0.02, () => {
          gsap.to(ruin.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            ease: 'back.out(0.7)'
          })
          gsap.to(ruin.material, {
            opacity: 1,
            duration: 1
          })
        })
      })

      // 符文激活
      gsap.to(runeMaterial, {
        opacity: 0.8,
        duration: 1.5,
        delay: 2
      })

      // 光柱出现
      lightPillars.forEach((pillar, i) => {
        gsap.delayedCall(3 + i * 0.3, () => {
          pillar.visible = true
          gsap.to(pillar.material.uniforms.uOpacity, {
            value: 0.6,
            duration: 1
          })
        })
      })

      return tl
    },
    destroy() {
      pillars.forEach(pillar => {
        scene.remove(pillar)
        pillar.geometry.dispose()
        pillar.material.dispose()
      })
      ruins.forEach(ruin => {
        scene.remove(ruin)
        ruin.geometry.dispose()
        ruin.material.dispose()
      })
      scene.remove(runes)
      lightPillars.forEach(pillar => {
        scene.remove(pillar)
        pillar.geometry.dispose()
        pillar.material.dispose()
      })
      scene.remove(altar)
      scene.remove(sunLight)
      scene.remove(ambientLight)
      runeGeometry.dispose()
      runeMaterial.dispose()
      altarGeometry.dispose()
      altarMaterial.dispose()
    }
  }
}
