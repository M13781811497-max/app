import { useState } from "react"
import { supabase } from "../lib/supabase"
import { LogIn, Loader2 } from "../lib/icons"

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) { setError("请输入邮箱和密码"); return }
    setLoading(true); setError("")

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (!signInError) { onLogin(); return }

    const { error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password })
    if (signUpError) {
      setError(signUpError.message.includes("already registered") ? "密码错误，请重试" : signUpError.message)
      setLoading(false); return
    }
    onLogin()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand text-white text-2xl font-bold mb-3">
            <LogIn size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">升本冲刺</h1>
          <p className="text-sm text-slate-400 mt-1">登录以同步你的备考数据</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="设置一个密码"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand text-white rounded-xl font-medium hover:bg-brand-dark transition-colors disabled:opacity-60">
            {loading ? <Loader2 size={16} /> : null}{loading ? "登录中..." : "登录 / 注册"}
          </button>
        </form>
        <p className="text-xs text-slate-400 text-center mt-4">首次使用将自动注册 · 数据云端同步</p>
      </div>
    </div>
  )
}
