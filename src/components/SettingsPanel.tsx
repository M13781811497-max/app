import { useStore } from "../store/useStore"
import { supabase } from "../lib/supabase"

export default function SettingsPanel() {
  const { examDate, mathTarget, englishTarget, setExamDate, setMathTarget, setEnglishTarget } =
    useStore()

  const handleExport = () => {
    const state = useStore.getState()
    const data = {
      examDate: state.examDate,
      mathTarget: state.mathTarget,
      englishTarget: state.englishTarget,
      records: state.records,
      mockExams: state.mockExams,
      quickLinks: state.quickLinks,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `exam-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = async () => {
    if (!window.confirm("确定要清除所有云端数据吗？此操作不可撤销！")) return
    const tables = ["study_sessions", "study_records", "mock_exams", "quick_links", "settings"]
    for (const table of tables) {
      // delete all rows for current user (RLS ensures this)
      await supabase.from(table).delete().neq("user_id", "00000000-0000-0000-0000-000000000000")
    }
    window.location.reload()
  }

  return (
    <div className="p-5 space-y-5">
      <h3 className="text-sm font-semibold text-slate-700">偏好设置</h3>

      {/* 考试日期 */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-500 font-medium">考试日期</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
        />
        <p className="text-xs text-slate-400">2026 年河南专升本预计在 4 月上旬</p>
      </div>

      {/* 目标分数 */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-500 font-medium">高等数学目标分</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={150}
            step={5}
            value={mathTarget}
            onChange={(e) => setMathTarget(Number(e.target.value))}
            className="flex-1 accent-brand"
          />
          <span className="text-sm font-bold text-slate-800 w-10 text-right tabular-nums">
            {mathTarget}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-slate-500 font-medium">公共英语目标分</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={150}
            step={5}
            value={englishTarget}
            onChange={(e) => setEnglishTarget(Number(e.target.value))}
            className="flex-1 accent-brand"
          />
          <span className="text-sm font-bold text-slate-800 w-10 text-right tabular-nums">
            {englishTarget}
          </span>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">数据管理</h4>

        <button
          onClick={handleExport}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
        >
          导出备份数据
        </button>

        <button
          onClick={handleClear}
          className="w-full py-2.5 rounded-xl border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          清除云端数据
        </button>
      </div>

      {/* 关于 */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          升本冲刺 v2.0 · 2026 河南省专升本备考助手 · 云端同步
        </p>
      </div>
    </div>
  )
}
