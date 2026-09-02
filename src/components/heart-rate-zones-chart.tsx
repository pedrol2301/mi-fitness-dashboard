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

import type { HeartRateDay } from "@/lib/health-api"

export function HeartRateZonesChart({ days }: { days: HeartRateDay[] }) {
  const data = days.map((day) => ({
    date: new Date(`${day.date}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    aquecimento: day.zones.warm_up_min,
    queima: day.zones.fat_burning_min,
    aerobica: day.zones.aerobic_min,
    anaerobica: day.zones.anaerobic_min,
    extrema: day.zones.extreme_min,
  }))

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.45} />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} tickLine={false} axisLine={false} unit=" min" width={62} />
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
          <Bar dataKey="aquecimento" name="Aquecimento" stackId="zones" fill="#60a5fa" />
          <Bar dataKey="queima" name="Queima de gordura" stackId="zones" fill="#34d399" />
          <Bar dataKey="aerobica" name="Aeróbica" stackId="zones" fill="#fbbf24" />
          <Bar dataKey="anaerobica" name="Anaeróbica" stackId="zones" fill="#fb923c" />
          <Bar dataKey="extrema" name="Extrema" stackId="zones" fill="#fb7185" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
