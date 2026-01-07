/**
 * 量子矩阵特效
 * 模拟高科技量子计算矩阵的流动效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumMatrix(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    try {
        setupInitialCamera(camera, new THREE.Vector3(0, 30, 80), 100, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
                if (onComplete) onComplete({ type: 'quantum-matrix' })
            },
            onError,
            '量子矩阵',
            controls,
        )

        // 创建量子矩阵系统
        const quantumMatrix = createQuantumMatrix(scene, {
            gridSize: 8,
            particleCount: 2000,
            flowSpeed: 1.5,
            connectorCount: 50
        })

        // 阶段1: 相机缓慢进入矩阵空间
        tl.to(camera.position, {
            x: 0,
            y: 25,
            z: 40,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '相机进入错误',
            ),
        })

        // 阶段2: 矩阵激活
        quantumMatrix.animate(6)

        // 阶段3: 环绕观察矩阵细节
        tl.to(camera.position, {
            x: 25,
            y: 20,
            z: 25,
            duration: 4,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '相机环绕错误',
            ),
        })

        // 持续更新动画
        let startTime = null
        const duration = 12

        const animate = (time) => {
            if (!startTime) startTime = time
            const elapsed = (time - startTime) / 1000

            if (elapsed < duration) {
                const deltaTime = 0.016
                quantumMatrix.update(deltaTime, elapsed)
                renderer.render(scene, camera)
                requestAnimationFrame(animate)
            }
            else {
                quantumMatrix.destroy()
            }
        }

        requestAnimationFrame(animate)

        return tl
    }
    catch (error) {
        if (onError) {
            onError(error, '量子矩阵特效执行错误')
        }
        return gsap.timeline()
    }
}

// 量子矩阵创建函数
function createQuantumMatrix(scene, options = {}) {
    const {
        gridSize = 8,
        particleCount = 2000,
        flowSpeed = 1.5,
        connectorCount = 50
    } = options

    // 矩阵容器
    const container = new THREE.Group()
    scene.add(container)

    // 创建网格基础结构
    const gridSpacing = 6
    const gridPoints = []

    // 创建网格点
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const posX = (x - gridSize / 2) * gridSpacing
                const posY = (y - gridSize / 2) * gridSpacing
                const posZ = (z - gridSize / 2) * gridSpacing
                gridPoints.push(new THREE.Vector3(posX, posY, posZ))
            }
        }
    }

    // 创建量子粒子系统
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)

    // 初始化粒子和连接器
    const particles = []
    const connectors = []

    // 创建量子粒子
    for (let i = 0; i < particleCount; i++) {
        const pointIndex = Math.floor(Math.random() * gridPoints.length)
        const basePosition = gridPoints[pointIndex].clone()

        // 添加随机偏移
        basePosition.x += (Math.random() - 0.5) * 2
        basePosition.y += (Math.random() - 0.5) * 2
        basePosition.z += (Math.random() - 0.5) * 2

        const i3 = i * 3
        positions[i3] = basePosition.x
        positions[i3 + 1] = basePosition.y
        positions[i3 + 2] = basePosition.z

        originalPositions[i3] = basePosition.x
        originalPositions[i3 + 1] = basePosition.y
        originalPositions[i3 + 2] = basePosition.z

        // 量子色: 蓝绿渐变
        const hue = 0.5 + Math.random() * 0.2
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        particles.push({
            basePosition: basePosition.clone(),
            currentPosition: basePosition.clone(),
            velocity: new THREE.Vector3(),
            targetIndex: pointIndex,
            energy: Math.random()
        })
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    container.add(particleSystem)

    // 创建连接器线条
    for (let i = 0; i < connectorCount; i++) {
        const startIndex = Math.floor(Math.random() * gridPoints.length)
        const endIndex = Math.floor(Math.random() * gridPoints.length)

        if (startIndex !== endIndex) {
            const startPos = gridPoints[startIndex]
            const endPos = gridPoints[endIndex]

            const geometry = new THREE.BufferGeometry()
            const linePositions = new Float32Array(6)
            linePositions[0] = startPos.x
            linePositions[1] = startPos.y
            linePositions[2] = startPos.z
            linePositions[3] = endPos.x
            linePositions[4] = endPos.y
            linePositions[5] = endPos.z

            geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0.5, 0.8, 0.5),
                transparent: true,
                opacity: 0.3
            })

            const connector = new THREE.Line(geometry, material)
            container.add(connector)
            connectors.push({
                line: connector,
                startIndex,
                endIndex,
                active: false
            })
        }
    }

    // 创建中心能量核心
    const coreGeometry = new THREE.IcosahedronGeometry(3, 2)
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    })
    const energyCore = new THREE.Mesh(coreGeometry, coreMaterial)
    container.add(energyCore)

    // 动画状态
    let isActive = false
    let phase = 0 // 0:初始化, 1:激活, 2:流动

    return {
        // 激活动画
        animate: (duration) => {
            isActive = true
            phase = 1

            // 能量核心脉动
            gsap.to(energyCore.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: duration * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })

            // 核心光芒变化
            gsap.to(coreMaterial, {
                opacity: 1,
                duration: duration * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })

            // 延迟进入流动阶段
            setTimeout(() => {
                phase = 2
            }, duration * 1000 * 0.3)
        },

        // 更新函数
        update: (deltaTime, elapsed) => {
            if (!isActive) return

            const time = elapsed * flowSpeed

            // 更新能量核心
            energyCore.rotation.x = time * 0.3
            energyCore.rotation.y = time * 0.5

            // 更新粒子系统
            const positions = particleGeometry.attributes.position.array
            const colors = particleGeometry.attributes.color.array

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3
                const particle = particles[i]

                if (phase === 1) {
                    // 激活阶段：粒子向目标聚集
                    const targetPos = gridPoints[particle.targetIndex]
                    particle.currentPosition.lerp(targetPos, 0.1)
                } else if (phase === 2) {
                    // 流动阶段：量子跃迁效果
                    if (Math.random() < 0.02) {
                        particle.targetIndex = Math.floor(Math.random() * gridPoints.length)
                    }

                    const targetPos = gridPoints[particle.targetIndex]
                    particle.currentPosition.lerp(targetPos, 0.05)

                    // 添加量子波动
                    const wave = Math.sin(time + i * 0.1) * 0.3
                    particle.currentPosition.x += wave * Math.cos(time + i)
                    particle.currentPosition.y += wave * Math.sin(time + i * 0.7)
                    particle.currentPosition.z += wave * Math.cos(time + i * 1.3)
                }

                // 更新粒子位置
                positions[i3] = particle.currentPosition.x
                positions[i3 + 1] = particle.currentPosition.y
                positions[i3 + 2] = particle.currentPosition.z

                // 动态颜色变化
                const energyLevel = (Math.sin(time + i * 0.05) + 1) * 0.5
                const hue = 0.5 + energyLevel * 0.2
                const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + energyLevel * 0.3)

                colors[i3] = color.r
                colors[i3 + 1] = color.g
                colors[i3 + 2] = color.b
            }

            particleGeometry.attributes.position.needsUpdate = true
            particleGeometry.attributes.color.needsUpdate = true

            // 更新连接器
            connectors.forEach((connector, index) => {
                if (phase === 2 && Math.random() < 0.01) {
                    connector.active = !connector.active

                    const material = connector.line.material
                    gsap.to(material, {
                        opacity: connector.active ? 0.8 : 0.3,
                        duration: 0.5,
                        ease: 'power2.inOut'
                    })
                }
            })

            // 矩阵整体旋转
            container.rotation.y = elapsed * 0.1
            container.rotation.x = Math.sin(elapsed * 0.2) * 0.05
        },

        // 销毁函数
        destroy: () => {
            // 清理粒子系统
            if (particleSystem.geometry) particleSystem.geometry.dispose()
            if (particleSystem.material) particleSystem.material.dispose()
            container.remove(particleSystem)

            // 清理连接器
            connectors.forEach(connector => {
                if (connector.line.geometry) connector.line.geometry.dispose()
                if (connector.line.material) connector.line.material.dispose()
                container.remove(connector.line)
            })

            // 清理能量核心
            if (energyCore.geometry) energyCore.geometry.dispose()
            if (energyCore.material) energyCore.material.dispose()
            container.remove(energyCore)

            scene.remove(container)
        }
    }
}
