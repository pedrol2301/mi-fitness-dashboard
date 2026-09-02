"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Workout } from "@/lib/health-api"

function label(type: string | null) {
  const names: Record<string, string> = {
    indoor_running: "Corrida indoor",
    outdoor_running: "Corrida",
    walking: "Caminhada",
    cycling: "Ciclismo",
    swimming: "Natação",
    pool_swimming: "Natação",
    strength_training: "Musculação",
  }
  return type ? names[type] ?? type.replaceAll("_", " ") : "Treino"
}

export function WorkoutsChart({ workouts }: { workouts: Workout[] }) {
  const data = workouts.slice(-12).map((workout) => ({
    date: workout.start_time
      ? new Date(workout.start_time).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      : "—",
    name: label(workout.type),
    minutos: workout.duration_sec ? Number((workout.duration_sec / 60).toFixed(1)) : 0,
    calorias: workout.calories_kcal ?? 0,
  }))

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} opacity={0.35} />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis yAxisId="duration" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="calories" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }}
            labelStyle={{ color: "#cbd5e1" }}
            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
          <Bar yAxisId="duration" dataKey="minutos" name="Duração (min)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          <Bar yAxisId="calories" dataKey="calorias" name="Calorias (kcal)" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
