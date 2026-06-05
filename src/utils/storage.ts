const STORAGE_KEY = "exam-tracker-data"

export function loadFromStorage<T>(defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function saveToStorage<T>(data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage 满了或不可用，静默失败
  }
}
