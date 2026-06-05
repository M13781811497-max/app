import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import Layout from "./components/Layout"
import CountdownCard from "./components/CountdownCard"
import CheckInCard from "./components/CheckInCard"
import StudyTimer from "./components/StudyTimer"
import GoalProgress from "./components/GoalProgress"
import QuickLinks from "./components/QuickLinks"
import SettingsPanel from "./components/SettingsPanel"
import LoginPage from "./components/LoginPage"
import { useStore } from "./store/useStore"
import { Loader2 } from "./lib/icons"

type Tab = "timer" | "checkin" | "countdown" | "progress" | "links" | "settings"

export default function App() {
  const [tab, setTab] = useState<Tab>("countdown")
  const [authReady, setAuthReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const isLoading = useStore((s) => s.isLoading)
  const loadAllData = useStore((s) => s.loadAllData)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(
      ({ data }) => {
        if (!cancelled) {
          setLoggedIn(!!data.session)
          setAuthReady(true)
        }
      },
      () => {
        if (!cancelled) setAuthReady(true)
      }
    )

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setLoggedIn(!!session)
    })

    return () => {
      cancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (loggedIn) loadAllData()
  }, [loggedIn, loadAllData])

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    )
  }

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-3" />
          <p className="text-sm text-slate-400">加载备考数据...</p>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (tab) {
      case "countdown": return <CountdownCard />
      case "checkin": return <CheckInCard />
      case "timer": return <StudyTimer />
      case "progress": return <GoalProgress />
      case "links": return <QuickLinks />
      case "settings": return <SettingsPanel />
    }
  }

  return (
    <Layout activeTab={tab} onTabChange={setTab}>
      {renderTab()}
    </Layout>
  )
}
