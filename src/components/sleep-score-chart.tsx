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

import type { SleepDay } from "@/lib/health-api"

export function SleepScoreChart({ days }: { days: SleepDay[] }) {
  const data = days.map((day) => ({
    date: new Date(`${day.date}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    score: day.sleep_score,
    fc: day.avg_hr,
  }))

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} opacity={0.35} />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis yAxisId="score" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="hr" orientation="right" domain={["auto", "auto"]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
          <Line yAxisId="score" type="monotone" dataKey="score" name="Score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Line yAxisId="hr" type="monotone" dataKey="fc" name="FC média" stroke="#f472b6" strokeWidth={3} dot={{ r: 3, fill: "#f472b6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
