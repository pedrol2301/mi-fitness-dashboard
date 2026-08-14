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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis dataKey="date" />
          <YAxis yAxisId="score" domain={[0, 100]} />
          <YAxis yAxisId="hr" orientation="right" domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line yAxisId="score" type="monotone" dataKey="score" name="Score" strokeWidth={2} />
          <Line yAxisId="hr" type="monotone" dataKey="fc" name="FC média" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
