import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { SleepScoreChart } from "@/components/sleep-score-chart"
import { SleepStagesChart } from "@/components/sleep-stages-chart"
import { SleepWeeklyChart } from "@/components/sleep-weekly-chart"
import { authOptions } from "@/lib/auth"
import { getLatestSleep, getSleep } from "@/lib/health-api"

function duration(minutes: number | null) {
  if (minutes == null) return "—"
  const rounded = Math.round(minutes)
  const hours = Math.floor(rounded / 60)
  const mins = rounded % 60
  return `${hours}h ${mins.toString().padStart(2, "0")}min`
}

function average(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value != null)
  if (!valid.length) return null
  return valid.reduce((sum, value) => sum + value, 0) / valid.length
}

export default async function SleepPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const params = await searchParams
  const requestedDays = Number(params.days ?? 7)
  const days = [7, 30].includes(requestedDays) ? requestedDays : 7

  const [latest, records] = await Promise.all([
    getLatestSleep(),
    getSleep(days),
  ])

  const orderedRecords = [...records].sort(
    (a, b) => a.data_referencia - b.data_referencia,
  )

  const avgMain = average(orderedRecords.map((r) => r.main_sleep_min))
  const avgScore = average(orderedRecords.map((r) => r.sleep_score))
  const avgDeep = average(orderedRecords.map((r) => r.deep_min))
  const avgRem = average(orderedRecords.map((r) => r.rem_min))

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
            ← Dashboard
          </Link>
          <h1 className="mt-5 text-3xl font-semibold">Sono</h1>
          <p className="mt-2 text-slate-400">Evolução e composição do sono.</p>
        </div>

        <div className="flex rounded-lg border border-white/10 p-1">
          {[7, 30].map((period) => (
            <Link
              key={period}
              href={`/sleep?days=${period}`}
              className={`rounded-md px-4 py-2 text-sm ${
                days === period
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {period} dias
            </Link>
          ))}
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Média de sono" value={duration(avgMain)} />
        <Card title="Score médio" value={avgScore == null ? "—" : avgScore.toFixed(1)} />
        <Card title="Profundo médio" value={duration(avgDeep)} />
        <Card title="REM médio" value={duration(avgRem)} />
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Duração do sono</h2>
        <p className="mt-1 text-sm text-slate-400">Sono principal e cochilos ao longo do período.</p>
        <div className="mt-6"><SleepWeeklyChart days={orderedRecords} /></div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Estágios do sono</h2>
        <p className="mt-1 text-sm text-slate-400">Distribuição entre sono leve, profundo e REM.</p>
        <div className="mt-6"><SleepStagesChart days={orderedRecords} /></div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Score e frequência cardíaca</h2>
        <p className="mt-1 text-sm text-slate-400">Relação entre qualidade do sono e FC média.</p>
        <div className="mt-6"><SleepScoreChart days={orderedRecords} /></div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Última noite</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric name="Total" value={duration(latest.total_sleep_min)} />
          <Metric name="Principal" value={duration(latest.main_sleep_min)} />
          <Metric name="Profundo" value={duration(latest.deep_min)} />
          <Metric name="REM" value={duration(latest.rem_min)} />
          <Metric name="Leve" value={duration(latest.light_min)} />
          <Metric name="Acordado" value={duration(latest.awake_min)} />
          <Metric name="FC média" value={latest.avg_hr ? `${latest.avg_hr} bpm` : "—"} />
          <Metric name="Score" value={String(latest.sleep_score ?? "—")} />
        </div>
      </section>
    </main>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  )
}

function Metric({ name, value }: { name: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{name}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </div>
  )
}
