"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { SleepDay } from "@/lib/health-api"

type Props = {
  days: SleepDay[]
}

function minutesToHours(minutes: number | null) {
  if (!minutes) return 0

  return Number((minutes / 60).toFixed(2))
}

export function SleepWeeklyChart({ days }: Props) {
  const data = days.map((day) => ({
    date: new Date(`${day.date}T12:00:00`).toLocaleDateString(
      "pt-BR",
      {
        weekday: "short",
      },
    ),
    sono: minutesToHours(day.main_sleep_min),
    cochilo: minutesToHours(day.nap_min),
  }))

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.15}
          />

          <XAxis dataKey="date" />

          <YAxis
            unit="h"
            domain={[0, "auto"]}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toFixed(1)} h`,
            ]}
          />

          <Bar
            dataKey="sono"
            name="Sono principal"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="cochilo"
            name="Cochilo"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}