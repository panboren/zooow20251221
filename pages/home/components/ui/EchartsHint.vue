<template>
  <div class="echarts-hint" title="Go ECharts 3D" @click="goTo">
    <span class="echarts-3d letter-animate letter-e" style="animation-delay: 0s">E</span>
    <span class="echarts-3d letter-animate letter-c" style="animation-delay: 0.1s">c</span>
    <span class="echarts-3d letter-animate letter-h" style="animation-delay: 0.2s">h</span>
    <span class="echarts-3d letter-animate letter-a" style="animation-delay: 0.3s">a</span>
    <span class="echarts-3d letter-animate letter-r" style="animation-delay: 0.4s">r</span>
    <span class="echarts-3d letter-animate letter-t" style="animation-delay: 0.5s">t</span>
    <span class="echarts-3d letter-animate letter-s" style="animation-delay: 0.6s">s</span>
  </div>
</template>

<script setup>
/**
 * ControlsHint Component
 * 控制提示组件，显示用户交互提示
 *
 * @component ControlsHint
 * @author ZOOOW-AI Team
 * @version 1.0.0
 * @license MIT
 */
let goTo = () => {
  window.open('http://www.echarts.zooow.xyz')
}
</script>

<style scoped lang="scss">
.echarts-hint {
  position: absolute;
  top: 80px;
  left: 20px;
  background: linear-gradient(45deg, rgba(11, 47, 66, 0.6), rgba(3, 38, 56, 0.7), rgba(5, 17, 73, 0.7));
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 232, 164, 0.2);
  //pointer-events: none;
  transition: opacity 0.3s ease;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 0.8;
  cursor: pointer;

  &:hover {
    box-sizing: border-box;
    border: 2px solid #eacf1e;
    opacity: 1;
  }
  
  // 焦点状态适配键盘导航
  &:focus {
    outline: 2px solid #eacf1e;
    outline-offset: 2px;
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
  letter-spacing: 1px;
  background-size: 400% 400%;
  
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
    opacity: 0.7;
  }
  50% {
    transform: translateY(-8px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(-4px) scale(1.05);
    opacity: 0.9;
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
  .echarts-hint {
    top: 60px;
    left: 15px;
    width: 80px;
    height: 80px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.6);
    
    &:hover {
      border: 1px solid #eacf1e;
    }
  }
  
  .echarts-3d {
    font-size: 14px;
    letter-spacing: 0.5px;
    transform: perspective(300px) rotateX(8deg);
    
    // 简化移动端阴影效果以提升性能
    text-shadow: 
      0 1px 0 #555,
      0 2px 0 #444,
      0 3px 0 #333,
      0 4px 1px rgba(0,0,0,.2);
    
    animation: gradientShift 4s ease-in-out infinite alternate;
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
  .echarts-hint {
    top: 50px;
    left: 10px;
    width: 70px;
    height: 70px;
    padding: 6px 10px;
  }
  
  .echarts-3d {
    font-size: 12px;
    letter-spacing: 0px;
    transform: perspective(200px) rotateX(6deg);
    
    // 进一步简化阴影
    text-shadow: 
      0 1px 0 #444,
      0 2px 0 #333;
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
    // 移除悬停效果，在触摸设备上始终显示
    opacity: 0.9;
    
    &:active {
      transform: scale(0.95);
      border: 2px solid #eacf1e;
    }
  }
  
  .echarts-3d {
    // 触摸设备上减少动画复杂度
    animation: gradientShift 6s ease-in-out infinite alternate;
  }
  
  .letter-animate {
    animation: bounceIn 3s ease-in-out infinite alternate;
  }
}
</style>
