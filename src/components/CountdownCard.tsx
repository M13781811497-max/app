import { useCountdown } from "../hooks/useCountdown"
import { useStore } from "../store/useStore"

export default function CountdownCard() {
  const { remaining, progress, isUrgent } = useCountdown()
  const examDate = useStore((s) => s.examDate)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const ringColor = isUrgent ? "stroke-red-500" : "stroke-brand"

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-slate-200"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`progress-ring__circle ${ringColor}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className={`text-5xl font-bold tabular-nums ${
              isUrgent ? "text-red-500" : "text-slate-800"
            }`}
          >
            {remaining}
          </span>
          <span className="text-sm text-slate-500 mt-1">天</span>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        考试日期：{examDate}
      </p>

      {isUrgent && (
        <div className="mt-3 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium animate-pulse">
          冲刺阶段！全力以赴！
        </div>
      )}

      <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${
            isUrgent ? "bg-red-500" : "bg-brand"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">备考进度 {Math.round(progress)}%</p>
    </div>
  )
}
