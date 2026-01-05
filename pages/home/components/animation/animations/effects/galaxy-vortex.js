/**
 * effects/galaxy-vortex.js
 * 银河漩涡特效
 * 宇宙、壮丽、璀璨
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建银河漩涡
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 银河对象
 */
export function createGalaxyVortex(scene, options = {}) {
  const {
    bandCount = 8,
    galaxyRadius = 80
  } = options

  const bands = []

  // 借鉴极光流体的鲜艳颜色
  const auroraColors = [
    new THREE.Color(0x00ff00),  // 极光绿
    new THREE.Color(0xff00ff),  // 紫粉
    new THREE.Color(0x00ffff),  // 青
    new THREE.Color(0xff6600),  // 橙
    new THREE.Color(0x0080ff),  // 蓝
    new THREE.Color(0xffd700),  // 金黄
    new THREE.Color(0x9370db),  // 紫色
    new THREE.Color(0x00ff7f)   // 青绿
  ]

  // 创建银河带 - 使用 PlaneGeometry
  for (let i = 0; i < bandCount; i++) {
    const geometry = new THREE.PlaneGeometry(galaxyRadius * 2, 40, 128, 64)
    geometry.rotateX(-Math.PI / 5)

    const color = auroraColors[i % auroraColors.length]
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uBandIndex: { value: i },
        uGalaxyRadius: { value: galaxyRadius }  // 🔧 修复：添加 galaxyRadius uniform
      },
      vertexShader: `
        uniform float uTime;
        uniform float uBandIndex;
        uniform float uGalaxyRadius;  // 🔧 修复：声明 uniform
        varying vec2 vUv;
        varying float vAlpha;
        varying vec3 vPos;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // 漩涡形状 - 使用径向坐标
          float dist = length(pos.xz);
          float angle = atan(pos.z, pos.x);

          // 螺旋扭曲
          float spiral = dist * 0.05;
          angle += spiral + uTime * 0.3 + uBandIndex * 0.2;

          // 更新的位置
          pos.x = cos(angle) * dist;
          pos.z = sin(angle) * dist;

          // 垂直波动 - 多层波浪
          float wave1 = sin(dist * 0.2 + uTime * 0.5);
          float wave2 = sin(dist * 0.3 + uTime * 0.7 + uBandIndex * 0.1);
          float wave3 = cos(uv.y * 4.0 + uTime * 0.6);

          pos.y += (wave1 + wave2 + wave3) * 6.0;

          // 距离衰减 - 中心更亮
          float fade = 1.0 - smoothstep(0.0, uGalaxyRadius, dist);  // 🔧 修复：使用 uniform
          pos.y += fade * 15.0;

          vAlpha = fade;
          vPos = pos;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uBandIndex;
        varying vec2 vUv;
        varying float vAlpha;
        varying vec3 vPos;

        void main() {
          // 透明度渐变 - 中心亮，边缘淡
          float alpha = vAlpha * 0.45 * (1.0 - abs(vUv.x - 0.5) * 1.6);

          // 流动效果 - 更强的对比
          float flow = sin(uTime * 3.0 + vUv.y * 5.0 + vPos.x * 0.05) * 0.25 + 0.85;

          // 边缘柔化
          float edge = 1.0 - smoothstep(0.2, 0.4, abs(vUv.x - 0.5));

          // 高光效果
          float highlight = pow(flow, 2.5) * 0.4;

          // 径向渐变 - 更清晰的颜色
          float radialFade = 1.0 - smoothstep(0.0, 0.8, vUv.y);

          vec3 finalColor = uColor * flow + vec3(highlight);
          finalColor *= radialFade;

          gl_FragColor = vec4(finalColor, alpha * edge);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const band = new THREE.Mesh(geometry, material)
    band.position.z = -30 + i * 5
    band.position.y = 10 + i * 3
    band.rotation.y = (i / bandCount) * Math.PI * 0.5
    scene.add(band)
    bands.push(band)
  }

  // 中心光晕 - 使用多个层次
  const centerLayers = []

  for (let i = 0; i < 3; i++) {
    const size = 10 + i * 8
    const opacity = 0.25 - i * 0.08
    const color = new THREE.Color(0xfff8dc)

    const glowGeometry = new THREE.SphereGeometry(size, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glow)
    centerLayers.push(glow)
  }

  // 星星背景 - 增强氛围
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 500
  const starPositions = new Float32Array(starCount * 3)
  const starColors = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 200
    starPositions[i * 3 + 1] = Math.random() * 100
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200

    const starColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.6)
    starColors[i * 3] = starColor.r
    starColors[i * 3 + 1] = starColor.g
    starColors[i * 3 + 2] = starColor.b
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // 能量爆发效果
  const energyGeometry = new THREE.SphereGeometry(3, 32, 32)
  const energyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffd700) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(vec3(normalMatrix * vec4(normal, 0.0)));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;

      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float pulse = sin(uTime * 8.0) * 0.3 + 0.7;
        gl_FragColor = vec4(uColor * pulse, intensity * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const energy = new THREE.Mesh(energyGeometry, energyMaterial)
  energy.visible = false
  scene.add(energy)

  return {
    bands,
    centerLayers,
    stars,
    starGeometry,  // 🔧 修复：添加到返回对象中
    starMaterial,  // 🔧 修复：添加到返回对象中
    energy,
    update(deltaTime, time) {
      // 更新银河带
      bands.forEach((band, i) => {
        band.material.uniforms.uTime.value = time + i * 0.2
      })

      // 更新中心光晕
      centerLayers.forEach((layer, i) => {
        const pulse = Math.sin(time * (1.5 + i * 0.5)) * 0.15 + 1.0
        layer.scale.setScalar(pulse)
      })

      // 更新星星
      const starPositions = this.starGeometry.attributes.position.array
      for (let i = 0; i < 500; i++) {
        if (Math.random() < 0.01) {
          starPositions[i * 3 + 1] += (Math.random() - 0.5) * 0.5
        }
      }
      this.starGeometry.attributes.position.needsUpdate = true
      stars.rotation.y += deltaTime * 0.01

      // 更新能量爆发
      if (energy.visible) {
        energy.material.uniforms.uTime.value = time
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 银河带增强
      bands.forEach((band, i) => {
        const delay = i * 0.06
        gsap.to(band.scale, {
          y: 1.8,
          duration: 2.5,
          delay,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1
        })

        gsap.to(band.material, {
          opacity: 0.95,
          duration: 1.8,
          delay,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
      })

      // 中心光晕爆发
      gsap.to(centerLayers[0].scale, {
        x: 2.5,
        y: 2.5,
        z: 2.5,
        duration: 2,
        ease: 'elastic.out(1, 0.5)'
      })

      // 能量爆发
      tl.call(() => {
        energy.visible = true
        energy.scale.setScalar(0.01)
      }, null, 2)

      tl.to(energy.scale, {
        x: 40,
        y: 40,
        z: 40,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })

      tl.to(energy.material, {
        opacity: 0,
        duration: 2.5,
        ease: 'power2.in'
      })

      tl.to(energy.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 2.5,
        ease: 'power2.in',
        onComplete: () => {
          energy.visible = false
          energy.material.opacity = 0.8
        }
      }, '<')

      return tl
    },
    destroy() {
      bands.forEach(band => {
        scene.remove(band)
        band.geometry.dispose()
        band.material.dispose()
      })
      centerLayers.forEach(layer => {
        scene.remove(layer)
        layer.geometry.dispose()
        layer.material.dispose()
      })
      scene.remove(stars)
      scene.remove(energy)
      this.starGeometry.dispose()
      this.starMaterial.dispose()
      energyGeometry.dispose()
      energyMaterial.dispose()
    }
  }
}
