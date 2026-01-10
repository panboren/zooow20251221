export default defineEventHandler(() => {
  // 生成 1-37 的随机数
  const randomNum = Math.floor(Math.random() * 37) + 1

  return {
    success: true,
    data: {
      random: randomNum,
      message: `随机生成数字: ${randomNum}`
    }
  }
})
