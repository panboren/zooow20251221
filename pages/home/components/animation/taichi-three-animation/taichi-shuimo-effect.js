/**
 * 水墨-Taichi.js 特效（水墨画风格）
 *
 * 水墨画美学特点：
 * - 墨色变化：从浓墨到淡墨的渐变（0.0-1.0）
 * - 留白艺术：大面积空白与墨色对比
 * - 笔触感：粒子大小和透明度变化模拟毛笔笔触
 * - 流动性：墨汁在水中扩散的自然流动
 * - 气韵生动：虚实相生，意境深远
 *
 * 架构设计：
 * - 插件(taichi.client.js): 只负责加载taichi.js
 * - 特效文件(本文件): 包含所有特效逻辑，使用taichi.js进行计算
 *
 * 动画流程：
 * 阶段1: 研墨 - 浓墨聚集
 * 阶段2: 落笔 - 墨汁散开
 * 阶段3: 润色 - 墨晕扩散
 * 阶段4: 渲染 - 笔触加深
 * 阶段5: 晕染 - 墨韵流动
 * 阶段6: 留白 - 意境营造
 * 阶段7: 收尾 - 水墨大成
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../animations/utils.js'

/**
 * 水墨-Taichi.js 特效主函数
 * @param {Object} props - 动画属性 { camera, renderer, scene, controls }
 * @param {Object} callbacks - 回调函数 { onComplete, onError }
 */
export default async function animateTaichiThree(props, callbacks) {
    const { camera, renderer, scene, controls } = props
    const { onComplete, onError } = callbacks || {}

    console.log('🎬 启动水墨-Taichi.js 特效')

    // Taichi.js 相关
    let ti = null
    let useTaichi = false

    // Taichi 字段
    let positionsField = null
    let velocitiesField = null
    let colorsField = null
    let opacityField = null
    let sizeField = null

    // Taichi kernels
    let initKernel = null
    let updateKernel = null

    // 粒子数量
    const PARTICLE_COUNT = 50000

    try {
        // ========== 步骤1: 加载和初始化 Taichi.js ==========
        console.log('📦 步骤 1/4: 加载 Taichi.js...')

        const { $loadTaichi, $initTaichi } = useNuxtApp()

        try {
            ti = await $loadTaichi()
            console.log('✅ Taichi.js 加载成功')

            await $initTaichi(ti)
            console.log('✅ Taichi.js 初始化成功')

            // 检查Taichi实例是否有效
            if (!ti || typeof ti.Vector !== 'object') {
                console.warn('⚠️ Taichi.js 实例无效，使用 JavaScript 模拟')
                useTaichi = false
            } else {
                useTaichi = true
            }
        } catch (error) {
            console.warn('⚠️ Taichi.js 加载或初始化失败，使用 JavaScript 模拟:', error.message)
            useTaichi = false
        }

        // ========== 步骤2: 创建 Taichi 字段和 Kernels（水墨物理）==========
        if (useTaichi && ti) {
            console.log('🔨 步骤 2/4: 创建水墨 Taichi 字段和 Kernels...')

            try {
                await new Promise(resolve => setTimeout(resolve, 200))

                // 检查Taichi实例是否仍然有效
                if (!ti.Vector) {
                    throw new Error('Taichi实例已失效')
                }

                // 水墨专用字段
                positionsField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
                velocitiesField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
                colorsField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
                opacityField = ti.field(ti.f32, [PARTICLE_COUNT])
                sizeField = ti.field(ti.f32, [PARTICLE_COUNT])

                console.log('✅ 水墨 Taichi 字段创建成功')

                // 水墨常量
                ti.addToKernelScope({
                    positions: positionsField,
                    velocities: velocitiesField,
                    colors: colorsField,
                    opacity: opacityField,
                    size: sizeField
                })

                console.log('✅ 水墨 Kernel scope 设置完成')

                // 初始化内核 - 创建墨滴
                initKernel = ti.kernel(() => {
                    for (let i of ti.range(50000)) {
                        // 墨滴从中心随机分布（模拟研墨）
                        const angle = ti.random() * 6.28318
                        const radius = ti.random() * 5.0
                        const height = (ti.random() - 0.5) * 3.0

                        positions[i] = [
                            radius * ti.cos(angle),
                            height,
                            radius * ti.sin(angle)
                        ]

                        // 初始速度（墨汁扩散速度）
                        const spreadSpeed = 0.2 + ti.random() * 0.5
                        velocities[i] = [
                            ti.cos(angle) * spreadSpeed,
                            (ti.random() - 0.5) * 0.3,
                            ti.sin(angle) * spreadSpeed
                        ]

                        // 墨色浓度（0=浓墨，1=淡墨）
                        const inkDensity = ti.random()
                        colors[i] = [inkDensity * 0.1, inkDensity * 0.1, inkDensity * 0.1]

                        // 透明度（模拟墨色深浅）
                        opacity[i] = 0.3 + inkDensity * 0.5

                        // 笔触大小（模拟毛笔笔触）
                        size[i] = 0.5 + ti.random() * 2.0
                    }
                })

                // 更新内核 - 水墨流动物理
                updateKernel = ti.kernel(() => {
                    for (let i of ti.range(50000)) {
                        // 更新位置
                        positions[i][0] += velocities[i][0] * 0.016
                        positions[i][1] += velocities[i][1] * 0.016
                        positions[i][2] += velocities[i][2] * 0.016

                        // 墨汁扩散阻力（模拟水的粘度）
                        velocities[i][0] *= 0.995
                        velocities[i][1] *= 0.995
                        velocities[i][2] *= 0.995

                        // 随机微动（模拟墨晕）
                        velocities[i][0] += (ti.random() - 0.5) * 0.02
                        velocities[i][1] += (ti.random() - 0.5) * 0.01
                        velocities[i][2] += (ti.random() - 0.5) * 0.02

                        // 边界反弹（柔和，模拟墨汁在容器中的流动）
                        const x = positions[i][0]
                        const y = positions[i][1]
                        const z = positions[i][2]
                        const dist = ti.sqrt(x * x + y * y + z * z)

                        if (dist > 80.0) {
                            velocities[i][0] *= -0.8
                            velocities[i][1] *= -0.8
                            velocities[i][2] *= -0.8
                        }

                        // 墨色渐变（随时间变淡）
                        opacity[i] *= 0.9995

                        // 笔触大小变化（模拟墨晕扩散）
                        size[i] += 0.001
                        if (size[i] > 4.0) {
                            size[i] = 4.0
                        }
                    }
                })

                console.log('✅ 水墨 Taichi Kernels 编译完成')

                // 执行初始化
                initKernel()
                console.log('✅ 水墨初始化执行完成')

            } catch (error) {
                console.warn('⚠️ 水墨 Taichi 字段或 Kernels 创建失败，降级到 JavaScript:', error.message)
                useTaichi = false
            }
        }

        // ========== 步骤3: 初始化 Three.js 水墨场景 ==========
        console.log('🎨 步骤 3/4: 初始化水墨场景...')

        // 初始设置 - 远距离俯瞰
        setupInitialCamera(camera, new THREE.Vector3(0, 60, 120), 85, controls)
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)

        // 创建水墨核心
        const inkCore = createInkCore(scene)

        // 创建墨滴粒子系统
        const inkDrops = createInkDrops(scene, {
            particleCount: 30000,
            useTaichi,
            positionsField,
            colorsField,
            opacityField,
            sizeField
        })

        // 创建墨晕层
        const inkMist = createInkMist(scene, {
            particleCount: 15000,
            useTaichi,
            positionsField,
            colorsField
        })

        // 创建水墨流动线
        const inkFlow = createInkFlow(scene)

        console.log('✅ 水墨场景创建完成')

        // ========== 步骤4: 创建水墨动画时间轴 ==========
        console.log('⏱️  步骤 4/4: 创建水墨动画时间轴...')

        const tl = createTimeline(
            () => {
                cleanup()
                if (onComplete) onComplete({ type: 'taichi-three' })
            },
            onError,
            '水墨-Taichi.js 特效',
            controls
        )

        console.log('✅ 水墨动画时间轴创建完成')

        // ========== 水墨动画阶段 ==========

        // 阶段1: 研墨 - 浓墨聚集
        tl.to(camera.position, {
            x: 20,
            y: 40,
            z: 80,
            duration: 2.5,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '研墨错误'
            )
        })

        tl.call(() => {
            inkCore.form()
            inkDrops.appear()
        }, null, 0.5)

        // 阶段2: 落笔 - 墨汁散开
        tl.to(camera.position, {
            x: 15,
            y: 30,
            z: 65,
            duration: 2,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '落笔错误'
            )
        }, 2.5)

        tl.call(() => {
            inkDrops.spread()
            inkMist.reveal()
        }, null, 3.5)

        // 阶段3: 润色 - 墨晕扩散
        tl.to(camera.position, {
            x: 10,
            y: 20,
            z: 50,
            duration: 2,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '润色错误'
            )
        }, 4.5)

        tl.call(() => {
            inkDrips.diffuse()
            inkMist.expand()
        }, null, 5.5)

        tl.to(camera, {
            fov: 95,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV变化错误'
            )
        }, 6)

        // 阶段4: 渲染 - 笔触加深
        tl.to(camera.position, {
            x: 8,
            y: 15,
            z: 40,
            duration: 2,
            ease: 'power1.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '渲染错误'
            )
        }, 6.8)

        tl.call(() => {
            inkDrips.deepen()
            inkFlow.begin()
        }, null, 8)

        // 阶段5: 晕染 - 墨韵流动
        tl.to(camera.position, {
            x: 5,
            y: 10,
            z: 30,
            duration: 2.5,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '晕染错误'
            )
        }, 8.8)

        tl.call(() => {
            inkCore.harmonize()
            inkDrips.flow()
            inkMist.swirl()
        }, null, 10.5)

        tl.to(camera, {
            fov: 105,
            duration: 0.5,
            ease: 'power3.in',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                '晕染冲击错误'
            )
        }, 10.5)

        // 阶段6: 留白 - 意境营造
        tl.to(camera.position, {
            x: 3,
            y: 7,
            z: 22,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '留白错误'
            )
        }, 11.3)

        tl.call(() => {
            inkDrips.fade()
            inkMist.enhance()
        }, null, 12.5)

        // 阶段7: 收尾 - 水墨大成
        tl.to(camera.position, {
            x: 1.5,
            y: 4,
            z: 15,
            duration: 2,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '收尾错误'
            )
        }, 13.3)

        tl.to(camera, {
            fov: 75,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 13)

        // 添加爆炸效果
        tl.call(() => {
            inkCore.explode()
        }, null, 14.5)

        // ========== 更新循环 ==========
        const updateHandler = async () => {
            const time = Date.now() * 0.001

            // 更新水墨核心
            inkCore.update(time)

            // 更新墨滴
            inkDrops.update(time)

            // 更新墨晕
            inkMist.update(time)

            // 更新水墨流动线
            inkFlow.update(time)

            // 如果使用 Taichi.js，更新水墨物理
            if (useTaichi && updateKernel) {
                try {
                    // 执行水墨物理 kernel
                    updateKernel()

                    // 获取计算结果
                    const taichiPositions = await positionsField.toArray1D()
                    const taichiColors = await colorsField.toArray1D()
                    const taichiOpacity = await opacityField.toArray1D()
                    const taichiSize = await sizeField.toArray1D()

                    // 更新墨滴粒子
                    if (inkDrops && inkDrops.geometry) {
                        const dropPositions = inkDrops.geometry.attributes.position.array
                        const dropColors = inkDrops.geometry.attributes.color.array
                        const dropOpacity = inkDrops.geometry.attributes.opacity.array
                        const dropSize = inkDrops.geometry.attributes.size.array

                        const count = Math.min(
                            taichiPositions.length / 3,
                            dropPositions.length / 3
                        )

                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3

                            // 应用水墨物理计算的位置
                            dropPositions[i3] = taichiPositions[i3] * 0.8
                            dropPositions[i3 + 1] = taichiPositions[i3 + 1] * 0.8
                            dropPositions[i3 + 2] = taichiPositions[i3 + 2] * 0.8

                            // 墨色浓度
                            dropColors[i3] = taichiColors[i3]
                            dropColors[i3 + 1] = taichiColors[i3 + 1]
                            dropColors[i3 + 2] = taichiColors[i3 + 2]

                            // 透明度（墨色深浅）
                            dropOpacity[i] = taichiOpacity[i]

                            // 笔触大小
                            dropSize[i] = taichiSize[i]
                        }

                        inkDrops.geometry.attributes.position.needsUpdate = true
                        inkDrops.geometry.attributes.color.needsUpdate = true
                        inkDrops.geometry.attributes.opacity.needsUpdate = true
                        inkDrops.geometry.attributes.size.needsUpdate = true
                    }

                    // 更新墨晕
                    if (inkMist && inkMist.geometry) {
                        const mistPositions = inkMist.geometry.attributes.position.array
                        const mistColors = inkMist.geometry.attributes.color.array
                        const offset = 30000
                        const count = Math.min(
                            (taichiPositions.length / 3) - offset,
                            mistPositions.length / 3
                        )

                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3
                            const tiIndex = offset + i
                            const ti3 = tiIndex * 3

                            mistPositions[i3] = taichiPositions[ti3] * 0.6
                            mistPositions[i3 + 1] = taichiPositions[ti3 + 1] * 0.6
                            mistPositions[i3 + 2] = taichiPositions[ti3 + 2] * 0.6

                            // 墨晕颜色更淡
                            mistColors[i3] = taichiColors[ti3] * 0.3 + 0.7
                            mistColors[i3 + 1] = taichiColors[ti3 + 1] * 0.3 + 0.7
                            mistColors[i3 + 2] = taichiColors[ti3 + 2] * 0.3 + 0.7
                        }

                        inkMist.geometry.attributes.position.needsUpdate = true
                        inkMist.geometry.attributes.color.needsUpdate = true
                    }

                } catch (error) {
                    console.warn('⚠️ 水墨 Taichi 更新失败:', error)
                }
            }
        }

        // 清理函数
        const cleanup = () => {
            console.log('🧹 清理水墨特效资源')
            inkCore.destroy()
            inkDrops.destroy()
            inkMist.destroy()
            inkFlow.destroy()

            positionsField = null
            velocitiesField = null
            colorsField = null
            opacityField = null
            sizeField = null
            initKernel = null
            updateKernel = null
        }

        tl.call(cleanup, null, 16)

        return { updateHandler }

    } catch (error) {
        console.error('❌ 水墨-Taichi.js 特效启动失败:', error)
        if (onError) onError(error)
        return null
    }
}

/**
 * 创建水墨核心 - 水墨莲花绽放效果（增强版）
 */
function createInkCore(scene) {
    const group = new THREE.Group()
    scene.add(group)

    // 爆炸粒子系统
    const explosionParticles = createExplosionSystem(scene)

    // 水墨莲心（多层花瓣）
    const petalCount = 8
    const petals = []
    const petalGeometries = []
    const petalMaterials = []

    for (let i = 0; i < petalCount; i++) {
        // 每片花瓣使用曲线形状
        const petalGeometry = new THREE.PlaneGeometry(6, 3, 32, 16)

        // 弯曲花瓣
        const positions = petalGeometry.attributes.position
        for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j)
            const y = positions.getY(j)

            // 花瓣弯曲效果
            const bend = Math.pow(y / 3, 2) * 2
            positions.setZ(j, bend)

            // 花瓣边缘卷曲
            const edgeFactor = Math.abs(x) / 3
            positions.setY(j, y * (1 - edgeFactor * 0.3))
        }

        petalGeometry.computeVertexNormals()

        const petalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uOpacity: { value: 0 },
                uAngleOffset: { value: (i / petalCount) * Math.PI * 2 },
                uExplode: { value: 0 }, // 爆炸强度
                uExplodeProgress: { value: 0 } // 爆炸进度
            },
            vertexShader: `
        precision highp float;
        uniform float uTime;
        uniform float uAngleOffset;
        uniform float uExplode;
        uniform float uExplodeProgress;
        varying vec3 vPosition;
        varying float vExplode;

        void main() {
          vPosition = position;
          vec3 pos = position;

          float openProgress = smoothstep(0.0, 1.0, uTime * 0.3);
          pos.x *= (0.2 + openProgress * 0.8);

          pos.x += sin(uTime * 3.0 + uAngleOffset) * 0.05;
          pos.y += cos(uTime * 2.5 + uAngleOffset) * 0.03;
          pos.z += sin(uTime * 2.0 + uAngleOffset) * 0.02;

          // 爆炸效果
          if (uExplodeProgress > 0.0) {
            float explodeStrength = uExplode * uExplodeProgress;
            vec3 explodeDir = normalize(pos);
            pos += explodeDir * explodeStrength * 20.0;
            
            // 添加随机扰动
            pos.x += sin(uTime * 5.0 + uAngleOffset * 2.0) * explodeStrength * 3.0;
            pos.y += cos(uTime * 4.0 + uAngleOffset * 1.5) * explodeStrength * 2.0;
            pos.z += sin(uTime * 6.0 + uAngleOffset * 2.5) * explodeStrength * 3.0;
          }

          float angle = uAngleOffset + openProgress * 0.5;
          float cosA = cos(angle);
          float sinA = sin(angle);

          vec3 rotatedPos;
          rotatedPos.x = pos.x * cosA - pos.z * sinA;
          rotatedPos.y = pos.y;
          rotatedPos.z = pos.x * sinA + pos.z * cosA;

          vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          vExplode = uExplodeProgress;
        }
      `,
            fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uExplode;
        uniform float uExplodeProgress;
        varying vec3 vPosition;
        varying float vExplode;

        void main() {
          float noise1 = sin(vPosition.x * 10.0 + uTime) * 0.5 + 0.5;
          float noise2 = cos(vPosition.y * 8.0 + uTime * 0.8) * 0.5 + 0.5;
          float noise = noise1 * noise2;

          vec3 inkColor = vec3(0.08 + noise * 0.05);
          
          // 爆炸时增加亮度
          if (uExplodeProgress > 0.5) {
            inkColor *= (1.0 + uExplodeProgress * 2.0);
          }
          
          float alpha = uOpacity * (0.5 + noise * 0.3);
          
          // 爆炸时增加透明度
          if (uExplodeProgress > 0.0) {
            alpha *= (1.0 - uExplodeProgress * 0.7);
          }

          gl_FragColor = vec4(inkColor, alpha);
        }
      `,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        })

        const petal = new THREE.Mesh(petalGeometry, petalMaterial)
        petal.rotation.x = Math.PI * 0.3  // 花瓣微微上翘
        group.add(petal)

        petals.push(petal)
        petalGeometries.push(petalGeometry)
        petalMaterials.push(petalMaterial)
    }

    // 莲心（花蕊）- 增强爆炸效果
    const centerGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const centerMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0 },
            uExplode: { value: 0 },
            uExplodeProgress: { value: 0 }
        },
        vertexShader: `
      precision highp float;
      uniform float uTime;
      uniform float uExplode;
      uniform float uExplodeProgress;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        
        vec3 pos = position;
        
        // 爆炸变形
        if (uExplodeProgress > 0.0) {
          float explodeStrength = uExplode * uExplodeProgress;
          vec3 explodeDir = normalize(pos);
          pos += explodeDir * explodeStrength * 15.0;
          
          // 添加脉冲效果
          pos *= (1.0 + sin(uTime * 10.0) * 0.1 * uExplodeProgress);
        }
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
        fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform float uOpacity;
      uniform float uExplode;
      uniform float uExplodeProgress;
      varying vec3 vPosition;

      void main() {
        float dist = length(vPosition);
        float noise = sin(dist * 20.0 + uTime * 2.0) * 0.1 + 0.9;

        vec3 inkColor = vec3(0.15 + noise * 0.05);
        
        // 爆炸时光芒效果
        if (uExplodeProgress > 0.0) {
          inkColor *= (1.0 + uExplodeProgress * 3.0);
        }
        
        float alpha = uOpacity * 0.8;
        
        // 爆炸时逐渐消失
        if (uExplodeProgress > 0.0) {
          alpha *= (1.0 - uExplodeProgress * 0.8);
        }

        gl_FragColor = vec4(inkColor, alpha);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
    const center = new THREE.Mesh(centerGeometry, centerMaterial)
    center.position.y = 1
    group.add(center)

    // 花蕊粒子
    const stamenCount = 12
    const stamens = []
    const stamenGeometries = []
    const stamenMaterials = []

    for (let i = 0; i < stamenCount; i++) {
        const angle = (i / stamenCount) * Math.PI * 2
        const stamenGeometry = new THREE.CylinderGeometry(0.05, 0.02, 3, 8)
        const stamenMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uOpacity: { value: 0 },
                uAngle: { value: angle },
                uExplode: { value: 0 },
                uExplodeProgress: { value: 0 }
            },
            vertexShader: `
        precision highp float;
        uniform float uTime;
        uniform float uAngle;
        uniform float uExplode;
        uniform float uExplodeProgress;
        varying vec3 vPosition;

        void main() {
          vPosition = position;

          vec3 pos = position;

          // 花蕊摇摆动画
          float sway = sin(uTime * 2.0 + uAngle) * 0.05;
          pos.x += sway * pos.y;
          pos.z += cos(uTime * 1.5 + uAngle) * 0.03 * pos.y;
          
          // 爆炸效果
          if (uExplodeProgress > 0.0) {
            float explodeStrength = uExplode * uExplodeProgress;
            vec3 explodeDir = normalize(pos);
            pos += explodeDir * explodeStrength * 25.0;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uExplode;
        uniform float uExplodeProgress;
        uniform float uAngle;
        varying vec3 vPosition;

        void main() {
          float y = vPosition.y;
          float progress = smoothstep(-1.5, 1.5, y);

          vec3 inkColor = vec3(0.1 + progress * 0.1);
          
          // 爆炸时光芒
          if (uExplodeProgress > 0.5) {
            inkColor *= (1.0 + uExplodeProgress);
          }
          
          float alpha = uOpacity * (0.6 + progress * 0.4);
          
          // 爆炸时透明度变化
          if (uExplodeProgress > 0.0) {
            alpha *= (1.0 - uExplodeProgress * 0.6);
          }

          gl_FragColor = vec4(inkColor, alpha);
        }
      `,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false
        })

        const stamen = new THREE.Mesh(stamenGeometry, stamenMaterial)
        stamen.position.set(
            Math.cos(angle) * 0.8,
            1,
            Math.sin(angle) * 0.8
        )
        stamen.rotation.z = Math.PI * 0.3
        stamen.rotation.y = angle
        group.add(stamen)

        stamens.push(stamen)
        stamenGeometries.push(stamenGeometry)
        stamenMaterials.push(stamenMaterial)
    }

    // 水墨雾气（周围氛围）
    const mistGeometry = new THREE.SphereGeometry(20, 32, 32)
    const mistMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0 },
            uExplode: { value: 0 },
            uExplodeProgress: { value: 0 }
        },
        vertexShader: `
      precision highp float;
      uniform float uTime;
      uniform float uExplode;
      uniform float uExplodeProgress;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        
        vec3 pos = position;
        
        // 爆炸时雾气扩散
        if (uExplodeProgress > 0.0) {
          float explodeStrength = uExplode * uExplodeProgress;
          vec3 explodeDir = normalize(pos);
          pos += explodeDir * explodeStrength * 40.0;
        }
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
        fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform float uOpacity;
      uniform float uExplode;
      uniform float uExplodeProgress;
      varying vec3 vPosition;

      void main() {
        float dist = length(vPosition) / 20.0;

        // 墨雾流动
        float noise = sin(vPosition.x * 0.5 + uTime) *
                     cos(vPosition.y * 0.5 + uTime * 0.7) *
                     sin(vPosition.z * 0.5 + uTime * 0.5);

        float alpha = uOpacity * (1.0 - dist) * 0.15 * (0.8 + noise * 0.2);
        
        // 爆炸时增强效果
        if (uExplodeProgress > 0.0) {
          alpha *= (1.0 + uExplodeProgress * 2.0);
        }

        gl_FragColor = vec4(vec3(0.05), alpha);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
    const mist = new THREE.Mesh(mistGeometry, mistMaterial)
    group.add(mist)

    return {
        group,
        explosionParticles,
        form() {
            // 花瓣绽放
            petalMaterials.forEach((material, i) => {
                gsap.to(material.uniforms.uOpacity, {
                    value: 1,
                    duration: 2,
                    delay: i * 0.1
                })
            })

            // 莲心显现
            gsap.to(centerMaterial.uniforms.uOpacity, {
                value: 1,
                duration: 1.5,
                delay: 0.8
            })

            // 花蕊生长
            stamenMaterials.forEach((material, i) => {
                gsap.to(material.uniforms.uOpacity, {
                    value: 1,
                    duration: 1.5,
                    delay: 1.0 + i * 0.05
                })
            })

            // 墨雾扩散
            gsap.to(mistMaterial.uniforms.uOpacity, {
                value: 1,
                duration: 2.5,
                delay: 0.3
            })
        },
        harmonize() {
            // 花瓣轻颤
            group.scale.setScalar(1.1)
            gsap.to(group.scale, {
                x: 1, y: 1, z: 1,
                duration: 2,
                yoyo: true,
                repeat: 1
            })

            // 莲心光芒
            gsap.to(centerMaterial.uniforms.uOpacity, {
                value: 1.2,
                duration: 1,
                yoyo: true,
                repeat: 1
            })
        },
        explode() {
            // 触发爆炸效果
            gsap.to([centerMaterial.uniforms.uExplode, ...petalMaterials.map(m => m.uniforms.uExplode), ...stamenMaterials.map(m => m.uniforms.uExplode), mistMaterial.uniforms.uExplode], {
                value: 1,
                duration: 0.8,
                ease: "power2.inOut"
            })

            // 爆炸进度动画
            gsap.to([centerMaterial.uniforms.uExplodeProgress, ...petalMaterials.map(m => m.uniforms.uExplodeProgress), ...stamenMaterials.map(m => m.uniforms.uExplodeProgress), mistMaterial.uniforms.uExplodeProgress], {
                value: 1,
                duration: 1.2,
                ease: "power2.in",
                onComplete: () => {
                    // 爆炸后隐藏对象
                    center.visible = false
                    petals.forEach(p => p.visible = false)
                    stamens.forEach(s => s.visible = false)
                    mist.visible = false

                    // 启动爆炸粒子效果
                    if (this.explosionParticles) {
                        this.explosionParticles.explode()
                    }
                }
            })
        },
        finalize() {
            // 收缩
            gsap.to(group.scale, {
                x: 0.9, y: 0.9, z: 0.9,
                duration: 1.5
            })

            // 淡化
            petalMaterials.forEach(material => {
                gsap.to(material.uniforms.uOpacity, { value: 0.8, duration: 1 })
            })
            gsap.to(centerMaterial.uniforms.uOpacity, { value: 0.9, duration: 1 })
            gsap.to(mistMaterial.uniforms.uOpacity, { value: 0.8, duration: 1 })
        },
        update(time) {
            // 更新所有 uniforms
            petals.forEach((petal, i) => {
                petalMaterials[i].uniforms.uTime.value = time
            })
            centerMaterial.uniforms.uTime.value = time
            stamens.forEach((stamen, i) => {
                stamenMaterials[i].uniforms.uTime.value = time
            })
            mistMaterial.uniforms.uTime.value = time

            // 整体旋转
            group.rotation.y = time * 0.15

            // 上下浮动
            group.position.y = Math.sin(time * 0.5) * 0.3

            // 更新爆炸粒子系统
            if (this.explosionParticles) {
                this.explosionParticles.update(time)
            }
        },
        destroy() {
            scene.remove(group)

            petals.forEach((petal, i) => {
                petalGeometries[i].dispose()
                petalMaterials[i].dispose()
            })

            centerGeometry.dispose()
            centerMaterial.dispose()

            stamens.forEach((stamen, i) => {
                stamenGeometries[i].dispose()
                stamenMaterials[i].dispose()
            })

            mistGeometry.dispose()
            mistMaterial.dispose()

            // 销毁爆炸粒子系统
            if (this.explosionParticles) {
                this.explosionParticles.destroy()
            }
        }
    }
}

/**
 * 创建爆炸粒子系统
 */
function createExplosionSystem(scene) {
    const group = new THREE.Group()
    scene.add(group)

    const particleCount = 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    // 初始化粒子数据
    for (let i = 0; i < particleCount; i++) {
        // 随机位置（从中心向外）
        const radius = Math.random() * 2
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.cos(phi)
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

        // 颜色（墨色变化）
        const density = Math.random()
        colors[i * 3] = density * 0.1
        colors[i * 3 + 1] = density * 0.1
        colors[i * 3 + 2] = density * 0.1

        // 大小
        sizes[i] = 0.1 + Math.random() * 0.5

        // 初始速度（向外爆炸）
        const speed = 0.5 + Math.random() * 2
        velocities[i * 3] = positions[i * 3] * speed
        velocities[i * 3 + 1] = positions[i * 3 + 1] * speed
        velocities[i * 3 + 2] = positions[i * 3 + 2] * speed
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uAlpha: { value: 0 }  // 确保这个 uniform 存在
        },
        vertexShader: `
        precision highp float;
        attribute float size;
        attribute vec3 color;
        uniform float uTime;
        uniform float uAlpha;  // ✅ 添加缺失的 uniform 声明
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            vColor = color;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            vAlpha = uAlpha;  // 现在可以正常使用
        }
    `,
        fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
            
            gl_FragColor = vec4(vColor, alpha);
        }
    `,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false
    })


    const particles = new THREE.Points(geometry, material)
    group.add(particles)

    let isActive = false
    let startTime = 0

    return {
        group,
        particles,
        geometry,
        material,
        explode() {
            isActive = true
            startTime = performance.now()
            material.uniforms.uAlpha.value = 1
        },
        update(time) {
            if (!isActive) return

            const elapsed = (performance.now() - startTime) / 1000

            // 更新粒子位置
            const positionsArray = geometry.attributes.position.array
            const velocitiesArray = velocities

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3

                // 应用速度
                positionsArray[i3] += velocitiesArray[i3] * 0.016
                positionsArray[i3 + 1] += velocitiesArray[i3 + 1] * 0.016
                positionsArray[i3 + 2] += velocitiesArray[i3 + 2] * 0.016

                // 添加重力效果
                velocitiesArray[i3 + 1] -= 0.001

                // 添加随机扰动
                positionsArray[i3] += (Math.random() - 0.5) * 0.01
                positionsArray[i3 + 1] += (Math.random() - 0.5) * 0.01
                positionsArray[i3 + 2] += (Math.random() - 0.5) * 0.01
            }

            geometry.attributes.position.needsUpdate = true

            // 随时间减小透明度
            const alpha = Math.max(0, 1 - elapsed * 0.8)
            material.uniforms.uAlpha.value = alpha

            // 5秒后停止
            if (elapsed > 5) {
                isActive = false
                material.uniforms.uAlpha.value = 0
            }
        },
        destroy() {
            scene.remove(group)
            geometry.dispose()
            material.dispose()
        }
    }
}

/**
 * 创建墨滴粒子系统
 */
function createInkDrops(scene, options) {
    const { particleCount = 30000, useTaichi = false } = options

    const group = new THREE.Group()
    scene.add(group)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const opacity = new Float32Array(particleCount)
    const size = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
        // 墨滴分布
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = Math.random() * 10

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.cos(phi)
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

        // 墨色（浓墨到淡墨）
        const inkDensity = Math.random()
        colors[i * 3] = inkDensity * 0.15
        colors[i * 3 + 1] = inkDensity * 0.15
        colors[i * 3 + 2] = inkDensity * 0.15

        // 透明度（墨色深浅）
        opacity[i] = 0.2 + inkDensity * 0.6

        // 笔触大小
        size[i] = 0.3 + Math.random() * 1.5

        // 相位（用于动画）
        phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1))
    geometry.setAttribute('size', new THREE.BufferAttribute(size, 1))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

    // 自定义着色器材质 - 水墨笔触效果
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uGlobalOpacity: { value: 0 },
            uTime: { value: 0 }
        },
        vertexShader: `
      precision highp float;
      attribute vec3 color;
      attribute float opacity;
      attribute float size;
      attribute float phase;
      varying float vOpacity;
      varying float vPhase;
      varying vec3 vColor;

      void main() {
        vOpacity = opacity;
        vPhase = phase;
        vColor = color;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
        fragmentShader: `
      precision highp float;
      uniform float uGlobalOpacity;
      uniform float uTime;
      varying float vOpacity;
      varying float vPhase;
      varying vec3 vColor;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        if (dist > 0.5) discard;

        float inkEdge = smoothstep(0.5, 0.0, dist);
        float alpha = vOpacity * uGlobalOpacity * inkEdge;

        float inkPulse = sin(vPhase + uTime) * 0.1 + 0.9;

        gl_FragColor = vec4(vColor * inkPulse, alpha);
      }
    `,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false
    })

    const particles = new THREE.Points(geometry, material)
    group.add(particles)

    let spreadFactor = 1.0
    let flowSpeed = 0.0

    return {
        group,
        particles,
        geometry,
        appear() {
            gsap.to(material.uniforms.uGlobalOpacity, { value: 1, duration: 2 })
        },
        spread() {
            spreadFactor = 2.0
        },
        diffuse() {
            spreadFactor = 3.0
        },
        deepen() {
            const colors = geometry.attributes.color.array
            for (let i = 0; i < particleCount; i++) {
                colors[i * 3] *= 0.7
                colors[i * 3 + 1] *= 0.7
                colors[i * 3 + 2] *= 0.7
            }
            geometry.attributes.color.needsUpdate = true
        },
        flow() {
            flowSpeed = 1.0
        },
        fade() {
            gsap.to(material.uniforms.uGlobalOpacity, { value: 0.4, duration: 2 })
        },
        update(time) {
            material.uniforms.uTime.value = time

            const positions = geometry.attributes.position.array
            const phases = geometry.attributes.phase.array

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3
                const phase = phases[i]

                // 墨汁流动
                positions[i3] += Math.sin(time * 0.5 + phase) * 0.01 * spreadFactor
                positions[i3 + 1] += Math.cos(time * 0.3 + phase) * 0.005
                positions[i3 + 2] += Math.sin(time * 0.4 + phase) * 0.01 * spreadFactor
            }

            geometry.attributes.position.needsUpdate = true

            group.rotation.y += flowSpeed * 0.01
            group.rotation.x = Math.sin(time * 0.2) * 0.05
        },
        destroy() {
            scene.remove(group)
            geometry.dispose()
            material.dispose()
        }
    }
}

/**
 * 创建墨晕层
 */
function createInkMist(scene, options) {
    const { particleCount = 15000 } = options

    const group = new THREE.Group()
    scene.add(group)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
        // 墨晕分布（更广范围）
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 20 + Math.random() * 60

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.cos(phi)
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

        // 墨晕颜色（非常淡）
        const mistDensity = Math.random() * 0.1
        colors[i * 3] = mistDensity
        colors[i * 3 + 1] = mistDensity
        colors[i * 3 + 2] = mistDensity
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 2.0,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })

    const particles = new THREE.Points(geometry, material)
    group.add(particles)

    return {
        group,
        particles,
        geometry,
        reveal() {
            gsap.to(material, { opacity: 0.3, duration: 2.5 })
        },
        expand() {
            const positions = geometry.attributes.position.array
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] *= 1.3
                positions[i * 3 + 1] *= 1.3
                positions[i * 3 + 2] *= 1.3
            }
            geometry.attributes.position.needsUpdate = true
        },
        swirl() {
            gsap.to(material, { opacity: 0.5, duration: 1 })
        },
        enhance() {
            const colors = geometry.attributes.color.array
            for (let i = 0; i < particleCount; i++) {
                colors[i * 3] *= 0.8
                colors[i * 3 + 1] *= 0.8
                colors[i * 3 + 2] *= 0.8
            }
            geometry.attributes.color.needsUpdate = true
        },
        update(time) {
            group.rotation.y = time * 0.08
            group.rotation.x = Math.sin(time * 0.15) * 0.1
        },
        destroy() {
            scene.remove(group)
            geometry.dispose()
            material.dispose()
        }
    }
}

/**
 * 创建水墨流动线
 */
function createInkFlow(scene) {
    const group = new THREE.Group()
    scene.add(group)

    const curves = []
    const lineMaterials = []

    // 创建多条水墨流动线
    for (let i = 0; i < 20; i++) {
        const points = []
        const segments = 50

        for (let j = 0; j < segments; j++) {
            const t = j / segments
            const angle = t * Math.PI * 4 + i * 0.3
            const radius = 15 + t * 40

            points.push(new THREE.Vector3(
                radius * Math.cos(angle),
                Math.sin(t * Math.PI * 2 + i) * 10,
                radius * Math.sin(angle)
            ))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0x111111,
            transparent: true,
            opacity: 0,
            linewidth: 1
        })

        const curveLine = new THREE.Line(curveGeometry, curveMaterial)
        group.add(curveLine)

        curves.push({ line: curveLine, curve, originalPoints: points })
        lineMaterials.push(curveMaterial)
    }

    return {
        group,
        begin() {
            lineMaterials.forEach((material, i) => {
                gsap.to(material, {
                    opacity: 0.3 + Math.random() * 0.2,
                    duration: 1.5,
                    delay: i * 0.05
                })
            })
        },
        update(time) {
            curves.forEach((curveObj, i) => {
                // 动态更新曲线点
                const points = curveObj.originalPoints.map((point, j) => {
                    const t = j / curveObj.originalPoints.length
                    const waveOffset = Math.sin(time * 2 + i + j * 0.2) * 2

                    return new THREE.Vector3(
                        point.x + Math.cos(time + i) * waveOffset,
                        point.y + Math.sin(time * 1.5 + i) * waveOffset * 0.5,
                        point.z + Math.sin(time + i) * waveOffset
                    )
                })

                const newCurve = new THREE.CatmullRomCurve3(points)
                curveObj.line.geometry.dispose()
                curveObj.line.geometry = new THREE.BufferGeometry().setFromPoints(newCurve.getPoints(100))
            })

            group.rotation.y = time * 0.05
        },
        destroy() {
            scene.remove(group)
            curves.forEach(curveObj => {
                curveObj.line.geometry.dispose()
                curveObj.line.material.dispose()
            })
        }
    }
}
