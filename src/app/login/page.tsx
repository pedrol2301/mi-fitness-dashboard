"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Usuário ou senha inválidos")
      return
    }

    router.push(searchParams.get("callbackUrl") || "/dashboard")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-semibold">Mi Fitness</h1>
        <p className="mt-2 text-sm text-slate-400">Entre para acessar seu dashboard.</p>

        <label className="mt-8 block text-sm">Usuário</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-sky-400"
          autoComplete="username"
          required
        />

        <label className="mt-4 block text-sm">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-sky-400"
          autoComplete="current-password"
          required
        />

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}
