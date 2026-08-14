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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis dataKey="date" />
          <YAxis unit="h" />
          <Tooltip formatter={(value) => `${Number(value).toFixed(1)} h`} />
          <Legend />
          <Bar dataKey="leve" name="Leve" stackId="sleep" />
          <Bar dataKey="profundo" name="Profundo" stackId="sleep" />
          <Bar dataKey="rem" name="REM" stackId="sleep" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
