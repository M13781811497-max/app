import { Play, Pause, Square, Clock } from "../lib/icons"
import { useTimer } from "../hooks/useTimer"
import { useStore } from "../store/useStore"
import { formatSeconds, formatMinutes, todayStr } from "../utils/date"
import type { Subject } from "../types"

const subjectLabels: Record<Subject, string> = { math: "高等数学", english: "公共英语", other: "其他" }

export default function StudyTimer() {
  const { isRunning, subject, elapsed, start, stop, setSubject } = useTimer()
  const addStudySession = useStore((s) => s.addStudySession)
  const records = useStore((s) => s.records)
  const todayMinutes = records[todayStr()]?.totalMinutes ?? 0

  const handleStop = () => { const session = stop(); if (session) addStudySession(session) }

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-2 mb-6 text-slate-500">
        <Clock size={16} /><span className="text-sm">今日已学：</span>
        <span className="text-lg font-bold text-slate-800 tabular-nums">{formatMinutes(todayMinutes)}</span>
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className={`text-7xl font-mono font-bold tabular-nums mb-6 ${isRunning ? "text-brand" : "text-slate-300"}`}>{formatSeconds(elapsed)}</div>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {(Object.keys(subjectLabels) as Subject[]).map((s) => (
          <button key={s} onClick={() => !isRunning && setSubject(s)} disabled={isRunning}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subject === s ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}>
            {subjectLabels[s]}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button onClick={() => start(subject)} className="flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30">
            <Play size={20} />开始学习
          </button>
        ) : (
          <>
            <button onClick={handleStop} className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"><Pause size={20} />暂停</button>
            <button onClick={handleStop} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"><Square size={20} />结束</button>
          </>
        )}
      </div>
    </div>
  )
}
