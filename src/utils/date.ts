/** 返回 YYYY-MM-DD 格式的今日日期 */
export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** 计算从今天到目标日期的剩余天数 */
export function daysUntil(targetDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))
}

/** 格式化分钟数为 X小时Y分钟 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}分钟`
  if (m === 0) return `${h}小时`
  return `${h}小时${m}分钟`
}

/** 格式化秒数为 HH:MM:SS */
export function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/** 获取过去 N 天的日期字符串数组 */
export function pastDays(n: number): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(dateToStr(d))
  }
  return days
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** 格式化日期为 MM-DD */
export function shortDate(ts: string): string {
  const parts = ts.split("-")
  return `${parts[1]}-${parts[2]}`
}

/** 获取本周一的日期字符串 */
export function thisMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return dateToStr(d)
}
