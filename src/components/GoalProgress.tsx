import { useState } from "react"
import { Plus, Trash2 } from "../lib/icons"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useStore } from "../store/useStore"
import { todayStr, shortDate } from "../utils/date"
import type { MockExam } from "../types"

const subjectNames: Record<string, string> = { math: "高数", english: "英语" }

export default function GoalProgress() {
  const { mathTarget, englishTarget, setMathTarget, setEnglishTarget, mockExams, addMockExam, removeMockExam } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [subj, setSubj] = useState<"math" | "english">("math")
  const [score, setScore] = useState("")

  const mathExams = mockExams.filter((e) => e.subject === "math").sort((a, b) => a.date.localeCompare(b.date))
  const englishExams = mockExams.filter((e) => e.subject === "english").sort((a, b) => a.date.localeCompare(b.date))
  const latestMath = mathExams[mathExams.length - 1]?.score
  const latestEnglish = englishExams[englishExams.length - 1]?.score

  const handleAdd = () => {
    const s = Number(score)
    if (!score || isNaN(s) || s < 0 || s > 150) return
    addMockExam({ id: Date.now().toString(), date: todayStr(), subject: subj, score: s, totalScore: 150 })
    setScore(""); setShowForm(false)
  }

  const chartData = (exams: MockExam[]) => exams.map((e) => ({ date: shortDate(e.date), score: e.score }))

  return (
    <div className="p-5 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">目标分数</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">高等数学</div>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={150} value={mathTarget} onChange={(e) => setMathTarget(Number(e.target.value))} className="w-16 text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-brand focus:outline-none tabular-nums" />
              <span className="text-sm text-slate-400">/ 150</span>
            </div>
            {latestMath !== undefined && <div className="mt-1 text-xs text-slate-500">最新：{latestMath} 分 · 差距：{mathTarget - latestMath > 0 ? `${mathTarget - latestMath} 分` : "已达成！"}</div>}
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">公共英语</div>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={150} value={englishTarget} onChange={(e) => setEnglishTarget(Number(e.target.value))} className="w-16 text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-brand focus:outline-none tabular-nums" />
              <span className="text-sm text-slate-400">/ 150</span>
            </div>
            {latestEnglish !== undefined && <div className="mt-1 text-xs text-slate-500">最新：{latestEnglish} 分 · 差距：{englishTarget - latestEnglish > 0 ? `${englishTarget - latestEnglish} 分` : "已达成！"}</div>}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">模拟考记录</h3>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-xs text-brand font-medium hover:text-brand-dark"><Plus size={16} />添加</button>
        </div>
        {showForm && (
          <div className="flex items-center gap-2 mb-3 bg-slate-50 p-3 rounded-xl">
            <select value={subj} onChange={(e) => setSubj(e.target.value as "math" | "english")} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"><option value="math">高数</option><option value="english">英语</option></select>
            <input type="number" placeholder="分数" value={score} onChange={(e) => setScore(e.target.value)} className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-sm tabular-nums" min={0} max={150} />
            <button onClick={handleAdd} className="px-4 py-1.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark">保存</button>
          </div>
        )}
      </div>
      {mockExams.length > 0 && (
        <div>
          {mathExams.length >= 2 && (
            <div className="mb-4"><h4 className="text-xs font-medium text-slate-500 mb-2">高数趋势</h4>
              <div className="bg-slate-50 rounded-xl p-3"><ResponsiveContainer width="100%" height={160}><BarChart data={chartData(mathExams)}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis domain={[0, 150]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          )}
          {englishExams.length >= 2 && (
            <div className="mb-4"><h4 className="text-xs font-medium text-slate-500 mb-2">英语趋势</h4>
              <div className="bg-slate-50 rounded-xl p-3"><ResponsiveContainer width="100%" height={160}><BarChart data={chartData(englishExams)}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis domain={[0, 150]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="score" fill="#f59e0b" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          )}
        </div>
      )}
      {mockExams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">全部记录</h3>
          <div className="space-y-1">
            {[...mockExams].reverse().map((e) => (
              <div key={e.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg text-sm">
                <span className="text-slate-600">{shortDate(e.date)} · {subjectNames[e.subject]}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 tabular-nums">{e.score}</span>
                  <span className="text-slate-400">/ {e.totalScore}</span>
                  <button onClick={() => removeMockExam(e.id)} className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
