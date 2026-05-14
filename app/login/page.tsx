"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const router = useRouter()

  async function fazerLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert("Email ou senha inválidos")
      return
    }

    router.push("/admin")
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px]">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
          Login Admin
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 p-4 rounded-xl w-full text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-zinc-800 p-4 rounded-xl w-full text-white"
          />

          <button
            onClick={fazerLogin}
            className="bg-red-600 w-full py-4 rounded-xl font-bold text-white"
          >
            Entrar
          </button>
        </div>
      </div>
    </main>
  )
}
