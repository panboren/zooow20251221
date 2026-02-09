/**
 * 青春绚丽-Taichi.js 特效
 *
 * 设计理念：
 * - 青春色彩：明亮活泼的色彩搭配
 * - 动态粒子：活力四射的粒子系统
 * - 光影效果：绚丽的光影变化
 * - 几何变换：动态几何体变形
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../animations/utils.js';
import { getAdaptiveParticleCount, getDeviceTier } from '../animations/device-detection.js';
import { logger } from '../animations/logger.js';

/**
 * 青春绚丽特效主函数
 * @param {Object} props - 动画属性 { camera, renderer, scene, controls }
 * @param {Object} callbacks - 回调函数 { onComplete, onError }
 */
export default async function animateYouthThree(props, callbacks) {
    const { camera, renderer, scene, controls } = props;
    const { onComplete, onError } = callbacks || {};

    logger.log('🎬 启动青春绚丽-Taichi.js 特效');

    // 检测设备性能并设置粒子数量
    const deviceTier = getDeviceTier();
    const PARTICLE_COUNT = getAdaptiveParticleCount('youth', deviceTier);

    // Taichi.js 相关
    let ti = null;
    let useTaichi = false;

    // Taichi 字段
    let positionsField = null;
    let velocitiesField = null;
    let colorsField = null;
    let sizeField = null;

    // Taichi kernels
    let initKernel = null;
    let updateKernel = null;

    try {
        // ========== 步骤1: 加载和初始化 Taichi.js ==========
        logger.log('📦 步骤 1/4: 加载 Taichi.js...');

        // 从全局 window 对象获取 Taichi 工具
        const taichiUtils = typeof window !== 'undefined' ? window.__TAICHI_UTILS__ : null;

        if (!taichiUtils || !taichiUtils.isReady || !taichiUtils.isReady()) {
            logger.warn('⚠️ Taichi.js 未初始化，使用 JavaScript 模拟');
            useTaichi = false;
        } else {
            try {
                ti = taichiUtils.getModule();
                logger.log('✅ Taichi.js 加载成功');

                useTaichi = true;
            } catch (error) {
                logger.warn('⚠️ Taichi.js 获取失败，使用 JavaScript 模拟:', error.message);
                useTaichi = false;
            }
        }

        // ========== 步骤2: 创建 Taichi 字段和 Kernels（青春物理）==========
        if (useTaichi && ti) {
            logger.log('🔨 步骤 2/4: 创建青春 Taichi 字段和 Kernels...');

            try {
                await new Promise(resolve => setTimeout(resolve, 200));

                // 检查Taichi实例是否仍然有效
                if (!ti.Vector) {
                    throw new Error('Taichi实例已失效');
                }

                // 青春专用字段
                positionsField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                velocitiesField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                colorsField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                sizeField = ti.field(ti.f32, [PARTICLE_COUNT]);

                logger.log('✅ 青春 Taichi 字段创建成功');

                // 青春常量 - 将 PARTICLE_COUNT 作为常量添加到 kernel scope
                ti.addToKernelScope({
                    positions: positionsField,
                    velocities: velocitiesField,
                    colors: colorsField,
                    size: sizeField,
                    PARTICLE_COUNT: PARTICLE_COUNT // 添加常量
                });

                logger.log('✅ 青春 Kernel scope 设置完成');

                // 初始化内核 - 创建青春粒子
                initKernel = ti.kernel(() => {
                    for (let i of ti.range(PARTICLE_COUNT)) {
                        // 青春粒子从中心随机分布
                        const angle = ti.random() * 6.28318;
                        const radius = ti.random() * 3.0;
                        const height = (ti.random() - 0.5) * 2.0;

                        positions[i] = [
                            radius * ti.cos(angle),
                            height,
                            radius * ti.sin(angle)
                        ];

                        // 初始速度（青春活力扩散速度）
                        const spreadSpeed = 0.3 + ti.random() * 0.8;
                        velocities[i] = [
                            ti.cos(angle) * spreadSpeed,
                            (ti.random() - 0.5) * 0.5,
                            ti.sin(angle) * spreadSpeed
                        ];

                        // 青春色彩（彩虹色系） - 内联HSL转RGB逻辑
                        const hue = ti.random();
                        const saturation = 0.7 + ti.random() * 0.3;
                        const lightness = 0.4 + ti.random() * 0.4;

                        // HSL to RGB 转换逻辑 - 修复Taichi.js语法
                        // Taichi.js不支持let r, g, b; 需要单独声明每个变量
                        let r = 0.0;
                        let g = 0.0;
                        let b = 0.0;

                        if (saturation === 0) {
                            r = lightness; // achromatic
                            g = lightness;
                            b = lightness;
                        } else {
                            const hue2rgb = (p, q, t) => {
                                let temp_t = t;
                                if (temp_t < 0) temp_t += 1;
                                if (temp_t > 1) temp_t -= 1;

                                // 修复：避免在条件分支中使用return
                                let result = p; // 默认返回值

                                if (temp_t < 1/6) {
                                    result = p + (q - p) * 6 * temp_t;
                                } else if (temp_t < 1/2) {
                                    result = q;
                                } else if (temp_t < 2/3) {
                                    result = p + (q - p) * (2/3 - temp_t) * 6;
                                }
                                // 否则保持默认值 p

                                return result;
                            };

                            // 修复：使用if-else替代三元运算符
                            let q = 0.0;
                            let p = 0.0;

                            if (lightness < 0.5) {
                                q = lightness * (1 + saturation);
                            } else {
                                q = lightness + saturation - lightness * saturation;
                            }

                            p = 2 * lightness - q;

                            r = hue2rgb(p, q, hue + 1/3);
                            g = hue2rgb(p, q, hue);
                            b = hue2rgb(p, q, hue - 1/3);
                        }

                        colors[i] = [r, g, b];

                        // 粒子大小
                        size[i] = 0.8 + ti.random() * 1.5;
                    }
                });

                // 更新内核 - 青春粒子物理
                updateKernel = ti.kernel(() => {
                    for (let i of ti.range(PARTICLE_COUNT)) {
                        // 更新位置
                        positions[i][0] += velocities[i][0] * 0.016;
                        positions[i][1] += velocities[i][1] * 0.016;
                        positions[i][2] += velocities[i][2] * 0.016;

                        // 青春活力阻力
                        velocities[i][0] *= 0.99;
                        velocities[i][1] *= 0.99;
                        velocities[i][2] *= 0.99;

                        // 随机活力（青春律动）
                        velocities[i][0] += (ti.random() - 0.5) * 0.03;
                        velocities[i][1] += (ti.random() - 0.5) * 0.02;
                        velocities[i][2] += (ti.random() - 0.5) * 0.03;

                        // 边界反弹（青春活力无限）
                        const x = positions[i][0];
                        const y = positions[i][1];
                        const z = positions[i][2];
                        const dist = ti.sqrt(x * x + y * y + z * z);

                        if (dist > 100.0) {
                            velocities[i][0] *= -0.9;
                            velocities[i][1] *= -0.9;
                            velocities[i][2] *= -0.9;
                        }

                        // 粒子大小变化（青春绽放）
                        size[i] += 0.0005;
                        if (size[i] > 3.0) {
                            size[i] = 3.0;
                        }
                    }
                });

                logger.log('✅ 青春 Taichi Kernels 编译完成');

                // 执行初始化
                initKernel();
                logger.log('✅ 青春初始化执行完成');

            } catch (error) {
                logger.warn('⚠️ 青春 Taichi 字段或 Kernels 创建失败，降级到 JavaScript:', error.message);
                useTaichi = false;
            }
        }

        // ========== 步骤3: 初始化 Three.js 青春场景 ==========
        logger.log('🎨 步骤 3/4: 初始化青春场景...');

        // 初始设置 - 远距离俯瞰
        setupInitialCamera(camera, new THREE.Vector3(0, 50, 100), 85, controls);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);

        // 创建青春核心
        const youthCore = createYouthCore(scene);

        // 创建青春粒子系统
        const youthParticles = createYouthParticles(scene, {
            particleCount: PARTICLE_COUNT,
            useTaichi,
            positionsField,
            colorsField,
            sizeField
        });

        // 创建青春光束
        const youthBeams = createYouthBeams(scene);

        // 创建青春几何体
        const youthGeometry = createYouthGeometry(scene);

        // 创建青春光晕
        const youthGlow = createYouthGlow(scene);

        logger.log('✅ 青春场景创建完成');

        // ========== 步骤4: 创建青春动画时间轴 ==========
        logger.log('⏱️  步骤 4/4: 创建青春动画时间轴...');

        const tl = createTimeline(
            () => {
                cleanup();
                if (onComplete) onComplete({ type: 'youth-three' });
            },
            onError,
            '青春绚丽-Taichi.js 特效',
            controls
        );

        logger.log('✅ 青春动画时间轴创建完成');

        // ========== 青春动画阶段 ==========

        // 阶段1: 青春萌芽
        tl.to(camera.position, {
            x: 15,
            y: 30,
            z: 60,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春萌芽错误'
            )
        });

        tl.call(() => {
            youthCore.bloom();
            youthParticles.appear();
        }, null, 0.3);

        // 阶段2: 青春绽放
        tl.to(camera.position, {
            x: 10,
            y: 20,
            z: 45,
            duration: 1.2,
            ease: 'power1.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春绽放错误'
            )
        }, 1.5);

        tl.call(() => {
            youthParticles.spread();
            youthBeams.activate();
        }, null, 2);

        // 阶段3: 青春律动
        tl.to(camera.position, {
            x: 5,
            y: 15,
            z: 35,
            duration: 1,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春律动错误'
            )
        }, 2.7);

        tl.call(() => {
            youthGeometry.animate();
            youthParticles.vibrate();
        }, null, 3.2);

        tl.to(camera, {
            fov: 100,
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV变化错误'
            )
        }, 3.5);

        // 阶段4: 青春狂欢
        tl.to(camera.position, {
            x: 3,
            y: 10,
            z: 25,
            duration: 1.2,
            ease: 'power1.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春狂欢错误'
            )
        }, 4);

        tl.call(() => {
            youthParticles.intensify();
            youthBeams.intensify();
            youthGlow.brighten();
        }, null, 4.5);

        // 阶段5: 青春升华
        tl.to(camera.position, {
            x: 1,
            y: 5,
            z: 15,
            duration: 1,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春升华错误'
            )
        }, 5.2);

        tl.call(() => {
            youthCore.ascend();
            youthGeometry.transform();
            youthParticles.explode();
        }, null, 5.7);

        tl.to(camera, {
            fov: 110,
            duration: 0.8,
            ease: 'power3.in',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV冲击错误'
            )
        }, 6);

        // 阶段6: 青春爆炸 - 白色球体炸裂
        tl.call(() => {
            logger.log('🎆 阶段6: 青春爆炸！');
            youthCore.explode();

            // 添加相机震动效果
            gsap.to(camera.position, {
                x: camera.position.x + 0.5,
                y: camera.position.y + 0.5,
                z: camera.position.z + 0.5,
                duration: 0.05,
                yoyo: true,
                repeat: 5,
                ease: 'power1.inOut'
            });
        }, null, 6.8);

        // 阶段7: 青春永恒
        tl.to(camera.position, {
            x: 0.5,
            y: 2,
            z: 8,
            duration: 1.5,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '青春永恒错误'
            )
        }, 6.8);

        tl.to(camera, {
            fov: 75,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 8);

        // ========== 更新循环 ==========
        let lastTaichiUpdate = 0;
        const TAIICHI_UPDATE_INTERVAL = 16; // ~60fps 限制更新频率

        const updateHandler = async () => {
            const time = Date.now() * 0.001;

            // 更新青春核心
            youthCore?.update(time);

            // 更新青春粒子
            youthParticles?.update(time);

            // 更新青春光束
            youthBeams?.update(time);

            // 更新青春几何体
            youthGeometry?.update(time);

            // 更新青春光晕
            youthGlow?.update(time);

            // 如果使用 Taichi.js，更新青春物理（限制更新频率以提升性能）
            if (useTaichi && updateKernel && time - lastTaichiUpdate >= TAIICHI_UPDATE_INTERVAL / 1000) {
                try {
                    lastTaichiUpdate = time;

                    // 执行青春物理 kernel
                    updateKernel();

                    // 获取计算结果（使用 Promise.all 并行获取）
                    const [taichiPositions, taichiColors, taichiSize] = await Promise.all([
                        positionsField.toArray1D(),
                        colorsField.toArray1D(),
                        sizeField.toArray1D()
                    ]);

                    // 更新青春粒子
                    if (youthParticles?.geometry) {
                        const particlePositions = youthParticles.geometry.attributes.position.array;
                        const particleColors = youthParticles.geometry.attributes.color.array;
                        const particleSize = youthParticles.geometry.attributes.size.array;

                        const count = Math.min(
                            taichiPositions.length / 3,
                            particlePositions.length / 3
                        );

                        // 批量更新位置数据
                        const scale = 0.9;
                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3;

                            // 应用青春物理计算的位置
                            particlePositions[i3] = taichiPositions[i3] * scale;
                            particlePositions[i3 + 1] = taichiPositions[i3 + 1] * scale;
                            particlePositions[i3 + 2] = taichiPositions[i3 + 2] * scale;

                            // 青春色彩
                            particleColors[i3] = taichiColors[i3];
                            particleColors[i3 + 1] = taichiColors[i3 + 1];
                            particleColors[i3 + 2] = taichiColors[i3 + 2];

                            // 粒子大小
                            particleSize[i] = taichiSize[i];
                        }

                        youthParticles.geometry.attributes.position.needsUpdate = true;
                        youthParticles.geometry.attributes.color.needsUpdate = true;
                        youthParticles.geometry.attributes.size.needsUpdate = true;
                    }

                } catch (error) {
                    logger.warn('⚠️ 青春 Taichi 更新失败:', error);
                }
            }
        };

        // 清理函数
        const cleanup = () => {
            logger.log('🧹 清理青春特效资源');
            youthCore?.destroy();
            youthParticles?.destroy();
            youthBeams?.destroy();
            youthGeometry?.destroy();
            youthGlow?.destroy();

            // 清理 Taichi 资源
            if (positionsField?.destroy) positionsField.destroy();
            if (velocitiesField?.destroy) velocitiesField.destroy();
            if (colorsField?.destroy) colorsField.destroy();
            if (sizeField?.destroy) sizeField.destroy();

            positionsField = null;
            velocitiesField = null;
            colorsField = null;
            sizeField = null;
            initKernel = null;
            updateKernel = null;
        };

        tl.call(cleanup, null, 18);

        return { updateHandler };

    } catch (error) {
        logger.error('❌ 青春绚丽-Taichi.js 特效启动失败:', error);
        if (onError) onError(error);
        return null;
    }
}

/**
 * HSL to RGB 转换函数
 */
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b];
}

/**
 * 创建青春核心 - 彩虹球体绽放效果（增强爆炸）
 */
function createYouthCore(scene) {
    const group = new THREE.Group();
    scene.add(group);

    // 青春核心球体（镂空五颜六色）
    const coreBaseGeometry = new THREE.IcosahedronGeometry(5, 3);

    // 将几何体转换为线框模式（镂空效果）
    const wireframeGeometry = new THREE.WireframeGeometry(coreBaseGeometry);
    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 1.0 }
        },
        vertexShader: `
            precision highp float;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float uTime;

            void main() {
                vPosition = position;
                vNormal = normal;

                vec3 pos = position;

                // 添加脉动效果
                float pulse = sin(uTime * 4.0) * 0.08;
                pos += normal * pulse;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float uTime;
            uniform float uOpacity;

            // HSL 到 RGB 转换函数
            vec3 hsl2rgb(float h, float s, float l) {
                float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
                float p = 2.0 * l - q;

                float r = p;
                float g = p;
                float b = p;

                float t = h;
                if (t < 0.0) t += 1.0;
                if (t > 1.0) t -= 1.0;

                if (t < 1.0/6.0) r += (q - p) * 6.0 * t;
                else if (t < 1.0/2.0) r = q;
                else if (t < 2.0/3.0) r += (q - p) * (2.0/3.0 - t) * 6.0;

                t = h + 1.0/3.0;
                if (t < 0.0) t += 1.0;
                if (t > 1.0) t -= 1.0;

                if (t < 1.0/6.0) g += (q - p) * 6.0 * t;
                else if (t < 1.0/2.0) g = q;
                else if (t < 2.0/3.0) g += (q - p) * (2.0/3.0 - t) * 6.0;

                t = h - 1.0/3.0;
                if (t < 0.0) t += 1.0;
                if (t > 1.0) t -= 1.0;

                if (t < 1.0/6.0) b += (q - p) * 6.0 * t;
                else if (t < 1.0/2.0) b = q;
                else if (t < 2.0/3.0) b += (q - p) * (2.0/3.0 - t) * 6.0;

                return vec3(r, g, b);
            }

            void main() {
                // 基于位置创建彩虹渐变
                vec3 pos = normalize(vPosition);
                float hue = (atan(pos.z, pos.x) / 6.28318) + uTime * 0.25;

                // 非常鲜艳的饱和度和高亮度
                float saturation = 1.0;
                float lightness = 0.65;

                // HSL 到 RGB 转换
                vec3 color = hsl2rgb(hue, saturation, lightness);

                // 添加 fresnel 效果（边缘发光）
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

                // 添加动态光效
                float glow = sin(uTime * 3.0 + pos.x * 5.0) *
                            cos(uTime * 2.5 + pos.y * 5.0) * 0.5;
                color += vec3(glow * 0.3);

                // 边缘更亮更鲜艳
                color = mix(color, vec3(1.0, 1.0, 1.0), fresnel * 0.6);

                // 强烈的透明度（线框效果）
                float alpha = uOpacity * (0.4 + fresnel * 0.6);

                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const core = new THREE.LineSegments(wireframeGeometry, coreMaterial);
    group.add(core);

    // 青春光环（多层）
    const rings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(8 + i * 3, 0.5, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / 3, 1, 0.6),
            transparent: true,
            opacity: 0.5 - i * 0.1,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + i * 0.2;
        ring.rotation.z = i * 0.3;
        group.add(ring);
        rings.push({ mesh: ring, material: ringMaterial, geometry: ringGeometry });
    }

    // 青春光点阵列
    const lightPoints = [];
    const lightGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 12;
        const lightMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            emissive: new THREE.Color(Math.random(), Math.random(), Math.random()),
            roughness: 0.2,
            metalness: 0.8
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.7) * 3,
            Math.sin(angle) * radius
        );
        group.add(light);
        lightPoints.push(light);
    }

    // 爆炸碎片系统
    const explosionSystem = createCoreExplosionSystem(scene);
    const shockwave = createShockwaveSystem(scene);

    return {
        group,
        core,
        rings,
        lightPoints,
        explosionSystem,
        shockwave,
        bloom() {
            // 青春绽放动画
            gsap.to(core.scale, {
                x: 1.3, y: 1.3, z: 1.3,
                duration: 2,
                yoyo: true,
                repeat: 2,
                ease: 'power2.inOut'
            });

            // 增强透明度动画
            gsap.to(coreMaterial.uniforms.uOpacity, {
                value: 1.0,
                duration: 1.5,
                yoyo: true,
                repeat: 2
            });

            // 光环闪烁
            rings.forEach((ringObj, i) => {
                gsap.to(ringObj.material, {
                    opacity: 0.8,
                    duration: 1,
                    delay: i * 0.2,
                    yoyo: true,
                    repeat: 2
                });
            });

            // 光点闪烁
            lightPoints.forEach((light, i) => {
                gsap.to(light.scale, {
                    x: 1.5, y: 1.5, z: 1.5,
                    duration: 0.8,
                    delay: i * 0.1,
                    yoyo: true,
                    repeat: 3
                });
            });
        },
        ascend() {
            // 青春升华动画
            gsap.to(group.rotation, {
                x: Math.PI / 4,
                y: Math.PI / 2,
                duration: 3,
                ease: 'power2.inOut'
            });
        },
        explode() {
            // 强烈爆炸效果
            logger.log('💥 触发青春核心爆炸！');

            // 核心剧烈脉动
            gsap.to(core.scale, {
                x: 2.5, y: 2.5, z: 2.5,
                duration: 0.3,
                ease: 'power4.in',
                onComplete: () => {
                    // 爆炸后核心消失
                    gsap.to(coreMaterial.uniforms.uOpacity, {
                        value: 0,
                        duration: 0.2
                    });
                    core.visible = false;

                    // 触发爆炸粒子系统
                    explosionSystem.trigger();
                    shockwave.trigger();
                }
            });

            // 光环破碎效果
            rings.forEach((ringObj, i) => {
                gsap.to(ringObj.mesh.scale, {
                    x: 3, y: 3, z: 3,
                    duration: 0.5,
                    ease: 'power2.in',
                    delay: i * 0.05
                });
                gsap.to(ringObj.material, {
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.05
                });
            });

            // 光点爆发
            lightPoints.forEach((light, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 20;

                gsap.to(light.position, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    z: Math.cos(angle * 0.5) * distance,
                    duration: 1.5,
                    ease: 'power2.out'
                });

                gsap.to(light.material, {
                    opacity: 0,
                    duration: 1.2
                });

                gsap.to(light.scale, {
                    x: 3, y: 3, z: 3,
                    duration: 1,
                    ease: 'power2.out'
                });
            });
        },
        update(time) {
            // 青春核心旋转
            group.rotation.y = time * 0.5;
            group.rotation.x = Math.sin(time * 0.3) * 0.2;

            // 更新核心着色器 uniform
            if (core.visible) {
                coreMaterial.uniforms.uTime.value = time;
            }

            // 光环旋转
            rings.forEach((ringObj, i) => {
                ringObj.mesh.rotation.z = time * (0.5 + i * 0.2);
            });

            // 光点脉动
            lightPoints.forEach((light, i) => {
                light.scale.x = 1 + Math.sin(time * 2 + i) * 0.3;
                light.scale.y = 1 + Math.sin(time * 2 + i) * 0.3;
                light.scale.z = 1 + Math.sin(time * 2 + i) * 0.3;
            });

            // 更新爆炸系统
            explosionSystem.update(time);
            shockwave.update(time);
        },
        destroy() {
            scene.remove(group);
            coreBaseGeometry.dispose();
            wireframeGeometry.dispose();
            coreMaterial.dispose();
            rings.forEach(ringObj => {
                ringObj.geometry.dispose();
                ringObj.material.dispose();
            });
            lightPoints.forEach(light => {
                light.geometry.dispose();
                light.material.dispose();
            });
            explosionSystem.destroy();
            shockwave.destroy();
        }
    };
}

/**
 * 创建核心爆炸碎片系统
 */
function createCoreExplosionSystem(scene) {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // 初始位置在中心
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // 随机方向爆炸速度
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 5 + Math.random() * 15;

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.cos(phi) * speed;
        velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

        // 白色到彩虹色的渐变
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();

        sizes[i] = 0.5 + Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uActive: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float size;
            uniform float uTime;
            uniform float uActive;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                vColor = color;
                vAlpha = uActive;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (400.0 / -mvPosition.z) * uActive;
                gl_Position = projectionMatrix * mvPosition;
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

                // 发光效果
                float glow = pow(1.0 - dist, 2.0);
                vec3 finalColor = mix(vColor, vec3(1.0), glow * 0.7);

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let isActive = false;
    let startTime = 0;

    return {
        trigger() {
            isActive = true;
            startTime = performance.now();
            material.uniforms.uActive.value = 1;
        },
        update(time) {
            if (!isActive) return;

            const elapsed = (performance.now() - startTime) / 1000;
            const positionsArray = geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                // 应用速度
                positionsArray[i3] += velocities[i3] * 0.016;
                positionsArray[i3 + 1] += velocities[i3 + 1] * 0.016;
                positionsArray[i3 + 2] += velocities[i3 + 2] * 0.016;

                // 阻力
                velocities[i3] *= 0.99;
                velocities[i3 + 1] *= 0.99;
                velocities[i3 + 2] *= 0.99;
            }

            geometry.attributes.position.needsUpdate = true;

            // 随时间淡出
            const alpha = Math.max(0, 1 - elapsed * 0.8);
            material.uniforms.uActive.value = alpha;

            if (elapsed > 2) {
                isActive = false;
            }
        },
        destroy() {
            scene.remove(points);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建冲击波系统
 */
function createShockwaveSystem(scene) {
    const ringCount = 5;
    const rings = [];

    for (let i = 0; i < ringCount; i++) {
        const geometry = new THREE.RingGeometry(5, 6, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.visible = false;
        scene.add(ring);
        rings.push({ mesh: ring, geometry, material });
    }

    let isActive = false;
    let startTime = 0;

    return {
        trigger() {
            isActive = true;
            startTime = performance.now();

            rings.forEach((ringObj, i) => {
                ringObj.mesh.visible = true;
                ringObj.mesh.scale.set(1, 1, 1);
                ringObj.material.opacity = 1;
            });
        },
        update(time) {
            if (!isActive) return;

            const elapsed = (performance.now() - startTime) / 1000;

            rings.forEach((ringObj, i) => {
                const delay = i * 0.15;
                const ringTime = elapsed - delay;

                if (ringTime > 0 && ringTime < 2) {
                    const progress = ringTime / 2;

                    // 扩散效果
                    const scale = 1 + progress * 20;
                    ringObj.mesh.scale.set(scale, scale, scale);

                    // 旋转效果
                    ringObj.mesh.rotation.z = progress * Math.PI * 2;

                    // 淡出效果
                    ringObj.material.opacity = 1 - progress;

                    // 颜色从白色渐变到彩色
                    const hue = (time * 0.5 + i * 0.2) % 1;
                    ringObj.material.color.setHSL(hue, 1, 0.7);
                } else if (ringTime >= 2) {
                    ringObj.mesh.visible = false;
                }
            });

            if (elapsed > 3) {
                isActive = false;
            }
        },
        destroy() {
            rings.forEach(ringObj => {
                scene.remove(ringObj.mesh);
                ringObj.geometry.dispose();
                ringObj.material.dispose();
            });
        }
    };
}

/**
 * 创建青春粒子系统
 */
function createYouthParticles(scene, options) {
    const { particleCount = 30000, useTaichi = false } = options;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // 青春粒子分布
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 8;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.cos(phi);
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

        // 青春色彩（彩虹色系）
        const hue = Math.random();
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.4 + Math.random() * 0.4;
        const hsl = hslToRgb(hue, saturation, lightness);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];

        // 粒子大小
        size[i] = 0.5 + Math.random() * 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(size, 1));

    // 自定义着色器材质 - 青春粒子效果
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalOpacity: { value: 0 },
            uIntensity: { value: 1 }
        },
        vertexShader: `
      precision highp float;
      attribute vec3 color;
      attribute float size;
      uniform float uTime;
      uniform float uGlobalOpacity;
      uniform float uIntensity;
      varying vec3 vColor;

      void main() {
        vColor = color;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * uIntensity;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
        fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform float uGlobalOpacity;
      varying vec3 vColor;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        if (dist > 0.5) discard;

        float particleEdge = smoothstep(0.5, 0.0, dist);
        float alpha = uGlobalOpacity * particleEdge;

        // 添加发光效果
        float glow = pow(1.0 - dist, 3.0);
        vec3 finalColor = mix(vColor, vec3(1.0), glow * 0.5);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    let spreadFactor = 1.0;
    let intensity = 1.0;

    return {
        group,
        particles,
        geometry,
        appear() {
            gsap.to(material.uniforms.uGlobalOpacity, { value: 1, duration: 2.5 });
        },
        spread() {
            spreadFactor = 2.0;
        },
        vibrate() {
            // 青春律动
            group.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;
        },
        intensify() {
            gsap.to(material.uniforms.uIntensity, { value: 2, duration: 1 });
        },
        explode() {
            // 粒子爆炸效果
            gsap.to(material.uniforms.uIntensity, {
                value: 3,
                duration: 1.5,
                yoyo: true,
                repeat: 1
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;

            // 只在需要时更新粒子位置
            if (spreadFactor > 1.0) {
                const positions = geometry.attributes.position.array;
                const time08 = time * 0.8;
                const time06 = time * 0.6;
                const time07 = time * 0.7;
                const spreadSpeed = 0.01 * spreadFactor;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;

                    // 青春律动
                    positions[i3] += Math.sin(time08 + i * 0.01) * spreadSpeed;
                    positions[i3 + 1] += Math.cos(time06 + i * 0.01) * spreadSpeed;
                    positions[i3 + 2] += Math.sin(time07 + i * 0.01) * spreadSpeed;
                }

                geometry.attributes.position.needsUpdate = true;
            }

            group.rotation.y += 0.002 * spreadFactor;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建青春光束
 */
function createYouthBeams(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const beams = [];
    const beamCount = 8;

    for (let i = 0; i < beamCount; i++) {
        const angle = (i / beamCount) * Math.PI * 2;
        const direction = new THREE.Vector3(
            Math.cos(angle),
            0,
            Math.sin(angle)
        ).normalize();

        // 创建圆柱形光束
        const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 50, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });

        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(
            Math.cos(angle) * 10,
            0,
            Math.sin(angle) * 10
        );

        // 旋转使圆柱沿径向方向
        beam.lookAt(new THREE.Vector3(0, 0, 0));
        beam.rotateX(Math.PI / 2);
        beam.rotateZ(angle);

        group.add(beam);
        beams.push(beam);
    }

    return {
        group,
        beams,
        activate() {
            beams.forEach((beam, i) => {
                gsap.to(beam.material, {
                    opacity: 0.7,
                    duration: 2,
                    delay: i * 0.2
                });
            });
        },
        intensify() {
            beams.forEach(beam => {
                gsap.to(beam.material, {
                    opacity: 1,
                    duration: 1,
                    yoyo: true,
                    repeat: 3
                });
            });
        },
        update(time) {
            const colorOffset = 0.01;

            beams.forEach((beam, i) => {
                // 光束脉动效果
                const pulse = Math.sin(time * 2 + i) * 0.2 + 1;
                beam.scale.y = pulse;

                // 光束颜色变化（减少频率以优化性能）
                if (Math.floor(time * 60) % 2 === 0) {
                    beam.material.color.offsetHSL(colorOffset, 0, 0);
                }
            });
        },
        destroy() {
            scene.remove(group);
            beams.forEach(beam => {
                beam.geometry.dispose();
                beam.material.dispose();
            });
        }
    };
}

/**
 * 创建青春几何体
 */
function createYouthGeometry(scene) {
    const group = new THREE.Group();
    scene.add(group);

    // 创建多个动态几何体
    const geometries = [];
    const geometryCount = 5;

    for (let i = 0; i < geometryCount; i++) {
        // 随机选择几何体类型
        let geometry;
        switch(i % 4) {
            case 0:
                geometry = new THREE.OctahedronGeometry(2, 0);
                break;
            case 1:
                geometry = new THREE.DodecahedronGeometry(2, 0);
                break;
            case 2:
                geometry = new THREE.IcosahedronGeometry(2, 0);
                break;
            case 3:
                geometry = new THREE.TetrahedronGeometry(2, 0);
                break;
        }

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            wireframe: true,
            emissive: new THREE.Color(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2),
            roughness: 0.5,
            metalness: 0.5
        });

        const geo = new THREE.Mesh(geometry, material);
        geo.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 15
        );
        geo.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        group.add(geo);
        geometries.push(geo);
    }

    return {
        group,
        geometries,
        animate() {
            geometries.forEach((geo, i) => {
                gsap.to(geo.rotation, {
                    x: Math.PI * 2,
                    y: Math.PI * 2,
                    duration: 4,
                    ease: 'power2.inOut',
                    repeat: -1,
                    yoyo: true
                });
            });
        },
        transform() {
            // 几何体变形动画
            geometries.forEach((geo, i) => {
                gsap.to(geo.scale, {
                    x: 1.5, y: 1.5, z: 1.5,
                    duration: 2,
                    ease: 'elastic.out(1, 0.3)',
                    yoyo: true,
                    repeat: 1
                });
            });
        },
        update(time) {
            geometries.forEach((geo, i) => {
                // 青春律动
                geo.position.y = Math.sin(time * 0.8 + i) * 0.5;

                // 颜色脉动
                geo.material.emissive.offsetHSL(0.005, 0, 0);
            });
        },
        destroy() {
            scene.remove(group);
            geometries.forEach(geo => {
                geo.geometry.dispose();
                geo.material.dispose();
            });
        }
    };
}

/**
 * 创建青春光晕
 */
function createYouthGlow(scene) {
    const group = new THREE.Group();
    scene.add(group);

    // 创建多个光晕层
    const glows = [];
    const glowCount = 3;

    for (let i = 0; i < glowCount; i++) {
        const glowGeometry = new THREE.SphereGeometry(15 + i * 5, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uOpacity: { value: 0 },
                uColor: { value: new THREE.Color(Math.random(), Math.random(), Math.random()) }
            },
            vertexShader: `
        precision highp float;
        uniform float uTime;
        varying vec3 vNormal;

        void main() {
          vNormal = normal;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec3 vNormal;

        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 glowColor = uColor * intensity;
          gl_FragColor = vec4(glowColor, intensity * uOpacity * 0.3);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 0, 0);
        group.add(glow);
        glows.push(glow);
    }

    return {
        group,
        glows,
        brighten() {
            glows.forEach((glow, i) => {
                gsap.to(glow.material.uniforms.uOpacity, {
                    value: 0.8,
                    duration: 2,
                    delay: i * 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });
        },
        update(time) {
            glows.forEach((glow, i) => {
                glow.material.uniforms.uTime.value = time;

                // 光晕脉动
                const scale = 1 + Math.sin(time * 0.5 + i) * 0.1;
                glow.scale.set(scale, scale, scale);

                // 颜色变化（减少频率）
                if (Math.floor(time * 60) % 3 === 0) {
                    glow.material.uniforms.uColor.value.offsetHSL(0.002, 0, 0);
                }
            });
        },
        destroy() {
            scene.remove(group);
            glows.forEach(glow => {
                glow.geometry.dispose();
                glow.material.dispose();
            });
        }
    };
}
