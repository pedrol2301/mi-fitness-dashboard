import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { HeartRateChart } from "@/components/heart-rate-chart"
import { HeartRateZonesChart } from "@/components/heart-rate-zones-chart"
import { authOptions } from "@/lib/auth"
import { getHeartRate } from "@/lib/health-api"

export default async function HeartRatePage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const params = await searchParams
  const requestedDays = Number(params.days ?? 7)
  const days = [7, 30].includes(requestedDays) ? requestedDays : 7

  const data = await getHeartRate(days)
  const latest = data.days[data.days.length - 1]

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
            ← Dashboard
          </Link>
          <h1 className="mt-5 text-3xl font-semibold">Frequência cardíaca</h1>
          <p className="mt-2 text-slate-400">Tendência diária, repouso e tempo nas zonas de esforço.</p>
        </div>

        <div className="flex rounded-lg border border-white/10 p-1">
          {[7, 30].map((period) => (
            <Link
              key={period}
              href={`/heart-rate?days=${period}`}
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
        <Card title="FC média" value={bpm(data.summary.avg_hr)} />
        <Card title="Mínima média" value={bpm(data.summary.avg_min_hr)} />
        <Card title="Máxima média" value={bpm(data.summary.avg_max_hr)} />
        <Card title="FC de repouso" value={bpm(data.summary.avg_resting_hr)} />
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Evolução diária</h2>
        <p className="mt-1 text-sm text-slate-400">Média, repouso, mínima e máxima registradas pelo Mi Fitness.</p>
        <div className="mt-6">
          <HeartRateChart days={data.days} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Zonas de frequência cardíaca</h2>
        <p className="mt-1 text-sm text-slate-400">Minutos acumulados em cada zona de esforço por dia.</p>
        <div className="mt-6">
          <HeartRateZonesChart days={data.days} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Último dia registrado</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric name="Média" value={bpm(latest?.avg_hr)} />
          <Metric name="Mínima" value={bpm(latest?.min_hr)} />
          <Metric name="Máxima" value={bpm(latest?.max_hr)} />
          <Metric name="Repouso" value={bpm(latest?.resting_hr)} />
          <Metric name="Última leitura" value={bpm(latest?.latest_hr)} />
          <Metric name="Horário" value={formatTime(latest?.latest_hr_time)} />
          <Metric name="Leituras anormais" value={String(latest?.abnormal_hr_count ?? 0)} />
          <Metric name="Data" value={formatDate(latest?.date)} />
        </div>
      </section>
    </main>
  )
}

function bpm(value: number | null | undefined) {
  return value == null ? "—" : `${value} bpm`
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(value: string | undefined) {
  if (!value) return "—"
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR")
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
