import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import {
  Clock,
  HeartPulse,
  Moon,
  Star,
} from "lucide-react"

import { authOptions } from "@/lib/auth"
import {
  getLatestSleep,
  getWeeklySleep,
} from "@/lib/health-api"

function duration(minutes: number | null) {
  if (minutes == null) return "—"

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h ${mins.toString().padStart(2, "0")}min`
}

function time(value: string | null) {
  if (!value) return "—"

  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [latest, weekly] = await Promise.all([
    getLatestSleep(),
    getWeeklySleep(),
  ])

  const cards = [
    {
      title: "Sono principal",
      value: duration(latest.main_sleep_min),
      subtitle: `Média semanal ${duration(
        Math.round(
          weekly.summary.avg_main_sleep_min ?? 0,
        ),
      )}`,
      icon: Moon,
    },
    {
      title: "Score",
      value: latest.sleep_score?.toString() ?? "—",
      subtitle: `Média semanal ${weekly.summary.avg_score ?? "—"}`,
      icon: Star,
    },
    {
      title: "FC durante o sono",
      value: latest.avg_hr
        ? `${latest.avg_hr} bpm`
        : "—",
      subtitle: `${latest.min_hr ?? "—"}–${
        latest.max_hr ?? "—"
      } bpm`,
      icon: HeartPulse,
    },
    {
      title: "Horário",
      value: time(latest.bedtime),
      subtitle: `Acordou ${time(
        latest.wake_up_time,
      )}`,
      icon: Clock,
    },
  ]

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-sky-400">
            Mi Fitness
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Resumo da sua última noite.
          </p>
        </div>

        <Link
          href="/sleep"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          Ver sono
        </Link>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <Icon className="size-5 text-sky-400" />
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {card.subtitle}
              </p>
            </article>
          )
        })}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">
            Sono leve
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {duration(latest.light_min)}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">
            Sono profundo
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {duration(latest.deep_min)}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">
            REM
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {duration(latest.rem_min)}
          </p>
        </article>
      </section>
    </main>
  )
}