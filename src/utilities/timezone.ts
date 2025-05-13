export function toBeijingTime(date: string) {
  return new Date(new Date(date).getTime() - 8 * 60 * 60 * 1000)
}

export function formatToBeijingTime(date: Date) {
  const options = {
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
    timeZone: 'Asia/Shanghai', // 设置为东八区
    hour12: false,
  }
  const formatter = new Intl.DateTimeFormat('zh-CN', options)
  const parts = formatter.formatToParts(date)
  const formatted = `${parts[0].value}-${parts[2].value}-${parts[4].value}T${parts[6].value}:${parts[8].value}:${parts[10].value}+08:00`
  return formatted
}

// 北京时间零点
export function today() {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  const todayWithoutTimezone = new Date(new Date().setHours(0, 0, 0, 0) - timezoneOffset)
  return new Date(todayWithoutTimezone.getTime() - 8 * 60 * 60 * 1000)
}

// 北京时间明天零点
export function tomorrow() {
  return new Date(today().getTime() + 24 * 60 * 60 * 1000)
}

export function getDay(date: Date) {
  const options = {
    timeZone: 'Asia/Shanghai',
    weekday: 'long' as const,
  }
  const dayName = date.toLocaleString('en-US', options)

  // 如果你想返回数字（0-6），可以映射一下
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days.indexOf(dayName)
}

export function getMonth(date: Date) {
  const options = {
    timeZone: 'Asia/Shanghai',
    month: 'long' as const,
  }
  const monthName = date.toLocaleString('en-US', options)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return months.indexOf(monthName)
}
