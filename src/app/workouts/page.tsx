import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Activity, Dumbbell, Flame, HeartPulse, Route, Timer } from "lucide-react"

import { WorkoutsChart } from "@/components/workouts-chart"
import { authOptions } from "@/lib/auth"
import { getWorkouts, type Workout } from "@/lib/health-api"

export default async function WorkoutsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const data = await getWorkouts(100)
  const latest = data.workouts[data.workouts.length - 1]

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
          ← Dashboard
        </Link>
        <h1 className="mt-5 text-3xl font-semibold">Treinos</h1>
        <p className="mt-2 text-slate-400">Histórico de atividades registradas pelo Mi Fitness.</p>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Activity} title="Treinos" value={String(data.summary.count)} />
        <Card icon={Timer} title="Tempo total" value={formatDuration(data.summary.total_duration_sec)} />
        <Card icon={Flame} title="Calorias" value={formatCalories(data.summary.total_calories_kcal)} />
        <Card icon={HeartPulse} title="FC média" value={formatBpm(data.summary.avg_hr)} />
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Volume dos treinos</h2>
        <p className="mt-1 text-sm text-slate-400">Duração e gasto calórico dos últimos treinos.</p>
        <div className="mt-6">
          <WorkoutsChart workouts={data.workouts} />
        </div>
      </section>

      {latest && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-sky-400">Último treino</p>
              <h2 className="mt-1 text-xl font-semibold">{workoutName(latest.type)}</h2>
              <p className="mt-1 text-sm text-slate-400">{formatDateTime(latest.start_time)}</p>
            </div>
            <Dumbbell className="size-6 text-sky-400" />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Metric name="Duração" value={formatDuration(latest.duration_sec)} />
            <Metric name="Calorias" value={formatCalories(latest.calories_kcal)} />
            <Metric name="Distância" value={formatDistance(latest.distance_m)} />
            <Metric name="FC média" value={formatBpm(latest.avg_hr)} />
            <Metric name="FC mínima" value={formatBpm(latest.min_hr)} />
            <Metric name="FC máxima" value={formatBpm(latest.max_hr)} />
            <Metric name="Passos" value={latest.steps?.toLocaleString("pt-BR") ?? "—"} />
            <Metric name="Carga" value={latest.training_load?.toFixed(1) ?? "—"} />
          </div>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Histórico</h2>
        <div className="mt-6 space-y-3">
          {[...data.workouts].reverse().map((workout) => (
            <WorkoutRow key={workout.id} workout={workout} />
          ))}
        </div>
      </section>
    </main>
  )
}

function WorkoutRow({ workout }: { workout: Workout }) {
  return (
    <article className="grid gap-4 rounded-xl border border-white/10 bg-slate-950/30 p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:items-center">
      <div>
        <p className="font-medium">{workoutName(workout.type)}</p>
        <p className="mt-1 text-xs text-slate-500">{formatDateTime(workout.start_time)}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Timer className="size-4 text-sky-400" />
        {formatDuration(workout.duration_sec)}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Flame className="size-4 text-orange-400" />
        {formatCalories(workout.calories_kcal)}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {workout.distance_m ? <Route className="size-4 text-violet-400" /> : <HeartPulse className="size-4 text-pink-400" />}
        {workout.distance_m ? formatDistance(workout.distance_m) : formatBpm(workout.avg_hr)}
      </div>
    </article>
  )
}

function workoutName(type: string | null) {
  const names: Record<string, string> = {
    indoor_running: "Corrida indoor",
    outdoor_running: "Corrida",
    walking: "Caminhada",
    cycling: "Ciclismo",
    swimming: "Natação",
    pool_swimming: "Natação",
    strength_training: "Musculação",
    // No export observado do Mi Fitness, o treino registrado como vôlei
    // chega com a chave interna "foosball".
    foosball: "Vôlei",
  }
  return type ? names[type] ?? type.replaceAll("_", " ") : "Treino"
}

function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return "—"
  const minutes = Math.round(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours ? `${hours}h ${mins.toString().padStart(2, "0")}min` : `${mins} min`
}

function formatCalories(value: number | null | undefined) {
  return value == null ? "—" : `${Math.round(value)} kcal`
}

function formatBpm(value: number | null | undefined) {
  return value == null ? "—" : `${Math.round(value)} bpm`
}

function formatDistance(value: number | null | undefined) {
  if (value == null) return "—"
  return value >= 1000 ? `${(value / 1000).toFixed(2)} km` : `${Math.round(value)} m`
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function Card({ icon: Icon, title, value }: { icon: typeof Activity; title: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <Icon className="size-5 text-sky-400" />
      </div>
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
