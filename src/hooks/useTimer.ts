import { useState, useRef, useCallback } from "react"
import type { Subject, StudySession } from "../types"

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [subject, setSubject] = useState<Subject>("math")
  const [elapsed, setElapsed] = useState(0) // 秒
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback((subj: Subject) => {
    setSubject(subj)
    startTimeRef.current = Date.now()
    setElapsed(0)
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      setElapsed(Math.floor((now - startTimeRef.current) / 1000))
    }, 1000)
  }, [])

  const stop = useCallback((): StudySession | null => {
    if (!isRunning) return null
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    const end = Date.now()
    const dur = Math.round((end - startTimeRef.current) / 60000)
    if (dur <= 0) return null

    const session: StudySession = {
      startTime: startTimeRef.current,
      endTime: end,
      durationMinutes: dur,
      subject,
    }
    setElapsed(0)
    return session
  }, [isRunning, subject])

  return { isRunning, subject, elapsed, start, stop, setSubject }
}
