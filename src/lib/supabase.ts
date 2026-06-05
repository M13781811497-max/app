import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jqyirecdnrtvnyjrjghf.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder"
const isDev = import.meta.env.DEV

// 开发模式下通过 Vite 代理转发请求
const customFetch: typeof fetch = (...args) => {
  const [input, init] = args
  let url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url

  if (isDev && url.includes("jqyirecdnrtvnyjrjghf.supabase.co")) {
    url = url.replace("https://jqyirecdnrtvnyjrjghf.supabase.co", "/supabase-api")
  }

  return fetch(url, init)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
})
