import { useMemo } from "react"
import { Check } from "../lib/icons"
import { useStore } from "../store/useStore"
import { todayStr, shortDate, pastDays } from "../utils/date"

export default function CheckInCard() {
  const records = useStore((s) => s.records)
  const checkIn = useStore((s) => s.checkIn)
  const today = todayStr()
  const checkedToday = records[today]?.checkedIn ?? false

  const { streak, maxStreak } = useMemo(() => {
    let current = 0; let max = 0
    const days = pastDays(365)
    for (const d of days) {
      if (records[d]?.checkedIn) { current++; if (current > max) max = current }
      else { if (d === today) continue; current = 0 }
    }
    return { streak: current, maxStreak: max }
  }, [records, today])

  const weekData = useMemo(() => {
    const result: { date: string; checked: boolean }[] = []
    for (const d of pastDays(30)) result.push({ date: shortDate(d), checked: records[d]?.checkedIn ?? false })
    return result
  }, [records])

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <button onClick={checkIn} disabled={checkedToday}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold transition-all shadow-lg ${
            checkedToday ? "bg-emerald-100 text-emerald-600 shadow-emerald-200/50 cursor-default" : "bg-brand text-white hover:bg-brand-dark hover:scale-105 active:scale-95 shadow-brand/30"
          }`}>
          {checkedToday ? <Check size={40} /> : "打卡"}
        </button>
        <p className="mt-2 text-sm text-slate-500">{checkedToday ? "今日已打卡 ✓" : "点击打卡记录今天的学习"}</p>
      </div>
      <div className="flex justify-around mb-6 text-center">
        <div><div className="text-3xl font-bold text-orange-500 tabular-nums">{streak}</div><div className="text-xs text-slate-400 mt-1">当前连续</div></div>
        <div className="w-px bg-slate-200" />
        <div><div className="text-3xl font-bold text-slate-700 tabular-nums">{maxStreak}</div><div className="text-xs text-slate-400 mt-1">最长连续</div></div>
        <div className="w-px bg-slate-200" />
        <div><div className="text-3xl font-bold text-brand tabular-nums">{Object.values(records).filter((r) => r.checkedIn).length}</div><div className="text-xs text-slate-400 mt-1">累计打卡</div></div>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-2">过去 30 天</p>
        <div className="flex flex-wrap gap-1">
          {weekData.map((d, i) => (
            <div key={i} title={d.date} className={`w-3.5 h-3.5 rounded-sm transition-colors ${d.checked ? "bg-emerald-400" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
