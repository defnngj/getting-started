// 计算延迟时间（毫秒）
export function calculateDelayTime (minuteOfHour: number): number {
  const now = new Date()
  const next = new Date()

  // 如果当前时间已经过了指定分钟，设置下一个执行时间为下一个小时的指定分钟
  if (now.getMinutes() >= minuteOfHour) {
    next.setHours(now.getHours() + 1)
  }

  next.setMinutes(minuteOfHour, 0, 0) // 设置为下一个小时的指定分钟

  const delay = next.getTime() - now.getTime()

  return delay
}
