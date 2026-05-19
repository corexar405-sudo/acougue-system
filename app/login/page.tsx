"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function fazerLogin() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert("Login inválido")
      return
    }

    router.push("/admin")
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">

        <h1 className="text-5xl font-black text-red-600 mb-8 text-center">
          Admin
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-zinc-800 p-4 rounded-2xl text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            className="w-full bg-zinc-800 p-4 rounded-2xl text-white"
          />

          <button
            onClick={fazerLogin}
            className="
              bg-red-600
              hover:bg-red-700
              w-full
              py-4
              rounded-2xl
              font-black
              text-xl
            "
          >
            Entrar
          </button>

        </div>

      </div>

    </main>
  )
}