export type Subject = "math" | "english" | "other"

export interface StudySession {
  startTime: number
  endTime: number
  durationMinutes: number
  subject: Subject
}

export interface StudyRecord {
  date: string
  totalMinutes: number
  sessions: StudySession[]
  checkedIn: boolean
  note?: string
}

export interface MockExam {
  id: string
  date: string
  subject: "math" | "english"
  score: number
  totalScore: number
}

export interface QuickLink {
  id: string
  title: string
  url: string
  category: "course" | "official" | "collection" | "resource" | "other"
  icon?: string
}

export interface AppData {
  examDate: string
  mathTarget: number
  englishTarget: number
  records: Record<string, StudyRecord>
  mockExams: MockExam[]
  quickLinks: QuickLink[]
}
