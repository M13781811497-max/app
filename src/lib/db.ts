import { supabase } from "./supabase"
import type { MockExam, QuickLink, StudyRecord, StudySession } from "../types"

// ─── Settings ────────────────────────────────────────────

export async function getSettings(): Promise<{
  examDate: string
  mathTarget: number
  englishTarget: number
}> {
  const { data, error } = await supabase
    .from("settings")
    .select("exam_date, math_target, english_target")
    .maybeSingle()

  if (error || !data) {
    // 首次使用：插入默认值，带 user_id
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    const defaults = {
      user_id: userId,
      exam_date: "2026-04-11",
      math_target: 120,
      english_target: 100,
    }
    await supabase.from("settings").upsert(defaults, { onConflict: "user_id" })
    return { examDate: defaults.exam_date, mathTarget: defaults.math_target, englishTarget: defaults.english_target }
  }

  return {
    examDate: data.exam_date,
    mathTarget: data.math_target,
    englishTarget: data.english_target,
  }
}

export async function updateSettings(fields: Partial<{ examDate: string; mathTarget: number; englishTarget: number }>) {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (fields.examDate !== undefined) update.exam_date = fields.examDate
  if (fields.mathTarget !== undefined) update.math_target = fields.mathTarget
  if (fields.englishTarget !== undefined) update.english_target = fields.englishTarget
  await supabase.from("settings").update(update).neq("user_id", "00000000-0000-0000-0000-000000000000")
}

// ─── Study Records + Sessions ────────────────────────────

export async function getRecordsWithSessions(): Promise<{
  records: Record<string, StudyRecord>
}> {
  const { data: records } = await supabase
    .from("study_records")
    .select("date, total_minutes, checked_in, note")
    .order("date", { ascending: false })
    .limit(400)

  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("record_date, start_time, end_time, duration_minutes, subject")

  const sessionsByDate: Record<string, StudySession[]> = {}
  for (const s of sessions ?? []) {
    if (!sessionsByDate[s.record_date]) sessionsByDate[s.record_date] = []
    sessionsByDate[s.record_date].push({
      startTime: s.start_time,
      endTime: s.end_time,
      durationMinutes: s.duration_minutes,
      subject: s.subject,
    })
  }

  const result: Record<string, StudyRecord> = {}
  for (const r of records ?? []) {
    result[r.date] = {
      date: r.date,
      totalMinutes: r.total_minutes,
      sessions: sessionsByDate[r.date] ?? [],
      checkedIn: r.checked_in,
      note: r.note ?? undefined,
    }
  }
  return { records: result }
}

export async function upsertRecord(record: StudyRecord) {
  await supabase.from("study_records").upsert({
    date: record.date,
    total_minutes: record.totalMinutes,
    checked_in: record.checkedIn,
    note: record.note ?? null,
  }, { onConflict: "user_id, date" })
}

export async function insertSession(date: string, session: StudySession) {
  await supabase.from("study_sessions").insert({
    record_date: date,
    start_time: session.startTime,
    end_time: session.endTime,
    duration_minutes: session.durationMinutes,
    subject: session.subject,
  })
}

// ─── Mock Exams ──────────────────────────────────────────

export async function getMockExams(): Promise<MockExam[]> {
  const { data } = await supabase
    .from("mock_exams")
    .select("*")
    .order("date", { ascending: false })
  return (data ?? []).map((e) => ({
    id: e.id,
    date: e.date,
    subject: e.subject,
    score: e.score,
    totalScore: e.total_score,
  }))
}

export async function insertMockExam(exam: MockExam) {
  await supabase.from("mock_exams").insert({
    id: exam.id,
    date: exam.date,
    subject: exam.subject,
    score: exam.score,
    total_score: exam.totalScore,
  })
}

export async function deleteMockExam(id: string) {
  await supabase.from("mock_exams").delete().eq("id", id)
}

// ─── Quick Links ─────────────────────────────────────────

export async function getQuickLinks(): Promise<QuickLink[]> {
  const { data } = await supabase.from("quick_links").select("*").order("sort_order", { ascending: true })
  return (data ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    category: l.category,
    icon: l.icon ?? undefined,
  }))
}

export async function insertQuickLink(link: QuickLink) {
  await supabase.from("quick_links").insert({
    id: link.id,
    title: link.title,
    url: link.url,
    category: link.category,
    icon: link.icon ?? null,
  })
}

export async function updateQuickLinkRow(link: QuickLink) {
  await supabase.from("quick_links").update({
    title: link.title,
    url: link.url,
    category: link.category,
    icon: link.icon ?? null,
  }).eq("id", link.id)
}

export async function deleteQuickLink(id: string) {
  await supabase.from("quick_links").delete().eq("id", id)
}

/** 首次使用时插入默认快捷链接 */
export async function ensureDefaultLinks(defaultLinks: QuickLink[]) {
  const { data } = await supabase.from("quick_links").select("id").limit(1)
  if (data?.length === 0) {
    for (const link of defaultLinks) {
      await insertQuickLink(link)
    }
  }
}
