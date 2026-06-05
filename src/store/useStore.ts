import { create } from "zustand"
import type { AppData, MockExam, QuickLink, StudySession } from "../types"
import { todayStr } from "../utils/date"
import {
  DEFAULT_EXAM_DATE,
  DEFAULT_ENGLISH_TARGET,
  DEFAULT_MATH_TARGET,
  DEFAULT_QUICK_LINKS,
} from "../data/defaults"
import * as db from "../lib/db"

interface AppStore extends AppData {
  isLoading: boolean
  loadAllData: () => Promise<void>

  setExamDate: (date: string) => Promise<void>
  setMathTarget: (score: number) => Promise<void>
  setEnglishTarget: (score: number) => Promise<void>
  checkIn: () => Promise<void>
  addStudySession: (session: StudySession) => Promise<void>
  addMockExam: (exam: MockExam) => Promise<void>
  removeMockExam: (id: string) => Promise<void>
  addQuickLink: (link: QuickLink) => Promise<void>
  removeQuickLink: (id: string) => Promise<void>
  updateQuickLink: (link: QuickLink) => Promise<void>
  updateNote: (date: string, note: string) => Promise<void>
}

const initialState: AppData = {
  examDate: DEFAULT_EXAM_DATE,
  mathTarget: DEFAULT_MATH_TARGET,
  englishTarget: DEFAULT_ENGLISH_TARGET,
  records: {},
  mockExams: [],
  quickLinks: DEFAULT_QUICK_LINKS,
}

export const useStore = create<AppStore>()((set, get) => ({
  ...initialState,
  isLoading: true,

  loadAllData: async () => {
    try {
      const [settings, recordsData, mockExams, quickLinks] = await Promise.all([
        db.getSettings(),
        db.getRecordsWithSessions(),
        db.getMockExams(),
        db.getQuickLinks(),
      ])

      // 首次使用，初始化默认快捷链接
      if (quickLinks.length === 0) {
        await db.ensureDefaultLinks(DEFAULT_QUICK_LINKS)
      }

      set({
        ...settings,
        records: recordsData.records,
        mockExams,
        quickLinks: quickLinks.length > 0 ? quickLinks : DEFAULT_QUICK_LINKS,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  setExamDate: async (date) => {
    set({ examDate: date })
    await db.updateSettings({ examDate: date })
  },

  setMathTarget: async (score) => {
    set({ mathTarget: score })
    await db.updateSettings({ mathTarget: score })
  },

  setEnglishTarget: async (score) => {
    set({ englishTarget: score })
    await db.updateSettings({ englishTarget: score })
  },

  checkIn: async () => {
    const date = todayStr()
    const records = { ...get().records }
    const existing = records[date]
    records[date] = {
      date,
      totalMinutes: existing?.totalMinutes ?? 0,
      sessions: existing?.sessions ?? [],
      checkedIn: true,
      note: existing?.note,
    }
    set({ records })
    await db.upsertRecord(records[date])
  },

  addStudySession: async (session) => {
    const date = todayStr()
    const records = { ...get().records }
    const existing = records[date]
    const sessions = [...(existing?.sessions ?? []), session]
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    records[date] = {
      date,
      totalMinutes,
      sessions,
      checkedIn: existing?.checkedIn ?? false,
      note: existing?.note,
    }
    set({ records })
    await Promise.all([
      db.upsertRecord(records[date]),
      db.insertSession(date, session),
    ])
  },

  addMockExam: async (exam) => {
    const mockExams = [...get().mockExams, exam]
    set({ mockExams })
    await db.insertMockExam(exam)
  },

  removeMockExam: async (id) => {
    set({ mockExams: get().mockExams.filter((e) => e.id !== id) })
    await db.deleteMockExam(id)
  },

  addQuickLink: async (link) => {
    const quickLinks = [...get().quickLinks, link]
    set({ quickLinks })
    await db.insertQuickLink(link)
  },

  removeQuickLink: async (id) => {
    set({ quickLinks: get().quickLinks.filter((l) => l.id !== id) })
    await db.deleteQuickLink(id)
  },

  updateQuickLink: async (link) => {
    set({
      quickLinks: get().quickLinks.map((l) =>
        l.id === link.id ? link : l
      ),
    })
    await db.updateQuickLinkRow(link)
  },

  updateNote: async (date, note) => {
    const records = { ...get().records }
    const existing = records[date]
    if (existing) {
      records[date] = { ...existing, note }
    } else {
      records[date] = {
        date,
        totalMinutes: 0,
        sessions: [],
        checkedIn: false,
        note,
      }
    }
    set({ records })
    await db.upsertRecord(records[date])
  },
}))
