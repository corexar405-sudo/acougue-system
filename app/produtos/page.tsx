"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [carrinho, setCarrinho] = useState<any[]>([])

  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [telefone, setTelefone] = useState("")

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")

    if (data) {
      setProdutos(data)
    }
  }

  function adicionarCarrinho(produto: any) {
    setCarrinho([...carrinho, produto])
  }

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.preco),
    0
  )

  async function finalizarPedido() {
    const pedidoTexto = carrinho
      .map((item) => item.nome)
      .join(", ")

    await supabase.from("pedidos").insert([
      {
        cliente: nome,
        endereco,
        telefone,
        pedido: pedidoTexto,
        total,
        status: "aguardando",
      },
    ])

    alert("Pedido realizado com sucesso!")

    setCarrinho([])
    setNome("")
    setEndereco("")
    setTelefone("")
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-[350px]">
        <img
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-black text-red-600">
            Açougue Premium
          </h1>

          <p className="text-zinc-300 mt-4 text-xl">
            Carnes frescas entregues na sua casa
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <h2 className="text-4xl font-bold mb-8">
          Produtos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {produtos.map((produto, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-3xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={
                  produto.imagem ||
                  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
                }
                alt={produto.nome}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h2 className="text-3xl font-bold">
                  {produto.nome}
                </h2>

                <p className="text-green-400 text-2xl mt-3 font-bold">
                  R$ {produto.preco}
                </p>

                <button
                  onClick={() =>
                    adicionarCarrinho(produto)
                  }
                  className="bg-red-600 hover:bg-red-700 transition w-full mt-6 py-4 rounded-2xl font-bold text-xl"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-zinc-900 p-8 rounded-3xl">
          <h2 className="text-4xl font-bold mb-6">
            Carrinho
          </h2>

          {carrinho.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-zinc-700 py-4"
            >
              <p className="text-lg">
                {item.nome}
              </p>

              <p className="text-lg text-green-400">
                R$ {item.preco}
              </p>
            </div>
          ))}

          <h3 className="text-3xl mt-8 font-black text-green-400">
            Total: R$ {total.toFixed(2)}
          </h3>

          <div className="mt-8 space-y-5">
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-zinc-800 p-4 rounded-2xl w-full text-lg"
            />

            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="bg-zinc-800 p-4 rounded-2xl w-full text-lg"
            />

            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="bg-zinc-800 p-4 rounded-2xl w-full text-lg"
            />

            <button
              onClick={finalizarPedido}
              className="bg-green-600 hover:bg-green-700 transition w-full py-5 rounded-2xl font-black text-2xl"
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}