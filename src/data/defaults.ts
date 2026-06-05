import type { QuickLink } from "../types"

export const DEFAULT_EXAM_DATE = "2026-04-11"
export const DEFAULT_MATH_TARGET = 120
export const DEFAULT_ENGLISH_TARGET = 100

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  {
    id: "1",
    title: "河南省教育考试院",
    url: "https://www.haeea.cn/",
    category: "official",
  },
  {
    id: "2",
    title: "河南专升本招生信息",
    url: "https://www.haeea.cn/html/zsb/",
    category: "official",
  },
  {
    id: "3",
    title: "B站收藏专栏",
    url: "https://space.bilibili.com/",
    category: "collection",
  },
  {
    id: "4",
    title: "中国大学MOOC",
    url: "https://www.icourse163.org/",
    category: "course",
  },
  {
    id: "5",
    title: "B站 — 高数",
    url: "https://search.bilibili.com/all?keyword=专升本高等数学",
    category: "course",
  },
  {
    id: "6",
    title: "B站 — 英语",
    url: "https://search.bilibili.com/all?keyword=专升本英语",
    category: "course",
  },
  {
    id: "7",
    title: "河南专升本真题资源",
    url: "https://www.haeea.cn/",
    category: "resource",
  },
  {
    id: "8",
    title: "专升本高等数学大纲",
    url: "https://www.haeea.cn/",
    category: "resource",
  },
]
