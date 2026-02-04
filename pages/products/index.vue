<template>
  <div class="website-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-logo">ZOOOW-AI</div>
      <div class="nav-links">
        <a href="#home" class="nav-link">首页</a>
        <a href="#about" class="nav-link">3D动画特效</a>
        <a href="#services" class="nav-link">Echarts特效</a>
        <a href="#portfolio" class="nav-link">3D云展厅</a>
        <a href="#contact" class="nav-link">联系我们</a>
      </div>
      <button class="nav-button">立即咨询</button>
    </nav>

    <!-- 首屏 Hero Section -->
    <section id="home" class="section hero-section vertical">
      <div class="hero-bg">
        <div class="bg-gradient-1"></div>
        <div class="bg-gradient-2"></div>
        <div class="bg-gradient-3"></div>
        <div class="grid-pattern"></div>
        <div class="aurora-effect"></div>
        <div class="nebula-effect"></div>
        <div class="star-field"></div>
        <div class="cyber-grid"></div>
        <div class="hologram-base"></div>
      </div>
      <div class="hero-particles" id="particles-container">
        <!-- 粒子将由 JS 动态生成 -->
      </div>
      <div class="advanced-particles" id="advanced-particles">
        <!-- 高级粒子系统 -->
      </div>
      <div class="lightning-bolt bolt-1"></div>
      <div class="lightning-bolt bolt-2"></div>
      <div class="lightning-bolt bolt-3"></div>
      <div class="hero-lightning lightning-1"></div>
      <div class="hero-lightning lightning-2"></div>
      <div class="hero-mesh mesh-1"></div>
      <div class="hero-mesh mesh-2"></div>
      <div class="hero-orb orb-1"></div>
      <div class="hero-orb orb-2"></div>
      <div class="hero-orb orb-3"></div>
      <div class="hero-orb orb-4"></div>
      <div class="hero-glow glow-1"></div>
      <div class="hero-glow glow-2"></div>
      <div class="hero-glow glow-3"></div>
      <div class="floating-crystal crystal-1"></div>
      <div class="floating-crystal crystal-2"></div>
      <div class="floating-crystal crystal-3"></div>
      <div class="floating-crystal crystal-4"></div>
      <div class="hexagon-pattern"></div>
      <div class="wave-anim wave-1"></div>
      <div class="wave-anim wave-2"></div>
      <div class="wave-anim wave-3"></div>
      <div class="hologram-ring ring-1"></div>
      <div class="hologram-ring ring-2"></div>
      <div class="hologram-ring ring-3"></div>
      <div class="energy-line line-top"></div>
      <div class="energy-line line-bottom"></div>
      <div class="energy-line line-left"></div>
      <div class="energy-line line-right"></div>
      <div class="data-stream stream-1"></div>
      <div class="data-stream stream-2"></div>
      <div class="data-stream stream-3"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-pulse"></span>
          <span class="badge-icon">✨</span>
          <span class="badge-text">AI驱动的智能体验</span>
          <div class="badge-glow"></div>
        </div>
        <div class="hero-title-container">
          <h1 class="hero-title">
            <span class="title-line line-1">
              <span class="title-char char-1" data-text="重">重</span>
              <span class="title-char char-2" data-text="塑">塑</span>
              <span class="title-char char-3" data-text="数">数</span>
              <span class="title-char char-4" data-text="字">字</span>
              <span class="title-char char-5" data-text="未">未</span>
              <span class="title-char char-6" data-text="来">来</span>
            </span>
          </h1>
          <h2 class="hero-title-right">
            <span class="title-line line-2" data-text="创造动态美丽">创造动态美丽</span>
          </h2>
          <div class="title-glow"></div>
          <div class="title-particle"></div>
          <div class="title-3d-layer layer-1"></div>
          <div class="title-3d-layer layer-2"></div>
          <div class="title-3d-layer layer-3"></div>
        </div>
        <p class="hero-subtitle">
          集成<span class="highlight highlight-1">AI智能网站</span>、<span class="highlight highlight-2">3D动画特效</span>、<span class="highlight highlight-3">Echarts可视化</span>、<span class="highlight highlight-4">3D云展厅</span><br/>
          基于<span class="highlight gradient-text highlight-5">自研引擎</span>打造流畅动画体验，让您的网站与众不同
          <span class="subtitle-sparkle sparkle-1"></span>
          <span class="subtitle-sparkle sparkle-2"></span>
          <span class="subtitle-sparkle sparkle-3"></span>
        </p>
        <div class="hologram-typewriter">
          <span class="typewriter-text"></span>
          <span class="typing-cursor"></span>
        </div>
        <div class="hero-cta-container">
          <div class="floating-showcase">
            <div class="showcase-card card-3d-flip">
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-visual visual-ai"></div>
                  <div class="card-content">
                    <h4>AI智能</h4>
                    <p>下一代智能引擎</p>
                  </div>
                </div>
                <div class="card-back">
                  <div class="back-content">
                    <h4>智能引擎</h4>
                    <ul>
                      <li>自然语言处理</li>
                      <li>智能推荐</li>
                      <li>自适应学习</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="showcase-card card-3d-flip">
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-visual visual-3d"></div>
                  <div class="card-content">
                    <h4>3D动画</h4>
                    <p>沉浸式视觉体验</p>
                  </div>
                </div>
                <div class="card-back">
                  <div class="back-content">
                    <h4>3D特效</h4>
                    <ul>
                      <li>150+动画模板</li>
                      <li>实时渲染</li>
                      <li>高性能引擎</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="showcase-card card-3d-flip">
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-visual visual-data"></div>
                  <div class="card-content">
                    <h4>数据可视化</h4>
                    <p>洞察数据价值</p>
                  </div>
                </div>
                <div class="card-back">
                  <div class="back-content">
                    <h4>Echarts</h4>
                    <ul>
                      <li>丰富图表类型</li>
                      <li>实时数据更新</li>
                      <li>交互式分析</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat stat-1">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div class="stat-icon-ring"></div>
              </div>
              <div class="stat-content">
                <span class="hero-stat-number" data-target="150">0</span>
                <span class="hero-stat-label">动画模板</span>
              </div>
            </div>
            <div class="hero-stat-divider divider-1">
              <div class="divider-pulse"></div>
            </div>
            <div class="hero-stat stat-2">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div class="stat-icon-ring"></div>
              </div>
              <div class="stat-content">
                <span class="hero-stat-number" data-target="3">0</span>
                <span class="hero-stat-label">自研引擎</span>
              </div>
            </div>
            <div class="hero-stat-divider divider-2">
              <div class="divider-pulse"></div>
            </div>
            <div class="hero-stat stat-3">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </div>
                <div class="stat-icon-ring"></div>
              </div>
              <div class="stat-content">
                <span class="hero-stat-number" data-target="100">0</span>
                <span class="hero-stat-label">流畅体验</span>
              </div>
            </div>
            <div class="hero-stat-divider divider-3">
              <div class="divider-pulse"></div>
            </div>
            <div class="hero-stat stat-4">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                <div class="stat-icon-ring"></div>
              </div>
              <div class="stat-content">
                <span class="hero-stat-number" data-target="50">0</span>
                <span class="hero-stat-label">K+用户</span>
              </div>
            </div>
          </div>
          <div class="hero-buttons">
            <button class="hero-btn primary">
              <div class="btn-bg"></div>
              <div class="btn-glow"></div>
              <span class="btn-text">开始探索</span>
              <span class="btn-shine"></span>
              <span class="btn-icon-right">→</span>
              <div class="btn-particles"></div>
            </button>
            <button class="hero-btn secondary">
              <div class="play-btn-wrapper">
                <div class="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div class="play-ring"></div>
              </div>
              <span>特效演示</span>
              <div class="btn-sparkle"></div>
            </button>
          </div>
        </div>
        <div class="hero-features">
          <div class="feature-card">
            <div class="feature-icon-wrap icon-ai">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1010 10H12V2z"/>
                <path d="M12 12L2.5 9.5"/>
                <path d="M12 12l9.5-2.5"/>
                <path d="M12 12l-2.5 9.5"/>
                <path d="M12 12l2.5-9.5"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">AI智能</span>
            <div class="feature-glow"></div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap icon-3d">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3l10 6-10 6-10-6 10-6z"/>
                <path d="M12 15v8"/>
                <path d="M22 9v8"/>
                <path d="M2 9v8"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">3D动画</span>
            <div class="feature-glow"></div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap icon-data">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">数据可视化</span>
            <div class="feature-glow"></div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap icon-cloud">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">云端部署</span>
            <div class="feature-glow"></div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap icon-fast">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">极速加载</span>
            <div class="feature-glow"></div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap icon-safe">
              <div class="icon-bg"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <div class="icon-pulse"></div>
            </div>
            <span class="feature-text">安全可靠</span>
            <div class="feature-glow"></div>
          </div>
        </div>
        <div class="hero-testimonial">
          <div class="testimonial-quote">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" class="quote-icon">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            </svg>
            <p class="testimonial-text text-1">
              <span class="brand-name">ZOOOW-AI</span> 让我们的网站焕然一新，用户体验提升了<span class="highlight-num">300%</span>！
            </p>
            <p class="testimonial-text text-2">
              <span class="brand-name">ZOOOW-AI</span> 让创作更<span class="highlight-word">智能</span>，更<span class="highlight-word">高效</span>！
            </p>
            <div class="testimonial-stars">
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="deco-circle circle-1">
          <div class="circle-inner"></div>
          <div class="circle-outer"></div>
          <div class="circle-particles"></div>
        </div>
        <div class="deco-circle circle-2">
          <div class="circle-inner"></div>
          <div class="circle-outer"></div>
          <div class="circle-particles"></div>
        </div>
        <div class="deco-circle circle-3">
          <div class="circle-inner"></div>
          <div class="circle-outer"></div>
          <div class="circle-particles"></div>
        </div>
        <div class="floating-shape shape-1">
          <div class="shape-glow"></div>
        </div>
        <div class="floating-shape shape-2">
          <div class="shape-glow"></div>
        </div>
        <div class="floating-shape shape-3">
          <div class="shape-glow"></div>
        </div>
        <div class="floating-shape shape-4">
          <div class="shape-glow"></div>
        </div>
        <div class="floating-shape shape-5">
          <div class="shape-glow"></div>
        </div>
        <div class="geometric-line line-1">
          <div class="line-glow"></div>
        </div>
        <div class="geometric-line line-2">
          <div class="line-glow"></div>
        </div>
        <div class="geometric-line line-3">
          <div class="line-glow"></div>
        </div>
        <div class="geometric-line line-4">
          <div class="line-glow"></div>
        </div>
        <div class="rotating-ring ring-1"></div>
        <div class="rotating-ring ring-2"></div>
        <div class="rotating-ring ring-3"></div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-dot">
          <div class="dot-pulse"></div>
        </div>
        <div class="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
        <span class="scroll-text">向下滚动</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- 3D动画特效 -->
    <section id="about" class="section about-section vertical">
      <div class="section-bg">
        <div class="bg-mesh"></div>
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
      </div>
      <div class="container">
        <div class="section-header">
          <div class="header-badge">
            <span class="badge-icon">✨</span>
            <span class="badge-text">自研引擎</span>
          </div>
          <h2 class="section-title">3D动画特效</h2>
          <p class="section-subtitle">自研动画引擎打造震撼视觉体验</p>
        </div>
        <div class="about-content">
          <div class="about-text">
            <p class="about-description">
              ZOOOW-AI 提供业界领先的<span class="highlight gradient-text highlight-1">3D动画</span>解决方案，基于<span class="highlight gradient-text highlight-2">自研强大</span>的动画引擎，
              为您打造令人惊叹的视觉体验。从基础过渡到复杂的粒子系统，应有尽有。
            </p>
            <p class="about-description">
              我们的动画库包含 <span class="highlight-num">150</span> 种精心设计的动画模板，涵盖<span class="highlight gradient-text highlight-3">横向滚动</span>、<span class="highlight gradient-text highlight-4">3D翻转</span>、<span class="highlight gradient-text highlight-5">粒子波浪</span>、
              虫洞穿越、液体流动、矩阵代码雨等特效，满足各种场景需求。
            </p>
            <div class="about-advantages">
              <div class="advantage-item adv-1">
                <div class="advantage-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <h4 class="advantage-title">基础模板 V1-V3</h4>
                <p class="advantage-desc">横向、横竖、无限循环、缩放</p>
                <div class="advantage-glow"></div>
              </div>
              <div class="advantage-item adv-2">
                <div class="advantage-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <h4 class="advantage-title">专业级 V4-V11</h4>
                <p class="advantage-desc">3D翻转、粒子波浪、虫洞、玻璃破碎</p>
                <div class="advantage-glow"></div>
              </div>
              <div class="advantage-item adv-3">
                <div class="advantage-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h4 class="advantage-title">高级 V12-V19</h4>
                <p class="advantage-desc">纸张折叠、莫比乌斯环、极光流淌</p>
                <div class="advantage-glow"></div>
              </div>
              <div class="advantage-item adv-4">
                <div class="advantage-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h4 class="advantage-title">精英级 V20-V27</h4>
                <p class="advantage-desc">液体张力、电磁波动、矩阵代码雨</p>
                <div class="advantage-glow"></div>
              </div>
            </div>
            <div class="about-stats">
              <div class="stat-item stat-1">
                <div class="stat-number-wrapper">
                  <span class="stat-number" data-target="150">0</span>
                  <div class="stat-ring ring-1"></div>
                </div>
                <p class="stat-name">动画模板</p>
              </div>
              <div class="stat-item stat-2">
                <div class="stat-number-wrapper">
                  <span class="stat-number" data-target="3">0</span>
                  <span class="stat-label">.14</span>
                  <div class="stat-ring ring-2"></div>
                </div>
                <p class="stat-name">GSAP版本</p>
              </div>
              <div class="stat-item stat-3">
                <div class="stat-number-wrapper">
                  <span class="stat-number" data-target="60">0</span>
                  <span class="stat-label">fps</span>
                  <div class="stat-ring ring-3"></div>
                </div>
                <p class="stat-name">流畅帧率</p>
              </div>
              <div class="stat-item stat-4">
                <div class="stat-number-wrapper">
                  <span class="stat-number" data-target="100">0</span>
                  <span class="stat-label">%</span>
                  <div class="stat-ring ring-4"></div>
                </div>
                <p class="stat-name">兼容性</p>
              </div>
            </div>
          </div>
          <div class="about-image">
            <div class="image-wrapper">
              <div class="image-box box-1">
                <div class="box-glow"></div>
                <div class="box-content">
                  <div class="box-icon-wrapper icon-rocket">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M4.5 16.5c-1.5 1.5-1.5 4.5 0 6l9 9"/>
                      <path d="M13.5 6.5l9 9c1.5 1.5 4.5 1.5 6 0"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <h4 class="box-title">星际传送门</h4>
                  <p class="box-desc">V28-V31 传奇级</p>
                  <div class="box-shine"></div>
                </div>
              </div>
              <div class="image-box box-2">
                <div class="box-glow"></div>
                <div class="box-content">
                  <div class="box-icon-wrapper icon-wave">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M2 12c2 4 4.5 6 7 6s5-2 7-6"/>
                      <path d="M2 12c2-4 4.5-6 7-6s5 2 7 6"/>
                    </svg>
                  </div>
                  <h4 class="box-title">液体流动</h4>
                  <p class="box-desc">V20-V23 精英级</p>
                  <div class="box-shine"></div>
                </div>
              </div>
              <div class="image-box box-3">
                <div class="box-glow"></div>
                <div class="box-content">
                  <div class="box-icon-wrapper icon-matrix">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M4 4h16v16H4V4zm4 4h8M4 12h8m-4 4h8"/>
                    </svg>
                  </div>
                  <h4 class="box-title">矩阵代码雨</h4>
                  <p class="box-desc">V20-V27 赛博朋克</p>
                  <div class="box-shine"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Echarts特效 - 水平滚动区域 -->
    <div id="services" class="vertical-wrap panels-container">
      <div class="panel services-panel">
        <section id="services-1" class="section services-section">
          <div class="section-bg-echarts">
            <div class="echarts-grid"></div>
            <div class="echarts-orb orb-1"></div>
            <div class="echarts-orb orb-2"></div>
          </div>
          <div class="container">
            <div class="section-header">
              <div class="header-badge">
                <span class="badge-icon">📊</span>
                <span class="badge-text">数据可视化</span>
              </div>
              <h2 class="section-title">Echarts特效 <span class="page-num">(1/3)</span></h2>
              <p class="section-subtitle">数据可视化的艺术表达</p>
            </div>
            <div class="services-grid">
              <div class="service-card card-1">
                <div class="card-glow"></div>
                <div class="service-icon icon-1">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 20V10M18 20V4M6 20v-7M12 4l4 4M12 4L8 8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div class="icon-pulse"></div>
                </div>
                <h3 class="service-title">动态柱状图</h3>
                <p class="service-desc">
                  流畅的数据增长动画，支持渐变填充、多组对比、动态更新。
                </p>
                <ul class="service-features">
                  <li><span class="feature-bullet">✓</span>平滑动画过渡</li>
                  <li><span class="feature-bullet">✓</span>渐变色彩填充</li>
                  <li><span class="feature-bullet">✓</span>多维度数据对比</li>
                  <li><span class="feature-bullet">✓</span>实时数据更新</li>
                </ul>
                <a href="#" class="service-link">
                  <span>了解更多</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              <div class="service-card card-2">
                <div class="card-glow"></div>
                <div class="service-icon icon-2">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2v20M2 12h20" stroke-linecap="round"/>
                  </svg>
                  <div class="icon-pulse"></div>
                </div>
                <h3 class="service-title">交互式饼图</h3>
                <p class="service-desc">
                  优雅的数据占比展示，支持扇区展开、标签引导、图例切换。
                </p>
                <ul class="service-features">
                  <li><span class="feature-bullet">✓</span>扇区展开动画</li>
                  <li><span class="feature-bullet">✓</span>引导线智能布局</li>
                  <li><span class="feature-bullet">✓</span>图例交互切换</li>
                  <li><span class="feature-bullet">✓</span>玫瑰图/南丁格尔图</li>
                </ul>
                <a href="#" class="service-link">
                  <span>了解更多</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="panel services-panel">
        <section id="services-2" class="section services-section">
          <div class="container">
            <h2 class="section-title">Echarts特效 (2/3)</h2>
            <p class="section-subtitle">20+图表类型，满足各种数据展示需求</p>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon icon-3">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M3 3v18h18" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 12l5 5-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="service-title">曲线趋势图</h3>
                <p class="service-desc">
                  平滑的数据走向，支持面积图、堆叠、标记点交互。
                </p>
                <ul class="service-features">
                  <li>贝塞尔曲线平滑</li>
                  <li>多Y轴支持</li>
                  <li>区域渐变填充</li>
                  <li>缩放漫游交互</li>
                </ul>
                <a href="#" class="service-link">了解更多 →</a>
              </div>
              <div class="service-card">
                <div class="service-icon icon-4">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="service-title">雷达分析图</h3>
                <p class="service-desc">
                  多维数据对比分析，支持多雷达图、指标对比、填充样式。
                </p>
                <ul class="service-features">
                  <li>多维度数据展示</li>
                  <li>指标实时对比</li>
                  <li>填充样式自定义</li>
                  <li>区域层级展示</li>
                </ul>
                <a href="#" class="service-link">了解更多 →</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="panel services-panel">
        <section id="services-3" class="section services-section">
          <div class="container">
            <h2 class="section-title">Echarts特效 (3/3)</h2>
            <p class="section-subtitle">高性能渲染，百万级数据流畅展示</p>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon icon-5">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3 class="service-title">3D图表</h3>
                <p class="service-desc">
                  沉浸式3D数据可视化，支持旋转、缩放、平移交互。
                </p>
                <ul class="service-features">
                  <li>3D柱状/饼图/散点</li>
                  <li>360°旋转查看</li>
                  <li>实时3D渲染</li>
                  <li>透视投影效果</li>
                </ul>
                <a href="#" class="service-link">了解更多 →</a>
              </div>
              <div class="service-card">
                <div class="service-icon icon-6">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"/>
                    <path d="M12 12v4M12 16h4M8 16h4" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3 class="service-title">主题定制</h3>
                <p class="service-desc">
                  10+精美主题，支持自定义配色、深色模式、暗黑主题。
                </p>
                <ul class="service-features">
                  <li>内置10+主题</li>
                  <li>自定义配色方案</li>
                  <li>深色/暗黑模式</li>
                  <li>品牌色一键适配</li>
                </ul>
                <a href="#" class="service-link">了解更多 →</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 3D云展厅 -->
    <section id="portfolio" class="section portfolio-section vertical">
      <div class="section-bg-portfolio">
        <div class="portfolio-mesh"></div>
        <div class="portfolio-orb orb-1"></div>
        <div class="portfolio-orb orb-2"></div>
      </div>
      <div class="container">
        <div class="section-header">
          <div class="header-badge">
            <span class="badge-icon">🎨</span>
            <span class="badge-text">虚拟展厅</span>
          </div>
          <h2 class="section-title">3D云展厅</h2>
          <p class="section-subtitle">沉浸式线上展览体验，突破时空限制</p>
        </div>
        <div class="portfolio-grid">
          <div class="portfolio-item item-1 card-3d-hover">
            <div class="portfolio-glow glow-1"></div>
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <div class="icon-3d-effect">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                    <path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"/>
                    <circle cx="12" cy="13" r="3"/>
                    <path d="M12 16v3" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <h3 class="portfolio-title">360°产品展示</h3>
              <p class="portfolio-desc">
                产品全方位立体展示，支持旋转、缩放、细节查看。
                用户可自由探索产品每个角度，真实还原线下体验。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">自由旋转</span>
                <span class="feature-tag">缩放查看</span>
                <span class="feature-tag">细节展示</span>
              </div>
              <div class="portfolio-hologram"></div>
            </div>
          </div>
          <div class="portfolio-item item-2 card-3d-hover">
            <div class="portfolio-glow glow-2"></div>
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <div class="icon-3d-effect">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                    <path d="M15 3h6v6h-6M9 21h6M12 16l-2 4M12 16l2 4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 3a9 9 0 00-9 9v3.6" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <h3 class="portfolio-title">虚拟漫游体验</h3>
              <p class="portfolio-desc">
                沉浸式虚拟漫游，用户如临现场般自由探索展厅。
                支持点击热点、语音导览、自动巡游模式。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">自由漫游</span>
                <span class="feature-tag">语音导览</span>
                <span class="feature-tag">热点交互</span>
              </div>
              <div class="portfolio-hologram"></div>
            </div>
          </div>
          <div class="portfolio-item item-3 card-3d-hover">
            <div class="portfolio-glow glow-3"></div>
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <div class="icon-3d-effect">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                    <path d="M2 12h20M12 2a10 10 0 00-10 10v2a10 10 0 0010 10v-8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 16v4" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="portfolio-title">云端快速部署</h3>
              <p class="portfolio-desc">
                轻量化云端部署，秒级加载无需下载。
                支持CDN加速、多地区部署、实时更新。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">秒级加载</span>
                <span class="feature-tag">CDN加速</span>
                <span class="feature-tag">实时更新</span>
              </div>
            </div>
          </div>
          <div class="portfolio-item item-4">
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 00-2-2H9a2 2 0 00-2-2m10 0v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 13l-3 3" stroke-linecap="round"/>
                  <circle cx="14" cy="13" r="1.5"/>
                </svg>
              </div>
              <h3 class="portfolio-title">数据分析统计</h3>
              <p class="portfolio-desc">
                用户行为追踪分析，热力图展示用户关注点。
                支持访问统计、停留时长、交互次数分析。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">热力分析</span>
                <span class="feature-tag">行为追踪</span>
                <span class="feature-tag">数据报表</span>
              </div>
            </div>
          </div>
          <div class="portfolio-item item-5">
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V8c0-5.523-4.477-10-10-10S6.477 2 12 2s10 4.477 10 10v4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 14h8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16v4" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="portfolio-title">品牌个性定制</h3>
              <p class="portfolio-desc">
                完全定制化设计，打造专属线上展厅。
                支持品牌色、Logo植入、专属UI风格。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">品牌定制</span>
                <span class="feature-tag">专属UI</span>
                <span class="feature-tag">Logo植入</span>
              </div>
            </div>
          </div>
          <div class="portfolio-item item-6">
            <div class="portfolio-content">
              <div class="portfolio-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9l3 3m-3-3l3 3m6-6l-3 3m0 0l-3-3m6 0l3-3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="portfolio-title">多端完美适配</h3>
              <p class="portfolio-desc">
                支持PC、平板、手机多端访问，
                自动适配各种屏幕尺寸，流畅体验。
              </p>
              <div class="portfolio-features">
                <span class="feature-tag">PC端</span>
                <span class="feature-tag">平板端</span>
                <span class="feature-tag">手机端</span>
              </div>
            </div>
          </div>
        </div>
        <div class="showcase-types">
          <h3 class="types-title">适用场景</h3>
          <div class="types-grid">
            <div class="type-card">
              <span class="type-emoji">🏢</span>
              <h4>企业展厅</h4>
              <p>展示企业实力与产品</p>
            </div>
            <div class="type-card">
              <span class="type-emoji">🎨</span>
              <h4>艺术展览</h4>
              <p>线上艺术作品展</p>
            </div>
            <div class="type-card">
              <span class="type-emoji">🏠</span>
              <h4>房产看房</h4>
              <p>VR样板间体验</p>
            </div>
            <div class="type-card">
              <span class="type-emoji">🚗</span>
              <h4>汽车展厅</h4>
              <p>3D车型展示</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="section contact-section vertical">
      <div class="contact-bg">
        <div class="contact-gradient-1"></div>
        <div class="contact-gradient-2"></div>
        <div class="contact-orb orb-1"></div>
        <div class="contact-orb orb-2"></div>
        <div class="contact-particle-grid"></div>
        <div class="contact-hologram"></div>
      </div>
      <div class="container">
        <div class="contact-header">
          <div class="contact-badge">
            <span class="badge-dot"></span>
            <span class="badge-text">立即联系</span>
          </div>
          <h2 class="section-title">联系我们</h2>
          <p class="section-subtitle">期待与您的合作，共创美好未来</p>
        </div>
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-card">
              <div class="info-icon-wrapper">
                <div class="info-icon icon-location">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div class="icon-glow"></div>
              </div>
              <div class="info-text">
                <h4>公司地址</h4>
                <p>北京市朝阳区科技园创新大厦A座12层</p>
                <p class="info-sub">邮编：100020</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon-wrapper">
                <div class="info-icon icon-phone">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4h8a2 2 0 012 2v2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 16.92v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="icon-glow"></div>
              </div>
              <div class="info-text">
                <h4>联系电话</h4>
                <p>400-888-8888（全国免费热线）</p>
                <p class="info-sub">010-88886666（北京总部）</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon-wrapper">
                <div class="info-icon icon-email">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <path d="M22 6l-10 7L2 6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="icon-glow"></div>
              </div>
              <div class="info-text">
                <h4>电子邮箱</h4>
                <p>contact@zooow-ai.com</p>
                <p class="info-sub">business@zooow-ai.com</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon-wrapper">
                <div class="info-icon icon-time">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="icon-glow"></div>
              </div>
              <div class="info-text">
                <h4>工作时间</h4>
                <p>周一至周五 9:00 - 18:00</p>
                <p class="info-sub">周末及法定节假日休息</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <div class="form-header">
              <div class="form-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  <path d="M8 10h8M8 14h6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="form-title-group">
                <h3>在线留言</h3>
                <p>填写下方表单，我们将在24小时内与您联系</p>
              </div>
            </div>
            <form>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" placeholder="您的姓名 *" class="form-input" />
                </div>
                <div class="form-group">
                  <input type="email" placeholder="您的邮箱 *" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" placeholder="联系电话" class="form-input" />
                </div>
                <div class="form-group">
                  <input type="text" placeholder="公司名称" class="form-input" />
                </div>
              </div>
              <div class="form-group full-width">
                <select class="form-select">
                  <option value="">请选择咨询类型</option>
                  <option value="web">AI网站建设</option>
                  <option value="animation">3D动画特效</option>
                  <option value="echarts">Echarts特效</option>
                  <option value="showroom">3D云展厅</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div class="form-group full-width">
                <textarea placeholder="请描述您的需求或问题 *" class="form-textarea"></textarea>
              </div>
              <button type="submit" class="form-submit">
                <span class="submit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>发送消息</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

definePageMeta({
  layout: false
})

// SEO Meta
useHead({
  title: '产品中心 - ZOOOW-AI',
  meta: [
    { name: 'description', content: '探索我们的全线产品，找到最适合您的解决方案' }
  ]
})

// 防抖函数
const createDebouncedFn = (fn: Function, delay: number, id: string) => {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 清理所有动画
const killAllAnimation = ({ keepScrollPosition }: { keepScrollPosition?: boolean } = {}) => {
  const scrollPos = keepScrollPosition ? window.pageYOffset : 0
  gsap.killTweensOf('*')
  ScrollTrigger.getAll().forEach(st => st.kill())
  if (keepScrollPosition && scrollPos) {
    window.scrollTo(0, scrollPos)
  }
}

// 参考的垂直滚动动画模式
const verticalAnimation = async (selector: string, runStyle: any) => {
  try {
    if (!selector || !runStyle) return

    const toKey = runStyle.toKey || 'from'
    delete runStyle.toKey

    // 创建滚动触发动画
    gsap[toKey](selector, {
      ...runStyle,
      scrollTrigger: {
        trigger: selector,
        scrub: 1,
        markers: false,
        start: 'top 100%',
        end: 'bottom 100%'
      }
    })
  } catch (error) {
    console.error('纵向动画创建失败:', error)
  }
}

// 单页无限滚动
let pageScrollTriggerInstance: any = null
let scrollPanelTriggers: any[] = []
let clonedPanelNode: any = null
let onScrollResize: any = null
let onWindowScroll: any = null
let maxScrollValue: number = 0

const infinitePanelScrollAnimation = (className = 'vertical') => {
  ScrollTrigger.refresh()

  let panels: any[] = []

  const cleanup = () => {
    // 移除事件监听器
    if (onScrollResize) {
      window.removeEventListener('resize', onScrollResize)
    }
    if (onWindowScroll) {
      window.removeEventListener('scroll', onWindowScroll, { passive: false } as any)
    }

    // 清理页面级ScrollTrigger
    pageScrollTriggerInstance?.kill?.()
    pageScrollTriggerInstance = null

    // 清理所有panel的ScrollTrigger
    scrollPanelTriggers.forEach(st => {
      try {
        st?.kill?.()
      } catch (e) {
        console.warn('清理panel ScrollTrigger失败:', e)
      }
    })
    scrollPanelTriggers = []

    // 移除克隆的节点
    if (clonedPanelNode && clonedPanelNode.parentNode) {
      clonedPanelNode.parentNode.removeChild(clonedPanelNode)
      clonedPanelNode = null
    }

    // 恢复panels的pin样式
    panels.forEach(panel => {
      try {
        panel.style.position = ''
        panel.style.transform = ''
        panel.style.zIndex = ''
      } catch (e) {
        console.warn('恢复panel样式失败:', e)
      }
    })

    killAllAnimation({ keepScrollPosition: true })
  }

  nextTick(() => {
    panels = gsap.utils.toArray(`.${className}`) || []
    if (panels.length <= 0) return

    // 过滤掉 vertical-wrap 中的 panel
    panels = panels.filter(panel => {
      const parent = panel.parentElement
      return !parent || !parent.classList.contains('vertical-wrap')
    })

    if (panels.length <= 0) return

    // 克隆第一个节点（用于无限滚动效果）
    clonedPanelNode = panels[0].cloneNode(true)
    clonedPanelNode.setAttribute('data-cloned', 'true')
    panels[0].parentNode?.appendChild(clonedPanelNode)

    // 为每个panel创建ScrollTrigger，固定每个面板
    panels.forEach((panel) => {
      const trigger = ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true,
        pinSpacing: false
      })
      scrollPanelTriggers.push(trigger)
    })

    // 创建页面级别的snap ScrollTrigger
    pageScrollTriggerInstance = ScrollTrigger.create({
      snap(value: number) {
        const snappedValue = gsap.utils.snap(1 / panels.length, value)
        if (snappedValue <= 0) return 1.05 / maxScrollValue
        if (snappedValue >= 1) return maxScrollValue / (maxScrollValue + 1.05)
        return snappedValue
      }
    })

    // 防抖的resize处理
    onScrollResize = createDebouncedFn(() => {
      maxScrollValue = (ScrollTrigger as any).maxScroll(window) - 1
    }, 100, 'infinite-resize')

    // 滚动事件处理 - 实现无限循环
    onWindowScroll = (e: Event) => {
      const scroll = pageScrollTriggerInstance.scroll()
      if (scroll > maxScrollValue) {
        pageScrollTriggerInstance.scroll(1)
        e.preventDefault()
      } else if (scroll < 1) {
        pageScrollTriggerInstance.scroll(maxScrollValue - 1)
        e.preventDefault()
      }
    }

    // 初始化
    onScrollResize()
    window.addEventListener('resize', onScrollResize)
    window.addEventListener('scroll', onWindowScroll, { passive: false } as any)
  })

  return cleanup
}

onMounted(() => {
  // 初始化打字机效果
  const initTypewriter = () => {
    const text = '· 下一代智能体验 · 沉浸式3D动画 · 实时数据可视化'
    const typewriterEl = document.querySelector('.typewriter-text')
    if (!typewriterEl) return

    let index = 0
    const typeSpeed = 100

    const typeChar = () => {
      if (index < text.length) {
        typewriterEl.textContent += text.charAt(index)
        index++
        setTimeout(typeChar, typeSpeed)
      } else {
        // 完成后暂停一下，然后重新开始
        setTimeout(() => {
          typewriterEl.textContent = ''
          index = 0
          typeChar()
        }, 3000)
      }
    }

    setTimeout(typeChar, 1000)
  }

  // 初始化高级粒子系统
  const initAdvancedParticles = () => {
    const container = document.getElementById('advanced-particles')
    if (!container) return

    const particleCount = 50
    const colors = ['#667eea', '#f093fb', '#764ba2', '#fff']

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'advanced-particle'

      const size = Math.random() * 4 + 2
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 10 + 10
      const delay = Math.random() * 5
      const color = colors[Math.floor(Math.random() * colors.length)]

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 ${size * 3}px ${color};
        opacity: ${Math.random() * 0.5 + 0.3};
        animation: advancedParticleFloat ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
      `

      container.appendChild(particle)
    }
  }

  // 添加高级粒子动画的关键帧
  const addAdvancedParticleKeyframes = () => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes advancedParticleFloat {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
          opacity: 0.6;
        }
        50% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1);
          opacity: 0.8;
        }
        75% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
          opacity: 0.5;
        }
      }
    `
    document.head.appendChild(style)
  }

  // 初始化粒子样式（解决SSR水合问题）
  const initParticles = () => {
    const particles = document.querySelectorAll('.particle')
    particles.forEach((particle) => {
      const size = 3 + Math.random() * 5
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 2
      const duration = 2 + Math.random() * 3
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${left}%`
      particle.style.top = `${top}%`
      particle.style.animationDelay = `${delay}s`
      particle.style.animationDuration = `${duration}s`
    })
  }

  // 初始化所有动画系统
  initTypewriter()
  addAdvancedParticleKeyframes()
  initAdvancedParticles()
  initParticles()

  // 鼠标跟随粒子效果
  const initMouseParticles = () => {
    const heroSection = document.querySelector('.hero-section')
    if (!heroSection) return

    let mouseX = 0
    let mouseY = 0
    let particles: HTMLDivElement[] = []
    const maxParticles = 15

    heroSection.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      // 创建新粒子
      if (particles.length < maxParticles) {
        const particle = document.createElement('div')
        particle.className = 'mouse-particle'
        const size = Math.random() * 6 + 3
        const colors = ['#667eea', '#f093fb', '#764ba2', '#fff']
        const color = colors[Math.floor(Math.random() * colors.length)]

        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${mouseX}px;
          top: ${mouseY}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 ${size * 2}px ${color};
          opacity: 1;
          z-index: 5;
        `

        heroSection.appendChild(particle)
        particles.push(particle)

        // 粒子动画
        const angle = Math.random() * Math.PI * 2
        const velocity = Math.random() * 100 + 50
        const tx = Math.cos(angle) * velocity
        const ty = Math.sin(angle) * velocity

        gsap.to(particle, {
          x: tx,
          y: ty,
          opacity: 0,
          scale: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            particle.remove()
            particles = particles.filter(p => p !== particle)
          }
        })
      }
    })
  }

  initMouseParticles()

  // 3D卡片悬停效果
  const init3DCardHover = () => {
    const cards = document.querySelectorAll('.card-3d-hover')

    cards.forEach(card => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })
  }

  init3DCardHover()

  // 暂时禁用无限滚动，避免与水平滚动冲突
  // const cleanupInfiniteScroll = infinitePanelScrollAnimation()

  // 服务项目水平滚动
  nextTick(() => {
    ScrollTrigger.refresh()

    const container = document.querySelector('.vertical-wrap.panels-container')
    if (!container) return

    const panels = container.querySelectorAll('.panel')
    if (!panels.length) return

    console.log('水平滚动初始化:', {
      panelsCount: panels.length,
      containerWidth: container.offsetWidth,
      windowWidth: window.innerWidth,
      scrollDistance: container.offsetWidth - window.innerWidth,
      targetXPercent: -100 * (panels.length - 1)
    })

    const tween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        start: 'top top',
        scrub: 1,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (panels.length - 1),
          inertia: false,
          duration: { min: 0.1, max: 0.1 }
        },
        end: () => '+=' + (container.offsetWidth - window.innerWidth)
      }
    })
  })

  // 导航栏动画
  gsap.from('.navbar', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  // Hero 区域动画 - 使用垂直滚动动画
  verticalAnimation('.hero-bg', {
    scale: 1.2,
    opacity: 0,
    duration: 1.5,
    toKey: 'from'
  })

  verticalAnimation('.hero-badge', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    toKey: 'from'
  })

  verticalAnimation('.title-line', {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    toKey: 'from'
  })

  verticalAnimation('.hero-subtitle', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    toKey: 'from'
  })

  verticalAnimation('.hero-stat', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    toKey: 'from'
  })

  verticalAnimation('.hero-stat-divider', {
    scaleY: 0,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    toKey: 'from'
  })

  verticalAnimation('.hero-testimonial', {
    y: 50,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  // 标题字符逐个动画
  verticalAnimation('.title-char', {
    y: 100,
    opacity: 0,
    rotationX: 90,
    duration: 0.8,
    stagger: 0.08,
    toKey: 'from'
  })

  verticalAnimation('.hero-btn', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    toKey: 'from'
  })

  verticalAnimation('.feature-card', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    toKey: 'from'
  })

  // 装饰圆形动画
  verticalAnimation('.deco-circle', {
    scale: 0,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    toKey: 'from'
  })

  // 浮动形状动画
  verticalAnimation('.floating-shape', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    toKey: 'from'
  })

  // 装饰圆形持续动画
  gsap.to('.circle-1', {
    rotate: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })
  gsap.to('.circle-2', {
    rotate: -360,
    duration: 25,
    repeat: -1,
    ease: 'none'
  })
  gsap.to('.circle-3', {
    y: -30,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  // 浮动形状持续动画
  gsap.to('.shape-1', {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  gsap.to('.shape-2', {
    y: -15,
    rotate: 180,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  gsap.to('.shape-3', {
    y: -25,
    rotate: 360,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  // 关于我们 - 使用垂直滚动动画
  verticalAnimation('.about-text', {
    x: -100,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  verticalAnimation('.about-image', {
    x: 100,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  // 优势项动画
  verticalAnimation('.advantage-item', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    toKey: 'from'
  })

  // 统计数字动画
  verticalAnimation('.stat-item', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    toKey: 'from'
  })

  // 图片盒子动画
  verticalAnimation('.image-box', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    toKey: 'from'
  })

  // Hero 数字增长动画
  const heroStatNumbers = document.querySelectorAll('.hero-stat-number')
  heroStatNumbers.forEach((stat, index) => {
    const target = parseInt(stat.getAttribute('data-target') || '0')
    const isDecimal = stat.getAttribute('data-target')?.includes('.')

    gsap.to(stat, {
      scrollTrigger: {
        trigger: '.hero-stats',
        start: 'top 85%'
      },
      innerText: target,
      duration: 2.5,
      ease: 'power2.out',
      snap: { innerText: 1 },
      delay: index * 0.15,
      onUpdate: function() {
        const value = Math.ceil(this.targets()[0].innerText)
        if (isDecimal && index === 1) {
          // GSAP引擎显示为小数
          const progress = this.progress()
          this.targets()[0].innerHTML = (0 + progress * 3.14).toFixed(2)
        } else if (index === 2) {
          // 100% 添加百分号
          this.targets()[0].innerHTML = value + '%'
        } else if (index === 3) {
          // 50K+ 添加单位
          this.targets()[0].innerHTML = value + 'K+'
        } else {
          // 150+ 加号
          this.targets()[0].innerHTML = value + '+'
        }
      }
    })
  })

  // 数字增长动画
  const statNumbers = document.querySelectorAll('.about-stats .stat-number')
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target') || '0')
    gsap.to(stat, {
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 85%'
      },
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function() {
        this.targets()[0].innerHTML = Math.ceil(this.targets()[0].innerText)
      }
    })
  })

  // 服务卡片 - 使用垂直滚动动画
  verticalAnimation('.service-card', {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    toKey: 'from'
  })

  // 案例项目 - 使用垂直滚动动画
  verticalAnimation('.portfolio-item', {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    toKey: 'from'
  })

  // 案例图标动画
  verticalAnimation('.portfolio-icon', {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    toKey: 'from'
  })

  // 案例标题动画
  verticalAnimation('.portfolio-title', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    toKey: 'from'
  })

  // 案例描述动画
  verticalAnimation('.portfolio-desc', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    toKey: 'from'
  })

  // 案例特性标签动画
  verticalAnimation('.feature-tag', {
    y: 15,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    toKey: 'from'
  })

  // 场景类型动画
  verticalAnimation('.showcase-types', {
    y: 60,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  verticalAnimation('.type-card', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    toKey: 'from'
  })

  // 案例项目悬停效果
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        scale: 1.05,
        boxShadow: '0 30px 60px rgba(102, 126, 234, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(item.querySelector('.portfolio-icon'), {
        scale: 1.2,
        rotate: 10,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })
    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(item.querySelector('.portfolio-icon'), {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 场景卡片悬停
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -15,
        scale: 1.05,
        boxShadow: '0 30px 60px rgba(102, 126, 234, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 联系信息 - 使用垂直滚动动画
  verticalAnimation('.contact-header', {
    y: 40,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  verticalAnimation('.contact-info', {
    x: -80,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  verticalAnimation('.contact-form', {
    x: 80,
    opacity: 0,
    duration: 1,
    toKey: 'from'
  })

  // 联系信息卡片动画
  verticalAnimation('.info-card', {
    x: -50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    toKey: 'from'
  })

  // 表单头部动画
  verticalAnimation('.form-header', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    toKey: 'from'
  })

  // 表单输入框动画
  verticalAnimation('.form-group', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    toKey: 'from'
  })

  // 信息卡片悬停效果
  document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.info-icon'), {
        scale: 1.15,
        rotate: 5,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.info-icon'), {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 提交按钮滑光效果
  document.querySelectorAll('.form-submit').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn.querySelector('.submit-icon svg'), {
        x: 5,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn.querySelector('.submit-icon svg'), {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 地图占位符动画
  verticalAnimation('.map-placeholder', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    toKey: 'from'
  })

  // 服务卡片悬停效果
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.service-icon'), {
        scale: 1.2,
        rotate: 5,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.service-icon'), {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 服务图标持续动画
  gsap.to('.service-icon', {
    scale: 1.1,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    stagger: {
      each: 0.2,
      from: 'random'
    }
  })

  // 表单输入框焦点动画
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, {
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.3)',
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    input.addEventListener('blur', () => {
      gsap.to(input, {
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 平滑滚动到指定section
  const scrollToSection = (index: number) => {
    const hrefMap = ['#home', '#about', '#services', '#portfolio', '#contact']
    const href = hrefMap[index]

    if (!href) return

    // 使用更精确的计算方式
    let targetPosition = 0

    if (href === '#home') {
      targetPosition = 0
    } else if (href === '#about') {
      targetPosition = window.innerHeight
    } else if (href === '#services') {
      // 服务容器开始位置 - 始终使用计算值，因为pin后offsetTop不准确
      targetPosition = 2 * window.innerHeight
    } else if (href === '#portfolio') {
      const portfolioSection = document.querySelector('#portfolio') as HTMLElement
      if (portfolioSection && portfolioSection.offsetTop > 0) {
        // 使用实际的 offsetTop
        targetPosition = portfolioSection.offsetTop
      } else {
        // 回退到计算值：首页1 + 关于1 + 服务3 = 5
        targetPosition = 5 * window.innerHeight
      }
    } else if (href === '#contact') {
      const contactSection = document.querySelector('#contact') as HTMLElement
      if (contactSection && contactSection.offsetTop > 0) {
        targetPosition = contactSection.offsetTop
      } else {
        // 回退到计算值：首页1 + 关于1 + 服务3 + 案例1 = 6
        targetPosition = 6 * window.innerHeight
      }
    }

    console.log('Scrolling to:', {
      href,
      targetPosition,
      viewportIndex: Math.round(targetPosition / window.innerHeight),
      windowInnerHeight: window.innerHeight
    })

    const body = document.body
    const originalOverflow = body.style.overflow
    body.style.overflow = 'auto'

    gsap.to(window, {
      duration: 1,
      scrollTo: { y: targetPosition, autoKill: false, offsetY: 0 },
      ease: 'power3.inOut',
      onComplete: () => {
        body.style.overflow = originalOverflow
      }
    })
  }

  // 导航链接点击跳转
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      const panels = gsap.utils.toArray('.vertical')

      let targetIndex = 0
      if (href === '#home') targetIndex = 0
      else if (href === '#about') targetIndex = 1
      else if (href === '#services') targetIndex = 2
      else if (href === '#portfolio') targetIndex = 3
      else if (href === '#contact') targetIndex = 4

      scrollToSection(targetIndex)
    })
  })

  // 导航链接悬停动画
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        color: '#667eea',
        y: -2,
        duration: 0.2,
        ease: 'power2.out'
      })
    })
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        color: '#fff',
        y: 0,
        duration: 0.2,
        ease: 'power2.out'
      })
    })
  })

  // 按钮悬停动画
  document.querySelectorAll('.hero-btn, .nav-button, .form-submit').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.05,
        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
      gsap.to(btn.querySelector('.btn-icon-right, .submit-icon'), {
        x: 5,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(btn.querySelector('.btn-icon-right, .submit-icon'), {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 特性卡片悬停动画
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.feature-icon-wrap'), {
        rotate: 360,
        scale: 1.2,
        duration: 0.5,
        ease: 'back.out(1.7)'
      })
      gsap.to(card.querySelector('.feature-text'), {
        color: '#667eea',
        duration: 0.3
      })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.feature-icon-wrap'), {
        rotate: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.feature-text'), {
        color: '#fff',
        duration: 0.3
      })
    })
  })

  // 推荐引用动画
  gsap.to('.testimonial-quote', {
    scrollTrigger: {
      trigger: '.hero-testimonial',
      start: 'top 80%'
    },
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  })
})
</script>


<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overscroll-behavior: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0a0a0f;
  color: #fff;
  overflow: hidden;
  overflow-x: hidden;
}

.website-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.website-container::-webkit-scrollbar {
  display: none;
}

// 粒子动画
.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.6);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 1;
  }
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-logo {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 40px;
  position: relative;

  .nav-link {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    padding: 8px 0;
    transition: color 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #f093fb, #764ba2);
      background-size: 200% 100%;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 2px;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #f093fb, #667eea);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(-50%);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    &:hover {
      color: #667eea;
      text-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
      animation: textGlow 0.6s ease;

      &::before {
        width: 100%;
        animation: gradientMove 2s linear infinite;
      }

      &::after {
        width: 80%;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.nav-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 200% 200%;
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    opacity: 0;
    transform: scale(0);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5), 0 0 30px rgba(102, 126, 234, 0.3);
    background-position: 100% 100%;

    &::before {
      left: 100%;
    }

    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
}

// 导航栏动画效果
@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
  }
  50% {
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(240, 147, 251, 0.4);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 通用容器
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px;
}

// 通用区块
.section {
  min-height: 100vh;
  padding: 100px 0;
  position: relative;
}

.section-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 20px;
  color: #a0aec0;
  margin-bottom: 60px;
}

// 首屏 Hero
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  overflow: hidden;
  position: relative;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  z-index: -10;
  overflow: hidden;

  .bg-gradient-1 {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
    animation: gradientFloat 15s ease-in-out infinite;
  }

  .bg-gradient-2 {
    position: absolute;
    bottom: -50%;
    left: -30%;
    width: 100%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(118, 75, 162, 0.15) 0%, transparent 70%);
    animation: gradientFloat 20s ease-in-out infinite reverse;
  }

  .bg-gradient-3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150%;
    height: 150%;
    background: conic-gradient(from 0deg at 50% 50%, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1), rgba(240, 147, 251, 0.1), rgba(102, 126, 234, 0.1));
    animation: conicRotate 30s linear infinite;
    opacity: 0.5;
  }

  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
  }

  .aurora-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(ellipse at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 40%, rgba(240, 147, 251, 0.08) 0%, transparent 50%);
    animation: auroraPulse 8s ease-in-out infinite;
  }

  .nebula-effect {
    position: absolute;
    top: -100%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.05) 0%, transparent 60%);
    filter: blur(60px);
    animation: nebulaFloat 25s ease-in-out infinite;
  }

  .star-field {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 100%),
        radial-gradient(1px 1px at 40% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 100%),
        radial-gradient(1px 1px at 60% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 100%),
        radial-gradient(1px 1px at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 100%),
        radial-gradient(2px 2px at 10% 60%, rgba(102, 126, 234, 0.4) 0%, transparent 100%),
        radial-gradient(2px 2px at 90% 40%, rgba(118, 75, 162, 0.4) 0%, transparent 100%);
    animation: starTwinkle 4s ease-in-out infinite;
  }
}

@keyframes gradientFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

@keyframes conicRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes auroraPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes nebulaFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10%, 10%); }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.hero-lightning {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.6), transparent);
  opacity: 0;
  animation: lightningFlash 4s ease-in-out infinite;
}

.lightning-1 {
  left: 20%;
  animation-delay: 0s;
}

.lightning-2 {
  right: 15%;
  animation-delay: 2s;
}

@keyframes lightningFlash {
  0%, 100% { opacity: 0; }
  1% { opacity: 1; }
  2% { opacity: 0; }
  3% { opacity: 1; }
  4% { opacity: 0; }
}

.hero-mesh {
  position: absolute;
  width: 400px;
  height: 400px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  animation: meshRotate 20s linear infinite;
}

.mesh-1 {
  top: -100px;
  right: -100px;
}

.mesh-2 {
  bottom: -100px;
  left: -100px;
}

@keyframes meshRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  right: 10%;
  top: 20%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  left: 15%;
  bottom: 30%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%);
  animation-delay: 2s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  right: 30%;
  bottom: 10%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
  animation-delay: 4s;
}

.orb-4 {
  width: 180px;
  height: 180px;
  left: 25%;
  top: 15%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  animation-delay: 6s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: glowPulse 6s ease-in-out infinite;
}

.glow-1 {
  width: 400px;
  height: 400px;
  right: 5%;
  top: 10%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
}

.glow-2 {
  width: 350px;
  height: 350px;
  left: 10%;
  bottom: 20%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%);
  animation-delay: 3s;
}

.glow-3 {
  width: 300px;
  height: 300px;
  right: 20%;
  bottom: 5%;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.15) 0%, transparent 70%);
  animation-delay: 1.5s;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.floating-crystal {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: crystalFloat 10s ease-in-out infinite;
}

.crystal-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.crystal-2 {
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.crystal-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 6s;
}

@keyframes crystalFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-50px) rotate(180deg); opacity: 1; }
}

.hexagon-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
  animation: hexPulse 10s ease-in-out infinite;
}

@keyframes hexPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.wave-anim {
  position: absolute;
  width: 200%;
  height: 100px;
  left: -50%;
  opacity: 0.1;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent);
}

.wave-1 {
  bottom: 0;
  animation: waveMove 8s linear infinite;
}

.wave-2 {
  bottom: 20px;
  animation: waveMove 10s linear infinite reverse;
  opacity: 0.05;
}

.wave-3 {
  bottom: 40px;
  animation: waveMove 12s linear infinite;
  opacity: 0.03;
}

@keyframes waveMove {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

.hero-content {
  text-align: center;
  z-index: 1;
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 25px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  .badge-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
    animation: badgeShine 3s linear infinite;
  }

  .badge-glow {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 60%);
    animation: badgeGlowPulse 2s ease-in-out infinite;
  }
}

@keyframes badgeShine {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

@keyframes badgeGlowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.badge-icon {
  font-size: 20px;
  position: relative;
  z-index: 1;
}

.badge-text {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  position: relative;
  z-index: 1;
}


.hero-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  margin-bottom: 30px;
  position: relative;
}

.hero-title {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.3;
  margin: 0;
  position: relative;
  perspective: 1500px;
  transform-style: preserve-3d;

  .title-line {
    display: block;
  }

  .title-char {
    display: inline-block;
    position: relative;
    background: linear-gradient(135deg, #fff 0%, #a0aec0 30%, #667eea 70%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: charFloat 4s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    font-size: 72px;

    &.char-1 { animation-delay: 0s; }
    &.char-2 { animation-delay: 0.1s; }
    &.char-3 { animation-delay: 0.2s; }
    &.char-4 { animation-delay: 0.3s; }
    &.char-5 { animation-delay: 0.4s; }
    &.char-6 { animation-delay: 0.5s; }
  }
}

.hero-title-right {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.3;
  margin: 0;
  position: relative;
  perspective: 1500px;
  transform-style: preserve-3d;

  .title-line {
    display: block;
    background: linear-gradient(135deg, #667eea 0%, #f093fb 30%, #764ba2 60%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: titlePulse 3s ease-in-out infinite;
    text-shadow: 0 0 40px rgba(240, 147, 251, 0.6);
  }
}

@keyframes titlePulse {
  0%, 100% {
    filter: brightness(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.2);
    transform: scale(1.02);
  }
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 200%;
  background:
      radial-gradient(ellipse at 30% 30%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 70%, rgba(118, 75, 162, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.2) 0%, transparent 60%);
  filter: blur(60px);
  z-index: -1;
  animation: titleGlowPulse 5s ease-in-out infinite;
}

.title-particle {
  position: absolute;
  top: -20%;
  left: -10%;
  right: -10%;
  bottom: -20%;
  background-image:
      radial-gradient(2px 2px at 5% 15%, rgba(102, 126, 234, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 15% 35%, rgba(118, 75, 162, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 25% 25%, rgba(240, 147, 251, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 35% 65%, rgba(102, 126, 234, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 45% 45%, rgba(118, 75, 162, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 55% 25%, rgba(240, 147, 251, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 65% 75%, rgba(102, 126, 234, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 75% 55%, rgba(118, 75, 162, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 85% 35%, rgba(240, 147, 251, 0.9) 0%, transparent 100%),
      radial-gradient(2px 2px at 95% 85%, rgba(102, 126, 234, 0.9) 0%, transparent 100%);
  animation: titleParticleSparkle 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes charFloat {
  0%, 100% {
    transform: translateY(0) rotateX(0deg) rotateY(0deg);
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  }
  25% {
    transform: translateY(-8px) rotateX(5deg) rotateY(-5deg);
    text-shadow: 0 0 40px rgba(102, 126, 234, 0.7);
  }
  50% {
    transform: translateY(-15px) rotateX(0deg) rotateY(0deg);
    text-shadow: 0 0 50px rgba(102, 126, 234, 0.8), 0 0 80px rgba(240, 147, 251, 0.5);
  }
  75% {
    transform: translateY(-8px) rotateX(-5deg) rotateY(5deg);
    text-shadow: 0 0 40px rgba(118, 75, 162, 0.7);
  }
}

@keyframes lineGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
    transform: scaleX(1);
  }
  25% {
    filter: drop-shadow(0 0 40px rgba(102, 126, 234, 0.8));
    transform: scaleX(1.02);
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(240, 147, 251, 0.8)) drop-shadow(0 0 100px rgba(102, 126, 234, 0.6));
    transform: scaleX(1);
  }
  75% {
    filter: drop-shadow(0 0 40px rgba(118, 75, 162, 0.8));
    transform: scaleX(1.02);
  }
}

@keyframes titleGlowPulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  25% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1) rotate(2deg);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
  }
  75% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1) rotate(-2deg);
  }
}

@keyframes titleParticleSparkle {
  0% {
    opacity: 0.2;
    transform: translateY(0);
  }
  25% {
    opacity: 0.6;
    transform: translateY(-5px);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px);
  }
  75% {
    opacity: 0.6;
    transform: translateY(-5px);
  }
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 20px;
  color: #a0aec0;
  margin-bottom: 40px;
  line-height: 2;
  letter-spacing: 0.02em;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  animation: subtitleEnter 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: 0.8s;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, #667eea, #f093fb, #764ba2);
    border-radius: 2px;
    animation: subtitleBarGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 1.2s;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent);
    opacity: 0;
    animation: subtitleLineAppear 0.6s ease-out forwards;
    animation-delay: 1.5s;
  }

  .highlight {
    color: #667eea;
    font-weight: 700;
    position: relative;
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #f093fb 40%, #764ba2 70%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% auto;
    animation: gradientShift 4s linear infinite;

    &.highlight-1 { animation-delay: 1s, 1s; }
    &.highlight-2 { animation-delay: 1.15s, 1.15s; }
    &.highlight-3 { animation-delay: 1.3s, 1.3s; }
    &.highlight-4 { animation-delay: 1.45s, 1.45s; }
    &.highlight-5 { animation-delay: 1.6s, 1.6s; }

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #f093fb, #764ba2, #f5576c);
      background-size: 200% 100%;
      animation: highlightUnderline 3s ease-in-out infinite;
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::after {
      opacity: 1;
    }
  }

  @keyframes gradientShift {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  @keyframes subtitleEnter {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes subtitleBarGrow {
    0% {
      height: 0;
      opacity: 0;
    }
    100% {
      height: 60%;
      opacity: 1;
    }
  }

  @keyframes subtitleLineAppear {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  @keyframes highlightPop {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes quoteIconFloat {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-8px) rotate(5deg);
    }
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #f093fb 30%, #764ba2 60%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    background-size: 200% auto;
    animation: gradientShift 4s linear infinite;
  }
}

@keyframes highlightUnderline {
  0%, 100% {
    transform: scaleX(1);
    background-position: 0% 50%;
  }
  50% {
    transform: scaleX(0.85);
    background-position: 100% 50%;
  }
}

.hero-cta-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.hero-content {
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 25px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  margin-bottom: 30px;
}

.badge-icon {
  font-size: 20px;
}

.badge-text {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-line {
  display: block;
}

.hero-subtitle {
  font-size: 24px;
  color: #a0aec0;
  margin-bottom: 40px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  padding: 25px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    animation: statsShine 5s linear infinite;
  }
}

@keyframes statsShine {
  from { transform: translateX(0); }
  to { transform: translateX(200%); }
}

.hero-stat {
  text-align: center;
  position: relative;
  z-index: 1;
}

.stat-icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 2;
  color: #667eea;
  animation: iconPulse 3s ease-in-out infinite;
}

.stat-icon-ring {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: ringRotate 4s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    box-shadow: 0 0 10px #667eea;
  }
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-stat-number {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  animation: numberGlow 2s ease-in-out infinite;
}

.hero-stat-label {
  font-size: 14px;
  color: #a0aec0;
  margin-top: 5px;
}

@keyframes numberGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.hero-stat-divider {
  width: 2px;
  height: 50px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  position: relative;
}

.divider-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  animation: dividerPulse 2s ease-in-out infinite;
}

@keyframes dividerPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.hero-btn {
  padding: 18px 50px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.hero-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 200% 200%;
  color: #fff;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);

  .btn-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .btn-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 60%);
    opacity: 0;
    transform: scale(0);
    transition: all 0.5s ease;
  }

  .btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: none;
  }

  .btn-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 40% 70%, rgba(255, 255, 255, 0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 80% 60%, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    background-position: 100% 100%;
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);

    .btn-bg { opacity: 1; }
    .btn-glow { opacity: 1; transform: scale(1); }
    .btn-shine { animation: btnShineMove 1.5s ease-in-out infinite; }
    .btn-particles { opacity: 1; }

    &::before {
      width: 200%;
      height: 200%;
      opacity: 0;
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
}

@keyframes btnShineMove {
  from { left: -100%; }
  to { left: 100%; }
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  .play-btn-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play-btn {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .play-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(102, 126, 234, 0.5);
    border-radius: 50%;
    animation: playRingPulse 2s ease-in-out infinite;
  }

  .btn-sparkle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(1px 1px at 10% 20%, rgba(102, 126, 234, 0.6) 0%, transparent 100%),
        radial-gradient(1px 1px at 30% 80%, rgba(118, 75, 162, 0.6) 0%, transparent 100%),
        radial-gradient(1px 1px at 70% 30%, rgba(240, 147, 251, 0.6) 0%, transparent 100%),
        radial-gradient(1px 1px at 90% 70%, rgba(102, 126, 234, 0.6) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);

    .play-btn {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    }

    .btn-sparkle {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
}

@keyframes playRingPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.3; }
}

.hero-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.circle-1 {
  width: 400px;
  height: 400px;
  right: -100px;
  top: 100px;
  background: conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #667eea);
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.circle-2 {
  width: 300px;
  height: 300px;
  left: -80px;
  bottom: 150px;
  background: conic-gradient(from 90deg, #f093fb, #667eea, #764ba2, #f093fb);
  border: 2px solid rgba(240, 147, 251, 0.3);
}

.circle-3 {
  width: 150px;
  height: 150px;
  right: 200px;
  bottom: 100px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.2) 100%);
}

.circle-4 {
  width: 100px;
  height: 100px;
  left: 300px;
  top: 200px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, rgba(102, 126, 234, 0.1) 100%);
}

.floating-shape {
  position: absolute;
  opacity: 0.1;
}

.shape-1 {
  width: 60px;
  height: 60px;
  right: 400px;
  top: 300px;
  background: #667eea;
  border-radius: 50%;
}

.shape-2 {
  width: 40px;
  height: 40px;
  left: 400px;
  bottom: 300px;
  background: #f093fb;
  border-radius: 10px;
}

.shape-3 {
  width: 80px;
  height: 80px;
  right: 600px;
  bottom: 200px;
  background: #764ba2;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.hero-features {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 50px;
  flex-wrap: wrap;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 500px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
    transition: left 0.6s ease;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow:
      0 15px 35px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(102, 126, 234, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(102, 126, 234, 0.4);

    &::before {
      left: 100%;
    }

    &::after {
      opacity: 1;
    }

    .feature-glow {
      opacity: 1;
      transform: scale(1.5);
    }
  }

  .feature-icon-wrap {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: all 0.3s ease;
    color: #fff;

    &.icon-ai {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    &.icon-3d {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3);
    }

    &.icon-data {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
    }

    &.icon-cloud {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      box-shadow: 0 8px 20px rgba(67, 233, 123, 0.3);
    }

    &.icon-fast {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      box-shadow: 0 8px 20px rgba(250, 112, 154, 0.3);
    }

    &.icon-safe {
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
      box-shadow: 0 8px 20px rgba(161, 140, 209, 0.3);
    }

    svg {
      color: #fff;
      stroke-width: 2;
      transition: all 0.3s ease;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }

  .icon-bg {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 16px;
    opacity: 0;
    transition: all 0.3s ease;
    filter: blur(10px);

    .icon-ai & { background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5)); }
    .icon-3d & { background: linear-gradient(135deg, rgba(240, 147, 251, 0.5), rgba(245, 87, 108, 0.5)); }
    .icon-data & { background: linear-gradient(135deg, rgba(79, 172, 254, 0.5), rgba(0, 242, 254, 0.5)); }
    .icon-cloud & { background: linear-gradient(135deg, rgba(67, 233, 123, 0.5), rgba(56, 249, 215, 0.5)); }
    .icon-fast & { background: linear-gradient(135deg, rgba(250, 112, 154, 0.5), rgba(254, 225, 64, 0.5)); }
    .icon-safe & { background: linear-gradient(135deg, rgba(161, 140, 209, 0.5), rgba(251, 194, 235, 0.5)); }
  }

  .icon-pulse {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid;
    border-radius: 12px;
    animation: featureIconPulse 2s ease-in-out infinite;

    .icon-ai & { border-color: rgba(102, 126, 234, 0.3); }
    .icon-3d & { border-color: rgba(240, 147, 251, 0.3); }
    .icon-data & { border-color: rgba(79, 172, 254, 0.3); }
    .icon-cloud & { border-color: rgba(67, 233, 123, 0.3); }
    .icon-fast & { border-color: rgba(250, 112, 154, 0.3); }
    .icon-safe & { border-color: rgba(161, 140, 209, 0.3); }
  }

  .feature-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-radius: 30px;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(15px);

    .icon-ai & { background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%); }
    .icon-3d & { background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%); }
    .icon-data & { background: radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%); }
    .icon-cloud & { background: radial-gradient(circle, rgba(67, 233, 123, 0.3) 0%, transparent 70%); }
    .icon-fast & { background: radial-gradient(circle, rgba(250, 112, 154, 0.3) 0%, transparent 70%); }
    .icon-safe & { background: radial-gradient(circle, rgba(161, 140, 209, 0.3) 0%, transparent 70%); }
  }

  .feature-text {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);

    &::before {
      left: 100%;
    }

    .feature-icon-wrap {
      transform: rotate(360deg) scale(1.1);

      &.icon-ai { box-shadow: 0 0 25px rgba(102, 126, 234, 0.6); }
      &.icon-3d { box-shadow: 0 0 25px rgba(240, 147, 251, 0.6); }
      &.icon-data { box-shadow: 0 0 25px rgba(79, 172, 254, 0.6); }
      &.icon-cloud { box-shadow: 0 0 25px rgba(67, 233, 123, 0.6); }
      &.icon-fast { box-shadow: 0 0 25px rgba(250, 112, 154, 0.6); }
      &.icon-safe { box-shadow: 0 0 25px rgba(161, 140, 209, 0.6); }

      svg {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      }
    }

    .icon-bg {
      opacity: 1;
    }

    .feature-glow {
      opacity: 1;
    }

    .feature-text {
      color: #667eea;
      text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
  }
}

@keyframes featureIconPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.hero-testimonial {
  margin-top: 60px;
  position: relative;
  z-index: 1;
}

.testimonial-quote {
  max-width: 750px;
  margin: 0 auto;
  padding: 35px 45px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #f093fb, #764ba2, #f5576c);
    background-size: 300% 100%;
    animation: gradientMove 3s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.3);

    &::after {
      opacity: 1;
    }
  }

  .quote-icon {
    position: absolute;
    top: -18px;
    left: 25px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea, #f093fb);
    border-radius: 12px;
    padding: 10px;
    color: #fff;
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    transition: all 0.4s ease;
    animation: quoteIconFloat 3s ease-in-out infinite;
  }

  .testimonial-text {
    font-size: 20px;
    color: #fff;
    line-height: 1.9;
    margin-bottom: 30px;
    margin-left: 25px;
    position: relative;
    font-weight: 500;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.01em;

    &.text-1 {
      margin-bottom: 20px;

      .brand-name {
        background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 800;
        font-size: 22px;
        background-size: 200% auto;
        animation: gradientShift 3s linear infinite;
      }
    }

    &.text-2 {
      margin-bottom: 0;

      .brand-name {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 800;
        font-size: 22px;
        background-size: 200% auto;
        animation: gradientShift 3s linear infinite;
      }
    }

    .highlight-num {
      background: linear-gradient(135deg, #667eea 0%, #f093fb 30%, #764ba2 60%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
      font-size: 26px;
      position: relative;
      display: inline-block;
      background-size: 200% auto;
      animation: gradientShift 3s linear infinite;

      &::before {
        content: '';
        position: absolute;
        bottom: -5px;
        left: -5px;
        right: -5px;
        top: -5px;
        background: linear-gradient(135deg, #667eea 0%, #f093fb 30%, #764ba2 60%, #f5576c 100%);
        border-radius: 8px;
        opacity: 0.2;
        filter: blur(8px);
        z-index: -1;
      }
    }

    .highlight-word {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      font-size: 21px;
      position: relative;
      display: inline-block;
      background-size: 200% auto;
      animation: gradientShift 3s linear infinite;

      &::before {
        content: '';
        position: absolute;
        bottom: -3px;
        left: -3px;
        right: -3px;
        top: -3px;
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        border-radius: 6px;
        opacity: 0.15;
        filter: blur(6px);
        z-index: -1;
      }
    }
  }
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;

  .author-avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
  }

  .author-info {
    display: flex;
    flex-direction: column;

    .author-name {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .author-role {
      font-size: 14px;
      color: #a0aec0;
    }
  }
}

.hero-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.circle-outer {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  border: 1px solid rgba(102, 126, 234, 0.2);
  animation: outerRingRotate 20s linear infinite reverse;
}

.circle-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
      radial-gradient(2px 2px at 20% 20%, rgba(102, 126, 234, 0.6) 0%, transparent 100%),
      radial-gradient(2px 2px at 80% 30%, rgba(118, 75, 162, 0.6) 0%, transparent 100%),
      radial-gradient(2px 2px at 40% 80%, rgba(240, 147, 251, 0.6) 0%, transparent 100%);
  animation: circleParticleFloat 5s ease-in-out infinite;
}

@keyframes outerRingRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes circleParticleFloat {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.circle-1 {
  width: 400px;
  height: 400px;
  right: -100px;
  top: 100px;
  background: conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #667eea);
  border: 2px solid rgba(102, 126, 234, 0.3);
  animation: decoCircleRotate1 25s linear infinite;
}

@keyframes decoCircleRotate1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.circle-2 {
  width: 300px;
  height: 300px;
  left: -80px;
  bottom: 150px;
  background: conic-gradient(from 90deg, #f093fb, #667eea, #764ba2, #f093fb);
  border: 2px solid rgba(240, 147, 251, 0.3);
  animation: decoCircleRotate2 30s linear infinite reverse;
}

@keyframes decoCircleRotate2 {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.circle-3 {
  width: 150px;
  height: 150px;
  right: 200px;
  bottom: 100px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.2) 100%);
  animation: decoCirclePulse 4s ease-in-out infinite;
}

@keyframes decoCirclePulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

.floating-shape {
  position: absolute;
  opacity: 0.1;
}

.shape-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: inherit;
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.floating-shape:hover .shape-glow {
  opacity: 0.5;
}

.shape-1 {
  width: 60px;
  height: 60px;
  right: 400px;
  top: 300px;
  background: #667eea;
  border-radius: 50%;
  animation: shapeFloat1 12s ease-in-out infinite;
}

.shape-2 {
  width: 40px;
  height: 40px;
  left: 400px;
  bottom: 300px;
  background: #f093fb;
  border-radius: 10px;
  animation: shapeFloat2 15s ease-in-out infinite;
}

.shape-3 {
  width: 80px;
  height: 80px;
  right: 600px;
  bottom: 200px;
  background: #764ba2;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  animation: shapeFloat3 18s ease-in-out infinite;
}

.shape-4 {
  width: 50px;
  height: 50px;
  left: 250px;
  top: 350px;
  background: #667eea;
  border-radius: 25px;
  animation: shapeFloat4 10s ease-in-out infinite;
}

.shape-5 {
  width: 70px;
  height: 70px;
  right: 350px;
  top: 450px;
  background: #f093fb;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: shapeFloat5 14s ease-in-out infinite;
}

@keyframes shapeFloat1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

@keyframes shapeFloat2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(-90deg); }
}

@keyframes shapeFloat3 {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  50% { transform: translateY(-25px) scale(1.1) rotate(120deg); }
}

@keyframes shapeFloat4 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes shapeFloat5 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-35px) rotate(60deg); }
}

.geometric-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
}

.line-glow {
  position: absolute;
  top: -5px;
  left: 0;
  right: 0;
  bottom: -5px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
  filter: blur(5px);
}

.line-1 {
  width: 300px;
  top: 200px;
  left: 10%;
  transform: rotate(-15deg);
  animation: lineFloat1 8s ease-in-out infinite;
}

.line-2 {
  width: 250px;
  top: 400px;
  right: 15%;
  transform: rotate(20deg);
  animation: lineFloat2 10s ease-in-out infinite;
}

.line-3 {
  width: 200px;
  bottom: 200px;
  left: 20%;
  transform: rotate(-25deg);
  animation: lineFloat3 12s ease-in-out infinite;
}

.line-4 {
  width: 280px;
  bottom: 350px;
  right: 25%;
  transform: rotate(10deg);
  animation: lineFloat4 9s ease-in-out infinite;
}

@keyframes lineFloat1 {
  0%, 100% { transform: rotate(-15deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(-10deg) translateY(-20px); opacity: 0.6; }
}

@keyframes lineFloat2 {
  0%, 100% { transform: rotate(20deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(15deg) translateY(-15px); opacity: 0.6; }
}

@keyframes lineFloat3 {
  0%, 100% { transform: rotate(-25deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(-30deg) translateY(-25px); opacity: 0.6; }
}

@keyframes lineFloat4 {
  0%, 100% { transform: rotate(10deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(5deg) translateY(-18px); opacity: 0.6; }
}

.rotating-ring {
  position: absolute;
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.ring-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -100px;
  animation: rotatingRing1 30s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    width: 10px;
    height: 10px;
    background: rgba(102, 126, 234, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
}

.ring-2 {
  width: 400px;
  height: 400px;
  bottom: -50px;
  right: -50px;
  animation: rotatingRing2 25s linear infinite reverse;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 30%;
    width: 8px;
    height: 8px;
    background: rgba(118, 75, 162, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(118, 75, 162, 0.5);
  }
}

.ring-3 {
  width: 350px;
  height: 350px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotatingRing3 20s linear infinite;

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    right: 20%;
    width: 6px;
    height: 6px;
    background: rgba(240, 147, 251, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(240, 147, 251, 0.5);
  }
}

@keyframes rotatingRing1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotatingRing2 {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes rotatingRing3 {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

.scroll-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.6);
  position: relative;

  .dot-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: #667eea;
    border-radius: 50%;
    animation: dotPulse 1.5s ease-in-out infinite;
  }
}

@keyframes dotPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(2); opacity: 0.3; }
}

.scroll-arrow {
  color: #667eea;
  animation: arrowMove 2s ease-in-out infinite;
}

@keyframes arrowMove {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(5px); opacity: 0.5; }
}

.scroll-line {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, #667eea, transparent);
  margin-top: 5px;
  animation: scrollLineGrow 2s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes scrollLineGrow {
  0%, 100% { height: 60px; opacity: 0.3; }
  50% { height: 80px; opacity: 0.6; }
}

.scroll-text {
  font-size: 12px;
  color: #a0aec0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Testimonial Stars */
.testimonial-stars {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 15px;
}

.testimonial-stars .star {
  font-size: 20px;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  animation: starShine 2s ease-in-out infinite;
}

.testimonial-stars .star:nth-child(1) { animation-delay: 0s; }
.testimonial-stars .star:nth-child(2) { animation-delay: 0.1s; }
.testimonial-stars .star:nth-child(3) { animation-delay: 0.2s; }
.testimonial-stars .star:nth-child(4) { animation-delay: 0.3s; }
.testimonial-stars .star:nth-child(5) { animation-delay: 0.4s; }

@keyframes starShine {
  0%, 100% { transform: scale(1); text-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
  50% { transform: scale(1.2); text-shadow: 0 0 20px rgba(255, 215, 0, 1); }
}

.scroll-text {
  font-size: 12px;
  color: #667eea;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
}

// 案例展示内容
.portfolio-content {
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.portfolio-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.4);
}

.portfolio-icon svg {
  width: 100%;
  height: 100%;
}

.portfolio-features {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-tag {
  padding: 8px 20px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 20px;
  font-size: 14px;
  color: #a0aec0;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.feature-tag:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  border-color: transparent;
}

.showcase-types {
  margin-top: 80px;
  text-align: center;
}

.types-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.type-card {
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.type-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
}

.type-emoji {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.type-card h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.type-card p {
  font-size: 14px;
  color: #a0aec0;
}

// 关于我们
.about-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.section-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 25px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 50px;
  margin-bottom: 25px;
  animation: badgeFloat 3s ease-in-out infinite;
}

@keyframes badgeFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.badge-icon {
  font-size: 18px;
}

.badge-text {
  font-size: 14px;
  color: #667eea;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  animation: gradientShift 3s linear infinite;
}

.page-num {
  font-size: 28px;
  opacity: 0.5;
  font-weight: 300;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.about-description {
  font-size: 18px;
  line-height: 1.8;
  color: #a0aec0;
  margin-bottom: 30px;
}

.about-advantages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.advantage-item {
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.advantage-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #f093fb, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.advantage-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-8px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

.advantage-item:hover::before {
  opacity: 1;
}

.advantage-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  margin-bottom: 18px;
  color: #667eea;
}

.advantage-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.advantage-item:hover .advantage-glow {
  opacity: 1;
}

.advantage-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.advantage-desc {
  font-size: 14px;
  color: #a0aec0;
  line-height: 1.6;
}

.about-stats {
  display: flex;
  gap: 40px;
  margin-top: 50px;
}

.stat-item {
  text-align: center;
  position: relative;
}

.stat-number-wrapper {
  position: relative;
  display: inline-block;
}

.stat-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  animation: statPulse 2s ease-in-out infinite;
}

@keyframes statPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.2;
  }
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-name {
  font-size: 16px;
  color: #a0aec0;
  margin-top: 10px;
}

.image-wrapper {
  position: relative;
  height: 400px;
}

.image-box {
  position: absolute;
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.image-box:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 40px 100px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.3);
}

.box-1 {
  width: 300px;
  height: 250px;
  top: 0;
  left: 0;
  background: linear-gradient(145deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.5) 100%);
}

.box-2 {
  width: 320px;
  height: 280px;
  top: 100px;
  left: 180px;
  background: linear-gradient(145deg, rgba(240, 147, 251, 0.6) 0%, rgba(102, 126, 234, 0.4) 100%);
}

.box-3 {
  width: 250px;
  height: 200px;
  top: 250px;
  left: 50px;
  background: linear-gradient(145deg, rgba(118, 75, 162, 0.6) 0%, rgba(240, 147, 251, 0.4) 100%);
}

.box-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 60%);
  pointer-events: none;
}

.box-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 1s ease;
}

.image-box:hover .box-shine {
  left: 100%;
}

.box-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.box-icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: iconRotate 20s linear infinite;
}

@keyframes iconRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.box-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.box-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.box-desc {
  font-size: 14px;
  color: #a0aec0;
  line-height: 1.6;
}

// 服务项目
.vertical-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100vh;
}

.vertical-wrap.panels-container {
  width: 300vw;
}

.panel {
  width: 100vw;
  height: 100vh;
  flex: none;
  display: block;
}

.services-section {
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f3460 100%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
    background-size: 300% 100%;
    animation: gradientMove 3s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
    background: rgba(255, 255, 255, 0.08);

    &::before {
      opacity: 1;
    }

    .service-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
  }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.service-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.icon-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.icon-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.icon-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.icon-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.icon-5 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.icon-6 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.icon-7 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
.icon-8 { background: linear-gradient(135deg, #a6c0fe 0%, #f68084 100%); }
.icon-9 { background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%); }
.icon-10 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.icon-11 { background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
.icon-12 { background: linear-gradient(135deg, #fddb92 0%, #d1fdff 100%); }

.service-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 15px;
}

.service-desc {
  font-size: 16px;
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 20px;
}

.service-features {
  list-style: none;
  margin-bottom: 20px;
}

.service-features li {
  font-size: 14px;
  color: #a0aec0;
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.service-features li:hover {
  color: #fff;
  transform: translateX(5px);
}

.service-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
  transition: all 0.3s ease;
}

.service-features li:hover::before {
  color: #f093fb;
}

.service-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.service-link:hover {
  color: #764ba2;
  gap: 12px;
}

// 精选案例
.portfolio-section {
  background: linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%);
  position: relative;
  overflow: hidden;
}

/* 展厅背景效果 */
.section-bg-portfolio {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.portfolio-mesh {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background:
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 60%);
  animation: portfolioMesh 20s ease-in-out infinite;
  filter: blur(60px);
}

@keyframes portfolioMesh {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

.portfolio-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: portfolioOrbFloat 10s ease-in-out infinite;
}

.portfolio-orb.orb-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  background: rgba(102, 126, 234, 0.3);
  animation-delay: 0s;
}

.portfolio-orb.orb-2 {
  width: 400px;
  height: 400px;
  bottom: 10%;
  right: 5%;
  background: rgba(240, 147, 251, 0.3);
  animation-delay: 5s;
}

@keyframes portfolioOrbFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-50px) scale(1.1); }
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  position: relative;
  z-index: 1;
}

.portfolio-item {
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* 3D悬浮卡片效果 */
.card-3d-hover {
  transform-style: preserve-3d;
}

.card-3d-hover:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.portfolio-glow {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

.portfolio-item:hover .portfolio-glow {
  opacity: 1;
}

.portfolio-glow.glow-1 {
  background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
}

.portfolio-glow.glow-2 {
  background: radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
}

.portfolio-glow.glow-3 {
  background: radial-gradient(circle at 50% 50%, rgba(118, 75, 162, 0.3) 0%, transparent 70%);
}

.portfolio-item.item-1 {
  background: linear-gradient(145deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%);
}
.portfolio-item.item-2 {
  background: linear-gradient(145deg, rgba(240, 147, 251, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%);
}
.portfolio-item.item-3 {
  background: linear-gradient(145deg, rgba(79, 172, 254, 0.3) 0%, rgba(0, 242, 254, 0.2) 100%);
}
.portfolio-item.item-4 {
  background: linear-gradient(145deg, rgba(67, 233, 123, 0.3) 0%, rgba(56, 249, 215, 0.2) 100%);
}
.portfolio-item.item-5 {
  background: linear-gradient(145deg, rgba(250, 112, 154, 0.3) 0%, rgba(254, 225, 64, 0.2) 100%);
}
.portfolio-item.item-6 {
  background: linear-gradient(145deg, rgba(161, 140, 209, 0.3) 0%, rgba(251, 194, 235, 0.2) 100%);
}

.portfolio-content {
  position: relative;
  z-index: 1;
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.portfolio-icon {
  margin-bottom: 20px;
  position: relative;
}

.icon-3d-effect {
  position: relative;
  transform-style: preserve-3d;
  animation: icon3DRotate 6s ease-in-out infinite;
}

@keyframes icon3DRotate {
  0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
  25% { transform: rotateY(10deg) rotateX(5deg); }
  50% { transform: rotateY(0deg) rotateX(0deg); }
  75% { transform: rotateY(-10deg) rotateX(-5deg); }
}

.portfolio-icon svg {
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
  transition: filter 0.3s ease;
}

.portfolio-item:hover .portfolio-icon svg {
  filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.9));
}

.portfolio-hologram {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(102, 126, 234, 0.1), transparent);
  pointer-events: none;
  animation: hologramScan 3s linear infinite;
}

@keyframes hologramScan {
  0% { opacity: 0; transform: translateY(100%); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-100%); }
}

.portfolio-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  opacity: 0;
  transition: all 0.4s ease;
}

.portfolio-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.portfolio-desc {
  font-size: 16px;
  color: #a0aec0;
  margin-bottom: 25px;
  line-height: 1.6;
}

.portfolio-tag {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.portfolio-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  justify-content: center;
}

.meta-tag {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: #a0aec0;
}

.portfolio-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.portfolio-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
}

// 联系我们
.contact-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.contact-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.contact-gradient-1,
.contact-gradient-2 {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.contact-gradient-1 {
  background: radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.3) 0%, transparent 50%);
  animation: contactGradient1 10s ease-in-out infinite;
}

.contact-gradient-2 {
  background: radial-gradient(circle at 70% 70%, rgba(240, 147, 251, 0.3) 0%, transparent 50%);
  animation: contactGradient2 10s ease-in-out infinite;
  animation-delay: 5s;
}

@keyframes contactGradient1 {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.5; }
}

@keyframes contactGradient2 {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.3); opacity: 0.5; }
}

.contact-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: contactOrbFloat 8s ease-in-out infinite;
}

.contact-orb.orb-1 {
  width: 250px;
  height: 250px;
  top: 15%;
  left: 10%;
  background: rgba(102, 126, 234, 0.4);
}

.contact-orb.orb-2 {
  width: 300px;
  height: 300px;
  bottom: 20%;
  right: 10%;
  background: rgba(240, 147, 251, 0.4);
  animation-delay: 4s;
}

@keyframes contactOrbFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-40px) scale(1.1); }
}

.contact-particle-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(102, 126, 234, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(240, 147, 251, 0.3), transparent),
    radial-gradient(2px 2px at 50px 160px, rgba(118, 75, 162, 0.3), transparent),
    radial-gradient(2px 2px at 90px 40px, rgba(102, 126, 234, 0.3), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(240, 147, 251, 0.3), transparent);
  background-size: 200px 200px;
  animation: particleGridMove 20s linear infinite;
  opacity: 0.4;
}

@keyframes particleGridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 100px); }
}

.contact-hologram {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, rgba(102, 126, 234, 0.1), transparent);
  animation: hologramScan 4s linear infinite;
}

.contact-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.contact-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.contact-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 50px;
  margin-bottom: 25px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.badge-text {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  position: relative;
  z-index: 1;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(10px) translateY(-5px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.info-card:hover::before {
  opacity: 1;
}

.info-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.info-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  z-index: 1;
}

.icon-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border-radius: 20px;
  filter: blur(15px);
  z-index: 0;
  transition: all 0.4s ease;
}

.info-card:hover .icon-glow {
  opacity: 0.6;
  filter: blur(20px);
}

.info-text {
  flex: 1;
}

.info-text h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-text p {
  font-size: 15px;
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 4px;
}

.info-sub {
  font-size: 13px;
  color: #718096;
  margin-top: 6px;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.contact-form::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.form-header {
  margin-bottom: 35px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.form-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 1px solid rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
}

.form-title-group {
  flex: 1;
}

.form-header h3 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-header p {
  font-size: 14px;
  color: #a0aec0;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input::placeholder {
  color: #718096;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.form-textarea {
  width: 100%;
  padding: 16px 20px;
  min-height: 140px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  line-height: 1.6;
}

.form-textarea::placeholder {
  color: #718096;
}

.form-textarea:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.form-select {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a0aec0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 20px;
  padding-right: 45px;
}

.form-select::placeholder {
  color: #718096;
}

.form-select:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.form-select option {
  background: #1a1a2e;
  color: #fff;
  padding: 12px 20px;
}

.form-submit {
  width: 100%;
  padding: 18px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.form-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.form-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.5);
}

.form-submit:hover::before {
  left: 100%;
}

.form-submit:active {
  transform: translateY(-1px);
}

.submit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.form-submit:hover .submit-icon {
  transform: translateX(3px);
}

// 响应式
@media (max-width: 1200px) {
  .container {
    padding: 0 40px;
  }

  .services-grid,
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-content {
    gap: 60px;
  }

  .contact-form {
    padding: 40px;
  }
}

@media (max-width: 992px) {
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .image-wrapper {
    height: 300px;
  }

  .hero-title {
    font-size: 56px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-group {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 30px;
  }

  .nav-links {
    display: none;
  }

  .section-title {
    font-size: 36px;
  }

  .hero-title-container {
    flex-direction: column;
    gap: 20px;
  }

  .hero-title,
  .hero-title-right {
    font-size: 42px;
  }

  .services-grid,
  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .about-stats {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }

  .contact-header {
    margin-bottom: 40px;
  }

  .contact-form {
    padding: 30px 20px;
  }

  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .form-icon {
    margin: 0 auto;
  }

  .info-card {
    padding: 20px;
  }

  .info-icon {
    width: 50px;
    height: 50px;
  }

  .icon-glow {
    display: none;
  }
}

/* 响应式 */
@media (max-width: 1200px) {
  .container {
    padding: 0 40px;
  }

  .services-grid,
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .image-wrapper {
    height: 300px;
  }

  .hero-title {
    font-size: 56px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 30px;
  }

  .nav-links {
    display: none;
  }

  .section-title {
    font-size: 36px;
  }

  .hero-title-container {
    flex-direction: column;
    gap: 20px;
  }

  .hero-title,
  .hero-title-right {
    font-size: 42px;
  }

  .services-grid,
  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .about-stats {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }
}

/* ============ 新增酷炫动画效果 ============ */

/* 全息投影基底 */
.hologram-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 300px;
  background:
    radial-gradient(ellipse at center, rgba(102, 126, 234, 0.15) 0%, transparent 70%),
    linear-gradient(to top, rgba(102, 126, 234, 0.2) 0%, transparent 100%);
  filter: blur(40px);
  animation: hologramPulse 4s ease-in-out infinite;
  z-index: 0;
}

@keyframes hologramPulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 1; transform: translateX(-50%) scaleX(1.1); }
}

/* 全息环 */
.hologram-ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  opacity: 0.6;
  animation: ringRotate 20s linear infinite;
  z-index: 0;
}

.hologram-ring::before {
  content: '';
  position: absolute;
  inset: -5px;
  border: 1px solid;
  border-radius: 50%;
  opacity: 0.4;
}

.ring-1 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(102, 126, 234, 0.4);
  animation-duration: 30s;
}

.ring-2 {
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  border-color: rgba(240, 147, 251, 0.3);
  animation-duration: 40s;
  animation-direction: reverse;
}

.ring-3 {
  width: 1000px;
  height: 1000px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(30deg);
  border-color: rgba(118, 75, 162, 0.2);
  animation-duration: 50s;
}

@keyframes ringRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 能量线 */
.energy-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #f093fb, transparent);
  opacity: 0.6;
  animation: energyFlow 3s linear infinite;
  z-index: 0;
}

.line-top {
  width: 100%;
  top: 10%;
  animation-delay: 0s;
}

.line-bottom {
  width: 100%;
  bottom: 10%;
  animation-delay: 1s;
}

.line-left {
  width: 2px;
  height: 100%;
  left: 10%;
  background: linear-gradient(180deg, transparent, #667eea, #f093fb, transparent);
  animation: energyFlowVertical 3s linear infinite;
  animation-delay: 0.5s;
}

.line-right {
  width: 2px;
  height: 100%;
  right: 10%;
  background: linear-gradient(180deg, transparent, #f093fb, #667eea, transparent);
  animation: energyFlowVertical 3s linear infinite;
  animation-delay: 1.5s;
}

@keyframes energyFlow {
  0% { opacity: 0; transform: scaleX(0); }
  50% { opacity: 0.8; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(0); }
}

@keyframes energyFlowVertical {
  0% { opacity: 0; transform: scaleY(0); }
  50% { opacity: 0.8; transform: scaleY(1); }
  100% { opacity: 0; transform: scaleY(0); }
}

/* 数据流 */
.data-stream {
  position: absolute;
  width: 3px;
  height: 100%;
  opacity: 0.4;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 10px,
    rgba(102, 126, 234, 0.8) 10px,
    rgba(102, 126, 234, 0.8) 20px
  );
  animation: dataFlow 2s linear infinite;
  z-index: 0;
}

.stream-1 {
  left: 20%;
  animation-delay: 0s;
}

.stream-2 {
  left: 50%;
  animation-delay: 0.7s;
}

.stream-3 {
  left: 80%;
  animation-delay: 1.4s;
}

@keyframes dataFlow {
  0% { transform: translateY(-100%); opacity: 0; }
  20% { opacity: 0.4; }
  80% { opacity: 0.4; }
  100% { transform: translateY(100%); opacity: 0; }
}

/* 闪电效果 */
.lightning-bolt {
  position: absolute;
  width: 2px;
  height: 0;
  background: linear-gradient(to bottom, #fff, #667eea, transparent);
  opacity: 0;
  z-index: 0;
  animation: lightningStrike 4s ease-in-out infinite;
}

.bolt-1 {
  left: 30%;
  top: 20%;
  height: 200px;
  animation-delay: 0s;
  transform: rotate(15deg);
}

.bolt-2 {
  right: 25%;
  top: 30%;
  height: 150px;
  animation-delay: 2s;
  transform: rotate(-20deg);
}

.bolt-3 {
  left: 60%;
  bottom: 30%;
  height: 180px;
  animation-delay: 3s;
  transform: rotate(10deg);
}

@keyframes lightningStrike {
  0%, 90%, 100% { opacity: 0; }
  91%, 93% { opacity: 1; box-shadow: 0 0 20px #667eea, 0 0 40px #f093fb; }
  92% { opacity: 0.5; }
}

/* 3D立体文字增强 */
.title-char {
  position: relative;
  display: inline-block;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.title-char::before,
.title-char::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.title-char::before {
  transform: translateZ(-2px) translateX(-1px);
  color: rgba(102, 126, 234, 0.6);
  z-index: -1;
  filter: blur(1px);
}

.title-char::after {
  transform: translateZ(-4px) translateX(-2px);
  color: rgba(118, 75, 162, 0.4);
  z-index: -2;
  filter: blur(2px);
}

/* 3D文字层 */
.title-3d-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 150%;
  pointer-events: none;
  z-index: -1;
}

.title-3d-layer.layer-1 {
  background: radial-gradient(ellipse at 50% 30%, rgba(102, 126, 234, 0.2) 0%, transparent 50%);
  animation: layerPulse1 4s ease-in-out infinite;
}

.title-3d-layer.layer-2 {
  background: radial-gradient(ellipse at 30% 70%, rgba(240, 147, 251, 0.15) 0%, transparent 50%);
  animation: layerPulse2 5s ease-in-out infinite;
}

.title-3d-layer.layer-3 {
  background: radial-gradient(ellipse at 70% 40%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  animation: layerPulse3 6s ease-in-out infinite;
}

@keyframes layerPulse1 {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes layerPulse2 {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
}

@keyframes layerPulse3 {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}

/* 副标题闪光点 */
.subtitle-sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff, 0 0 20px #667eea, 0 0 30px #f093fb;
  animation: sparkle 2s ease-in-out infinite;
  z-index: 10;
}

.sparkle-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 60%;
  left: 50%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 20%;
  right: 15%;
  animation-delay: 1.4s;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 打字机效果 */
.hologram-typewriter {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: #667eea;
  text-shadow: 0 0 10px rgba(102, 126, 234, 0.8);
}

.typewriter-text {
  background: linear-gradient(90deg, #667eea, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.typing-cursor {
  width: 2px;
  height: 24px;
  background: #667eea;
  margin-left: 4px;
  animation: cursorBlink 1s step-end infinite;
  box-shadow: 0 0 10px #667eea;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 浮动展示卡片 */
.floating-showcase {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.showcase-card {
  width: 200px;
  height: 260px;
  perspective: 1000px;
}

.card-3d-flip {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card-3d-flip:hover {
  transform: rotateY(180deg);
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-front {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
}

.card-back {
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.15) 0%, rgba(102, 126, 234, 0.15) 100%);
  transform: rotateY(180deg);
}

.card-visual {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
}

.card-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  animation: visualPulse 2s ease-in-out infinite;
}

.visual-ai {
  background: linear-gradient(135deg, #667eea, #f093fb);
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
}

.visual-3d {
  background: linear-gradient(135deg, #f093fb, #764ba2);
  box-shadow: 0 0 30px rgba(240, 147, 251, 0.5);
}

.visual-data {
  background: linear-gradient(135deg, #764ba2, #667eea);
  box-shadow: 0 0 30px rgba(118, 75, 162, 0.5);
}

@keyframes visualPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.card-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  text-align: center;
}

.card-content p {
  font-size: 14px;
  color: #a0aec0;
  margin: 0;
  text-align: center;
}

.back-content {
  text-align: center;
}

.back-content h4 {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
}

.back-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.back-content li {
  font-size: 13px;
  color: #a0aec0;
  padding: 5px 0;
  position: relative;
}

.back-content li::before {
  content: '✓';
  color: #667eea;
  margin-right: 8px;
  font-weight: bold;
}

/* 网络网格背景 */
.cyber-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  z-index: 0;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

/* 额外浮动水晶 */
.floating-crystal.crystal-4 {
  width: 40px;
  height: 40px;
  right: 150px;
  bottom: 200px;
  background: linear-gradient(135deg, #764ba2 0%, #f093fb 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: crystalFloat4 12s ease-in-out infinite;
}

@keyframes crystalFloat4 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    box-shadow: 0 0 30px rgba(118, 75, 162, 0.6);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
    box-shadow: 0 0 50px rgba(240, 147, 251, 0.8);
  }
}

/* 高级粒子容器 */
.advanced-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floating-showcase {
    gap: 15px;
  }

  .showcase-card {
    width: 150px;
    height: 200px;
  }

  .card-visual {
    width: 60px;
    height: 60px;
  }

  .card-content h4 {
    font-size: 14px;
  }

  .card-content p,
  .back-content li {
    font-size: 11px;
  }

  .hologram-ring {
    display: none;
  }

  .energy-line,
  .data-stream {
    display: none;
  }

  .hologram-typewriter {
    font-size: 14px;
  }

  .typing-cursor {
    height: 18px;
  }
}

/* ============ 更多酷炫特效 ============ */

/* 霓虹文字效果 */
.neon-text {
  animation: neonFlicker 3s ease-in-out infinite alternate;
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 5px #667eea,
      0 0 10px #667eea,
      0 0 20px #667eea,
      0 0 40px #764ba2,
      0 0 80px #764ba2;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

/* 故障效果 */
.glitch-effect {
  position: relative;
}

.glitch-effect::before,
.glitch-effect::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-effect::before {
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-effect::after {
  left: -2px;
  text-shadow: -2px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(30px, 9999px, 10px, 0); }
  5% { clip: rect(70px, 9999px, 90px, 0); }
  10% { clip: rect(20px, 9999px, 60px, 0); }
  15% { clip: rect(80px, 9999px, 100px, 0); }
  20% { clip: rect(10px, 9999px, 40px, 0); }
  25% { clip: rect(60px, 9999px, 80px, 0); }
  30% { clip: rect(90px, 9999px, 120px, 0); }
  100% { clip: rect(30px, 9999px, 50px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(20px, 9999px, 80px, 0); }
  5% { clip: rect(50px, 9999px, 90px, 0); }
  10% { clip: rect(30px, 9999px, 60px, 0); }
  15% { clip: rect(70px, 9999px, 100px, 0); }
  20% { clip: rect(10px, 9999px, 40px, 0); }
  25% { clip: rect(80px, 9999px, 110px, 0); }
  30% { clip: rect(40px, 9999px, 70px, 0); }
  100% { clip: rect(60px, 9999px, 90px, 0); }
}

/* 矩阵效果背景 */
.matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
}

.matrix-column {
  position: absolute;
  top: -100%;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #0f0;
  writing-mode: vertical-rl;
  animation: matrixFall 10s linear infinite;
  text-shadow: 0 0 10px #0f0;
}

@keyframes matrixFall {
  0% { top: -100%; opacity: 1; }
  100% { top: 100%; opacity: 0.3; }
}

/* 悬浮发光卡片 */
.glow-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.glow-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #667eea, #f093fb, #764ba2, #667eea);
  background-size: 400% 400%;
  z-index: -1;
  border-radius: 22px;
  animation: gradientMove 3s ease infinite;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.glow-card:hover::before {
  opacity: 1;
}

.glow-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 波浪效果 */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;
  pointer-events: none;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='rgba(102, 126, 234, 0.1)' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E");
  background-size: 50% 100%;
  animation: wave 10s linear infinite;
}

.wave:nth-child(2) {
  bottom: 10px;
  opacity: 0.5;
  animation: wave 15s linear infinite reverse;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='rgba(240, 147, 251, 0.1)' d='M0,60 C150,0 350,120 600,60 C850,0 1050,120 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E");
}

.wave:nth-child(3) {
  bottom: 20px;
  opacity: 0.3;
  animation: wave 20s linear infinite;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='rgba(118, 75, 162, 0.1)' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E");
}

@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 粒子爆炸效果 */
.particle-explosion {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.explosion-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  animation: explode 1s ease-out forwards;
}

@keyframes explode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

/* 脉冲圆环 */
.pulse-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.5);
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 3D按钮效果 */
.btn-3d {
  position: relative;
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 500px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.btn-3d::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
  transition: all 0.3s ease;
}

.btn-3d:hover {
  transform: translateY(-5px) rotateX(10deg) rotateY(-5deg);
  box-shadow:
    0 20px 40px rgba(102, 126, 234, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.1);
}

.btn-3d:active {
  transform: translateY(0) rotateX(0deg) rotateY(0deg);
}

/* 文字渐变动画 */
.animated-gradient-text {
  background: linear-gradient(
    90deg,
    #667eea,
    #f093fb,
    #764ba2,
    #667eea
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientTextMove 5s ease infinite;
}

@keyframes gradientTextMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 悬浮星星 */
.floating-star {
  position: absolute;
  color: #fff;
  animation: starFloat 3s ease-in-out infinite;
}

@keyframes starFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg) scale(1.2);
    opacity: 1;
  }
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.8), transparent);
  animation: scanMove 3s linear infinite;
  pointer-events: none;
}

@keyframes scanMove {
  0% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* 鼠标跟随粒子 */
.mouse-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
}

/* 页面加载动画 */
@keyframes pageLoad {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-load-animation {
  animation: pageLoad 0.8s ease-out forwards;
}

/* 平滑滚动 */
* {
  scroll-behavior: smooth;
}

/* 选择文本样式 */
::selection {
  background: rgba(102, 126, 234, 0.3);
  color: #fff;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #764ba2, #667eea);
}
</style>
