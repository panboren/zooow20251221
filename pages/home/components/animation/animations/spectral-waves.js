/**
 * 光谱音波动画 - 增强版
 * 使用音频频谱可视化特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateSpectralWaves(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    try {
        setupInitialCamera(camera, new THREE.Vector3(0, 30, 80), 100, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
                if (onComplete) onComplete({ type: 'spectral-waves-enhanced' })
            },
            onError,
            '光谱音波',
            controls,
        )

        // 创建增强版光谱音波
        const spectralWaves = createEnhancedSpectralWaves(scene, {
            barCount: 128,
            maxBarHeight: 35,
            colorVariations: 16,
            particleCount: 2000,
            ringCount: 3
        })

        // 阶段1: 相机远观
        tl.to(camera.position, {
            x: 0,
            y: 25,
            z: 60,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '相机远观错误',
            ),
        })

        // 阶段2: 音波激活
        spectralWaves.animate(6)

        // 阶段3: 环绕欣赏
        tl.to(camera.position, {
            x: 50,
            y: 20,
            z: 50,
            duration: 4,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '相机环绕错误',
            ),
        })

        // 持续更新
        let startTime = null
        const duration = 10

        const animate = (time) => {
            if (!startTime) startTime = time
            const elapsed = (time - startTime) / 1000

            if (elapsed < duration) {
                const deltaTime = 0.016
                spectralWaves.update(deltaTime, elapsed)
                renderer.render(scene, camera)
                requestAnimationFrame(animate)
            }
            else {
                spectralWaves.destroy()
            }
        }

        requestAnimationFrame(animate)

        return tl
    }
    catch (error) {
        if (onError) {
            onError(error, '光谱音波动画执行错误')
        }
        return gsap.timeline()
    }
}

// 增强版光谱音波创建函数
function createEnhancedSpectralWaves(scene, options = {}) {
    const {
        barCount = 128,
        maxBarHeight = 35,
        colorVariations = 16,
        particleCount = 2000,
        ringCount = 3
    } = options

    // 音波容器
    const container = new THREE.Group()
    scene.add(container)

    // 创建音波柱
    const bars = []
    const barGeometry = new THREE.ConeGeometry(0.4, 1, 8)
    const radius = 20

    for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        // 动态颜色计算
        const hue = (i % colorVariations) / colorVariations
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color.clone().multiplyScalar(0.3),
            shininess: 100,
            transparent: true,
            opacity: 0.9
        })

        const bar = new THREE.Mesh(barGeometry, material)
        bar.position.set(x, 0, z)
        bar.scale.y = 0.1
        bar.rotation.y = angle
        container.add(bar)
        bars.push(bar)
    }

    // 创建同心环
    const rings = []
    for (let r = 0; r < ringCount; r++) {
        const ringRadius = radius * (0.5 + r * 0.3)
        const ringGeometry = new THREE.RingGeometry(ringRadius - 0.2, ringRadius + 0.2, 64)
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(r * 0.3, 0.8, 0.5),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        container.add(ring)
        rings.push(ring)
    }

    // 创建粒子系统
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        // 随机位置在圆柱区域内
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * radius * 1.5
        particlePositions[i3] = Math.cos(angle) * distance
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 20
        particlePositions[i3 + 2] = Math.sin(angle) * distance

        // 随机颜色
        const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
        particleColors[i3] = color.r
        particleColors[i3 + 1] = color.g
        particleColors[i3 + 2] = color.b
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    container.add(particleSystem)

    // 添加中心能量球
    const sphereGeometry = new THREE.SphereGeometry(4, 32, 32)
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x6666ff,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    })
    const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    container.add(centerSphere)

    // 光晕效果
    const glowGeometry = new THREE.SphereGeometry(6, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    })
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
    container.add(glowSphere)

    // 动画控制变量
    let isActive = false
    let animationProgress = 0
    const particlePositionsArray = particleGeometry.attributes.position.array
    const particleOriginalPositions = [...particlePositionsArray]

    return {
        // 激活动画
        animate: (duration) => {
            isActive = true
            animationProgress = 0

            // 中心球脉动动画
            gsap.to(centerSphere.scale, {
                x: 1.8,
                y: 1.8,
                z: 1.8,
                duration: duration * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })

            // 光晕强度变化
            gsap.to(glowMaterial, {
                opacity: 0.5,
                duration: duration * 0.25,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })

            // 环形动画
            rings.forEach((ring, index) => {
                gsap.to(ring.rotation, {
                    z: Math.PI * 2,
                    duration: 10 + index * 5,
                    repeat: -1,
                    ease: 'linear'
                })
            })
        },

        // 更新函数
        update: (deltaTime, elapsed) => {
            if (!isActive) return

            const time = elapsed * 3
            const pulse = Math.sin(elapsed * 2) * 0.5 + 0.5
            const globalWave = Math.sin(elapsed * 1.5) * 0.3 + 0.7

            // 更新音波柱
            bars.forEach((bar, index) => {
                // 复杂波形函数
                const wave = Math.sin(time + index * 0.2) * 0.5 +
                    Math.sin(time * 1.7 + index * 0.15) * 0.3 +
                    Math.sin(time * 0.9 + index * 0.25) * 0.2 +
                    Math.sin(time * 2.3 + index * 0.1) * 0.15

                const baseHeight = 1 + pulse * 3
                const waveHeight = Math.abs(wave) * maxBarHeight * globalWave
                const newHeight = baseHeight + waveHeight

                // 平滑更新高度
                bar.scale.y += (newHeight - bar.scale.y) * 0.2
                bar.position.y = bar.scale.y / 2

                // 根据高度调整颜色和透明度
                const heightFactor = Math.min(1, newHeight / maxBarHeight)
                const hue = (index % colorVariations) / colorVariations
                const saturation = 0.7 + heightFactor * 0.3
                const lightness = 0.4 + heightFactor * 0.4
                const originalColor = new THREE.Color().setHSL(hue, saturation, lightness)

                if (bar.material.color) {
                    bar.material.color.lerp(originalColor, 0.15)
                    bar.material.emissive.lerp(originalColor.clone().multiplyScalar(0.4), 0.15)
                    bar.material.opacity = 0.7 + heightFactor * 0.3
                }
            })

            // 更新粒子系统
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3
                // 基于时间的波动效果
                const timeOffset = time + i * 0.01
                const radialOffset = Math.sin(timeOffset * 2) * 0.5
                const verticalOffset = Math.sin(timeOffset * 1.5) * 0.8

                particlePositionsArray[i3] = particleOriginalPositions[i3] + radialOffset * Math.cos(timeOffset)
                particlePositionsArray[i3 + 1] = particleOriginalPositions[i3 + 1] + verticalOffset
                particlePositionsArray[i3 + 2] = particleOriginalPositions[i3 + 2] + radialOffset * Math.sin(timeOffset)
            }

            particleGeometry.attributes.position.needsUpdate = true

            // 旋转整个音波系统
            container.rotation.y = elapsed * 0.15
            container.rotation.x = Math.sin(elapsed * 0.3) * 0.05
        },

        // 销毁函数
        destroy: () => {
            bars.forEach(bar => {
                if (bar.geometry) bar.geometry.dispose()
                if (bar.material) {
                    if (Array.isArray(bar.material)) {
                        bar.material.forEach(mat => mat.dispose())
                    } else {
                        bar.material.dispose()
                    }
                }
                container.remove(bar)
            })

            rings.forEach(ring => {
                if (ring.geometry) ring.geometry.dispose()
                if (ring.material) ring.material.dispose()
                container.remove(ring)
            })

            if (particleSystem.geometry) particleSystem.geometry.dispose()
            if (particleSystem.material) particleSystem.material.dispose()
            container.remove(particleSystem)

            if (centerSphere.geometry) centerSphere.geometry.dispose()
            if (centerSphere.material) centerSphere.material.dispose()
            container.remove(centerSphere)

            if (glowSphere.geometry) glowSphere.geometry.dispose()
            if (glowSphere.material) glowSphere.material.dispose()
            container.remove(glowSphere)

            scene.remove(container)
        }
    }
}
