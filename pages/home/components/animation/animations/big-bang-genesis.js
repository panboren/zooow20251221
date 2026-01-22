/**
 * 宇宙大爆炸 - 万物起源特效（创世史诗版）
 * 模拟宇宙从奇点到万物形成的完整演化过程
 * 技术亮点：
 * - 奇点爆炸：从零维度到三维空间的瞬间展开
 * - 量子泡沫：量子涨落形成的宇宙种子
 * - 物质凝聚：氢氦原子的形成与聚类
 * - 恒星诞生：第一代恒星的点燃
 * - 星系形成：银河系结构的构建
 * - 生命萌芽：有机分子的组合
 * - 时空涟漪：引力波的传播
 * - 维度展开：多维空间的动态展现
 * - 200000+ 创世粒子
 * - 史诗级的创世叙事体验
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateBigBangGenesis(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    try {
        // 初始设置 - 奇点视角
        setupInitialCamera(camera, new THREE.Vector3(0, 50, 0), 80, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
                if (onComplete) onComplete({ type: 'big-bang-genesis' })
            },
            onError,
            '宇宙大爆炸',
            controls
        )

        // 奇点核心
        const singularity = createSingularity(scene)

        // 量子泡沫（50000粒子）
        const quantumFoam = createQuantumFoam(scene, {
            foamCount: 50000
        })

        // 物质凝聚（30000粒子）
        const matterCondensation = createMatterCondensation(scene, {
            condensationCount: 30000
        })

        // 恒星诞生（25000恒星）
        const stellarBirth = createStellarBirthGenesis(scene, {
            starCount: 25000
        })

        // 星系形成（20000粒子）
        const galaxyFormation = createGalaxyFormation(scene, {
            galaxyCount: 20000
        })

        // 生命萌芽（15000粒子）
        const lifeSprouting = createLifeSprouting(scene, {
            lifeCount: 15000
        })

        // 时空涟漪（25000粒子）
        const spacetimeRipples = createSpacetimeRipples(scene, {
            rippleCount: 25000
        })

        // 维度展开（30000粒子）
        const dimensionExpansion = createDimensionExpansion(scene, {
            expansionCount: 30000
        })

        // 宇宙微波背景（35000粒子）
        const cmb = createCosmicMicrowaveBackground(scene, {
            cmbCount: 35000
        })

        // 超新星爆发（18000粒子）
        const supernova = createSupernovaExplosions(scene, {
            supernovaCount: 18000
        })

        // 暗物质网络（22000粒子）
        const darkMatter = createDarkMatterNetwork(scene, {
            darkMatterCount: 22000
        })

        // 阶段1: 奇点爆发 - 从虚无到一切（持续2秒）
        tl.to(camera, {
            fov: 150,
            duration: 0.8,
            ease: 'power4.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                '奇点爆发错误'
            )
        })

        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 80,
            duration: 2,
            ease: 'power4.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '奇点移动错误'
            )
        }, 0.8)

        tl.call(() => {
            singularity.explode()
            quantumFoam.foam()
            dimensionExpansion.expand()
        }, null, 1.0)

        // 阶段2: 量子泡沫 - 虚空中的涟漪（持续3秒）
        tl.to(camera.position, {
            x: 15,
            y: 10,
            z: 60,
            duration: 3,
            ease: 'power3.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '量子移动错误'
            )
        }, 3.0)

        tl.call(() => {
            quantumFoam.coalesce()
            matterCondensation.condense()
            spacetimeRipples.propagate()
        }, null, 3.5)

        // 阶段3: 物质凝聚 - 氢氦原子形成（持续3.5秒）
        tl.to(camera.position, {
            x: -20,
            y: 5,
            z: 50,
            duration: 3.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '物质移动错误'
            )
        }, 6.0)

        tl.call(() => {
            matterCondensation.ignite()
            stellarBirth.birth()
            cmb.radiate()
        }, null, 6.5)

        // 阶段4: 恒星时代 - 第一代恒星点燃（持续3秒）
        tl.to(camera.position, {
            x: 0,
            y: -15,
            z: 45,
            duration: 3,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '恒星移动错误'
            )
        }, 9.5)

        tl.call(() => {
            stellarBirth.ignite()
            galaxyFormation.form()
            supernova.explode()
        }, null, 10.0)

        // 阶段5: 星系形成 - 银河系构建（持续3.5秒）
        tl.to(camera.position, {
            x: 25,
            y: 8,
            z: 40,
            duration: 3.5,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '星系移动错误'
            )
        }, 12.5)

        tl.call(() => {
            galaxyFormation.structure()
            darkMatter.connect()
            lifeSprouting.sprout()
        }, null, 13.0)

        // 阶段6: 生命萌芽 - 有机分子组合（持续3秒）
        tl.to(camera.position, {
            x: 0,
            y: 12,
            z: 55,
            duration: 3,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '生命移动错误'
            )
        }, 16.0)

        tl.call(() => {
            lifeSprouting.evolve()
            stellarBirth.mature()
            galaxyFormation.stabilize()
        }, null, 16.5)

        tl.to(camera, {
            fov: 70,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 18.5)

        // 更新循环
        const updateHandler = () => {
            const time = Date.now() * 0.001
            singularity.update(time)
            quantumFoam.update(time)
            matterCondensation.update(time)
            stellarBirth.update(time)
            galaxyFormation.update(time)
            lifeSprouting.update(time)
            spacetimeRipples.update(time)
            dimensionExpansion.update(time)
            cmb.update(time)
            supernova.update(time)
            darkMatter.update(time)
        }

        // 清理函数
        const cleanup = () => {
            singularity.destroy()
            quantumFoam.destroy()
            matterCondensation.destroy()
            stellarBirth.destroy()
            galaxyFormation.destroy()
            lifeSprouting.destroy()
            spacetimeRipples.destroy()
            dimensionExpansion.destroy()
            cmb.destroy()
            supernova.destroy()
            darkMatter.destroy()
        }

        tl.call(cleanup, null, 20.5)

        return { updateHandler }

    } catch (error) {
        if (onError) onError(error)
        return null
    }
}

/**
 * 创建奇点核心
 */
function createSingularity(scene) {
    const singularityGroup = new THREE.Group()
    singularityGroup.position.set(0, 0, 0)

    // 奇点核心 - 极小的发光球体
    const singularityGeometry = new THREE.SphereGeometry(0.1, 32, 32)
    const singularityMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
    })
    const singularity = new THREE.Mesh(singularityGeometry, singularityMaterial)
    singularityGroup.add(singularity)

    // 事件穹顶 - 奇点周围的时空扭曲
    const eventDomeGeometry = new THREE.SphereGeometry(2, 64, 64)
    const eventDomeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        wireframe: true
    })
    const eventDome = new THREE.Mesh(eventDomeGeometry, eventDomeMaterial)
    singularityGroup.add(eventDome)

    // 维度弦 - 连接多维空间的弦线
    const stringCount = 12
    const dimensionStrings = []
    for (let i = 0; i < stringCount; i++) {
        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 4, 8)
        const stringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / stringCount, 1, 0.8),
            transparent: true,
            opacity: 0
        })
        const string = new THREE.Mesh(stringGeometry, stringMaterial)
        string.rotation.x = Math.PI / 2
        string.rotation.z = (i / stringCount) * Math.PI * 2
        string.position.y = 0
        dimensionStrings.push(string)
        singularityGroup.add(string)
    }

    scene.add(singularityGroup)

    const singularityObj = {
        group: singularityGroup,
        singularity,
        eventDome,
        dimensionStrings,
        exploded: false,

        explode() {
            this.exploded = true

            // 奇点爆发动画
            gsap.to(singularity.scale, {
                x: 100,
                y: 100,
                z: 100,
                duration: 0.5,
                ease: 'power4.out'
            })

            gsap.to(singularityMaterial, {
                opacity: 0,
                duration: 0.5
            })

            gsap.to(eventDomeMaterial, {
                opacity: 0.8,
                duration: 0.3,
                delay: 0.2
            })

            dimensionStrings.forEach((string, i) => {
                gsap.to(string.material, {
                    opacity: 0.9,
                    duration: 0.4,
                    delay: 0.3 + i * 0.05
                })

                gsap.to(string.scale, {
                    x: 20,
                    y: 20,
                    z: 20,
                    duration: 0.6,
                    delay: 0.3 + i * 0.05,
                    ease: 'power3.out'
                })
            })
        },

        update(time) {
            if (this.exploded) {
                // 维度弦旋转
                dimensionStrings.forEach((string, i) => {
                    string.rotation.y += 0.02 + i * 0.001
                    string.rotation.x += 0.01 + i * 0.0005
                })

                // 事件穹顶脉动
                const pulse = 1 + Math.sin(time * 8) * 0.2
                eventDome.scale.set(pulse, pulse, pulse)
            }
        },

        destroy() {
            scene.remove(singularityGroup)
            singularityGeometry.dispose()
            singularityMaterial.dispose()
            eventDomeGeometry.dispose()
            eventDomeMaterial.dispose()

            dimensionStrings.forEach(string => {
                string.geometry.dispose()
                string.material.dispose()
            })
        }
    }

    return singularityObj
}

/**
 * 创建量子泡沫（增强版）
 */
function createQuantumFoam(scene, options) {
    const { foamCount = 50000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(foamCount * 3)
    const colors = new Float32Array(foamCount * 3)
    const foamData = []

    for (let i = 0; i < foamCount; i++) {
        // 在极小范围内随机分布（模拟量子尺度）
        positions[i * 3] = (Math.random() - 0.5) * 0.5
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5

        // 量子泡沫颜色 - 紫色到白色
        const hue = 0.8 + Math.random() * 0.2
        const color = new THREE.Color().setHSL(hue, 0.9, 0.7 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        foamData.push({
            originalX: positions[i * 3],
            originalY: positions[i * 3 + 1],
            originalZ: positions[i * 3 + 2],
            quantumPhase: Math.random() * Math.PI * 2,
            quantumFrequency: 5 + Math.random() * 10,
            quantumAmplitude: 0.1 + Math.random() * 0.2,
            coherence: 0,
            entangledWith: null,
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const quantumFoam = {
        points,
        material,
        geometry,
        foamData,
        foaming: false,

        foam() {
            gsap.to(material, { opacity: 0.9, duration: 0.8 })
            this.foaming = true

            // 量子泡沫爆发
            foamData.forEach((foam, i) => {
                gsap.to(foam, {
                    scale: 1,
                    duration: 1.2,
                    delay: i * 0.00001,
                    ease: 'power4.out'
                })
            })
        },

        coalesce() {
            // 量子泡沫凝聚
            foamData.forEach((foam, i) => {
                gsap.to(foam, {
                    coherence: 1,
                    duration: 2.5,
                    delay: i * 0.00002,
                    ease: 'power2.inOut'
                })
            })
        },

        update(time) {
            if (this.foaming) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < foamCount; i++) {
                    const data = foamData[i]
                    const idx = i * 3

                    // 量子涨落
                    const fluctuation = Math.sin(time * data.quantumFrequency + data.quantumPhase) *
                        data.quantumAmplitude * data.scale * data.coherence

                    pos[idx] = data.originalX + fluctuation
                    pos[idx + 1] = data.originalY + fluctuation * 0.7
                    pos[idx + 2] = data.originalZ + fluctuation * 0.5

                    // 量子纠缠闪烁
                    if (Math.random() < 0.005 * data.coherence) {
                        const intensity = 0.5 + Math.random() * 0.5
                        colors[i * 3] = Math.min(1, colors[i * 3] + intensity * 0.2)
                        colors[i * 3 + 1] = Math.min(1, colors[i * 3 + 1] + intensity * 0.1)
                        colors[i * 3 + 2] = Math.min(1, colors[i * 3 + 2] + intensity * 0.3)
                    }
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.001
            points.rotation.x += 0.0005
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return quantumFoam
}

/**
 * 创建物质凝聚（新增）
 */
function createMatterCondensation(scene, options) {
    const { condensationCount = 30000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(condensationCount * 3)
    const colors = new Float32Array(condensationCount * 3)
    const condensationData = []

    for (let i = 0; i < condensationCount; i++) {
        // 从中心向外扩散分布
        const distance = Math.random() * 15
        const angle = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI

        positions[i * 3] = Math.sin(phi) * Math.cos(angle) * distance
        positions[i * 3 + 1] = Math.cos(phi) * distance
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(angle) * distance

        // 物质颜色 - 氢氦比例
        const isHydrogen = Math.random() > 0.25 // 约75%氢，25%氦
        const color = isHydrogen ?
            new THREE.Color(0xffffff) : // 氢 - 白色
            new THREE.Color(0xffffaa)   // 氦 - 黄白色
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        condensationData.push({
            originalDistance: distance,
            angle: angle,
            phi: phi,
            condensationPhase: Math.random() * Math.PI * 2,
            condensationFrequency: 2 + Math.random() * 3,
            attractionStrength: 0.001 + Math.random() * 0.003,
            clusterId: Math.floor(Math.random() * 100), // 模拟100个原始物质团块
            scale: 0
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

    const matterCondensation = {
        points,
        material,
        geometry,
        condensationData,
        condensing: false,

        condense() {
            gsap.to(material, { opacity: 0.85, duration: 1.5 })
            this.condensing = true
        },

        ignite() {
            // 物质开始聚集成团
            condensationData.forEach((condense, i) => {
                gsap.to(condense, {
                    scale: 1,
                    duration: 2.8,
                    delay: i * 0.00003,
                    ease: 'power2.out'
                })
            })
        },

        update(time) {
            if (this.condensing) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < condensationCount; i++) {
                    const data = condensationData[i]
                    const idx = i * 3

                    // 找到同一团块的粒子并产生吸引力
                    let totalForceX = 0
                    let totalForceY = 0
                    let totalForceZ = 0

                    for (let j = 0; j < condensationCount; j++) {
                        if (i !== j && condensationData[j].clusterId === data.clusterId) {
                            const dx = pos[j * 3] - pos[idx]
                            const dy = pos[j * 3 + 1] - pos[idx + 1]
                            const dz = pos[j * 3 + 2] - pos[idx + 2]
                            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                            if (distance > 0.1 && distance < 5) {
                                const force = data.attractionStrength / (distance * distance + 0.1)
                                totalForceX += (dx / distance) * force * data.scale
                                totalForceY += (dy / distance) * force * data.scale
                                totalForceZ += (dz / distance) * force * data.scale
                            }
                        }
                    }

                    // 应用引力
                    pos[idx] += totalForceX
                    pos[idx + 1] += totalForceY
                    pos[idx + 2] += totalForceZ

                    // 量子涨落叠加
                    const fluctuation = Math.sin(time * data.condensationFrequency + data.condensationPhase) * 0.05 * data.scale
                    pos[idx] += fluctuation
                    pos[idx + 1] += fluctuation * 0.7
                    pos[idx + 2] += fluctuation * 0.5
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.y += 0.0008
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return matterCondensation
}

/**
 * 创建恒星诞生（创世纪版）
 */
function createStellarBirthGenesis(scene, options) {
    const { starCount = 25000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const starData = []

    for (let i = 0; i < starCount; i++) {
        // 在物质团块中形成恒星
        const clusterId = Math.floor(Math.random() * 100)
        const clusterCenterX = (Math.random() - 0.5) * 30
        const clusterCenterY = (Math.random() - 0.5) * 20
        const clusterCenterZ = (Math.random() - 0.5) * 30

        // 在团块周围随机分布
        const offset = Math.random() * 3
        const angle = Math.random() * Math.PI * 2

        positions[i * 3] = clusterCenterX + Math.cos(angle) * offset
        positions[i * 3 + 1] = clusterCenterY + Math.sin(angle * 0.7) * offset
        positions[i * 3 + 2] = clusterCenterZ + Math.sin(angle) * offset

        // 恒星颜色 - 根据质量分类
        const mass = Math.random()
        let color
        if (mass < 0.1) {
            // 红矮星
            color = new THREE.Color(0xff6b35)
        } else if (mass < 0.4) {
            // 橙矮星
            color = new THREE.Color(0xffa500)
        } else if (mass < 0.7) {
            // 黄矮星（如太阳）
            color = new THREE.Color(0xffffcc)
        } else if (mass < 0.9) {
            // 白星
            color = new THREE.Color(0xffffff)
        } else {
            // 蓝巨星
            color = new THREE.Color(0xaaccff)
        }

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        starData.push({
            birthTime: Math.random() * 5,
            luminosity: 0,
            temperature: 3000 + Math.random() * 30000, // 3000K to 33000K
            pulsationPhase: Math.random() * Math.PI * 2,
            pulsationSpeed: 0.5 + Math.random() * 2,
            mass: mass,
            clusterId: clusterId,
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

    const stellarBirth = {
        points,
        material,
        geometry,
        starData,
        birthing: false,

        birth() {
            gsap.to(material, { opacity: 0.92, duration: 1.8 })
            this.birthing = true
        },

        ignite() {
            // 恒星点燃 - 按质量顺序
            starData.sort((a, b) => a.mass - b.mass) // 质量小的先点燃
            starData.forEach((star, i) => {
                gsap.to(star, {
                    luminosity: 1,
                    duration: 2.2,
                    delay: i * 0.00005,
                    ease: 'power3.out'
                })
            })
        },

        mature() {
            // 恒星成熟 - 增加强度和稳定性
            starData.forEach(star => {
                star.luminosity = Math.min(1.2, star.luminosity * 1.5)
            })
        },

        update(time) {
            if (this.birthing) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < starCount; i++) {
                    const data = starData[i]
                    const idx = i * 3

                    // 恒星脉动和辐射
                    const pulsation = Math.sin(time * data.pulsationSpeed + data.pulsationPhase) * 0.05 * data.luminosity

                    // 颜色温度变化
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const tempVariation = 1 + pulsation * 0.1
                    const brightColor = baseColor.clone().multiplyScalar(data.luminosity * tempVariation)

                    colors[i * 3] = brightColor.r
                    colors[i * 3 + 1] = brightColor.g
                    colors[i * 3 + 2] = brightColor.b

                    // 轻微的位置抖动（模拟恒星活动）
                    pos[idx] += Math.sin(time * 3 + i) * 0.01 * data.luminosity
                    pos[idx + 1] += Math.cos(time * 2.5 + i) * 0.01 * data.luminosity
                    pos[idx + 2] += Math.sin(time * 2.7 + i) * 0.01 * data.luminosity
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0003
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
 * 创建星系形成（新增）
 */
function createGalaxyFormation(scene, options) {
    const { galaxyCount = 20000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(galaxyCount * 3)
    const colors = new Float32Array(galaxyCount * 3)
    const galaxyData = []

    // 创建多个原始星系团
    const galaxyClusters = 8
    for (let i = 0; i < galaxyCount; i++) {
        const clusterId = Math.floor(Math.random() * galaxyClusters)

        // 每个星系团的中心位置
        const clusterCenterX = Math.cos((clusterId / galaxyClusters) * Math.PI * 2) * 25
        const clusterCenterZ = Math.sin((clusterId / galaxyClusters) * Math.PI * 2) * 25
        const clusterCenterY = (Math.random() - 0.5) * 10

        // 在星系团内形成旋臂结构
        const armId = Math.floor(Math.random() * 4) // 4条旋臂
        const progress = (i % Math.floor(galaxyCount / galaxyClusters)) / (galaxyCount / galaxyClusters)
        const angle = progress * Math.PI * 4 + (armId / 4) * Math.PI * 2
        const radius = progress * 15

        positions[i * 3] = clusterCenterX + Math.cos(angle) * radius + (Math.random() - 0.5) * 2
        positions[i * 3 + 1] = clusterCenterY + (Math.random() - 0.5) * 3
        positions[i * 3 + 2] = clusterCenterZ + Math.sin(angle) * radius + (Math.random() - 0.5) * 2

        // 星系颜色 - 根据类型
        const galaxyType = Math.random()
        let color
        if (galaxyType < 0.6) {
            // 螺旋星系 - 蓝白色
            color = new THREE.Color().setHSL(0.6, 0.7, 0.7 + Math.random() * 0.3)
        } else if (galaxyType < 0.85) {
            // 椭圆星系 - 黄白色
            color = new THREE.Color().setHSL(0.1, 0.3, 0.8 + Math.random() * 0.2)
        } else {
            // 不规则星系 - 混合色
            color = new THREE.Color().setHSL(Math.random(), 0.6, 0.6 + Math.random() * 0.3)
        }

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        galaxyData.push({
            clusterId: clusterId,
            armId: armId,
            progress: progress,
            angle: angle,
            radius: radius,
            rotationalSpeed: 0.0005 + Math.random() * 0.001,
            gravitationalPull: 0.001 + Math.random() * 0.002,
            formationStage: 0, // 0=初始, 1=形成中, 2=稳定
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

    const galaxyFormation = {
        points,
        material,
        geometry,
        galaxyData,
        forming: false,

        form() {
            gsap.to(material, { opacity: 0.88, duration: 2 })
            this.forming = true
        },

        structure() {
            // 星系结构化 - 增强旋臂特征
            galaxyData.forEach(galaxy => {
                galaxy.formationStage = 1
            })
        },

        stabilize() {
            // 星系稳定 - 完成形成过程
            galaxyData.forEach(galaxy => {
                galaxy.formationStage = 2
            })
        },

        update(time) {
            if (this.forming) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < galaxyCount; i++) {
                    const data = galaxyData[i]
                    const idx = i * 3

                    if (data.formationStage >= 1) {
                        // 旋臂旋转
                        data.angle += data.rotationalSpeed * data.scale

                        // 重新计算位置
                        const clusterId = data.clusterId
                        const clusterCenterX = Math.cos((clusterId / 8) * Math.PI * 2) * 25
                        const clusterCenterZ = Math.sin((clusterId / 8) * Math.PI * 2) * 25

                        pos[idx] = clusterCenterX + Math.cos(data.angle) * data.radius
                        pos[idx + 1] = pos[idx + 1] // 保持Y坐标
                        pos[idx + 2] = clusterCenterZ + Math.sin(data.angle) * data.radius

                        // 与同星系粒子的引力作用
                        if (data.formationStage === 2) {
                            for (let j = 0; j < galaxyCount; j++) {
                                if (i !== j && galaxyData[j].clusterId === data.clusterId) {
                                    const dx = pos[j * 3] - pos[idx]
                                    const dy = pos[j * 3 + 1] - pos[idx + 1]
                                    const dz = pos[j * 3 + 2] - pos[idx + 2]
                                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                                    if (distance > 0.1 && distance < 8) {
                                        const force = data.gravitationalPull / (distance * distance + 0.5)
                                        pos[idx] += (dx / distance) * force * 0.01 * data.scale
                                        pos[idx + 1] += (dy / distance) * force * 0.01 * data.scale
                                        pos[idx + 2] += (dz / distance) * force * 0.01 * data.scale
                                    }
                                }
                            }
                        }
                    }

                    // 轻微的轨道漂移
                    pos[idx] += Math.sin(time * 0.5 + i * 0.01) * 0.005 * data.scale
                    pos[idx + 2] += Math.cos(time * 0.5 + i * 0.01) * 0.005 * data.scale
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

    return galaxyFormation
}

/**
 * 创建生命萌芽（新增）
 */
function createLifeSprouting(scene, options) {
    const { lifeCount = 15000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(lifeCount * 3)
    const colors = new Float32Array(lifeCount * 3)
    const lifeData = []

    for (let i = 0; i < lifeCount; i++) {
        // 在宜居带行星上形成有机分子
        const planetCluster = Math.floor(Math.random() * 20) // 20个潜在宜居行星
        const planetX = (Math.random() - 0.5) * 40
        const planetY = (Math.random() - 0.5) * 20
        const planetZ = (Math.random() - 0.5) * 40

        positions[i * 3] = planetX + (Math.random() - 0.5) * 2
        positions[i * 3 + 1] = planetY + (Math.random() - 0.5) * 2
        positions[i * 3 + 2] = planetZ + (Math.random() - 0.5) * 2

        // 生命颜色 - 绿色到蓝色的生命能量
        const hue = 0.3 + Math.random() * 0.3 // 绿到青
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6 + Math.random() * 0.4)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        lifeData.push({
            planetId: planetCluster,
            molecularType: Math.floor(Math.random() * 5), // 5种基本有机分子
            complexity: 0, // 分子复杂度
            connectionStrength: 0.01 + Math.random() * 0.02,
            evolutionPhase: Math.random() * Math.PI * 2,
            evolutionSpeed: 0.2 + Math.random() * 0.5,
            consciousness: 0,
            scale: 0
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

    const lifeSprouting = {
        points,
        material,
        geometry,
        lifeData,
        sprouting: false,

        sprout() {
            gsap.to(material, { opacity: 0.82, duration: 1.8 })
            this.sprouting = true
        },

        evolve() {
            // 生命进化 - 增加复杂度和意识
            lifeData.forEach(life => {
                gsap.to(life, {
                    complexity: 1,
                    consciousness: 1,
                    duration: 3,
                    ease: 'power2.out'
                })
            })
        },

        update(time) {
            if (this.sprouting) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < lifeCount; i++) {
                    const data = lifeData[i]
                    const idx = i * 3

                    // 生命能量脉动
                    const pulse = Math.sin(time * data.evolutionSpeed + data.evolutionPhase) *
                        0.02 * data.consciousness

                    // 颜色变化表示生命活力
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const vitality = 1 + pulse * data.complexity
                    const aliveColor = baseColor.clone().multiplyScalar(vitality)

                    colors[i * 3] = aliveColor.r
                    colors[i * 3 + 1] = aliveColor.g
                    colors[i * 3 + 2] = aliveColor.b

                    // 分子连接 - 形成生命网络
                    if (data.complexity > 0.3) {
                        for (let j = 0; j < lifeCount; j++) {
                            if (i !== j && lifeData[j].planetId === data.planetId) {
                                const dx = pos[j * 3] - pos[idx]
                                const dy = pos[j * 3 + 1] - pos[idx + 1]
                                const dz = pos[j * 3 + 2] - pos[idx + 2]
                                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                                if (distance > 0.05 && distance < 1.5) {
                                    // 分子间吸引力，形成复杂结构
                                    const force = data.connectionStrength / (distance * distance + 0.1)
                                    pos[idx] += (dx / distance) * force * 0.005 * data.complexity
                                    pos[idx + 1] += (dy / distance) * force * 0.005 * data.complexity
                                    pos[idx + 2] += (dz / distance) * force * 0.005 * data.complexity
                                }
                            }
                        }
                    }

                    // 生命能量场波动
                    pos[idx] += Math.sin(time * 2 + i) * pulse * 0.5
                    pos[idx + 1] += Math.cos(time * 1.8 + i) * pulse * 0.5
                    pos[idx + 2] += Math.sin(time * 2.2 + i) * pulse * 0.5
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0004
            points.rotation.z += 0.0001
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return lifeSprouting
}

/**
 * 创建时空涟漪（新增）
 */
function createSpacetimeRipples(scene, options) {
    const { rippleCount = 25000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(rippleCount * 3)
    const colors = new Float32Array(rippleCount * 3)
    const rippleData = []

    for (let i = 0; i < rippleCount; i++) {
        // 球面分布模拟时空曲率
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 5 + Math.random() * 35

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
        positions[i * 3 + 1] = Math.cos(phi) * radius
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

        // 引力波颜色 - 深蓝紫色
        const hue = 0.7 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        rippleData.push({
            originalTheta: theta,
            originalPhi: phi,
            originalRadius: radius,
            ripplePhase: Math.random() * Math.PI * 2,
            rippleFrequency: 1 + Math.random() * 3,
            rippleAmplitude: 0.5 + Math.random() * 1.5,
            propagationSpeed: 0.5 + Math.random() * 1,
            waveType: Math.floor(Math.random() * 3), // 3种波类型
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

    const spacetimeRipples = {
        points,
        material,
        geometry,
        rippleData,
        rippling: false,

        propagate() {
            gsap.to(material, { opacity: 0.75, duration: 1.5 })
            this.rippling = true
        },

        update(time) {
            if (this.rippling) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < rippleCount; i++) {
                    const data = rippleData[i]
                    const idx = i * 3

                    // 时空涟漪传播
                    const propagation = Math.sin(time * data.propagationSpeed - data.ripplePhase) * data.rippleAmplitude * data.scale

                    // 不同类型的引力波
                    let waveEffect
                    switch (data.waveType) {
                        case 0: // +模式
                            waveEffect = Math.cos(time * data.rippleFrequency + data.ripplePhase) * propagation
                            break
                        case 1: // x模式
                            waveEffect = Math.sin(time * data.rippleFrequency + data.ripplePhase) * propagation
                            break
                        case 2: // 随机模式
                            waveEffect = Math.sin(time * data.rippleFrequency * 1.5 + data.ripplePhase * 1.2) * propagation
                            break
                    }

                    const newRadius = data.originalRadius + waveEffect

                    pos[idx] = Math.sin(data.originalPhi) * Math.cos(data.originalTheta) * newRadius
                    pos[idx + 1] = Math.cos(data.originalPhi) * newRadius
                    pos[idx + 2] = Math.sin(data.originalPhi) * Math.sin(data.originalTheta) * newRadius

                    // 能量衰减
                    const energy = Math.max(0.1, 1 - (newRadius - data.originalRadius) / 10)
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const fadedColor = baseColor.clone().multiplyScalar(energy)

                    colors[i * 3] = fadedColor.r
                    colors[i * 3 + 1] = fadedColor.g
                    colors[i * 3 + 2] = fadedColor.b
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

    return spacetimeRipples
}

/**
 * 创建维度展开（新增）
 */
function createDimensionExpansion(scene, options) {
    const { expansionCount = 30000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(expansionCount * 3)
    const colors = new Float32Array(expansionCount * 3)
    const expansionData = []

    for (let i = 0; i < expansionCount; i++) {
        // 从原点开始向外扩展
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0

        // 维度颜色 - 从白到各种高维色彩
        const hue = Math.random()
        const color = new THREE.Color().setHSL(hue, 0.9, 0.7 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        expansionData.push({
            targetX: (Math.random() - 0.5) * 40,
            targetY: (Math.random() - 0.5) * 30,
            targetZ: (Math.random() - 0.5) * 40,
            expansionSpeed: 0.5 + Math.random() * 1.5,
            oscillationPhase: Math.random() * Math.PI * 2,
            oscillationFreq: 2 + Math.random() * 3,
            dimensionLevel: Math.floor(Math.random() * 5), // 0-4维
            scale: 0
        })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const dimensionExpansion = {
        points,
        material,
        geometry,
        expansionData,
        expanding: false,

        expand() {
            gsap.to(material, { opacity: 0.88, duration: 1 })
            this.expanding = true
        },

        update(time) {
            if (this.expanding) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < expansionCount; i++) {
                    const data = expansionData[i]
                    const idx = i * 3

                    // 维度展开运动
                    const progress = Math.min(1, data.scale * data.expansionSpeed * 0.01)

                    // 主要展开方向
                    pos[idx] = data.targetX * progress
                    pos[idx + 1] = data.targetY * progress
                    pos[idx + 2] = data.targetZ * progress

                    // 高维振荡
                    const oscillation = Math.sin(time * data.oscillationFreq + data.oscillationPhase) *
                        0.5 * (1 - progress) * (data.dimensionLevel + 1) * 0.3
                    pos[idx] += oscillation
                    pos[idx + 1] += oscillation * 0.7
                    pos[idx + 2] += oscillation * 0.5

                    // 维度稳定化
                    if (progress > 0.8) {
                        // 减少振荡
                        pos[idx] += (data.targetX * 0.95 - pos[idx]) * 0.01 * data.scale
                        pos[idx + 1] += (data.targetY * 0.95 - pos[idx + 1]) * 0.01 * data.scale
                        pos[idx + 2] += (data.targetZ * 0.95 - pos[idx + 2]) * 0.01 * data.scale
                    }
                }
                geometry.attributes.position.needsUpdate = true
            }

            points.rotation.x += 0.0002
            points.rotation.z += 0.0001
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return dimensionExpansion
}

/**
 * 创建宇宙微波背景（新增）
 */
function createCosmicMicrowaveBackground(scene, options) {
    const { cmbCount = 35000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(cmbCount * 3)
    const colors = new Float32Array(cmbCount * 3)
    const cmbData = []

    for (let i = 0; i < cmbCount; i++) {
        // 均匀分布在大球面上
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 45 + Math.random() * 10 // 远距离背景

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
        positions[i * 3 + 1] = Math.cos(phi) * radius
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

        // 微波背景色 - 微红到微黄
        const temperatureFluctuation = (Math.random() - 0.5) * 0.1 // 微小温度变化
        const hue = 0.05 + temperatureFluctuation // 微红
        const color = new THREE.Color().setHSL(hue, 0.3, 0.1 + Math.random() * 0.1)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        cmbData.push({
            originalTheta: theta,
            originalPhi: phi,
            originalRadius: radius,
            anisotropyPhase: Math.random() * Math.PI * 2,
            anisotropyFreq: 0.5 + Math.random() * 1,
            anisotropyAmp: 0.1 + Math.random() * 0.2,
            redshift: 1089, // 宇宙早期红移
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

    const cosmicMicrowaveBackground = {
        points,
        material,
        geometry,
        cmbData,
        radiating: false,

        radiate() {
            gsap.to(material, { opacity: 0.65, duration: 2.5 })
            this.radiating = true
        },

        update(time) {
            if (this.radiating) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < cmbCount; i++) {
                    const data = cmbData[i]
                    const idx = i * 3

                    // 宇宙膨胀效应
                    const expansion = 1 + time * 0.001 // 模拟宇宙膨胀
                    const newRadius = data.originalRadius * expansion

                    pos[idx] = Math.sin(data.originalPhi) * Math.cos(data.originalTheta) * newRadius
                    pos[idx + 1] = Math.cos(data.originalPhi) * newRadius
                    pos[idx + 2] = Math.sin(data.originalPhi) * Math.sin(data.originalTheta) * newRadius

                    // 温度涨落
                    const anisotropy = Math.sin(time * data.anisotropyFreq + data.anisotropyPhase) *
                        data.anisotropyAmp * data.scale
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const tempColor = baseColor.clone().multiplyScalar(1 + anisotropy)

                    colors[i * 3] = tempColor.r
                    colors[i * 3 + 1] = tempColor.g
                    colors[i * 3 + 2] = tempColor.b
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0001
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return cosmicMicrowaveBackground
}

/**
 * 创建超新星爆发（新增）
 */
function createSupernovaExplosions(scene, options) {
    const { supernovaCount = 18000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(supernovaCount * 3)
    const colors = new Float32Array(supernovaCount * 3)
    const supernovaData = []

    // 选择一些大质量恒星作为超新星候选
    const candidateStars = []
    for (let i = 0; i < 100; i++) {
        candidateStars.push({
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 30,
            explosionTime: Math.random() * 5 + 8 // 在8-13秒之间爆炸
        })
    }

    for (let i = 0; i < supernovaCount; i++) {
        const parentStar = candidateStars[i % candidateStars.length]

        positions[i * 3] = parentStar.x
        positions[i * 3 + 1] = parentStar.y
        positions[i * 3 + 2] = parentStar.z

        // 超新星颜色 - 从白热到红热
        const hue = Math.random() * 0.1 + 0.05 // 橙红范围
        const color = new THREE.Color().setHSL(hue, 0.9, 0.8 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        supernovaData.push({
            parentStar: parentStar,
            explosionStartTime: 0,
            explosionProgress: 0,
            velocity: 2 + Math.random() * 5,
            direction: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize(),
            shockwavePhase: Math.random() * Math.PI * 2,
            shockwaveFreq: 5 + Math.random() * 10,
            debrisTrail: [],
            exploded: false,
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

    const supernova = {
        points,
        material,
        geometry,
        supernovaData,
        exploding: false,

        explode() {
            gsap.to(material, { opacity: 0.95, duration: 0.5 })
            this.exploding = true
        },

        update(time) {
            if (this.exploding) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < supernovaCount; i++) {
                    const data = supernovaData[i]
                    const idx = i * 3

                    // 检查是否到达爆炸时间
                    if (!data.exploded && time > data.parentStar.explosionTime) {
                        data.exploded = true
                        data.explosionStartTime = time
                    }

                    if (data.exploded) {
                        const elapsed = time - data.explosionStartTime
                        data.explosionProgress = Math.min(1, elapsed * 2) // 0.5秒内完成爆炸

                        // 爆炸展开
                        const distance = data.velocity * elapsed * data.explosionProgress
                        pos[idx] = data.parentStar.x + data.direction.x * distance
                        pos[idx + 1] = data.parentStar.y + data.direction.y * distance
                        pos[idx + 2] = data.parentStar.z + data.direction.z * distance

                        // 冲击波效应
                        const shockwave = Math.sin(elapsed * data.shockwaveFreq + data.shockwavePhase) * 0.3 * data.explosionProgress
                        const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                        const shockColor = baseColor.clone().multiplyScalar(1 + shockwave)

                        colors[i * 3] = shockColor.r
                        colors[i * 3 + 1] = shockColor.g
                        colors[i * 3 + 2] = shockColor.b

                        // 边界检查 - 粒子飞出视野后重置
                        const distFromCenter = Math.sqrt(
                            pos[idx] * pos[idx] +
                            pos[idx + 1] * pos[idx + 1] +
                            pos[idx + 2] * pos[idx + 2]
                        )

                        if (distFromCenter > 50) {
                            // 重置到原位置，等待下次爆炸
                            pos[idx] = data.parentStar.x
                            pos[idx + 1] = data.parentStar.y
                            pos[idx + 2] = data.parentStar.z
                            data.exploded = false
                        }
                    }
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.0007
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return supernova
}

/**
 * 创建暗物质网络（新增）
 */
function createDarkMatterNetwork(scene, options) {
    const { darkMatterCount = 22000 } = options

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(darkMatterCount * 3)
    const colors = new Float32Array(darkMatterCount * 3)
    const darkMatterData = []

    for (let i = 0; i < darkMatterCount; i++) {
        // 在宇宙大尺度结构中分布
        const x = (Math.random() - 0.5) * 40
        const y = (Math.random() - 0.5) * 25
        const z = (Math.random() - 0.5) * 40

        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z

        // 暗物质颜色 - 深紫色到深蓝色
        const hue = 0.75 + Math.random() * 0.15
        const color = new THREE.Color().setHSL(hue, 0.9, 0.1 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        darkMatterData.push({
            originalX: x,
            originalY: y,
            originalZ: z,
            webNodeId: Math.floor(Math.random() * 50), // 50个暗物质节点
            gravitationalInfluence: 0.002 + Math.random() * 0.005,
            interactionPhase: Math.random() * Math.PI * 2,
            interactionFreq: 0.5 + Math.random() * 1.5,
            connectedNodes: [],
            density: 0.1 + Math.random() * 0.3,
            scale: 0
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

    const darkMatter = {
        points,
        material,
        geometry,
        darkMatterData,
        connecting: false,

        connect() {
            gsap.to(material, { opacity: 0.7, duration: 2 })
            this.connecting = true

            // 建立暗物质网络连接
            for (let i = 0; i < darkMatterCount; i++) {
                const data = darkMatterData[i]
                // 找到附近的节点建立连接
                for (let j = 0; j < darkMatterCount; j++) {
                    if (i !== j) {
                        const dx = positions[j * 3] - positions[i * 3]
                        const dy = positions[j * 3 + 1] - positions[i * 3 + 1]
                        const dz = positions[j * 3 + 2] - positions[i * 3 + 2]
                        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                        if (distance < 5) {
                            data.connectedNodes.push(j)
                        }
                    }
                }
            }
        },

        update(time) {
            if (this.connecting) {
                const pos = geometry.attributes.position.array
                for (let i = 0; i < darkMatterCount; i++) {
                    const data = darkMatterData[i]
                    const idx = i * 3

                    // 暗物质网络动力学
                    let totalForceX = 0
                    let totalForceY = 0
                    let totalForceZ = 0

                    // 与连接节点的引力
                    for (const connectedIdx of data.connectedNodes) {
                        if (connectedIdx < darkMatterCount) {
                            const dx = pos[connectedIdx * 3] - pos[idx]
                            const dy = pos[connectedIdx * 3 + 1] - pos[idx + 1]
                            const dz = pos[connectedIdx * 3 + 2] - pos[idx + 2]
                            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                            if (distance > 0.1) {
                                const force = data.gravitationalInfluence / (distance * distance + 0.1)
                                totalForceX += (dx / distance) * force * 0.01
                                totalForceY += (dy / distance) * force * 0.01
                                totalForceZ += (dz / distance) * force * 0.01
                            }
                        }
                    }

                    // 量子涨落
                    const fluctuation = Math.sin(time * data.interactionFreq + data.interactionPhase) * 0.02 * data.scale
                    totalForceX += fluctuation
                    totalForceY += fluctuation * 0.7
                    totalForceZ += fluctuation * 0.5

                    // 应用力
                    pos[idx] += totalForceX * data.scale
                    pos[idx + 1] += totalForceY * data.scale
                    pos[idx + 2] += totalForceZ * data.scale

                    // 向原始位置的弱恢复力
                    pos[idx] += (data.originalX - pos[idx]) * 0.001 * data.scale
                    pos[idx + 1] += (data.originalY - pos[idx + 1]) * 0.001 * data.scale
                    pos[idx + 2] += (data.originalZ - pos[idx + 2]) * 0.001 * data.scale

                    // 密度变化影响颜色
                    const densityEffect = 1 + (data.density - 0.2) * 0.5
                    const baseColor = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
                    const densityColor = baseColor.clone().multiplyScalar(densityEffect)

                    colors[i * 3] = densityColor.r
                    colors[i * 3 + 1] = densityColor.g
                    colors[i * 3 + 2] = densityColor.b
                }
                geometry.attributes.position.needsUpdate = true
                geometry.attributes.color.needsUpdate = true
            }

            points.rotation.y += 0.00025
        },

        destroy() {
            scene.remove(points)
            geometry.dispose()
            material.dispose()
        }
    }

    return darkMatter
}
