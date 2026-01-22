/**
 * 星河涌动 - 银河系动态流动特效（宇宙史诗版）
 * 融合星云、恒星、行星轨道、引力波纹、时空扭曲五大宇宙元素
 * 技术亮点：
 * - 星云漩涡：螺旋状星云流动
 * - 恒星诞生：新生恒星的诞生与演化
 * - 行星轨道：行星围绕中心恒星运动
 * - 引力波纹：引力场产生的时空波动
 * - 时空扭曲：黑洞引力造成的空间弯曲
 * - 能量脉冲：高能射线的周期性爆发
 * - 量子涟漪：量子场效应的微小波动
 * - 星系碰撞：两个星系的引力相互作用
 * - 120000+ 宇宙粒子
 * - 史诗级的宇宙叙事体验
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateGalaxyFlow(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    try {
        // 初始设置 - 宇宙远景
        setupInitialCamera(camera, new THREE.Vector3(0, 100, 0), 150, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
                if (onComplete) onComplete({ type: 'galaxy-flow' })
            },
            onError,
            '星河涌动',
            controls
        )

        // 银河中心黑洞
        const galaxyCore = createGalaxyCore(scene)

        // 星云漩涡（30000粒子）
        const nebulaSwirl = createNebulaSwirl(scene, {
            particleCount: 30000
        })

        // 恒星诞生（15000恒星）
        const stellarBirth = createStellarBirth(scene, {
            starCount: 15000
        })

        // 行星轨道（8000行星）
        const planetaryOrbits = createPlanetaryOrbits(scene, {
            planetCount: 8000
        })

        // 引力波纹（20000粒子）
        const gravityWaves = createGravityWaves(scene, {
            waveCount: 20000
        })

        // 时空扭曲（10000粒子）
        const spacetimeDistortion = createSpacetimeDistortion(scene, {
            distortionCount: 10000
        })

        // 能量脉冲（15000粒子）
        const energyPulses = createEnergyPulses(scene, {
            pulseCount: 15000
        })

        // 量子涟漪（25000粒子）
        const quantumRipples = createQuantumRipples(scene, {
            rippleCount: 25000
        })

        // 星系臂（25000粒子）
        const galacticArms = createGalacticArms(scene, {
            armCount: 25000
        })

        // 黑洞喷流（12000粒子）
        const blackholeJets = createBlackholeJets(scene, {
            jetCount: 12000
        })

        // 星系碰撞（8000粒子）
        const galaxyCollision = createGalaxyCollision(scene, {
            collisionCount: 8000
        })

        // 阶段1: 银河觉醒 - 星云漩涡（持续4秒）
        tl.to(camera, {
            fov: 120,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                '银河觉醒错误'
            )
        })

        tl.to(camera.position, {
            x: 35,
            y: 25,
            z: 50,
            duration: 4,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '星云移动错误'
            )
        }, 1.2)

        tl.call(() => {
            nebulaSwirl.swirl()
            stellarBirth.birth()
            spacetimeDistortion.warp()
            quantumRipples.ripple()
        }, null, 1.5)

        // 阶段2: 恒星诞生 - 新生恒星（持续3.5秒）
        tl.to(camera.position, {
            x: -30,
            y: 20,
            z: 45,
            duration: 3.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '恒星移动错误'
            )
        }, 5.2)

        tl.call(() => {
            stellarBirth.ignite()
            planetaryOrbits.orbit()
            energyPulses.pulse()
            galacticArms.rotate()
        }, null, 5.5)

        // 阶段3: 引力风暴 - 引力波纹（持续3.5秒）
        tl.to(camera.position, {
            x: 0,
            y: -25,
            z: 40,
            duration: 3.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '引力移动错误'
            )
        }, 8.7)

        tl.call(() => {
            gravityWaves.wave()
            blackholeJets.jet()
            galaxyCollision.collision()
            galaxyCore.active()
        }, null, 9.0)

        // 阶段4: 时空扭曲 - 黑洞效应（持续3秒）
        tl.to(camera.position, {
            x: 0,
            y: 8,
            z: 60,
            duration: 3,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '时空移动错误'
            )
        }, 12.2)

        tl.call(() => {
            spacetimeDistortion.intensify()
            quantumRipples.amplify()
        }, null, 12.5)

        tl.to(camera, {
            fov: 75,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 14.5)

        // 更新循环
        const updateHandler = () => {
            const time = Date.now() * 0.001
            galaxyCore.update(time)
            nebulaSwirl.update(time)
            stellarBirth.update(time)
            planetaryOrbits.update(time)
            gravityWaves.update(time)
            spacetimeDistortion.update(time)
            energyPulses.update(time)
            quantumRipples.update(time)
            galacticArms.update(time)
            blackholeJets.update(time)
            galaxyCollision.update(time)
        }

        // 清理函数
        const cleanup = () => {
            galaxyCore.destroy()
            nebulaSwirl.destroy()
            stellarBirth.destroy()
            planetaryOrbits.destroy()
            gravityWaves.destroy()
            spacetimeDistortion.destroy()
            energyPulses.destroy()
            quantumRipples.destroy()
            galacticArms.destroy()
            blackholeJets.destroy()
            galaxyCollision.destroy()
        }

        tl.call(cleanup, null, 16.0)

        return { updateHandler }

    } catch (error) {
        if (onError) onError(error)
        return null
    }
}

/**
 * 创建银河中心黑洞
 */
function createGalaxyCore(scene) {
    const coreGroup = new THREE.Group()
    coreGroup.position.set(0, 0, 0)

    // 黑洞主体
    const blackholeGeometry = new THREE.SphereGeometry(8, 128, 128)
    const blackholeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.9
    })
    const blackhole = new THREE.Mesh(blackholeGeometry, blackholeMaterial)
    coreGroup.add(blackhole)

    // 事件视界
    const eventHorizonGeometry = new THREE.SphereGeometry(9.5, 128, 128)
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.7,
        side: THREE.BackSide
    })
    const eventHorizon = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial)
    coreGroup.add(eventHorizon)

    // 吸积盘
    const accretionDiskGeometry = new THREE.RingGeometry(10, 25, 256)
    const accretionDiskMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.08, 0.9, 0.7),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    })
    const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial)
    accretionDisk.rotation.x = Math.PI / 2
    coreGroup.add(accretionDisk)

    // 高能粒子环（多层）
    const particleRingCount = 6
    const particleRings = []
    for (let i = 0; i < particleRingCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(20 + i * 4, 0.3, 16, 128)
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.05 + i * 0.03, 0.95, 0.8),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        ring.userData = { rotationSpeed: 0.01 + i * 0.005 }
        particleRings.push(ring)
        coreGroup.add(ring)
    }

    scene.add(coreGroup)

    const galaxyCore = {
        group: coreGroup,
        blackhole,
        eventHorizon,
        accretionDisk,
        particleRings,
        activeState: false,

        active() {
            this.activeState = true
            gsap.to(accretionDiskMaterial, { opacity: 0.85, duration: 2.5 })

            particleRings.forEach((ring, i) => {
                gsap.to(ring.material, {
                    opacity: 0.7 - i * 0.1,
                    duration: 2,
                    delay: i * 0.3
                })
            })
        },

        update(time) {
            if (this.activeState) {
                // 吸积盘旋转
                accretionDisk.rotation.z += 0.008

                // 粒子环旋转
                particleRings.forEach((ring, i) => {
                    ring.rotation.z += ring.userData.rotationSpeed
                })

                // 事件视界脉动
                const pulse = 1 + Math.sin(time * 2) * 0.05
                eventHorizon.scale.set(pulse, pulse, pulse)
            }
        },

        destroy() {
            scene.remove(coreGroup)
            blackholeGeometry.dispose()
            blackholeMaterial.dispose()
            eventHorizonGeometry.dispose()
            eventHorizonMaterial.dispose()
            accretionDiskGeometry.dispose()
            accretionDiskMaterial.dispose()

            particleRings.forEach(ring => {
                ring.geometry.dispose()
                ring.material.dispose()
            })
        }
    }

    return galaxyCore
}

/**
 * 创建星云漩涡（增强版）
 */
function createNebulaSwirl(scene, options) {
    const { particleCount = 30000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const nebulaData = []

    const nebulaColors = [
        new THREE.Color(0xff4500), // 深橙红
        new THREE.Color(0xff6347), // 番茄红
        new THREE.Color(0xff7f50), // 珊瑚色
        new THREE.Color(0xdc143c), // 深红
        new THREE.Color(0x8b0000), // 暗红
        new THREE.Color(0x4b0082), // 靛青
        new THREE.Color(0x191970), // 靛蓝
        new THREE.Color(0x000080)  // 海军蓝
    ]

    for (let i = 0; i < particleCount; i++) {
        // 螺旋分布
        const angle = Math.sqrt(i) * 0.5
        const radius = Math.sqrt(i) * 0.3
        const height = (Math.random() - 0.5) * 30

        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = height
        positions[i * 3 + 2] = Math.sin(angle) * radius

        const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        nebulaData.push({
            angle: angle,
            radius: radius,
            rotationSpeed: 0.001 + Math.random() * 0.003,
            verticalDrift: (Math.random() - 0.5) * 0.02,
            spiralOffset: Math.random() * Math.PI * 2,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const nebulaSwirl = {
        points,
        material,
        geometry,
        nebulaData,
        swirling: false,

        swirl() {
            gsap.to(material, { opacity: 0.85, duration: 2.2 })
            this.swirling = true

            // 渐进式激活
            nebulaData.forEach((data, i) => {
                gsap.to(data, {
                    scale: 1,
                    duration: 3,
                    delay: i * 0.00005,
                    ease: 'power2.out'
                })
            })
        },

        update(time) {
            if (this.swirling) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < particleCount; i++) {
                    const idx = i * 3
                    const data = nebulaData[i]

                    // 螺旋运动
                    data.angle += data.rotationSpeed * data.scale
                    const newRadius = data.radius + Math.sin(time * 0.5 + data.spiralOffset) * 0.1 * data.scale

                    pos[idx] = Math.cos(data.angle) * newRadius
                    pos[idx + 1] += data.verticalDrift * data.scale
                    pos[idx + 2] = Math.sin(data.angle) * newRadius

                    // 向中心轻微吸引
                    const centerX = 0
                    const centerZ = 0
                    const dx = centerX - pos[idx]
                    const dz = centerZ - pos[idx + 2]
                    const distance = Math.sqrt(dx * dx + dz * dz)

                    if (distance > 0.1) {
                        pos[idx] += (dx / distance) * 0.005 * data.scale
                        pos[idx + 2] += (dz / distance) * 0.005 * data.scale
                    }
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.0005
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return nebulaSwirl
}

/**
 * 创建恒星诞生（新增）
 */
function createStellarBirth(scene, options) {
    const { starCount = 15000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const starData = []

    for (let i = 0; i < starCount; i++) {
        // 在球体内随机分布
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = Math.cbrt(Math.random()) * 40 // 立方根分布，使内部密度更高

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.cos(phi)
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

        // 恒星颜色 - 从红矮星到蓝巨星
        const temperature = Math.random()
        let color
        if (temperature < 0.3) {
            // 红矮星
            color = new THREE.Color(0xff6b35)
        } else if (temperature < 0.6) {
            // 类太阳恒星
            color = new THREE.Color(0xfff2bc)
        } else {
            // 蓝巨星
            color = new THREE.Color(0xb5e8ff)
        }

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        starData.push({
            birthTime: Math.random() * 10,
            brightness: 0,
            pulsationPhase: Math.random() * Math.PI * 2,
            pulsationSpeed: 0.5 + Math.random() * 1.5,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const stellarBirth = {
        points,
        material,
        geometry,
        starData,
        birthing: false,

        birth() {
            gsap.to(material, { opacity: 0.9, duration: 2 })
            this.birthing = true
        },

        ignite() {
            // 恒星点燃效果 - 不同时间点亮
            starData.forEach((star, i) => {
                gsap.to(star, {
                    brightness: 1,
                    duration: 2.5,
                    delay: i * 0.0001,
                    ease: 'power3.out'
                })
            })
        },

        update(time) {
            if (this.birthing) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < starCount; i++) {
                    const data = starData[i]
                    const idx = i * 3

                    // 恒星脉动效果
                    const pulsation = Math.sin(time * data.pulsationSpeed + data.pulsationPhase) * 0.1 * data.brightness

                    // 颜色亮度调整
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const brightColor = baseColor.clone().multiplyScalar(1 + pulsation * data.brightness)

                    colors[i * 3] = brightColor.r
                    colors[i * 3 + 1] = brightColor.g
                    colors[i * 3 + 2] = brightColor.b
                }
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0002
            points.rotation.x += 0.0001
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return stellarBirth
}

/**
 * 创建行星轨道（新增）
 */
function createPlanetaryOrbits(scene, options) {
    const { planetCount = 8000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(planetCount * 3)
    const colors = new Float32Array(planetCount * 3)
    const orbitData = []

    for (let i = 0; i < planetCount; i++) {
        // 创建椭圆轨道
        const orbitRadius = 25 + Math.random() * 35
        const eccentricity = Math.random() * 0.6 // 椭圆度
        const angle = Math.random() * Math.PI * 2

        // 椭圆公式
        const r = orbitRadius * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle))

        positions[i * 3] = Math.cos(angle) * r
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8 // 微小垂直偏移
        positions[i * 3 + 2] = Math.sin(angle) * r

        // 行星颜色
        const hue = 0.3 + Math.random() * 0.3 // 绿到蓝绿色调
        const color = new THREE.Color().setHSL(hue, 0.7, 0.6 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        orbitData.push({
            semiMajorAxis: orbitRadius,
            eccentricity: eccentricity,
            currentAngle: angle,
            angularVelocity: 0.001 + Math.random() * 0.004,
            inclination: (Math.random() - 0.5) * 0.3,
            phase: Math.random() * Math.PI * 2,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const planetaryOrbits = {
        points,
        material,
        geometry,
        orbitData,
        orbiting: false,

        orbit() {
            gsap.to(material, { opacity: 0.75, duration: 1.8 })
            this.orbiting = true
        },

        update(time) {
            if (this.orbiting) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < planetCount; i++) {
                    const data = orbitData[i]
                    const idx = i * 3

                    // 更新角度
                    data.currentAngle += data.angularVelocity

                    // 计算新位置（椭圆轨道）
                    const r = data.semiMajorAxis * (1 - data.eccentricity * data.eccentricity) /
                        (1 + data.eccentricity * Math.cos(data.currentAngle))

                    pos[idx] = Math.cos(data.currentAngle) * r
                    pos[idx + 1] = Math.sin(data.currentAngle * data.inclination + data.phase) * 3
                    pos[idx + 2] = Math.sin(data.currentAngle) * r
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.0003
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return planetaryOrbits
}

/**
 * 创建引力波纹（新增）
 */
function createGravityWaves(scene, options) {
    const { waveCount = 20000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(waveCount * 3)
    const colors = new Float32Array(waveCount * 3)
    const waveData = []

    for (let i = 0; i < waveCount; i++) {
        // 环形分布
        const angle = (i / waveCount) * Math.PI * 2 * 5 // 5圈螺旋
        const radius = (i / waveCount) * 50
        const height = Math.sin(angle * 2) * 10 // 波浪高度

        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = height
        positions[i * 3 + 2] = Math.sin(angle) * radius

        // 引力波颜色 - 蓝紫色调
        const hue = 0.65 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.8, 0.7 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        waveData.push({
            originalRadius: radius,
            originalHeight: height,
            wavePhase: Math.random() * Math.PI * 2,
            waveFrequency: 0.5 + Math.random() * 1.5,
            waveAmplitude: 0.5 + Math.random() * 1.5,
            propagationSpeed: 0.002 + Math.random() * 0.003
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const gravityWaves = {
        points,
        material,
        geometry,
        waveData,
        waving: false,

        wave() {
            gsap.to(material, { opacity: 0.8, duration: 2 })
            this.waving = true
        },

        update(time) {
            if (this.waving) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < waveCount; i++) {
                    const data = waveData[i]
                    const idx = i * 3

                    // 引力波传播效果
                    const propagation = Math.sin(time * data.propagationSpeed * 10 - data.wavePhase) * data.waveAmplitude

                    // 波动计算
                    const waveEffect = Math.sin(time * data.waveFrequency + data.wavePhase) * propagation

                    pos[idx] = Math.cos((i / waveCount) * Math.PI * 2 * 5) * (data.originalRadius + waveEffect)
                    pos[idx + 1] = data.originalHeight + waveEffect * 0.5
                    pos[idx + 2] = Math.sin((i / waveCount) * Math.PI * 2 * 5) * (data.originalRadius + waveEffect)
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.0004
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return gravityWaves
}

/**
 * 创建时空扭曲（新增）
 */
function createSpacetimeDistortion(scene, options) {
    const { distortionCount = 10000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(distortionCount * 3)
    const colors = new Float32Array(distortionCount * 3)
    const distortionData = []

    for (let i = 0; i < distortionCount; i++) {
        // 在中心附近密集分布
        const distanceFromCenter = Math.random() * 20
        const angle = Math.random() * Math.PI * 2

        positions[i * 3] = Math.cos(angle) * distanceFromCenter
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = Math.sin(angle) * distanceFromCenter

        // 时空扭曲颜色 - 紫黑色调
        const hue = 0.8 + Math.random() * 0.15
        const color = new THREE.Color().setHSL(hue, 0.9, 0.4 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        distortionData.push({
            originalX: positions[i * 3],
            originalY: positions[i * 3 + 1],
            originalZ: positions[i * 3 + 2],
            distortionPhase: Math.random() * Math.PI * 2,
            distortionFrequency: 0.8 + Math.random() * 1.2,
            distortionAmplitude: 0.3 + Math.random() * 0.7,
            distanceFromCenter: distanceFromCenter,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const spacetimeDistortion = {
        points,
        material,
        geometry,
        distortionData,
        warping: false,

        warp() {
            gsap.to(material, { opacity: 0.85, duration: 2.2 })
            this.warping = true
        },

        intensify() {
            // 增强扭曲效果
            distortionData.forEach(data => {
                data.distortionAmplitude *= 1.5
            })
        },

        update(time) {
            if (this.warping) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < distortionCount; i++) {
                    const data = distortionData[i]
                    const idx = i * 3

                    // 时空扭曲效果 - 距离中心越近扭曲越大
                    const distortionFactor = Math.max(0, 1 - data.distanceFromCenter / 20)
                    const distortion = Math.sin(time * data.distortionFrequency + data.distortionPhase) *
                        data.distortionAmplitude * distortionFactor * data.scale

                    // 扭曲方向基于到中心的距离
                    const angleToCenter = Math.atan2(data.originalZ, data.originalX)
                    const distortionX = Math.cos(angleToCenter + distortion) * distortion * 2
                    const distortionZ = Math.sin(angleToCenter + distortion) * distortion * 2

                    pos[idx] = data.originalX + distortionX
                    pos[idx + 1] = data.originalY + Math.sin(time * 1.5 + data.distortionPhase) * distortion * 1.5
                    pos[idx + 2] = data.originalZ + distortionZ
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.00025
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return spacetimeDistortion
}

/**
 * 创建能量脉冲（新增）
 */
function createEnergyPulses(scene, options) {
    const { pulseCount = 15000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(pulseCount * 3)
    const colors = new Float32Array(pulseCount * 3)
    const pulseData = []

    for (let i = 0; i < pulseCount; i++) {
        // 从中心向外辐射分布
        const distance = Math.random() * 60
        const angle = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI

        positions[i * 3] = Math.sin(phi) * Math.cos(angle) * distance
        positions[i * 3 + 1] = Math.cos(phi) * distance
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(angle) * distance

        // 高能粒子颜色 - 青色到白色
        const hue = 0.5 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.95, 0.8 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        pulseData.push({
            initialDistance: distance,
            travelAngle: angle,
            travelPhi: phi,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseFrequency: 1 + Math.random() * 2,
            speed: 0.5 + Math.random() * 1.5,
            life: 0,
            maxLife: 5 + Math.random() * 5
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const energyPulses = {
        points,
        material,
        geometry,
        pulseData,
        pulsing: false,

        pulse() {
            gsap.to(material, { opacity: 0.9, duration: 1.5 })
            this.pulsing = true
        },

        update(time) {
            if (this.pulsing) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < pulseCount; i++) {
                    const data = pulseData[i]
                    const idx = i * 3

                    // 更新生命周期
                    data.life += 0.016

                    if (data.life > data.maxLife) {
                        // 重置粒子
                        data.life = 0
                        data.initialDistance = Math.random() * 2
                    }

                    // 脉冲运动
                    const currentDistance = data.initialDistance + data.speed * data.life

                    pos[idx] = Math.sin(data.travelPhi) * Math.cos(data.travelAngle) * currentDistance
                    pos[idx + 1] = Math.cos(data.travelPhi) * currentDistance
                    pos[idx + 2] = Math.sin(data.travelPhi) * Math.sin(data.travelAngle) * currentDistance

                    // 亮度脉冲
                    const pulseBrightness = Math.sin(time * data.pulseFrequency + data.pulsePhase) * 0.3 + 0.7
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const brightColor = baseColor.clone().multiplyScalar(pulseBrightness)

                    colors[i * 3] = brightColor.r
                    colors[i * 3 + 1] = brightColor.g
                    colors[i * 3 + 2] = brightColor.b
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0006
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return energyPulses
}

/**
 * 创建量子涟漪（新增）
 */
function createQuantumRipples(scene, options) {
    const { rippleCount = 25000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(rippleCount * 3)
    const colors = new Float32Array(rippleCount * 3)
    const rippleData = []

    for (let i = 0; i < rippleCount; i++) {
        // 球面分布
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 15 + Math.random() * 25

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
        positions[i * 3 + 1] = Math.cos(phi) * radius
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

        // 量子场颜色 - 紫青色调
        const hue = 0.75 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.85, 0.7 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        rippleData.push({
            originalTheta: theta,
            originalPhi: phi,
            originalRadius: radius,
            ripplePhase: Math.random() * Math.PI * 2,
            rippleFrequency: 2 + Math.random() * 3,
            rippleAmplitude: 0.2 + Math.random() * 0.5,
            quantumCoherence: Math.random(),
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const quantumRipples = {
        points,
        material,
        geometry,
        rippleData,
        rippling: false,

        ripple() {
            gsap.to(material, { opacity: 0.7, duration: 1.8 })
            this.rippling = true
        },

        amplify() {
            // 增强量子相干性
            rippleData.forEach(data => {
                data.rippleAmplitude *= 2
                data.quantumCoherence = Math.min(1, data.quantumCoherence + 0.3)
            })
        },

        update(time) {
            if (this.rippling) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < rippleCount; i++) {
                    const data = rippleData[i]
                    const idx = i * 3

                    // 量子涟漪效果
                    const rippleEffect = Math.sin(time * data.rippleFrequency + data.ripplePhase) *
                        data.rippleAmplitude * data.scale * data.quantumCoherence

                    const newRadius = data.originalRadius + rippleEffect

                    pos[idx] = Math.sin(data.originalPhi) * Math.cos(data.originalTheta) * newRadius
                    pos[idx + 1] = Math.cos(data.originalPhi) * newRadius
                    pos[idx + 2] = Math.sin(data.originalPhi) * Math.sin(data.originalTheta) * newRadius

                    // 量子纠缠闪烁
                    if (Math.random() < 0.002 * data.quantumCoherence) {
                        colors[i * 3] = Math.min(1, colors[i * 3] + 0.2)
                        colors[i * 3 + 1] = Math.min(1, colors[i * 3 + 1] + 0.2)
                        colors[i * 3 + 2] = Math.min(1, colors[i * 3 + 2] + 0.2)
                    }
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0001
            points.rotation.x += 0.00005
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return quantumRipples
}

/**
 * 创建星系臂（新增）
 */
function createGalacticArms(scene, options) {
    const { armCount = 25000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(armCount * 3)
    const colors = new Float32Array(armCount * 3)
    const armData = []

    // 创建4条主要旋臂
    const arms = 4
    for (let i = 0; i < armCount; i++) {
        const armIndex = i % arms
        const progress = Math.floor(i / arms) / (armCount / arms)

        // 对数螺线参数
        const a = 2
        const b = 0.2
        const theta = progress * Math.PI * 6 + (armIndex / arms) * Math.PI * 2

        const r = a * Math.exp(b * theta)

        // 添加一些随机扰动
        const perturbation = (Math.random() - 0.5) * 8

        positions[i * 3] = Math.cos(theta) * r + perturbation
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5
        positions[i * 3 + 2] = Math.sin(theta) * r + perturbation

        // 星系臂颜色 - 从蓝到红的渐变
        const hue = 0.6 - progress * 0.4 // 从蓝色到红色
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        armData.push({
            originalTheta: theta,
            originalR: r,
            armIndex: armIndex,
            rotationSpeed: 0.0005 + Math.random() * 0.001,
            spiralTightness: b,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const galacticArms = {
        points,
        material,
        geometry,
        armData,
        rotating: false,

        rotate() {
            gsap.to(material, { opacity: 0.88, duration: 2.5 })
            this.rotating = true
        },

        update(time) {
            if (this.rotating) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < armCount; i++) {
                    const data = armData[i]
                    const idx = i * 3

                    // 旋臂旋转
                    const newTheta = data.originalTheta + data.rotationSpeed * time * data.scale
                    const newR = data.originalR

                    pos[idx] = Math.cos(newTheta) * newR
                    pos[idx + 1] += Math.sin(time * 0.5 + i * 0.001) * 0.01 * data.scale
                    pos[idx + 2] = Math.sin(newTheta) * newR
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.0007
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return galacticArms
}

/**
 * 创建黑洞喷流（新增）
 */
function createBlackholeJets(scene, options) {
    const { jetCount = 12000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(jetCount * 3)
    const colors = new Float32Array(jetCount * 3)
    const jetData = []

    for (let i = 0; i < jetCount; i++) {
        // 两极喷流 - 上下分布
        const isTopJet = i < jetCount / 2
        const distanceFromCenter = Math.random() * 40

        positions[i * 3] = (Math.random() - 0.5) * 5 // 小的水平偏移
        positions[i * 3 + 1] = isTopJet ? distanceFromCenter : -distanceFromCenter
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5 // 小的前后偏移

        // 喷流颜色 - 高能粒子色调
        const hue = isTopJet ? 0.05 : 0.1 // 红橙色喷流
        const color = new THREE.Color().setHSL(hue, 0.95, 0.8 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        jetData.push({
            initialDistance: distanceFromCenter,
            isTopJet: isTopJet,
            jetSpeed: 1 + Math.random() * 2,
            jetPhase: Math.random() * Math.PI * 2,
            jetFrequency: 3 + Math.random() * 2,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const blackholeJets = {
        points,
        material,
        geometry,
        jetData,
        jetting: false,

        jet() {
            gsap.to(material, { opacity: 0.92, duration: 1.8 })
            this.jetting = true
        },

        update(time) {
            if (this.jetting) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < jetCount; i++) {
                    const data = jetData[i]
                    const idx = i * 3

                    // 喷流运动
                    const jetDistance = data.initialDistance + data.jetSpeed * time * 0.01 * data.scale

                    pos[idx] = positions[i * 3] + Math.sin(time * 2 + data.jetPhase) * 0.1 * data.scale
                    pos[idx + 1] = data.isTopJet ? jetDistance : -jetDistance
                    pos[idx + 2] = positions[i * 3 + 2] + Math.cos(time * 2 + data.jetPhase) * 0.1 * data.scale

                    // 边界检查 - 重置超出范围的粒子
                    if (Math.abs(pos[idx + 1]) > 50) {
                        data.initialDistance = Math.random() * 2
                        pos[idx + 1] = data.isTopJet ? data.initialDistance : -data.initialDistance
                    }

                    // 喷流脉冲
                    const pulse = Math.sin(time * data.jetFrequency + data.jetPhase) * 0.2 + 0.8
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const pulseColor = baseColor.clone().multiplyScalar(pulse)

                    colors[i * 3] = pulseColor.r
                    colors[i * 3 + 1] = pulseColor.g
                    colors[i * 3 + 2] = pulseColor.b
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.x += 0.0002
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return blackholeJets
}

/**
 * 创建星系碰撞（新增）
 */
function createGalaxyCollision(scene, options) {
    const { collisionCount = 8000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(collisionCount * 3)
    const colors = new Float32Array(collisionCount * 3)
    const collisionData = []

    // 创建两个星系
    for (let i = 0; i < collisionCount; i++) {
        const isGalaxyA = i < collisionCount / 2
        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random()) * 30

        // 初始位置 - 两个星系相距较远
        const offsetX = isGalaxyA ? -25 : 25
        const offsetZ = isGalaxyA ? -15 : 15

        positions[i * 3] = Math.cos(angle) * radius + offsetX
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8
        positions[i * 3 + 2] = Math.sin(angle) * radius + offsetZ

        // 两个星系不同颜色
        const hue = isGalaxyA ? 0.1 : 0.6 // 橙色和蓝色星系
        const color = new THREE.Color().setHSL(hue, 0.8, 0.7 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        collisionData.push({
            isGalaxyA: isGalaxyA,
            originalAngle: angle,
            originalRadius: radius,
            originalOffsetX: offsetX,
            originalOffsetZ: offsetZ,
            orbitalSpeed: 0.001 + Math.random() * 0.002,
            gravitationalPull: 0,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const galaxyCollision = {
        points,
        material,
        geometry,
        collisionData,
        colliding: false,

        collision() {
            gsap.to(material, { opacity: 0.85, duration: 2 })
            this.colliding = true
        },

        update(time) {
            if (this.colliding) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < collisionCount; i++) {
                    const data = collisionData[i]
                    const idx = i * 3

                    // 计算与其他星系粒子的引力
                    let totalForceX = 0
                    let totalForceZ = 0

                    for (let j = 0; j < collisionCount; j++) {
                        if (i !== j && collisionData[j].isGalaxyA !== data.isGalaxyA) {
                            // 只计算异星系的引力
                            const dx = pos[j * 3] - pos[idx]
                            const dz = pos[j * 3 + 2] - pos[idx + 2]
                            const distance = Math.sqrt(dx * dx + dz * dz)

                            if (distance > 0.1) {
                                const force = 1 / (distance * distance + 1) * 0.1
                                totalForceX += (dx / distance) * force
                                totalForceZ += (dz / distance) * force
                            }
                        }
                    }

                    // 更新位置
                    const currentAngle = data.originalAngle + data.orbitalSpeed * time * data.scale
                    const currentRadius = data.originalRadius

                    pos[idx] = Math.cos(currentAngle) * currentRadius + data.originalOffsetX + totalForceX * data.scale
                    pos[idx + 1] += Math.sin(time * 0.5 + i * 0.001) * 0.02 * data.scale
                    pos[idx + 2] = Math.sin(currentAngle) * currentRadius + data.originalOffsetZ + totalForceZ * data.scale
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.00015
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return galaxyCollision
}
