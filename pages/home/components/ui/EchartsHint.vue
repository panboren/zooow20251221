<template>
  <div class="echarts-hints-container">
    <div class="echarts-hint" title="Go ECharts" @click="goTo">
      <div class="echarts-hint-title">数据可视化</div>
      <div class="echarts-hint-abc">
        <span class="echarts-3d letter-animate letter-e" style="animation-delay: 0s">E</span>
        <span class="echarts-3d letter-animate letter-c" style="animation-delay: 0.1s">c</span>
        <span class="echarts-3d letter-animate letter-h" style="animation-delay: 0.2s">h</span>
        <span class="echarts-3d letter-animate letter-a" style="animation-delay: 0.3s">a</span>
        <span class="echarts-3d letter-animate letter-r" style="animation-delay: 0.4s">r</span>
        <span class="echarts-3d letter-animate letter-t" style="animation-delay: 0.5s">t</span>
        <span class="echarts-3d letter-animate letter-s" style="animation-delay: 0.6s">s</span>
      </div>
      <div class="echarts-hint-icon">📊</div>
    </div>
    <div class="echarts-hint" title="Go Animation" @click="goTo2">
      <div class="echarts-hint-title">动画可视化</div>
      <div class="echarts-hint-abc">
        <span class="echarts-3d letter-animate letter-e" style="animation-delay: 0s">A</span>
        <span class="echarts-3d letter-animate letter-c" style="animation-delay: 0.1s">N</span>
        <span class="echarts-3d letter-animate letter-h" style="animation-delay: 0.2s">I</span>
        <span class="echarts-3d letter-animate letter-a" style="animation-delay: 0.3s">M</span>
        <span class="echarts-3d letter-animate letter-r" style="animation-delay: 0.4s">A</span>
        <span class="echarts-3d letter-animate letter-t" style="animation-delay: 0.5s">T</span>
        <span class="echarts-3d letter-animate letter-s" style="animation-delay: 0.6s">I</span>
        <span class="echarts-3d letter-animate letter-s" style="animation-delay: 0.7s">O</span>
        <span class="echarts-3d letter-animate letter-s" style="animation-delay: 0.8s">N</span>
      </div>
      <div class="echarts-hint-icon">✨</div>
    </div>
  </div>
</template>

<script setup>
/**
 * ControlsHint Component
 * 控制提示组件，显示用户交互提示
 *
 * @component ControlsHint
 * @author ZOOOW Team
 * @version 1.0.0
 * @license MIT
 */
let goTo = () => {
  window.open('http://www.echarts.zooow.xyz')
}
let goTo2 = () => {
  window.open('http://www.animation.zooow.xyz')
}
</script>

<style scoped lang="scss">
.echarts-hints-container {
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.echarts-hint {
  position: relative;
  background: linear-gradient(135deg, rgba(11, 47, 66, 0.85), rgba(3, 38, 56, 0.9), rgba(5, 17, 73, 0.85));
  padding: 16px 12px;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(252, 232, 164, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 120px;
  height: auto;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  opacity: 0.9;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  .echarts-hint-abc{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-bottom: 8px;
    white-space: nowrap;
  }

  .echarts-hint-icon {
    font-size: 20px;
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    border: 2px solid #eacf1e;
    opacity: 1;
    box-shadow: 0 8px 30px rgba(234, 207, 30, 0.3), 0 0 20px rgba(234, 207, 30, 0.2);
    background: linear-gradient(135deg, rgba(11, 47, 66, 0.95), rgba(3, 38, 56, 0.98), rgba(5, 17, 73, 0.95));

    .echarts-hint-icon {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }

  // 焦点状态适配键盘导航
  &:focus {
    outline: 2px solid #eacf1e;
    outline-offset: 3px;
  }
}

.echarts-3d {
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(45deg,
    #ffffff 0%,
    #ffd700 25%,
    #ffa500 50%,
    #ff8c00 75%,
    #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-size: 400% 400%;
  display: inline-block;
  white-space: nowrap;
  
  // 提高清晰度的 3D 文字效果
  text-shadow: 
    0 1px 0 #666,
    0 2px 0 #555,
    0 3px 0 #444,
    0 4px 0 #333,
    0 5px 0 #222,
    0 6px 1px rgba(0,0,0,.3),
    0 0 2px rgba(0,0,0,.4),
    0 1px 2px rgba(0,0,0,.5),
    0 2px 3px rgba(0,0,0,.4),
    0 3px 4px rgba(0,0,0,.3),
    0 4px 6px rgba(0,0,0,.2),
    0 6px 8px rgba(0,0,0,.1);
  
  // 添加轻微的倾斜效果增强立体感
  transform: perspective(500px) rotateX(12deg);
  transform-origin: center;
  
  // 基础动画效果
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: gradientShift 3s ease-in-out infinite alternate;
  
  //.echarts-hint:hover & {
  //  // 悬停时增强对比度和清晰度
  //  text-shadow:
  //    0 1px 0 #777,
  //    0 2px 0 #666,
  //    0 3px 0 #555,
  //    0 4px 0 #444,
  //    0 5px 0 #333,
  //    0 6px 1px rgba(0,0,0,.4),
  //    0 0 3px rgba(255, 215, 0, .7),
  //    0 1px 2px rgba(255, 215, 0, .6),
  //    0 2px 3px rgba(255, 215, 0, .5),
  //    0 3px 4px rgba(255, 215, 0, .4),
  //    0 4px 6px rgba(255, 215, 0, .3),
  //    0 6px 8px rgba(255, 215, 0, .2);
  //  transform: perspective(500px) rotateX(8deg) scale(1.05);
  //  animation: gradientShift 1.5s ease-in-out infinite alternate;
  //}
}

.echarts-hint-title{
  font-size: 12px;
  color: #fff;
  padding: 6px 0 8px 0;
  text-wrap: nowrap;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
}
// 字母独立动画类
.letter-animate {
  display: inline-block;
  animation: bounceIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  
  .echarts-hint:hover & {
    animation: bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate, 
                wiggle 0.5s ease-in-out infinite alternate 0.8s;
  }
}

// 每个字母的独特颜色
.letter-e {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e, #ffb3b3);
  -webkit-background-clip: text;
  background-clip: text;
  color: #ff6b6b;
}

.letter-c {
  background: linear-gradient(45deg, #4ecdc4, #6ee7e0, #8ff0fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: #4ecdc4;
}

.letter-h {
  background: linear-gradient(45deg, #45b7d1, #6ac9e0, #90dbef);
  -webkit-background-clip: text;
  background-clip: text;
  color: #45b7d1;
}

.letter-a {
  background: linear-gradient(45deg, #96ceb4, #b3e0cc, #cff0e0);
  -webkit-background-clip: text;
  background-clip: text;
  color: #96ceb4;
}

.letter-r {
  background: linear-gradient(45deg, #ffeaa7, #ffedb8, #fff2ca);
  -webkit-background-clip: text;
  background-clip: text;
  color: #ffeaa7;
}

.letter-t {
  background: linear-gradient(45deg, #dda0dd, #e6b3e6, #f0c6f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: #dda0dd;
}

.letter-s {
  background: linear-gradient(45deg, #feca57, #fed77a, #fee49d);
  -webkit-background-clip: text;
  background-clip: text;
  color: #feca57;
}

// 渐变色动画
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 25% 75%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 75% 75%;
  }
  100% {
    background-position: 100% 50%;
  }
}

// 字母弹入动画
@keyframes bounceIn {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-6px) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateY(-3px) scale(1.08);
    opacity: 0.95;
  }
}

// 悬停时的摆动动画
@keyframes wiggle {
  0% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// 发光脉冲动画
@keyframes glowPulse {
  0% {
    filter: drop-shadow(0 0 5px rgba(234, 207, 30, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(234, 207, 30, 0.8));
  }
}

// 移动端适配
@media (max-width: 768px) {
  .echarts-hints-container {
    top: 60px;
    left: 15px;
    gap: 12px;
  }

  .echarts-hint {
    width: 90px;
    min-height: 100px;
    padding: 12px 8px;
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.4);

    .echarts-hint-icon {
      font-size: 16px;
    }

    &:hover {
      border: 2px solid #eacf1e;
      transform: translateY(-3px) scale(1.03);
    }

    &:active {
      transform: translateY(-1px) scale(1.01);
    }
  }

  .echarts-3d {
    font-size: 11px;
    letter-spacing: 0.2px;
    transform: perspective(300px) rotateX(8deg);

    text-shadow:
      0 1px 0 #555,
      0 2px 0 #444,
      0 3px 0 #333,
      0 4px 1px rgba(0,0,0,.2);

    animation: gradientShift 4s ease-in-out infinite alternate;
  }
  .echarts-hint-title{
    font-size: 10px;
    padding: 4px 0 6px 0;
  }

  .letter-animate {
    animation: bounceIn 2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;

    .echarts-hint:hover & {
      animation: bounceIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
    }
  }
}

// 小屏幕设备适配
@media (max-width: 480px) {
  .echarts-hints-container {
    top: 50px;
    left: 10px;
    gap: 10px;
  }

  .echarts-hint {
    width: 75px;
    min-height: 85px;
    padding: 10px 6px;
  }

  .echarts-3d {
    font-size: 9px;
    letter-spacing: 0px;
    transform: perspective(200px) rotateX(6deg);

    text-shadow:
      0 1px 0 #444,
      0 2px 0 #333;
  }
  .echarts-hint-title{
    font-size: 8px;
    padding: 3px 0 5px 0;
  }
  .letter-animate {
    animation: bounceIn 2.5s ease-in-out infinite alternate;

    .echarts-hint:hover & {
      animation: bounceIn 1.5s ease-in-out infinite alternate;
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .echarts-hint {
    opacity: 0.95;

    &:active {
      transform: translateY(-2px) scale(0.98);
      border: 2px solid #eacf1e;
    }
  }

  .echarts-3d {
    animation: gradientShift 6s ease-in-out infinite alternate;
  }
  .echarts-hint-title{
    font-size: 10px;
  }
  .letter-animate {
    animation: bounceIn 3s ease-in-out infinite alternate;
  }
}
</style>
