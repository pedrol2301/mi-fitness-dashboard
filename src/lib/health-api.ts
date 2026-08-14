export type SleepDay = {
  date: string
  data_referencia: number
  bedtime: string | null
  wake_up_time: string | null
  total_sleep_min: number | null
  main_sleep_min: number | null
  nap_min: number | null
  light_min: number | null
  deep_min: number | null
  rem_min: number | null
  awake_min: number | null
  sleep_score: number | null
  awake_count: number | null
  avg_hr: number | null
  min_hr: number | null
  max_hr: number | null
  avg_spo2: number | null
}

export type SleepWeekly = {
  period: {
    start: string
    end: string
  }

  summary: {
    avg_total_sleep_min: number | null
    avg_main_sleep_min: number | null
    avg_nap_min: number | null
    avg_score: number | null
    avg_light_min: number | null
    avg_deep_min: number | null
    avg_rem_min: number | null
    avg_awake_min: number | null
    avg_hr: number | null
    avg_min_hr: number | null
    avg_max_hr: number | null
  }

  days: SleepDay[]
}

async function healthFetch<T>(path: string): Promise<T> {
  const apiUrl = process.env.API_URL
  const apiToken = process.env.API_TOKEN

  if (!apiUrl || !apiToken) {
    throw new Error("API_URL ou API_TOKEN não configurados")
  }

  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Health API respondeu HTTP ${response.status}`)
  }

  return response.json()
}

export function getLatestSleep() {
  return healthFetch<SleepDay>("/sleep/latest")
}

export function getSleep(days = 7) {
  return healthFetch<SleepDay[]>(`/sleep?days=${days}`)
}

export function getWeeklySleep() {
  return healthFetch<SleepWeekly>("/sleep/weekly")
}