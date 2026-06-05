import { useState } from "react"
import { ExternalLink, Plus, X, Pencil, Check, BookOpen, Globe, Heart, FolderOpen, Link2 } from "../lib/icons"
import { useStore } from "../store/useStore"
import type { QuickLink } from "../types"

const categoryIcons: Record<string, React.ReactNode> = {
  course: <BookOpen size={16} />, official: <Globe size={16} />, collection: <Heart size={16} />, resource: <FolderOpen size={16} />, other: <Link2 size={16} />,
}
const categoryLabels: Record<string, string> = { course: "课程", official: "官方", collection: "收藏", resource: "资源", other: "其他" }

export default function QuickLinks() {
  const { quickLinks, addQuickLink, removeQuickLink, updateQuickLink } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState(""); const [url, setUrl] = useState("")
  const [category, setCategory] = useState<QuickLink["category"]>("course")

  const grouped = quickLinks.reduce((acc, link) => { const cat = link.category; if (!acc[cat]) acc[cat] = []; acc[cat].push(link); return acc }, {} as Record<string, QuickLink[]>)

  const handleAdd = () => {
    if (!title.trim() || !url.trim()) return
    addQuickLink({ id: Date.now().toString(), title: title.trim(), url: url.trim(), category })
    setTitle(""); setUrl(""); setShowForm(false)
  }
  const startEdit = (link: QuickLink) => { setEditingId(link.id); setTitle(link.title); setUrl(link.url); setCategory(link.category) }
  const saveEdit = () => {
    if (!editingId || !title.trim() || !url.trim()) return
    updateQuickLink({ id: editingId, title: title.trim(), url: url.trim(), category })
    setEditingId(null); setTitle(""); setUrl("")
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-xs text-brand font-medium hover:text-brand-dark"><Plus size={16} />添加链接</button>
      </div>
      {(showForm || editingId) && (
        <div className="bg-slate-50 p-3 rounded-xl space-y-2">
          <input type="text" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm" />
          <input type="url" placeholder="链接地址 (https://...)" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm" />
          <div className="flex items-center gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value as QuickLink["category"])} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white">
              {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {editingId ? <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-brand text-white rounded-lg text-sm"><Check size={16} /></button>
            : <button onClick={handleAdd} className="px-4 py-1.5 bg-brand text-white rounded-lg text-sm font-medium">保存</button>}
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="p-1.5 text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        </div>
      )}
      {Object.entries(grouped).map(([cat, links]) => (
        <div key={cat}>
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-500">{categoryIcons[cat]}{categoryLabels[cat]}</div>
          <div className="space-y-1.5">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between group bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-brand/30 hover:shadow-sm transition-all">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-2 text-sm text-slate-700 font-medium truncate">
                  <span className="truncate">{link.title}</span>
                  <ExternalLink size={14} className="text-slate-300 flex-shrink-0 group-hover:text-brand transition-colors" />
                </a>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => startEdit(link)} className="p-1 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"><Pencil size={14} /></button>
                  <button onClick={() => removeQuickLink(link.id)} className="p-1 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {quickLinks.length === 0 && <p className="text-center text-sm text-slate-400 py-8">还没有添加链接，点击右上角"添加链接"开始</p>}
    </div>
  )
}
