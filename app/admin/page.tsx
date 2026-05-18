"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin() {
  const [pedidos, setPedidos] = useState<any[]>([])

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function carregarPedidos() {
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .neq("status", "finalizado")
      .order("id", { ascending: false })

    if (data) {
      setPedidos(data)
    }
  }

  async function atualizarStatus(
    id: number,
    status: string
  ) {
    await supabase
      .from("pedidos")
      .update({ status })
      .eq("id", id)

    carregarPedidos()

    if (status === "entregue") {
      setTimeout(async () => {
        await supabase
          .from("pedidos")
          .update({
            status: "finalizado",
          })
          .eq("id", id)

        carregarPedidos()
      }, 60000)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-red-600 mb-10">
        Painel Admin
      </h1>

      <div className="space-y-6">

        {pedidos.map((pedido) => (

          <div
            key={pedido.id}
            className="bg-zinc-900 p-6 rounded-2xl"
          >

            <h2 className="text-2xl font-bold">
              {pedido.cliente}
            </h2>

            <p className="text-gray-300 mt-2">
              Pedido: {pedido.pedido}
            </p>

            <p className="text-gray-300">
              Endereço: {pedido.endereco}
            </p>

            <p className="text-gray-300">
              Telefone: {pedido.telefone}
            </p>

            <p className="text-green-400 text-xl mt-4">
              R$ {pedido.total}
            </p>

            <p className="mt-4">
              Status:
              <span className="text-yellow-400 ml-2">
                {pedido.status}
              </span>
            </p>

            <div className="flex gap-4 mt-6">

              <button
                onClick={() =>
                  atualizarStatus(
                    pedido.id,
                    "preparando"
                  )
                }
                className="bg-yellow-500 px-4 py-2 rounded-xl font-bold"
              >
                Preparando
              </button>

              <button
                onClick={() =>
                  atualizarStatus(
                    pedido.id,
                    "entregue"
                  )
                }
                className="bg-green-600 px-4 py-2 rounded-xl font-bold"
              >
                Entregue
              </button>

              <a
                href={`https://wa.me/55${pedido.telefone}`}
                target="_blank"
                className="bg-blue-500 px-4 py-2 rounded-xl font-bold"
              >
                WhatsApp
              </a>

            </div>
          </div>

        ))}

      </div>
    </main>
  )
}