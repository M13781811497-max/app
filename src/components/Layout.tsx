import { BookOpen, Flame, Link2, Settings, Timer, TrendingUp } from "../lib/icons"

type Tab = "timer" | "checkin" | "countdown" | "progress" | "links" | "settings"

interface LayoutProps {
  children: React.ReactNode
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "countdown", label: "倒计时", icon: <Flame size={20} /> },
  { id: "checkin", label: "打卡", icon: <BookOpen size={20} /> },
  { id: "timer", label: "计时", icon: <Timer size={20} /> },
  { id: "progress", label: "进度", icon: <TrendingUp size={20} /> },
  { id: "links", label: "链接", icon: <Link2 size={20} /> },
  { id: "settings", label: "设置", icon: <Settings size={20} /> },
]

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-white shadow-sm">
      <header className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-brand text-white">
        <div>
          <h1 className="text-lg font-bold tracking-tight">升本冲刺</h1>
          <p className="text-xs text-indigo-200">2026河南专升本</p>
        </div>
        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
          加油！
        </span>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
      <nav className="border-t border-slate-200 bg-white flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 text-xs transition-colors ${
                active
                  ? "text-brand font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon}
              <span className="mt-0.5">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
