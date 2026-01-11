// 移动端设备关键字 - 定义为常量避免重复创建
const MOBILE_KEYWORDS = [
    'mobile', 'android', 'iphone', 'ipad', 'ipod',
    'blackberry', 'windows phone', 'opera mini',
    'iemobile', 'wpdesktop'
]

// 预先检查运行环境，避免每次调用时重复检查
const ENV_CHECKED = typeof window !== 'undefined' && typeof navigator !== 'undefined'
const TOUCH_SUPPORT = ENV_CHECKED ? ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0) : false
const USER_AGENT = ENV_CHECKED ? navigator.userAgent?.toLowerCase() || '' : ''

/**
 * 判断是否为PC端
 * @returns {boolean} 是否为PC端
 */
export const isPc = () => {
    try {
        if (!ENV_CHECKED) {
            return false
        }

        // 检查是否包含移动端关键字
        const isMobile = MOBILE_KEYWORDS.some(keyword =>
            USER_AGENT.includes(keyword)
        )

        return !TOUCH_SUPPORT && !isMobile
    } catch (error) {
        console.error('Error in isPc:', error)
        return false
    }
}
