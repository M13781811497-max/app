import { useMemo } from "react"
import { useStore } from "../store/useStore"
import { daysUntil } from "../utils/date"

export function useCountdown() {
  const examDate = useStore((s) => s.examDate)
  return useMemo(() => {
    const remaining = daysUntil(examDate)
    const total = Math.max(1, 365) // 近似一年
    const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100))
    const isUrgent = remaining <= 30
    return { remaining, progress, isUrgent }
  }, [examDate])
}
