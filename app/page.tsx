"use client"

import { useState } from "react"

export default function Home() {
  const [pedidos, setPedidos] = useState([
    {
      cliente: "João",
      pedido: "2kg Picanha",
      status: "Preparando",
    },
  ])

  const [cliente, setCliente] = useState("")
  const [pedido, setPedido] = useState("")

  function adicionarPedido() {
    if (!cliente || !pedido) return

    const novoPedido = {
      cliente,
      pedido,
      status: "Preparando",
    }

    setPedidos([...pedidos, novoPedido])

    setCliente("")
    setPedido("")
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-red-600">
        Açougue Dashboard
      </h1>

      <p className="mt-4 text-gray-300">
        Sistema de pedidos e entregas
      </p>

      <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">
          Novo Pedido
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="bg-zinc-800 p-3 rounded-xl w-full"
          />

          <input
            type="text"
            placeholder="Pedido"
            value={pedido}
            onChange={(e) => setPedido(e.target.value)}
            className="bg-zinc-800 p-3 rounded-xl w-full"
          />

          <button
            onClick={adicionarPedido}
            className="bg-red-600 px-6 rounded-xl font-bold"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="mt-10 bg-zinc-900 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Pedidos
        </h2>

        <div className="space-y-4">
          {pedidos.map((pedido, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-4 rounded-xl flex justify-between"
            >
              <div>
                <p className="font-bold">
                  {pedido.cliente}
                </p>

                <p className="text-gray-400">
                  {pedido.pedido}
                </p>
              </div>

              <span className="bg-red-600 px-4 py-2 rounded-lg">
                {pedido.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
