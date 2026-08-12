import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-sky-400">Mi Fitness</p>
          <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-slate-400">Sono, frequência cardíaca, atividade física e treinos.</p>
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Sono", "Em breve"],
          ["Frequência cardíaca", "Em breve"],
          ["Passos", "Em breve"],
          ["Atividades", "Em breve"],
        ].map(([title, value]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
