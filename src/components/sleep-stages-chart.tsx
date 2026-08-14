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

import type { SleepDay } from "@/lib/health-api"

export function SleepStagesChart({ days }: { days: SleepDay[] }) {
  const data = days.map((day) => ({
    date: new Date(`${day.date}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    leve: Number(((day.light_min ?? 0) / 60).toFixed(2)),
    profundo: Number(((day.deep_min ?? 0) / 60).toFixed(2)),
    rem: Number(((day.rem_min ?? 0) / 60).toFixed(2)),
  }))

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} opacity={0.35} />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis unit="h" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }}
            labelStyle={{ color: "#cbd5e1" }}
            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
            formatter={(value) => `${Number(value).toFixed(1)} h`}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
          <Bar dataKey="leve" name="Leve" stackId="sleep" fill="#38bdf8" />
          <Bar dataKey="profundo" name="Profundo" stackId="sleep" fill="#6366f1" />
          <Bar dataKey="rem" name="REM" stackId="sleep" fill="#a78bfa" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
