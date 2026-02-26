import * as THREE from 'three';
import gsap from 'gsap';

/**
 * 撒豆成兵特效
 * 分身光流与军阵光效
 * 包含四个阶段：玉符炸裂 → 人形虚影 → 军阵攻击 → 碎裂回归
 */
export default function animateSadouchengbing(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const totalDuration = 40000; // 40秒总时长
  
  // 存储所有需要清理的对象
  const objects = {
    geometries: [],
    materials: [],
    meshes: [],
    particles: [],
    animations: []
  };

  // ===== 玉符炸裂阶段 (0-8秒) =====
  function createJadeTokenExplosion() {
    // 多层光环能量核心（类似永夜魔城）
    const coreGroup = new THREE.Group();
    const ringLayers = 5;
    const jadeRings = [];

    for (let i = 0; i < ringLayers; i++) {
      const ringGeometry = new THREE.TorusGeometry(2 + i * 0.8, 0.15, 32, 64);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x00ffaa) },
          uSpeed: { value: 0.2 + i * 0.1 },
          uIndex: { value: i }
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position + normal * sin(uTime * 3.0 + vPosition.y * 2.0) * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSpeed;
          uniform float uIndex;
          
          void main() {
            // 沿环流动的符文光效（类似齿轮符文）
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 10.0 + uTime * 5.0 * uSpeed + uIndex * 2.0);
            runeGlow = step(0.7, runeGlow) * 0.8 + 0.2;
            
            // 环形流动
            float flow = fract(vUv.x + uTime * uSpeed);
            float flowGlow = sin(flow * 6.28) * 0.5 + 0.5;
            
            vec3 finalColor = uColor * (runeGlow * 0.6 + flowGlow * 0.4);
            float alpha = 0.6 + 0.4 * runeGlow;
            
            gl_FragColor = vec4(finalColor * 1.5, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = i * 0.5;
      coreGroup.add(ring);
      jadeRings.push(ring);
      
      objects.geometries.push(ringGeometry);
      objects.materials.push(ringMaterial);
    }

    // 能量波纹（向外扩散）
    const rippleCount = 3;
    const ripples = [];
    for (let i = 0; i < rippleCount; i++) {
      const rippleGeometry = new THREE.RingGeometry(4 + i * 2, 4.2 + i * 2, 64);
      const rippleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x00ffaa) },
          uOffset: { value: i * 0.5 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOffset;
          
          void main() {
            float wave = fract(length(vUv - vec2(0.5)) * 4.0 - uTime * 2.0 + uOffset);
            float alpha = smoothstep(0.0, 0.3, wave) * smoothstep(1.0, 0.7, wave) * 0.5;
            
            gl_FragColor = vec4(uColor * 2.0, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      ripple.rotation.x = -Math.PI / 2;
      ripple.visible = false;
      scene.add(ripple);
      ripples.push(ripple);
      
      objects.geometries.push(rippleGeometry);
      objects.materials.push(rippleMaterial);
      objects.meshes.push(ripple);
    }

    coreGroup.position.set(0, 5, 0);
    coreGroup.visible = false;
    scene.add(coreGroup);
    objects.meshes.push(coreGroup);

    // 符文粒子带（类似悬浮碎片）
    const runeParticleCount = 500;
    const runeGeometry = new THREE.BufferGeometry();
    const runePositions = new Float32Array(runeParticleCount * 3);
    const runeColors = new Float32Array(runeParticleCount * 3);
    const runeSizes = new Float32Array(runeParticleCount);

    for (let i = 0; i < runeParticleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      const y = 5 + (Math.random() - 0.5) * 3;

      runePositions[i * 3] = Math.cos(theta) * radius;
      runePositions[i * 3 + 1] = y;
      runePositions[i * 3 + 2] = Math.sin(theta) * radius;

      const color = new THREE.Color().setHSL(0.45 + Math.random() * 0.1, 1.0, 0.6);
      runeColors[i * 3] = color.r;
      runeColors[i * 3 + 1] = color.g;
      runeColors[i * 3 + 2] = color.b;

      runeSizes[i] = Math.random() * 2 + 0.5;
    }

    runeGeometry.setAttribute('position', new THREE.BufferAttribute(runePositions, 3));
    runeGeometry.setAttribute('color', new THREE.BufferAttribute(runeColors, 3));
    runeGeometry.setAttribute('size', new THREE.BufferAttribute(runeSizes, 1));

    const runeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 2.0 + position.x * 0.5) * 0.3;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - dist * 2.0;
          alpha = pow(alpha, 2.0);
          gl_FragColor = vec4(vColor * 2.0, alpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const runeParticles = new THREE.Points(runeGeometry, runeMaterial);
    runeParticles.visible = false;
    scene.add(runeParticles);
    
    objects.particles.push(runeParticles);
    objects.geometries.push(runeGeometry);
    objects.materials.push(runeMaterial);

    // 炸裂粒子系统（增强版，类似蒸汽/冰晶效果）
    const particleCount = 4000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount); // 粒子相位用于闪烁

    const colorOptions = [
      new THREE.Color(0x00ffaa), // 青色
      new THREE.Color(0xaaff00), // 黄绿色
      new THREE.Color(0x00aaff), // 蓝色
      new THREE.Color(0xffaa00)  // 金色（新增）
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 5;
      positions[i * 3 + 2] = 0;

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 4 + 0.5;
      particlePhases[i] = Math.random() * Math.PI * 2;

      // 初始速度（向外喷射）
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 40 + 25;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        attribute float size;
        attribute vec3 color;
        attribute float phase;
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          vColor = color;
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // 闪烁效果（类似符文亮起）
          float glow = 0.6 + 0.4 * sin(uTime * 10.0 + vPhase);
          
          float alpha = (1.0 - dist * 2.0);
          alpha = pow(alpha, 1.5) * glow;
          
          gl_FragColor = vec4(vColor * 2.0 * glow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    objects.particles.push(particles);
    objects.geometries.push(particleGeometry);
    objects.materials.push(particleMaterial);

    // 蒸汽/冰晶粒子（类似幽蓝蒸汽）
    const steamCount = 1500;
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamColors = new Float32Array(steamCount * 3);
    const steamSizes = new Float32Array(steamCount);

    for (let i = 0; i < steamCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 15;
      const y = (Math.random() - 0.5) * 10 + 5;

      steamPositions[i * 3] = Math.cos(theta) * radius;
      steamPositions[i * 3 + 1] = y;
      steamPositions[i * 3 + 2] = Math.sin(theta) * radius;

      const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      steamColors[i * 3] = color.r;
      steamColors[i * 3 + 1] = color.g;
      steamColors[i * 3 + 2] = color.b;

      steamSizes[i] = Math.random() * 3 + 1;
    }

    steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    steamGeometry.setAttribute('color', new THREE.BufferAttribute(steamColors, 3));
    steamGeometry.setAttribute('size', new THREE.BufferAttribute(steamSizes, 1));

    const steamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vY;
        uniform float uTime;
        
        void main() {
          vColor = color;
          vY = position.y;
          vec3 pos = position;
          pos.y += sin(uTime + position.x * 0.5) * 0.5; // 上升效果
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        varying float vY;
        uniform float uTime;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // 渐变消散
          float fade = 1.0 - vY * 0.1;
          fade = clamp(fade, 0.0, 1.0);
          
          float alpha = (1.0 - dist * 2.0) * fade * 0.4;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const steamParticles = new THREE.Points(steamGeometry, steamMaterial);
    steamParticles.visible = false;
    scene.add(steamParticles);
    
    objects.particles.push(steamParticles);
    objects.geometries.push(steamGeometry);
    objects.materials.push(steamMaterial);

    // 炸裂动画
    let explosionStarted = false;
    let explosionTime = 0;

    function animateExplosion(delta) {
      if (!explosionStarted) return;

      explosionTime += delta;
      const time = explosionTime * 0.001;

      // 旋转多层光环
      jadeRings.forEach((ring, index) => {
        if (ring.material.uniforms) {
          ring.material.uniforms.uTime.value = time;
        }
        ring.rotation.z += (0.02 + index * 0.005) * delta * 0.001;
        ring.rotation.y += (0.01 + index * 0.003) * delta * 0.001;
      });

      // 更新波纹
      ripples.forEach((ripple, index) => {
        if (ripple.material.uniforms) {
          ripple.material.uniforms.uTime.value = time;
        }
      });

      // 更新符文粒子
      if (runeMaterial.uniforms) {
        runeMaterial.uniforms.uTime.value = time;
      }

      // 更新蒸汽粒子
      if (steamMaterial.uniforms) {
        steamMaterial.uniforms.uTime.value = time;
      }

      // 更新炸裂粒子位置
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * delta * 0.001;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 0.001;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 0.001;

        velocities[i * 3] *= 0.995;
        velocities[i * 3 + 1] *= 0.995;
        velocities[i * 3 + 2] *= 0.995;

        velocities[i * 3 + 1] -= 2.0 * delta * 0.001;
      }
      particleGeometry.attributes.position.needsUpdate = true;
    }

    return {
      coreGroup,
      ripples,
      jadeRings,
      runeParticles,
      steamParticles,
      particles,
      runeMaterial,
      steamMaterial,
      particleMaterial,
      animateExplosion,
      startExplosion: () => {
        explosionStarted = true;
        coreGroup.visible = true;
        
        // 光环炸裂动画
        gsap.to(coreGroup.scale, { x: 2, y: 2, z: 2, duration: 0.3 });
        gsap.to(coreGroup.scale, { x: 0, y: 0, z: 0, duration: 0.5, delay: 0.3 });

        // 显示波纹
        ripples.forEach((ripple, index) => {
          gsap.delayedCall(index * 0.2, () => {
            ripple.visible = true;
            gsap.to(ripple.material, {
              opacity: 0.8,
              duration: 0.2,
              onComplete: () => {
                gsap.to(ripple.material, { opacity: 0, duration: 0.3 });
              }
            });
          });
        });

        // 显示符文粒子
        runeParticles.visible = true;
        steamParticles.visible = true;
      }
    };
  }

  // ===== 人形虚影阶段 (8-20秒) =====
  function createHumanoidShadows() {
    const shadowCount = 2000;
    
    // 简化人形几何体（十字交叉平面）
    const humanoidGeometry = new THREE.PlaneGeometry(2, 4, 4, 8);
    const humanoidGeometry2 = new THREE.PlaneGeometry(2, 4, 4, 8);
    humanoidGeometry2.rotateY(Math.PI / 2);
    
    // 合并几何体
    const mergedGeometry = new THREE.BufferGeometry();
    const positions1 = humanoidGeometry.attributes.position.array;
    const positions2 = humanoidGeometry2.attributes.position.array;
    const mergedPositions = new Float32Array(positions1.length + positions2.length);
    mergedPositions.set(positions1);
    mergedPositions.set(positions2, positions1.length);
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
    mergedGeometry.computeVertexNormals();

    // 颜色选项（增强符文配色）
    const colorOptions = [
      new THREE.Color(0xffd700), // 金色
      new THREE.Color(0x00ffaa), // 青色
      new THREE.Color(0xaa00ff), // 紫色
      new THREE.Color(0xff6600)  // 橙红色（新增）
    ];

    // 为每个实例分配颜色和属性
    const instanceColors = new Float32Array(shadowCount * 3);
    const instancePhases = new Float32Array(shadowCount); // 符文相位
    const instanceScales = new Float32Array(shadowCount);

    for (let i = 0; i < shadowCount; i++) {
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      instanceColors[i * 3] = color.r;
      instanceColors[i * 3 + 1] = color.g;
      instanceColors[i * 3 + 2] = color.b;
      instancePhases[i] = Math.random() * Math.PI * 2;
      instanceScales[i] = 0.5 + Math.random() * 1.5;
    }

    const humanoidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(1, 1, 1) }
      },
      vertexShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;
          pos.x += sin(uTime * 2.0 + position.y) * 0.05;
          pos.z += cos(uTime * 1.5 + position.y) * 0.05;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uBaseColor;
        
        void main() {
          float edgeGlow = smoothstep(0.4, 0.5, abs(vUv.x - 0.5));
          edgeGlow += smoothstep(0.0, 0.1, vUv.y) * 0.3;
          edgeGlow += smoothstep(0.9, 1.0, vUv.y) * 0.5;
          
          // 符文流动光效（类似齿轮符文）
          float angle = atan(vPosition.x, vPosition.y);
          float runeGlow = sin(angle * 8.0 + uTime * 4.0);
          runeGlow = step(0.6, runeGlow) * 0.5 + 0.5;
          
          vec3 glowColor = uBaseColor * (1.0 + 0.5 * sin(uTime * 3.0 + vPosition.y * 2.0)) * runeGlow;
          float alpha = 0.2 + edgeGlow * 0.6 * runeGlow;
          
          gl_FragColor = vec4(glowColor * 1.8, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const humanoidMesh = new THREE.InstancedMesh(mergedGeometry, humanoidMaterial, shadowCount);
    
    // 设置实例位置
    const dummy = new THREE.Object3D();
    const positions = [];
    
    for (let i = 0; i < shadowCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 50;
      const angle = (Math.random() - 0.5) * Math.PI * 0.5;
      
      const x = Math.cos(theta) * radius * Math.cos(angle);
      const y = 5 + (Math.random() - 0.5) * 20;
      const z = Math.sin(theta) * radius * Math.cos(angle);
      
      dummy.position.set(x, y, z);
      dummy.rotation.y = theta + Math.PI;
      dummy.scale.setScalar(instanceScales[i]);
      dummy.updateMatrix();
      
      humanoidMesh.setMatrixAt(i, dummy.matrix);
      humanoidMesh.setColorAt(i, new THREE.Color(
        instanceColors[i * 3],
        instanceColors[i * 3 + 1],
        instanceColors[i * 3 + 2]
      ));
      
      positions.push({ x, y, z, theta, scale: instanceScales[i], baseY: y });
    }
    
    humanoidMesh.instanceMatrix.needsUpdate = true;
    humanoidMesh.instanceColor.needsUpdate = true;
    humanoidMesh.visible = false;
    scene.add(humanoidMesh);
    
    objects.geometries.push(mergedGeometry);
    objects.materials.push(humanoidMaterial);
    objects.meshes.push(humanoidMesh);

    // 军阵光幕（增强符文流动效果）
    const barrierCount = 20;
    const barriers = [];
    
    for (let b = 0; b < barrierCount; b++) {
      const barrierGeometry = new THREE.PlaneGeometry(80, 30);
      const barrierMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x00ffaa) },
          uIndex: { value: b }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIndex;
          
          void main() {
            // 符文流动光效（类似齿轮符文）
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 12.0 + uTime * 6.0 + uIndex * 2.0);
            runeGlow = step(0.7, runeGlow) * 0.8 + 0.2;
            
            // 水平波纹
            float wave = sin(vUv.x * 10.0 + uTime * 2.0 + uIndex) * 0.5 + 0.5;
            
            // 垂直光带
            float verticalGlow = sin(vUv.y * 6.28 + uTime * 3.0) * 0.5 + 0.5;
            
            vec3 finalColor = uColor * (runeGlow * 0.5 + wave * 0.3 + verticalGlow * 0.2);
            float alpha = 0.1 + runeGlow * 0.15 + wave * 0.1;
            
            // 边缘发光
            float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
            alpha *= edge;
            
            gl_FragColor = vec4(finalColor * 1.5, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
      const angle = (b / barrierCount) * Math.PI * 2;
      barrier.position.set(
        Math.cos(angle) * 50,
        5,
        Math.sin(angle) * 50
      );
      barrier.rotation.y = -angle + Math.PI / 2;
      barrier.visible = false;
      scene.add(barrier);
      
      barriers.push(barrier);
      
      objects.geometries.push(barrierGeometry);
      objects.materials.push(barrierMaterial);
      objects.meshes.push(barrier);
    }

    // 法宝虚影（剑形）
    const swordCount = 100;
    const swordGeometry = new THREE.PlaneGeometry(1, 4);
    const swordMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffd700) }
      },
      vertexShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(uTime * 3.0 + uv.y * 5.0) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        
        void main() {
          float blade = smoothstep(0.3, 0.4, abs(vUv.x - 0.5));
          blade = 1.0 - blade;
          
          float tipGlow = smoothstep(0.9, 1.0, vUv.y);
          float handleGlow = smoothstep(0.0, 0.15, vUv.y);
          
          vec3 glowColor = uColor * (1.0 + 0.5 * sin(uTime * 4.0));
          float alpha = blade * 0.5 + tipGlow * 0.5 + handleGlow * 0.3;
          
          gl_FragColor = vec4(glowColor, alpha * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    
    const swords = new THREE.InstancedMesh(swordGeometry, swordMaterial, swordCount);
    
    for (let i = 0; i < swordCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 30;
      const y = 5 + (Math.random() - 0.5) * 25;
      
      dummy.position.set(
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        theta + Math.PI / 2,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(0.8 + Math.random() * 0.8);
      dummy.updateMatrix();
      
      swords.setMatrixAt(i, dummy.matrix);
      swords.setColorAt(i, new THREE.Color(
        Math.random() > 0.5 ? 1 : 0,
        Math.random() > 0.5 ? 1 : 0.8,
        Math.random() > 0.5 ? 0 : 0.2
      ));
    }
    
    swords.instanceMatrix.needsUpdate = true;
    swords.instanceColor.needsUpdate = true;
    swords.visible = false;
    scene.add(swords);
    
    objects.geometries.push(swordGeometry);
    objects.materials.push(swordMaterial);
    objects.meshes.push(swords);

    // 人形动画
    let humanoidTime = 0;
    const rotationSpeeds = positions.map(() => (Math.random() - 0.5) * 0.02);
    const floatSpeeds = positions.map(() => (Math.random() - 0.5) * 2);
    const floatOffsets = positions.map(() => Math.random() * Math.PI * 2);

    function animateHumanoids(delta) {
      humanoidTime += delta;
      
      const dummy = new THREE.Object3D();
      
      for (let i = 0; i < shadowCount; i++) {
        const theta = positions[i].theta + humanoidTime * rotationSpeeds[i] * 0.001;
        const radius = 20 + Math.sin(humanoidTime * 0.001 + floatOffsets[i]) * 5;
        const y = positions[i].baseY + Math.sin(humanoidTime * 0.002 + floatOffsets[i]) * 3;
        
        dummy.position.set(
          Math.cos(theta) * radius,
          y,
          Math.sin(theta) * radius
        );
        dummy.rotation.y = theta + Math.PI;
        dummy.rotation.z = Math.sin(humanoidTime * 0.003 + i * 0.1) * 0.1;
        dummy.scale.setScalar(positions[i].scale);
        dummy.updateMatrix();
        
        humanoidMesh.setMatrixAt(i, dummy.matrix);
      }
      
      humanoidMesh.instanceMatrix.needsUpdate = true;
      
      // 旋转光幕
      barriers.forEach((barrier, index) => {
        const angle = (index / barrierCount) * Math.PI * 2 + humanoidTime * 0.0005;
        barrier.position.set(
          Math.cos(angle) * 50,
          5,
          Math.sin(angle) * 50
        );
        barrier.rotation.y = -angle + Math.PI / 2;
        barrier.material.uniforms.uTime.value = humanoidTime * 0.001;
      });
      
      // 旋转法宝
      for (let i = 0; i < swordCount; i++) {
        humanoidMesh.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        
        dummy.rotation.x += 0.001 * delta;
        dummy.rotation.y += 0.001 * delta;
        dummy.updateMatrix();
        
        swords.setMatrixAt(i, dummy.matrix);
      }
      
      swords.instanceMatrix.needsUpdate = true;
      swordMaterial.uniforms.uTime.value = humanoidTime * 0.001;
    }

    return {
      humanoidMesh,
      barriers,
      swords,
      humanoidMaterial,
      swordMaterial,
      animateHumanoids,
      showHumanoids: () => {
        humanoidMesh.visible = true;
        
        barriers.forEach((barrier, index) => {
          barrier.visible = true;
          if (barrier.material.uniforms) {
            barrier.material.uniforms.uTime.value = 0;
          }
        });
        
        swords.visible = true;
        if (swordMaterial.uniforms) {
          swordMaterial.uniforms.uTime.value = 0;
        }
      },
      hideHumanoids: () => {
        humanoidMesh.visible = false;
        barriers.forEach(b => b.visible = false);
        swords.visible = false;
      }
    };
  }

  // ===== 军阵攻击阶段 (20-32秒) =====
  function createFormationAttack() {
    // 法术光芒（增强符文流动）
    const magicRays = [];
    const rayCount = 60;
    
    for (let r = 0; r < rayCount; r++) {
      const rayGeometry = new THREE.PlaneGeometry(0.8, 50);
      const rayMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x00ffaa) },
          uOffset: { value: Math.random() }
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            pos.x += sin(uTime * 5.0 + vUv.y * 10.0) * 0.3;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOffset;
          
          void main() {
            // 符文流动光效
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 15.0 + uTime * 8.0 + uOffset * 10.0);
            runeGlow = pow(abs(runeGlow), 3.0);
            
            float fade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
            float pulse = 0.5 + 0.5 * sin(uTime * 10.0 + uOffset * 10.0);
            
            vec3 finalColor = uColor * (runeGlow * 0.7 + pulse * 0.3);
            gl_FragColor = vec4(finalColor * 2.5, fade * runeGlow * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      const theta = (r / rayCount) * Math.PI * 2;
      ray.position.set(
        Math.cos(theta) * 40,
        5,
        Math.sin(theta) * 40
      );
      ray.rotation.y = -theta;
      ray.visible = false;
      scene.add(ray);
      
      magicRays.push(ray);
      
      objects.geometries.push(rayGeometry);
      objects.materials.push(rayMaterial);
      objects.meshes.push(ray);
    }

    // 攻击波纹（多层扩散，类似能量波纹）
    const attackRipples = [];
    const rippleCount = 7;
    
    for (let rp = 0; rp < rippleCount; rp++) {
      const rippleGeometry = new THREE.RingGeometry(6, 10, 64);
      const rippleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xffd700) },
          uOffset: { value: rp * 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOffset;
          
          void main() {
            float dist = length(vUv - vec2(0.5));
            
            // 符文流动
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 20.0 + uTime * 10.0 + uOffset * 5.0);
            runeGlow = step(0.8, runeGlow) * 0.6 + 0.4;
            
            // 环形波纹
            float wave = sin(dist * 50.0 - uTime * 5.0 + uOffset * 3.0);
            wave = smoothstep(0.5, 0.8, wave);
            
            float ring = smoothstep(0.3, 0.35, dist) * smoothstep(0.5, 0.45, dist);
            ring *= wave;
            
            float pulse = 0.5 + 0.5 * sin(uTime * 6.0 + uOffset * 2.0);
            vec3 finalColor = uColor * pulse * runeGlow;
            
            gl_FragColor = vec4(finalColor * 2.5, ring * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      
      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      ripple.rotation.x = -Math.PI / 2;
      ripple.visible = false;
      scene.add(ripple);
      
      attackRipples.push(ripple);
      
      objects.geometries.push(rippleGeometry);
      objects.materials.push(rippleMaterial);
      objects.meshes.push(ripple);
    }

    // 能量球（多层光环核心）
    const energyCoreGroup = new THREE.Group();
    const coreLayers = 6;
    const energyRings = [];

    for (let i = 0; i < coreLayers; i++) {
      const ringGeometry = new THREE.TorusGeometry(4 + i * 1.2, 0.3, 32, 64);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xffaa00) },
          uSpeed: { value: 0.3 + i * 0.1 }
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position + normal * sin(uTime * 4.0) * 0.2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSpeed;
          
          void main() {
            // 符文流动
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 15.0 + uTime * 8.0 * uSpeed);
            runeGlow = step(0.7, runeGlow) * 0.7 + 0.3;
            
            // 沿环流动
            float flow = fract(vUv.x + uTime * uSpeed);
            float flowGlow = sin(flow * 6.28) * 0.5 + 0.5;
            
            vec3 finalColor = uColor * (runeGlow * 0.6 + flowGlow * 0.4);
            float alpha = 0.7 + 0.3 * runeGlow;
            
            gl_FragColor = vec4(finalColor * 1.8, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = i * 0.4;
      energyCoreGroup.add(ring);
      energyRings.push(ring);
      
      objects.geometries.push(ringGeometry);
      objects.materials.push(ringMaterial);
    }

    energyCoreGroup.position.set(0, 5, 0);
    energyCoreGroup.visible = false;
    scene.add(energyCoreGroup);
    objects.meshes.push(energyCoreGroup);

    function animateAttack(delta) {
      const time = Date.now() * 0.001;
      
      magicRays.forEach((ray, index) => {
        ray.material.uniforms.uTime.value = time;
        ray.rotation.y += 0.001 * delta;
      });
      
      attackRipples.forEach((ripple, index) => {
        const scale = 1 + Math.sin(time * 2.0 + index * 0.5) * 0.3;
        ripple.scale.setScalar(scale);
        ripple.material.uniforms.uTime.value = time;
      });
      
      // 旋转能量核心光环
      energyRings.forEach((ring, index) => {
        if (ring.material.uniforms) {
          ring.material.uniforms.uTime.value = time;
        }
        ring.rotation.z += (0.03 + index * 0.005) * delta * 0.001;
        ring.rotation.x += (0.01 + index * 0.002) * delta * 0.001;
      });
    }

    return {
      magicRays,
      attackRipples,
      energyCoreGroup,
      energyRings,
      animateAttack,
      showAttack: () => {
        magicRays.forEach(r => {
          r.visible = true;
          if (r.material.uniforms) {
            r.material.uniforms.uTime.value = 0;
          }
        });

        attackRipples.forEach(r => {
          r.visible = true;
          if (r.material.uniforms) {
            r.material.uniforms.uTime.value = 0;
          }
        });

        energyCoreGroup.visible = true;
        energyCoreGroup.scale.setScalar(0);

        gsap.to(energyCoreGroup.scale, { x: 1, y: 1, z: 1, duration: 1 });
      },
      hideAttack: () => {
        magicRays.forEach(r => r.visible = false);
        attackRipples.forEach(r => r.visible = false);
        energyCoreGroup.visible = false;
      }
    };
  }

  // ===== 碎裂回归阶段 (32-40秒) =====
  function createReturnFlow() {
    // 回归粒子（增强符文闪烁效果）
    const returnParticleCount = 6000;
    const returnGeometry = new THREE.BufferGeometry();
    const returnPositions = new Float32Array(returnParticleCount * 3);
    const returnColors = new Float32Array(returnParticleCount * 3);
    const returnSizes = new Float32Array(returnParticleCount);
    const returnPhases = new Float32Array(returnParticleCount); // 相位用于闪烁
    const returnTargets = new Float32Array(returnParticleCount * 3); // 目标位置

    for (let i = 0; i < returnParticleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 45;
      const y = 5 + (Math.random() - 0.5) * 35;
      
      returnPositions[i * 3] = Math.cos(theta) * radius;
      returnPositions[i * 3 + 1] = y;
      returnPositions[i * 3 + 2] = Math.sin(theta) * radius;

      const hue = Math.random() * 0.2;
      const color = new THREE.Color().setHSL(0.1 + hue, 1.0, 0.6);
      returnColors[i * 3] = color.r;
      returnColors[i * 3 + 1] = color.g;
      returnColors[i * 3 + 2] = color.b;

      returnSizes[i] = Math.random() * 2.5 + 0.5;
      returnPhases[i] = Math.random() * Math.PI * 2;

      // 目标是中心
      returnTargets[i * 3] = 0;
      returnTargets[i * 3 + 1] = 5;
      returnTargets[i * 3 + 2] = 0;
    }

    returnGeometry.setAttribute('position', new THREE.BufferAttribute(returnPositions, 3));
    returnGeometry.setAttribute('color', new THREE.BufferAttribute(returnColors, 3));
    returnGeometry.setAttribute('size', new THREE.BufferAttribute(returnSizes, 1));
    returnGeometry.setAttribute('phase', new THREE.BufferAttribute(returnPhases, 1));

    const returnMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        attribute float size;
        attribute vec3 color;
        attribute float phase;
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          vColor = color;
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (450.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // 符文闪烁效果
          float glow = 0.7 + 0.3 * sin(uTime * 12.0 + vPhase);
          
          float alpha = (1.0 - dist * 2.0) * glow;
          alpha = pow(alpha, 2.0);
          gl_FragColor = vec4(vColor * 2.5 * glow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const returnParticles = new THREE.Points(returnGeometry, returnMaterial);
    returnParticles.visible = false;
    scene.add(returnParticles);
    
    objects.particles.push(returnParticles);
    objects.geometries.push(returnGeometry);
    objects.materials.push(returnMaterial);

    // 最终金色光团（多层光环核心）
    const finalOrbGroup = new THREE.Group();
    const orbLayers = 7;
    const orbRings = [];

    for (let i = 0; i < orbLayers; i++) {
      const ringGeometry = new THREE.TorusGeometry(6 + i * 1.5, 0.4, 32, 64);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xffd700) },
          uSpeed: { value: 0.4 + i * 0.1 }
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position + normal * sin(uTime * 5.0 + position.y * 2.0) * 0.3;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSpeed;
          
          void main() {
            // 符文流动（最强效果）
            float angle = atan(vPosition.z, vPosition.x);
            float runeGlow = sin(angle * 20.0 + uTime * 10.0 * uSpeed);
            runeGlow = step(0.6, runeGlow) * 0.8 + 0.2;
            
            // 沿环流动
            float flow = fract(vUv.x + uTime * uSpeed);
            float flowGlow = sin(flow * 6.28) * 0.5 + 0.5;
            
            vec3 finalColor = uColor * (runeGlow * 0.7 + flowGlow * 0.3);
            float alpha = 0.8 + 0.2 * runeGlow;
            
            gl_FragColor = vec4(finalColor * 2.0, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = i * 0.3;
      finalOrbGroup.add(ring);
      orbRings.push(ring);
      
      objects.geometries.push(ringGeometry);
      objects.materials.push(ringMaterial);
    }

    // 中心能量球
    const orbCenterGeometry = new THREE.SphereGeometry(5, 64, 64);
    const orbCenterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffd700) }
      },
      vertexShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        void main() {
          vNormal = normal;
          vPosition = position;
          vec3 pos = position + normal * sin(uTime * 6.0 + position.y * 3.0) * 0.4;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float pulse = 0.5 + 0.5 * sin(uTime * 10.0 + vPosition.y * 4.0);
          float ray = sin(vPosition.y * 12.0 + uTime * 6.0) * 0.5 + 0.5;
          
          vec3 finalColor = uColor * (intensity * 3.0 + pulse + ray * 0.5);
          gl_FragColor = vec4(finalColor, 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const orbCenter = new THREE.Mesh(orbCenterGeometry, orbCenterMaterial);
    finalOrbGroup.add(orbCenter);
    
    objects.geometries.push(orbCenterGeometry);
    objects.materials.push(orbCenterMaterial);

    // 能量波纹扩散
    const orbRippleCount = 4;
    const orbRipples = [];
    for (let i = 0; i < orbRippleCount; i++) {
      const rippleGeometry = new THREE.RingGeometry(8 + i * 3, 8.5 + i * 3, 64);
      const rippleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xffd700) },
          uOffset: { value: i * 0.4 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOffset;
          
          void main() {
            float wave = fract(length(vUv - vec2(0.5)) * 3.0 - uTime * 2.0 + uOffset);
            float alpha = smoothstep(0.0, 0.2, wave) * smoothstep(1.0, 0.7, wave) * 0.6;
            
            gl_FragColor = vec4(uColor * 2.0, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      ripple.rotation.x = -Math.PI / 2;
      ripple.visible = false;
      finalOrbGroup.add(ripple);
      orbRipples.push(ripple);
      
      objects.geometries.push(rippleGeometry);
      objects.materials.push(rippleMaterial);
    }

    finalOrbGroup.position.set(0, 5, 0);
    finalOrbGroup.visible = false;
    scene.add(finalOrbGroup);
    objects.meshes.push(finalOrbGroup);

    function animateReturn(delta) {
      const time = Date.now() * 0.001;
      const positions = returnGeometry.attributes.position.array;
      
      // 更新回归粒子材质
      if (returnMaterial.uniforms) {
        returnMaterial.uniforms.uTime.value = time;
      }
      
      for (let i = 0; i < returnParticleCount; i++) {
        const dx = returnTargets[i * 3] - positions[i * 3];
        const dy = returnTargets[i * 3 + 1] - positions[i * 3 + 1];
        const dz = returnTargets[i * 3 + 2] - positions[i * 3 + 2];
        
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist > 1) {
          const speed = 0.02 * delta;
          positions[i * 3] += dx * speed;
          positions[i * 3 + 1] += dy * speed;
          positions[i * 3 + 2] += dz * speed;
          
          const spiralRadius = dist * 0.1;
          const spiralSpeed = 0.005 * delta;
          const angle = Math.atan2(positions[i * 3 + 2], positions[i * 3]) + spiralSpeed;
          positions[i * 3] += Math.cos(angle) * spiralRadius;
          positions[i * 3 + 2] += Math.sin(angle) * spiralRadius;
        }
      }
      
      returnGeometry.attributes.position.needsUpdate = true;

      // 旋转最终光团光环
      orbRings.forEach((ring, index) => {
        if (ring.material.uniforms) {
          ring.material.uniforms.uTime.value = time;
        }
        ring.rotation.z += (0.04 + index * 0.008) * delta * 0.001;
        ring.rotation.x += (0.02 + index * 0.004) * delta * 0.001;
      });

      // 更新波纹
      orbRipples.forEach((ripple, index) => {
        if (ripple.material.uniforms) {
          ripple.material.uniforms.uTime.value = time;
        }
      });

      // 更新中心球
      if (orbCenterMaterial.uniforms) {
        orbCenterMaterial.uniforms.uTime.value = time;
      }
    }

    return {
      returnParticles,
      finalOrbGroup,
      orbRings,
      orbRipples,
      animateReturn,
      showReturn: () => {
        returnParticles.visible = true;
        finalOrbGroup.visible = false;
      },
      showFinalOrb: () => {
        returnParticles.visible = false;
        finalOrbGroup.visible = true;
        finalOrbGroup.scale.setScalar(0);

        gsap.to(finalOrbGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        
        // 显示波纹
        orbRipples.forEach((ripple, index) => {
          gsap.delayedCall(index * 0.15, () => {
            ripple.visible = true;
            gsap.to(ripple.material, {
              opacity: 0.8,
              duration: 0.2,
              onComplete: () => {
                gsap.to(ripple.material, { opacity: 0, duration: 0.4 });
              }
            });
          });
        });

        gsap.to(finalOrbGroup.scale, { x: 0, y: 0, z: 0, duration: 0.5, delay: 1.5 });
      }
    };
  }

  // ===== 创建所有阶段 =====
  const explosion = createJadeTokenExplosion();
  const humanoids = createHumanoidShadows();
  const attack = createFormationAttack();
  const returnFlow = createReturnFlow();

  // 设置初始相机位置 - 俯视角度，观察军阵全景
  camera.position.set(0, 25, 100);
  camera.lookAt(0, 5, 0);
  controls.target.set(0, 5, 0);
  controls.update();

  // 动画帧ID和清理标志
  let animationFrameId = null;
  let cleaned = false;

  // 监听自动旋转状态，开启时立即清理
  let autoRotateCheckInterval = setInterval(() => {
    if (controls && controls.autoRotate && !cleaned) {
      cleanup();
      clearInterval(autoRotateCheckInterval);
    }
  }, 100);

  // ===== 时间线 =====
  const timeline = gsap.timeline({
    onComplete: () => {
      // 动画完成后清除所有特效
      cleanup();
      if (callbacks?.onComplete) {
        callbacks.onComplete();
      }
    }
  });

  // 0-8秒：玉符炸裂
  timeline.to({}, { duration: 2, onStart: () => {
    // 玉符炸裂开始
    if (explosion.startExplosion) {
      explosion.startExplosion();
    }
  }});

  timeline.to({}, { duration: 6 });

  // 8-20秒：人形虚影出现
  timeline.to({}, { duration: 0.1, onStart: () => {
    if (humanoids.showHumanoids) {
      humanoids.showHumanoids();
    }
  }});

  timeline.to({}, { duration: 12 });

  // 20-32秒：军阵攻击
  timeline.to({}, { duration: 0.1, onStart: () => {
    if (attack.showAttack) {
      attack.showAttack();
    }
  }});

  timeline.to({}, { duration: 12 });

  // 32-40秒：碎裂回归
  timeline.to({}, { duration: 0.1, onStart: () => {
    if (humanoids.hideHumanoids) {
      humanoids.hideHumanoids();
    }
    if (attack.hideAttack) {
      attack.hideAttack();
    }
    if (returnFlow.showReturn) {
      returnFlow.showReturn();
    }
  }});

  timeline.to({}, { duration: 6 });

  timeline.to({}, { duration: 0.1, onStart: () => {
    if (returnFlow.showFinalOrb) {
      returnFlow.showFinalOrb();
    }
  }});

  // 等待最终光团淡出后，隐藏所有元素
  timeline.to({}, { duration: 2 });

  timeline.to({}, { duration: 0.1, onStart: () => {
    // 隐藏回归粒子
    if (returnFlow.returnParticles) {
      returnFlow.returnParticles.visible = false;
    }
    // 隐藏最终光团
    if (returnFlow.finalOrbGroup) {
      returnFlow.finalOrbGroup.visible = false;
    }
  }});

  // ===== 动画循环 =====
  let lastTime = 0;

  function animate(time) {
    if (cleaned) return;
    animationFrameId = requestAnimationFrame(animate);

    const delta = time - lastTime;
    lastTime = time;
    
    // 玉符炸裂阶段动画
    if (time < 8000) {
      if (explosion.particleMaterial && explosion.particleMaterial.uniforms) {
        explosion.particleMaterial.uniforms.uTime.value = time * 0.001;
      }
      if (explosion.animateExplosion) {
        explosion.animateExplosion(delta);
      }
    }

    // 人形虚影阶段动画
    if (time >= 8000 && time < 32000) {
      if (humanoids.humanoidMaterial && humanoids.humanoidMaterial.uniforms) {
        humanoids.humanoidMaterial.uniforms.uTime.value = time * 0.001;
      }
      if (humanoids.animateHumanoids) {
        humanoids.animateHumanoids(delta);
      }
    }
    
    // 军阵攻击阶段动画
    if (time >= 20000 && time < 32000) {
      if (attack.animateAttack) {
        attack.animateAttack(delta);
      }
    }

    // 碎裂回归阶段动画
    if (time >= 32000) {
      if (returnFlow.animateReturn) {
        returnFlow.animateReturn(delta);
      }
    }
  }
  
  animate(0);

  // 相机运镜 - 优化视角轨迹
  // 0-8秒：玉符炸裂，特写中心
  gsap.to(camera.position, {
    x: 0,
    y: 15,
    z: 40,
    duration: 5,
    ease: "power2.inOut"
  });

  gsap.to(camera.position, {
    x: 20,
    y: 20,
    z: 50,
    duration: 8,
    delay: 5,
    ease: "power2.inOut"
  });

  // 8-20秒：人形虚影出现，俯视军阵
  gsap.to(camera.position, {
    x: 0,
    y: 35,
    z: 90,
    duration: 8,
    delay: 13,
    ease: "power2.inOut"
  });

  // 20-32秒：军阵攻击，环绕视角
  gsap.to(camera.position, {
    x: 40,
    y: 25,
    z: 60,
    duration: 10,
    delay: 20,
    ease: "power2.inOut"
  });

  gsap.to(camera.position, {
    x: -40,
    y: 25,
    z: 60,
    duration: 10,
    delay: 30,
    ease: "power2.inOut"
  });

  // 32-40秒：碎裂回归，中心特写
  gsap.to(camera.position, {
    x: 0,
    y: 15,
    z: 50,
    duration: 5,
    delay: 38,
    ease: "power2.inOut"
  });

  // 清理函数
  function cleanup() {
    if (cleaned) return;
    cleaned = true;

    // 取消自动旋转监听定时器
    if (autoRotateCheckInterval) {
      clearInterval(autoRotateCheckInterval);
      autoRotateCheckInterval = null;
    }

    // 取消动画循环
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // 清除所有GSAP动画
    gsap.killTweensOf('*');
    gsap.globalTimeline.clear();
    timeline.kill();

    // 清除网格和粒子（从场景移除）
    objects.meshes.forEach(mesh => {
      if (mesh) {
        scene.remove(mesh);
      }
    });

    objects.particles.forEach(particles => {
      if (particles) {
        scene.remove(particles);
      }
    });

    // 清除几何体
    objects.geometries.forEach(geo => {
      if (geo) geo.dispose();
    });

    // 清除材质
    objects.materials.forEach(mat => {
      if (mat) mat.dispose();
    });

    // 清除动画列表中的动画
    objects.animations.forEach(anim => {
      if (anim) {
        anim.kill();
      }
    });
  }

  return {
    cleanup,
    timeline
  };
}
