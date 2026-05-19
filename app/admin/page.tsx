"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { motion } from "framer-motion"

export default function Admin() {

  const [pedidos, setPedidos] = useState<any[]>([])

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function carregarPedidos() {

    const { data } = await supabase
      .from("pedidos")
      .select("*")
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
      .update({
        status,
      })
      .eq("id", id)

    carregarPedidos()
  }

async function entregarPedido(id: number) {

  const { error } = await supabase
    .from("pedidos")
    .delete()
    .eq("id", id)

  if (error) {
    console.log(error)
    alert(error.message)
    return
  }

  carregarPedidos()
}
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-black text-red-600">
              Painel Admin
            </h1>

            <p className="text-zinc-400 mt-2">
              Controle de pedidos do açougue
            </p>

          </div>

          <button
            onClick={carregarPedidos}
            className="
              bg-red-600
              px-6
              py-4
              rounded-2xl
              font-bold
            "
          >
            Atualizar
          </button>

        </div>

        <div className="space-y-6">

          {pedidos.map((pedido, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-6
              "
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="space-y-3">

                  <h2 className="text-3xl font-black text-red-500">
                    Pedido #{pedido.id}
                  </h2>

                  <p>
                    <span className="font-bold">
                      Cliente:
                    </span>{" "}
                    {pedido.nome}
                  </p>

                  <p>
                    <span className="font-bold">
                      Endereço:
                    </span>{" "}
                    {pedido.endereco}
                  </p>

                  <p>
                    <span className="font-bold">
                      Telefone:
                    </span>{" "}
                    {pedido.telefone}
                  </p>

                  <p>
                    <span className="font-bold">
                      Pedido:
                    </span>{" "}
                    {pedido.pedido}
                  </p>

                  <p className="text-green-400 text-2xl font-black">
                    Total: R$ {pedido.total}
                  </p>

                </div>

                <div className="space-y-4">

                  <div
                    className={`
                      px-5
                      py-3
                      rounded-2xl
                      text-center
                      font-black

                      ${
                        pedido.status === "Pendente"
                          ? "bg-yellow-700"
                          : pedido.status === "Preparando"
                          ? "bg-blue-700"
                          : pedido.status === "Saiu para entrega"
                          ? "bg-orange-700"
                          : "bg-green-700"
                      }
                    `}
                  >
                    {pedido.status}
                  </div>

                  <div className="grid grid-cols-2 gap-3">

  <button
    onClick={() =>
      atualizarStatus(
        pedido.id,
        "Preparando"
      )
    }
    className="
      bg-blue-600
      hover:bg-blue-700
      py-3
      rounded-xl
      font-bold
    "
  >
    Preparando
  </button>

  <button
    onClick={() =>
      atualizarStatus(
        pedido.id,
        "Saiu para entrega"
      )
    }
    className="
      bg-orange-600
      hover:bg-orange-700
      py-3
      rounded-xl
      font-bold
    "
  >
    Entrega
  </button>

  <button
    onClick={() =>
      entregarPedido(pedido.id)
    }
    className="
      bg-green-600
      hover:bg-green-700
      py-3
      rounded-xl
      font-bold
      col-span-2
    "
  >
    Entregue
  </button>

</div>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </main>
  )
}