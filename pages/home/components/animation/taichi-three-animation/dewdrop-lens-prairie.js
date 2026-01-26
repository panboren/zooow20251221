/**
 * 露珠透镜草原-Taichi.js 特效
 *
 * 设计理念：
 * - 高海拔草甸清晨：每片草叶托举一颗完美露珠
 * - 复合透镜系统：亿万露珠形成天然活体光谱仪
 * - 光线分解重组：晨曦被露珠聚焦，投射虹彩光斑
 * - 生物荧光激活：光斑激活地衣发出荧光
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../animations/utils.js';

/**
 * 露珠透镜草原特效主函数
 */
export default async function animateDewdropLens(props, callbacks) {
    const { camera, renderer, scene, controls } = props;
    const { onComplete, onError } = callbacks || {};

    console.log('💧 启动露珠透镜草原-Taichi.js 特效');

    // Taichi.js 相关
    let ti = null;
    let useTaichi = false;

    // Taichi 字段
    let dewdropField = null;
    let dewdropVelField = null;
    let grassField = null;
    let lightField = null;
    let fluorescenceField = null;

    // Taichi kernels
    let initKernel = null;
    let updateKernel = null;

    // 粒子数量
    const GRASS_COUNT = 40000;
    const DEWDROP_COUNT = 40000;

    try {
        // ========== 步骤1: 加载和初始化 Taichi.js ==========
        console.log('📦 步骤 1/5: 加载 Taichi.js...');

        const { $loadTaichi, $initTaichi } = useNuxtApp();

        try {
            ti = await $loadTaichi();
            console.log('✅ Taichi.js 加载成功');

            await $initTaichi(ti);
            console.log('✅ Taichi.js 初始化成功');

            if (!ti || typeof ti.Vector !== 'object') {
                console.warn('⚠️ Taichi.js 实例无效，使用 JavaScript 模拟');
                useTaichi = false;
            } else {
                useTaichi = true;
            }
        } catch (error) {
            console.warn('⚠️ Taichi.js 加载或初始化失败，使用 JavaScript 模拟:', error.message);
            useTaichi = false;
        }

        // ========== 步骤2: 创建 Taichi 字段和 Kernels（露珠透镜物理）==========
        if (useTaichi && ti) {
            console.log('🔨 步骤 2/5: 创建露珠透镜 Taichi 字段和 Kernels...');

            try {
                await new Promise(resolve => setTimeout(resolve, 200));

                if (!ti.Vector) {
                    throw new Error('Taichi实例已失效');
                }

                // 露珠透镜专用字段
                dewdropField = ti.Vector.field(3, ti.f32, [DEWDROP_COUNT]);
                dewdropVelField = ti.Vector.field(3, ti.f32, [DEWDROP_COUNT]);
                grassField = ti.Vector.field(3, ti.f32, [GRASS_COUNT]);
                lightField = ti.Vector.field(3, ti.f32, [DEWDROP_COUNT]);
                fluorescenceField = ti.field(ti.f32, [DEWDROP_COUNT]);

                console.log('✅ 露珠透镜 Taichi 字段创建成功');

                ti.addToKernelScope({
                    dewdropPositions: dewdropField,
                    dewdropVelocities: dewdropVelField,
                    grassPositions: grassField,
                    lightColors: lightField,
                    fluorescence: fluorescenceField,
                    DEWDROP_COUNT: DEWDROP_COUNT,
                    GRASS_COUNT: GRASS_COUNT
                });

                console.log('✅ 露珠透镜 Kernel scope 设置完成');

                // 初始化内核 - 创建草地和露珠
                initKernel = ti.kernel(() => {
                    // 初始化草叶
                    for (let i of ti.range(GRASS_COUNT)) {
                        const x = (ti.random() - 0.5) * 80.0;
                        const z = (ti.random() - 0.5) * 80.0;
                        const height = 1.5 + ti.random() * 2.5;

                        grassPositions[i] = [x, height * 0.5, z];
                    }

                    // 初始化露珠
                    for (let i of ti.range(DEWDROP_COUNT)) {
                        const idx = i % GRASS_COUNT;
                        const grass = grassPositions[idx];

                        dewdropPositions[i] = [
                            grass[0],
                            grass[1] + 0.6 + ti.random() * 0.4,
                            grass[2]
                        ];

                        // 露珠微动
                        dewdropVelocities[i] = [
                            (ti.random() - 0.5) * 0.005,
                            ti.random() * 0.005,
                            (ti.random() - 0.5) * 0.005
                        ];

                        // 光谱颜色（基于高度）
                        const hue = 0.5 + dewdropPositions[i][1] * 0.03;
                        lightColors[i] = [
                            ti.sin(hue * 6.28318) * 0.5 + 0.5,
                            ti.sin((hue + 0.333) * 6.28318) * 0.5 + 0.5,
                            ti.sin((hue + 0.667) * 6.28318) * 0.5 + 0.5
                        ];

                        // 荧光强度
                        fluorescence[i] = 0.0;
                    }
                });

                // 更新内核 - 露珠透镜物理
                updateKernel = ti.kernel(() => {
                    for (let i of ti.range(DEWDROP_COUNT)) {
                        // 露珠微动（风吹效果）
                        dewdropPositions[i][0] += dewdropVelocities[i][0] * 0.016;
                        dewdropPositions[i][1] += dewdropVelocities[i][1] * 0.016;
                        dewdropPositions[i][2] += dewdropVelocities[i][2] * 0.016;

                        // 回弹效果
                        const idx = i % GRASS_COUNT;
                        const grass = grassPositions[idx];
                        const targetY = grass[1] + 0.7;
                        dewdropPositions[i][1] += (targetY - dewdropPositions[i][1]) * 0.03;

                        // 光谱偏移（基于时间和位置）
                        const timeOffset = dewdropPositions[i][0] * 0.008 + dewdropPositions[i][2] * 0.008;
                        const hue = (0.5 + dewdropPositions[i][1] * 0.03 + timeOffset) % 1.0;

                        lightColors[i][0] = ti.sin(hue * 6.28318) * 0.5 + 0.5;
                        lightColors[i][1] = ti.sin((hue + 0.333) * 6.28318) * 0.5 + 0.5;
                        lightColors[i][2] = ti.sin((hue + 0.667) * 6.28318) * 0.5 + 0.5;

                        // 荧光激活
                        if (dewdropPositions[i][1] > 2.0) {
                            fluorescence[i] = 1.0;
                        } else {
                            fluorescence[i] *= 0.99;
                        }
                    }
                });

                console.log('✅ 露珠透镜 Taichi Kernels 编译完成');

                initKernel();
                console.log('✅ 露珠透镜初始化执行完成');

            } catch (error) {
                console.warn('⚠️ 露珠透镜 Taichi 字段或 Kernels 创建失败，降级到 JavaScript:', error.message);
                useTaichi = false;
            }
        }

        // ========== 步骤3: 初始化 Three.js 露珠透镜场景 ==========
        console.log('🎨 步骤 3/5: 初始化露珠透镜场景...');

        // 初始设置 - 低角度晨曦视角
        setupInitialCamera(camera, new THREE.Vector3(0, 3, 75), 50, controls);
        camera.lookAt(0, 2, 0);
        renderer.render(scene, camera);

        // 创建草地系统
        const prairieGrass = createPrairieGrass(scene);

        // 创建露珠系统
        const dewdrops = createDewdrops(scene, {
            dewdropCount: DEWDROP_COUNT,
            useTaichi,
            dewdropField,
            lightField,
            fluorescenceField
        });

        // 创建晨曦光源
        const morningSun = createMorningSun(scene);

        // 创建光斑系统
        const lightSpots = createLightSpots(scene);

        // 创建荧光地衣
        const fluorescentLichen = createFluorescentLichen(scene);

        // 创建氛围雾气
        const morningFog = createMorningFog(scene);

        console.log('✅ 露珠透镜场景创建完成');

        // ========== 步骤4: 创建露珠透镜动画时间轴 ==========
        console.log('⏱️  步骤 4/5: 创建露珠透镜动画时间轴...');

        const tl = createTimeline(
            () => {
                cleanup();
                if (onComplete) onComplete({ type: 'dewdrop-lens-prairie' });
            },
            onError,
            '露珠透镜草原-Taichi.js 特效',
            controls
        );

        console.log('✅ 露珠透镜动画时间轴创建完成');

        // ========== 露珠透镜动画阶段 ==========

        // 阶段1: 晨曦微露 - 清晨朦胧
        tl.to(camera.position, {
            x: 4,
            y: 2,
            z: 65,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 1.5, 0),
                '晨曦微露错误'
            )
        });

        tl.call(() => {
            morningFog.appear();
            prairieGrass.sway();
        }, null, 0.3);

        // 阶段2: 露珠初现 - 晶莹剔透
        tl.to(camera.position, {
            x: 3,
            y: 1.5,
            z: 55,
            duration: 1.2,
            ease: 'power1.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 2, 0),
                '露珠初现错误'
            )
        }, 1.5);

        tl.call(() => {
            morningSun.rise();
            dewdrops.appear();
        }, null, 2);

        // 阶段3: 光谱绽放 - 七彩流光
        tl.to(camera.position, {
            x: 2,
            y: 1.2,
            z: 45,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 2.5, 0),
                '光谱绽放错误'
            )
        }, 2.7);

        tl.call(() => {
            dewdrops.shimmer();
            lightSpots.activate();
        }, null, 3.2);

        // 阶段4: 光斑舞动 - 移动虹彩
        tl.to(camera.position, {
            x: 1,
            y: 1,
            z: 38,
            duration: 1.0,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 3, 0),
                '光斑舞动错误'
            )
        }, 3.9);

        tl.call(() => {
            lightSpots.dance();
            fluorescentLichen.glow();
        }, null, 4.2);

        // 阶段5: 荧光激活 - 生物光效
        tl.to(camera.position, {
            x: 0,
            y: 0.8,
            z: 33,
            duration: 0.8,
            ease: 'power1.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 2.5, 0),
                '荧光激活错误'
            )
        }, 4.9);

        tl.call(() => {
            dewdrops.intensify();
            fluorescentLichen.bloom();
        }, null, 5.5);

        // 阶段6: 活体光谱仪 - 辉煌时刻
        tl.to(camera.position, {
            x: 0,
            y: 0.6,
            z: 28,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 2, 0),
                '活体光谱仪错误'
            )
        }, 5.7);

        tl.to(camera, {
            fov: 45,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV扩展错误'
            )
        }, 6.8);

        tl.call(() => {
            lightSpots.pulse();
            morningFog.clear();
        }, null, 7.8);

        // 阶段7: 晨光渐逝 - 余韵悠长
        tl.to(camera.position, {
            x: 0,
            y: 0.5,
            z: 30,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 2, 0),
                '晨光渐逝错误'
            )
        }, 8.6);

        tl.to(camera, {
            fov: 50,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 9.8);

        tl.call(() => {
            dewdrops.fade();
            lightSpots.fade();
            fluorescentLichen.fade();
        }, null, 9.5);

        // ========== 更新循环 ==========
        let lastTaichiUpdate = 0;
        const TAIICHI_UPDATE_INTERVAL = 16;

        const updateHandler = async () => {
            const time = Date.now() * 0.001;

            // 更新所有元素
            prairieGrass?.update(time);
            dewdrops?.update(time);
            morningSun?.update(time);
            lightSpots?.update(time);
            fluorescentLichen?.update(time);
            morningFog?.update(time);

            // 如果使用 Taichi.js，更新物理
            if (useTaichi && updateKernel && time - lastTaichiUpdate >= TAIICHI_UPDATE_INTERVAL / 1000) {
                try {
                    lastTaichiUpdate = time;
                    updateKernel();

                    const [dewdropPositions, lightColors, fluorescence] = await Promise.all([
                        dewdropField.toArray1D(),
                        lightField.toArray1D(),
                        fluorescenceField.toArray1D()
                    ]);

                    if (dewdrops?.geometry) {
                        const particlePositions = dewdrops.geometry.attributes.position.array;
                        const particleColors = dewdrops.geometry.attributes.color.array;
                        const particleFluorescence = dewdrops.geometry.attributes.fluorescence.array;

                        const count = Math.min(
                            dewdropPositions.length / 3,
                            particlePositions.length / 3
                        );

                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3;
                            particlePositions[i3] = dewdropPositions[i3];
                            particlePositions[i3 + 1] = dewdropPositions[i3 + 1];
                            particlePositions[i3 + 2] = dewdropPositions[i3 + 2];
                            particleColors[i3] = lightColors[i3];
                            particleColors[i3 + 1] = lightColors[i3 + 1];
                            particleColors[i3 + 2] = lightColors[i3 + 2];
                            particleFluorescence[i] = fluorescence[i];
                        }

                        dewdrops.geometry.attributes.position.needsUpdate = true;
                        dewdrops.geometry.attributes.color.needsUpdate = true;
                        dewdrops.geometry.attributes.fluorescence.needsUpdate = true;
                    }

                } catch (error) {
                    console.warn('⚠️ 露珠透镜 Taichi 更新失败:', error);
                }
            }
        };

        // 清理函数
        const cleanup = () => {
            console.log('🧹 清理露珠透镜特效资源');
            prairieGrass?.destroy();
            dewdrops?.destroy();
            morningSun?.destroy();
            lightSpots?.destroy();
            fluorescentLichen?.destroy();
            morningFog?.destroy();

            if (dewdropField?.destroy) dewdropField.destroy();
            if (dewdropVelField?.destroy) dewdropVelField.destroy();
            if (grassField?.destroy) grassField.destroy();
            if (lightField?.destroy) lightField.destroy();
            if (fluorescenceField?.destroy) fluorescenceField.destroy();

            dewdropField = null;
            dewdropVelField = null;
            grassField = null;
            lightField = null;
            fluorescenceField = null;
            initKernel = null;
            updateKernel = null;
        };

        tl.call(cleanup, null, 12);

        return { updateHandler };

    } catch (error) {
        console.error('❌ 露珠透镜草原-Taichi.js 特效启动失败:', error);
        if (onError) onError(error);
        return null;
    }
}

/**
 * 创建草地系统
 */
function createPrairieGrass(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const grassCount = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(grassCount * 3);
    const colors = new Float32Array(grassCount * 3);

    for (let i = 0; i < grassCount; i++) {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const y = (Math.random() * 0.5) + 0.3;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // 绿色渐变
        const greenTone = 0.3 + Math.random() * 0.4;
        colors[i * 3] = 0.1 + greenTone * 0.2;
        colors[i * 3 + 1] = 0.5 + greenTone * 0.5;
        colors[i * 3 + 2] = 0.1 + greenTone * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
    });

    const grass = new THREE.Points(geometry, material);
    group.add(grass);

    return {
        group,
        grass,
        geometry,
        sway() {
            // 草地摇摆动画
            gsap.to(group.rotation, {
                z: 0.05,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });
        },
        update(time) {
            const positionsArray = geometry.attributes.position.array;
            
            for (let i = 0; i < grassCount; i++) {
                const i3 = i * 3;
                const wave = Math.sin(time * 1.5 + positionsArray[i3] * 0.1) * 0.05;
                positionsArray[i3 + 1] = (Math.random() * 0.5 + 0.3) + wave;
            }
            
            geometry.attributes.position.needsUpdate = true;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建露珠系统
 */
function createDewdrops(scene, options) {
    const { dewdropCount = 40000, useTaichi = false } = options;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dewdropCount * 3);
    const colors = new Float32Array(dewdropCount * 3);
    const fluorescence = new Float32Array(dewdropCount);
    const sizes = new Float32Array(dewdropCount);

    for (let i = 0; i < dewdropCount; i++) {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const y = 1.5 + Math.random() * 1.5;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // 初始颜色 - 淡青色
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.9;

        fluorescence[i] = 0;
        sizes[i] = 0.3 + Math.random() * 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('fluorescence', new THREE.BufferAttribute(fluorescence, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalAlpha: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float fluorescence;
            attribute float size;
            uniform float uTime;
            uniform float uGlobalAlpha;
            varying vec3 vColor;
            varying float vFluorescence;

            void main() {
                vColor = color;
                vFluorescence = fluorescence * uGlobalAlpha;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + fluorescence * 0.5);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            varying float vFluorescence;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) discard;

                float edge = smoothstep(0.5, 0.0, dist);
                float glow = pow(1.0 - dist, 2.0);

                vec3 baseColor = vColor;
                vec3 glowColor = vec3(0.8, 0.95, 1.0) * vFluorescence;

                vec3 finalColor = mix(baseColor, glowColor, vFluorescence) + vec3(glow * 0.3);

                float alpha = edge * (0.7 + vFluorescence * 0.3);

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dewdrops = new THREE.Points(geometry, material);
    group.add(dewdrops);

    return {
        group,
        dewdrops,
        geometry,
        appear() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.0,
                duration: 2
            });
        },
        shimmer() {
            // 露珠闪烁效果
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.2,
                duration: 0.5,
                yoyo: true,
                repeat: 3
            });
        },
        intensify() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.5,
                duration: 1,
                yoyo: true,
                repeat: 1
            });
        },
        fade() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 0,
                duration: 3
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;
            group.rotation.y = time * 0.01;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建晨曦光源
 */
function createMorningSun(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            varying vec3 vNormal;
            uniform float uTime;

            void main() {
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vNormal;
            uniform float uTime;
            uniform float uIntensity;

            void main() {
                vec3 normal = normalize(vNormal);
                float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), 2.0);

                vec3 sunColor = vec3(1.0, 0.85, 0.6);
                vec3 haloColor = vec3(1.0, 0.95, 0.8);

                float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
                vec3 finalColor = mix(sunColor, haloColor, fresnel) * pulse * uIntensity;

                gl_FragColor = vec4(finalColor, uIntensity * 0.9);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 40, -100);
    sun.visible = false;
    group.add(sun);

    return {
        group,
        sun,
        rise() {
            sun.visible = true;
            gsap.to(sun.position, {
                y: 35,
                duration: 3,
                ease: 'power2.out'
            });
            gsap.to(sunMaterial.uniforms.uIntensity, {
                value: 1.0,
                duration: 2
            });
        },
        update(time) {
            sunMaterial.uniforms.uTime.value = time;
            sun.rotation.z = time * 0.05;
        },
        destroy() {
            scene.remove(group);
            sunGeometry.dispose();
            sunMaterial.dispose();
        }
    };
}

/**
 * 创建光斑系统
 */
function createLightSpots(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const spotCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(spotCount * 3);
    const colors = new Float32Array(spotCount * 3);
    const sizes = new Float32Array(spotCount);

    for (let i = 0; i < spotCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = 0.1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

        // 彩虹色
        const hue = Math.random();
        const hsl = hslToRgb(hue, 0.9, 0.6);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];

        sizes[i] = 1 + Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalAlpha: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float size;
            uniform float uTime;
            uniform float uGlobalAlpha;
            varying vec3 vColor;

            void main() {
                vColor = color;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            uniform float uGlobalAlpha;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) discard;

                float edge = smoothstep(0.5, 0.0, dist);
                float glow = pow(1.0 - dist, 3.0);

                vec3 finalColor = vColor + vec3(glow * 0.5);

                gl_FragColor = vec4(finalColor, uGlobalAlpha * edge);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const spots = new THREE.Points(geometry, material);
    group.add(spots);

    return {
        group,
        spots,
        geometry,
        activate() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.0,
                duration: 1.5
            });
        },
        dance() {
            // 光斑舞动
            const positionsArray = geometry.attributes.position.array;
            
            for (let i = 0; i < spotCount; i++) {
                const i3 = i * 3;
                const angle = Math.atan2(positionsArray[i3 + 2], positionsArray[i3]);
                const radius = Math.sqrt(positionsArray[i3] ** 2 + positionsArray[i3 + 2] ** 2);
                
                positionsArray[i3] = Math.cos(angle + 0.5) * radius;
                positionsArray[i3 + 2] = Math.sin(angle + 0.5) * radius;
            }
            
            geometry.attributes.position.needsUpdate = true;
        },
        pulse() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.3,
                duration: 0.8,
                yoyo: true,
                repeat: 2
            });
        },
        fade() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 0,
                duration: 2.5
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;
            group.rotation.y = time * 0.02;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建荧光地衣
 */
function createFluorescentLichen(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const lichenCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lichenCount * 3);
    const colors = new Float32Array(lichenCount * 3);

    for (let i = 0; i < lichenCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = 0.05;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        // 生物荧光色 - 绿蓝紫
        const hue = 0.4 + Math.random() * 0.3;
        const hsl = hslToRgb(hue, 0.9, 0.5);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const lichen = new THREE.Points(geometry, material);
    group.add(lichen);

    return {
        group,
        lichen,
        glow() {
            gsap.to(material, {
                opacity: 0.8,
                duration: 2
            });
        },
        bloom() {
            gsap.to(material, {
                opacity: 1.0,
                size: 0.8,
                duration: 1.5,
                yoyo: true,
                repeat: 2
            });
        },
        fade() {
            gsap.to(material, {
                opacity: 0,
                duration: 2
            });
        },
        update(time) {
            const colorsArray = geometry.attributes.color.array;
            
            for (let i = 0; i < lichenCount; i++) {
                const i3 = i * 3;
                const hueShift = Math.sin(time + i * 0.01) * 0.01;
                const currentHue = Math.atan2(
                    Math.sqrt(3) * (colorsArray[i3 + 1] - colorsArray[i3 + 2]),
                    2 * colorsArray[i3] - colorsArray[i3 + 1] - colorsArray[i3 + 2]
                ) / (2 * Math.PI);
                
                const hsl = hslToRgb(currentHue + hueShift, 0.9, 0.5);
                colorsArray[i3] = hsl[0];
                colorsArray[i3 + 1] = hsl[1];
                colorsArray[i3 + 2] = hsl[2];
            }
            
            geometry.attributes.color.needsUpdate = true;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建氛围雾气
 */
function createMorningFog(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const fogGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const fogMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            varying vec2 vUv;
            uniform float uTime;

            void main() {
                vUv = uv;
                
                vec3 pos = position;
                pos.z += sin(pos.x * 0.1 + uTime) * 2.0;
                pos.z += cos(pos.y * 0.1 + uTime) * 2.0;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            uniform float uTime;
            uniform float uOpacity;

            void main() {
                float noise = sin(vUv.x * 10.0 + uTime) * sin(vUv.y * 10.0 + uTime);
                vec3 fogColor = vec3(0.7, 0.8, 0.9);
                
                float alpha = uOpacity * (0.3 + noise * 0.2);
                
                gl_FragColor = vec4(fogColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const fog = new THREE.Mesh(fogGeometry, fogMaterial);
    fog.rotation.x = -Math.PI / 2;
    fog.position.y = 2;
    group.add(fog);

    return {
        group,
        fog,
        appear() {
            gsap.to(fogMaterial.uniforms.uOpacity, {
                value: 0.6,
                duration: 3
            });
        },
        clear() {
            gsap.to(fogMaterial.uniforms.uOpacity, {
                value: 0,
                duration: 4
            });
        },
        update(time) {
            fogMaterial.uniforms.uTime.value = time;
        },
        destroy() {
            scene.remove(group);
            fogGeometry.dispose();
            fogMaterial.dispose();
        }
    };
}

/**
 * HSL转RGB辅助函数
 */
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
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
