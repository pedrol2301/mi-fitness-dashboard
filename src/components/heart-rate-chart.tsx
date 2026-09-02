"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { HeartRateDay } from "@/lib/health-api"

export function HeartRateChart({ days }: { days: HeartRateDay[] }) {
  const data = days.map((day) => ({
    date: new Date(`${day.date}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    media: day.avg_hr,
    repouso: day.resting_hr,
    minima: day.min_hr,
    maxima: day.max_hr,
  }))

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.45} />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} tickLine={false} axisLine={false} unit=" bpm" width={70} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />
          <Line type="monotone" dataKey="media" name="Média" stroke="#38bdf8" strokeWidth={3} dot={{ fill: "#38bdf8", r: 3 }} activeDot={{ r: 5 }} connectNulls />
          <Line type="monotone" dataKey="repouso" name="Repouso" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 2 }} connectNulls />
          <Line type="monotone" dataKey="minima" name="Mínima" stroke="#34d399" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="maxima" name="Máxima" stroke="#fb7185" strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
