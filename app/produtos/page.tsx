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
    async function carregarProdutos() {
      const { data } = await supabase
        .from("produtos")
        .select("*")

      if (data) {
        setProdutos(data)
      }
    }

    carregarProdutos()
  }, [])

  function adicionarCarrinho(produto: any) {
    setCarrinho([...carrinho, produto])
  }

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.preco),
    0
  )

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-red-600 mb-10">
        Produtos do Açougue
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {produtos.map((produto, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-2xl overflow-hidden"
          >
            <img
              src={
                produto.imagem ||
                "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
              }
              alt={produto.nome}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold">
                {produto.nome}
              </h2>

              <p className="text-green-400 text-xl mt-2">
                R$ {produto.preco}
              </p>

              <button
                onClick={() =>
                  adicionarCarrinho(produto)
                }
                className="bg-red-600 w-full mt-6 py-3 rounded-xl font-bold"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Carrinho
        </h2>

        {carrinho.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-zinc-700 py-3"
          >
            <p>{item.nome}</p>

            <p>R$ {item.preco}</p>
          </div>
        ))}

        <h3 className="text-2xl mt-6 font-bold text-green-400">
          Total: R$ {total.toFixed(2)}
        </h3>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-zinc-800 p-3 rounded-xl w-full"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="bg-zinc-800 p-3 rounded-xl w-full"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="bg-zinc-800 p-3 rounded-xl w-full"
          />

          <button
            onClick={async () => {
              const pedidoTexto = carrinho
                .map((item) => item.nome)
                .join(", ")

              await supabase.from("pedidos").insert([
                {
                  cliente: nome,
                  endereco: endereco,
                  telefone: telefone,
                  pedido: pedidoTexto,
                  total: total,
                  status: "aguardando",
                },
              ])

              alert("Pedido realizado com sucesso!")

              setCarrinho([])
              setNome("")
              setEndereco("")
              setTelefone("")
            }}
            className="bg-green-600 w-full py-4 rounded-xl font-bold text-xl"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </main>
  )
}
