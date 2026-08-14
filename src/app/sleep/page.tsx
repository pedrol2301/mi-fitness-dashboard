import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { SleepWeeklyChart } from "@/components/sleep-weekly-chart"
import { authOptions } from "@/lib/auth"
import {
  getLatestSleep,
  getWeeklySleep,
} from "@/lib/health-api"

function duration(minutes: number | null) {
  if (minutes == null) return "—"

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h ${mins
    .toString()
    .padStart(2, "0")}min`
}

export default async function SleepPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [latest, weekly] = await Promise.all([
    getLatestSleep(),
    getWeeklySleep(),
  ])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Dashboard
        </Link>

        <h1 className="mt-5 text-3xl font-semibold">
          Sono
        </h1>

        <p className="mt-2 text-slate-400">
          Análise dos últimos 7 dias.
        </p>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Média semanal"
          value={duration(
            Math.round(
              weekly.summary.avg_main_sleep_min ?? 0,
            ),
          )}
        />

        <Card
          title="Score médio"
          value={String(
            weekly.summary.avg_score ?? "—",
          )}
        />

        <Card
          title="Sono profundo"
          value={duration(
            Math.round(
              weekly.summary.avg_deep_min ?? 0,
            ),
          )}
        />

        <Card
          title="REM"
          value={duration(
            Math.round(
              weekly.summary.avg_rem_min ?? 0,
            ),
          )}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">
          Duração do sono
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Sono principal e cochilos por dia.
        </p>

        <div className="mt-6">
          <SleepWeeklyChart days={weekly.days} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">
          Última noite
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            name="Total"
            value={duration(latest.total_sleep_min)}
          />

          <Metric
            name="Principal"
            value={duration(latest.main_sleep_min)}
          />

          <Metric
            name="Profundo"
            value={duration(latest.deep_min)}
          />

          <Metric
            name="REM"
            value={duration(latest.rem_min)}
          />

          <Metric
            name="Leve"
            value={duration(latest.light_min)}
          />

          <Metric
            name="Acordado"
            value={duration(latest.awake_min)}
          />

          <Metric
            name="FC média"
            value={
              latest.avg_hr
                ? `${latest.avg_hr} bpm`
                : "—"
            }
          />

          <Metric
            name="Score"
            value={String(
              latest.sleep_score ?? "—",
            )}
          />
        </div>
      </section>
    </main>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>
    </article>
  )
}

function Metric({
  name,
  value,
}: {
  name: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {name}
      </p>

      <p className="mt-1 text-lg font-medium">
        {value}
      </p>
    </div>
  )
}