// 基础动画配置
export const ANIMATION_CONFIG = {
  // 基础滚动速度 (像素/秒)
  // 值越大，滚动速度越快
  BASE_VELOCITY: 0.1,

  // 滚动速度倍数
  // 用户滚动时的速度增益系数，值越大对滚轮的响应越敏感
  SCROLL_MULTIPLIER: 0.01,

  // 动画平滑度
  // 控制速度变化的过渡时间，值越大过渡越平滑
  SMOOTHNESS: 0.5,

  // 最小重复次数
  // 确保文字在任何屏幕宽度下都能形成无缝滚动的最小重复次数
  MIN_REPEAT_COUNT: 4,

  // 动画持续时间基数
  // 用于计算一次完整动画循环的基础时间（秒）
  BASE_DURATION: 20,

  // 滚轮配置
  WHEEL_CONFIG: {
    // 滚轮速度系数
    // 负值表示滚轮方向与动画方向相反
    WHEEL_SPEED: -1,

    // 滚动容差
    // 触发动画方向改变的最小滚动距离
    SCROLL_TOLERANCE: 10,
  },

  // 方向配置
  DIRECTION: {
    // 初始滚动方向
    // 1 表示向左，-1 表示向右
    INITIAL: -1,
    LEFT: 1,
    RIGHT: -1,
  },

  // 速度阈值
  // 当滚动速度超过此值时才会应用额外的速度增益
  VELOCITY_THRESHOLD: 0.5,
} as const

// 动画状态类型
export type AnimationState = {
  direction: number
  velocity: number
  isHovered: boolean
}
