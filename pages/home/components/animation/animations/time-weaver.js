/**
 * 时空编织者特效
 * 模拟时间与空间交织的多元宇宙视觉效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateTimeWeaver(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    try {
        setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 120, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
                if (onComplete) onComplete({ type: 'time-weaver' })
            },
            onError,
            '时空编织者',
            controls,
        )

        // 创建时空编织系统
        const timeWeaver = createTimeWeaverSystem(scene, {
            timelineCount: 4,
            particleCount: 2000,
            energyStrandCount: 4
        })

        // 阶段1: 时空之门开启
        tl.to(camera.position, {
            x: 0,
            y: 30,
            z: 60,
            duration: 3,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '时空之门开启错误',
            ),
        })

        // 阶段2: 时空编织激活
        timeWeaver.activate(8)

        // 阶段3: 多维穿梭体验
        tl.to(camera.position, {
            x: 40,
            y: 20,
            z: 40,
            duration: 5,
            ease: 'power3.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 10, 0),
                '多维穿梭错误',
            ),
        })

        // 持续编织时空
        let startTime = null
        const duration = 15

        const animate = (time) => {
            if (!startTime) startTime = time
            const elapsed = (time - startTime) / 1000

            if (elapsed < duration) {
                const deltaTime = 0.016
                timeWeaver.weave(deltaTime, elapsed)
                renderer.render(scene, camera)
                requestAnimationFrame(animate)
            }
            else {
                timeWeaver.dissolve()
            }
        }

        requestAnimationFrame(animate)

        return tl
    }
    catch (error) {
        if (onError) {
            onError(error, '时空编织者特效执行错误')
        }
        return gsap.timeline()
    }
}

// 时空编织系统创建函数
function createTimeWeaverSystem(scene, options = {}) {
    const {
        timelineCount = 4,
        particleCount = 2000,
        energyStrandCount = 4
    } = options

    // 主容器
    const universe = new THREE.Group()
    scene.add(universe)

    // 创建时间线轨道
    const timelines = []
    const timelineRadius = 25

    for (let i = 0; i < timelineCount; i++) {
        const angle = (i / timelineCount) * Math.PI * 2
        const height = (i - timelineCount / 2) * 8

        const timelineGeometry = new THREE.TorusGeometry(timelineRadius, 0.8, 16, 100)
        const timelineMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(i * 0.2, 0.9, 0.5),
            emissive: new THREE.Color().setHSL(i * 0.2, 0.7, 0.3),
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })

        const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial)
        timeline.rotation.x = Math.PI / 2
        timeline.position.y = height
        universe.add(timeline)

        timelines.push({
            mesh: timeline,
            rotationSpeed: 0.5 + i * 0.2,
            pulsePhase: i * 0.3
        })
    }

    // 创建时空粒子
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const particles = []

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const timelineIndex = Math.floor(Math.random() * timelineCount)
        const timeline = timelines[timelineIndex]

        // 在时间线上随机位置
        const angle = Math.random() * Math.PI * 2
        const radius = timelineRadius + (Math.random() - 0.5) * 3
        const height = timeline.mesh.position.y + (Math.random() - 0.5) * 4

        positions[i3] = Math.cos(angle) * radius
        positions[i3 + 1] = height
        positions[i3 + 2] = Math.sin(angle) * radius

        // 多彩时间粒子
        const hue = (timelineIndex * 0.2 + Math.random() * 0.1) % 1
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        sizes[i] = 0.8 + Math.random() * 1.2

        particles.push({
            timelineIndex,
            baseAngle: angle,
            phase: Math.random() * Math.PI * 2,
            speed: 1 + Math.random() * 2
        })
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    universe.add(particleSystem)

// 创建主要能量漩涡（减少到1个主要漩涡）
    const vortexGeometry = new THREE.ConeGeometry(10, 25, 32)
    const vortexMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.7, 0.8, 0.5),
        transparent: true,
        opacity: 0.4,
        wireframe: true,
        side: THREE.DoubleSide
    })

    const mainVortex = new THREE.Mesh(vortexGeometry, vortexMaterial)
    mainVortex.position.y = 0
    mainVortex.rotation.x = Math.PI / 2
    universe.add(mainVortex)

    // 创建核心能量纽带（减少到4个主要纽带）
    const energyStrands = []
    for (let i = 0; i < 4; i++) {
        const strandGeometry = new THREE.BufferGeometry()
        const strandPositions = new Float32Array(80 * 3)

        for (let j = 0; j < 80; j++) {
            const progress = j / 79
            const angle = progress * Math.PI * 3
            const radius = 15 + Math.sin(progress * Math.PI) * 8
            const height = Math.sin(progress * Math.PI * 1.5) * 15

            strandPositions[j * 3] = Math.cos(angle) * radius
            strandPositions[j * 3 + 1] = height
            strandPositions[j * 3 + 2] = Math.sin(angle) * radius
        }

        strandGeometry.setAttribute('position', new THREE.BufferAttribute(strandPositions, 3))

        const strandMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(i * 0.25, 0.9, 0.6),
            transparent: true,
            opacity: 0.8,
            linewidth: 1.5
        })

        const strand = new THREE.Line(strandGeometry, strandMaterial)
        universe.add(strand)
        energyStrands.push(strand)
    }

    // 创建可变色时空核心
    const coreGeometry = new THREE.SphereGeometry(8, 32, 32)
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b, // 鲜艳的红色起点
        emissive: 0xff6b6b,
        shininess: 120,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    })
    const timeCore = new THREE.Mesh(coreGeometry, coreMaterial)
    universe.add(timeCore)

    // 颜色变换参数
    let colorPhase = 0
    const colorPalette = [
        0xff6b6b, // 鲜艳红
        0x4ecdc4, // 青绿
        0x45b7d1, // 蓝
        0x96ceb4, // 浅绿
        0xfeca57, // 橙黄
        0xff9ff3, // 粉紫
    ]

    // 状态控制
    let isActive = false
    let weavePhase = 0

    return {
        // 激活时空编织
        activate: (duration) => {
            isActive = true
            weavePhase = 1

        // 核心脉动 + 颜色变换
        gsap.to(timeCore.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            duration: duration * 0.4,
            repeat: -1,
            yoyo: true,
            ease: 'elastic.out(1, 0.3)'
        })

        // 周期性颜色变换
        gsap.to({}, {
            duration: duration * 0.4,
            repeat: -1,
            onRepeat: () => {
                colorPhase = (colorPhase + 1) % colorPalette.length
                const newColor = colorPalette[colorPhase]
                gsap.to(coreMaterial, {
                    color: newColor,
                    emissive: newColor,
                    duration: 1.5,
                    ease: 'power2.inOut'
                })
            }
        })

        // 能量纽带激活 - 更加平滑的动画
        energyStrands.forEach((strand, index) => {
            gsap.to(strand.material, {
                opacity: 0.8,
                duration: duration * 0.15,
                delay: index * 0.2,
                ease: 'power2.out'
            })
        })

        // 漩涡激活动画
        gsap.to(mainVortex.material, {
            opacity: 0.6,
            duration: duration * 0.25,
            ease: 'power2.out'
        })

            // 延迟进入编织阶段
            setTimeout(() => {
                weavePhase = 2
            }, duration * 1000 * 0.4)
        },

        // 时空编织更新
        weave: (deltaTime, elapsed) => {
            if (!isActive) return

            const time = elapsed * 1.5

            // 更新时间线旋转
            timelines.forEach((timeline, index) => {
                timeline.mesh.rotation.z += deltaTime * timeline.rotationSpeed

                // 时间线脉动
                const pulse = Math.sin(time * 2 + timeline.pulsePhase) * 0.5 + 0.5
                timeline.mesh.scale.setScalar(0.9 + pulse * 0.2)
                timeline.mesh.material.opacity = 0.4 + pulse * 0.3
            })

            // 更新粒子系统
            const positions = particleGeometry.attributes.position.array
            const colors = particleGeometry.attributes.color.array

            particles.forEach((particle, i) => {
                const i3 = i * 3
                const timeline = timelines[particle.timelineIndex]

                // 沿时间线运动
                const angle = particle.baseAngle + time * particle.speed
                const radius = timelineRadius + Math.sin(time + particle.phase) * 2

                positions[i3] = Math.cos(angle) * radius
                positions[i3 + 2] = Math.sin(angle) * radius
                positions[i3 + 1] = timeline.mesh.position.y + Math.cos(time * 3 + particle.phase) * 3

                // 动态颜色变化
                const energy = (Math.sin(time * 2 + particle.phase) + 1) * 0.5
                const hue = (particle.timelineIndex * 0.2 + energy * 0.1) % 1
                const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + energy * 0.2)

                colors[i3] = color.r
                colors[i3 + 1] = color.g
                colors[i3 + 2] = color.b
            })

            particleGeometry.attributes.position.needsUpdate = true
            particleGeometry.attributes.color.needsUpdate = true

            // 更新能量漩涡
            mainVortex.rotation.y = time * 0.8
            mainVortex.scale.x = 1 + Math.sin(time * 1.5) * 0.4
            mainVortex.scale.y = 1 + Math.cos(time * 1.2) * 0.3

            // 更新能量纽带 - 使每个纽带有不同的运动模式
            energyStrands.forEach((strand, index) => {
                strand.rotation.y = time * (0.2 + index * 0.1)
                strand.rotation.x = Math.sin(time * 0.4 + index * 0.5) * 0.15
                strand.material.opacity = 0.6 + Math.sin(time * 1.5 + index) * 0.2
            })

            // 时空核心旋转 + 颜色动态效果
            timeCore.rotation.x = time * 0.4
            timeCore.rotation.y = time * 0.6

            // 透明度脉动
            coreMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.25

            // 尺寸脉动
            const pulse = Math.sin(time * 3) * 0.5 + 1
            timeCore.scale.setScalar(pulse)

            // 宇宙整体运动
            universe.rotation.y = elapsed * 0.1
        },

        // 时空溶解
        dissolve: () => {
            // 清理所有资源
            timelines.forEach(timeline => {
                if (timeline.mesh.geometry) timeline.mesh.geometry.dispose()
                if (timeline.mesh.material) timeline.mesh.material.dispose()
                universe.remove(timeline.mesh)
            })

            if (particleSystem.geometry) particleSystem.geometry.dispose()
            if (particleSystem.material) particleSystem.material.dispose()
            universe.remove(particleSystem)

            // 清理漩涡
            if (mainVortex.geometry) mainVortex.geometry.dispose()
            if (mainVortex.material) mainVortex.material.dispose()
            universe.remove(mainVortex)

            energyStrands.forEach(strand => {
                if (strand.geometry) strand.geometry.dispose()
                if (strand.material) strand.material.dispose()
                universe.remove(strand)
            })

            if (timeCore.geometry) timeCore.geometry.dispose()
            if (timeCore.material) timeCore.material.dispose()
            universe.remove(timeCore)

            scene.remove(universe)
        }
    }
}
