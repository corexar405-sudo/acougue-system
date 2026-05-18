"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function Produtos() {

  const [produtos, setProdutos] = useState<any[]>([])
  const [carrinho, setCarrinho] = useState<any[]>([])

  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [telefone, setTelefone] = useState("")

  const [abrirCarrinho, setAbrirCarrinho] = useState(false)

  const [abrirAdmin, setAbrirAdmin] = useState(false)
  const [emailAdmin, setEmailAdmin] = useState("")
  const [senhaAdmin, setSenhaAdmin] = useState("")

  const router = useRouter()

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

    const itemExistente = carrinho.find(
      (item) => item.id === produto.id
    )

    if (itemExistente) {

      const novoCarrinho = carrinho.map((item) =>
        item.id === produto.id
          ? {
              ...item,
              quantidade: item.quantidade + 1,
            }
          : item
      )

      setCarrinho(novoCarrinho)

    } else {

      setCarrinho([
        ...carrinho,
        {
          ...produto,
          quantidade: 1,
        },
      ])
    }
  }

  function aumentarQuantidade(id: number) {

    const novoCarrinho = carrinho.map((item) =>
      item.id === id
        ? {
            ...item,
            quantidade: item.quantidade + 1,
          }
        : item
    )

    setCarrinho(novoCarrinho)
  }

  function diminuirQuantidade(id: number) {

    const itemExistente = carrinho.find(
      (item) => item.id === id
    )

    if (itemExistente.quantidade === 1) {

      const novoCarrinho = carrinho.filter(
        (item) => item.id !== id
      )

      setCarrinho(novoCarrinho)

    } else {

      const novoCarrinho = carrinho.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade - 1,
            }
          : item
      )

      setCarrinho(novoCarrinho)
    }
  }

  const total = carrinho.reduce(
    (acc, item) =>
      acc +
      Number(item.preco) * item.quantidade,
    0
  )

  async function finalizarPedido() {

    const numeroPedido =
      Math.floor(Math.random() * 99999)

    const pedidoTexto = carrinho
      .map(function(item) {
        return item.nome + " x" + item.quantidade
      })
      .join("%0A")

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

    const mensagem =
      "Pedido realizado com sucesso!%0A%0A" +

      "Pedido #" + numeroPedido + "%0A%0A" +

      "----------------------------%0A%0A" +

      "DETALHES DO PEDIDO%0A%0A" +

      pedidoTexto + "%0A%0A" +

      "----------------------------%0A%0A" +

      "Total: R$ " + total.toFixed(2) + "%0A%0A" +

      "Endereco:%0A" +
      endereco + "%0A%0A" +

      "Telefone:%0A" +
      telefone + "%0A%0A" +

      "Forma de pagamento:%0A" +
      "PIX ou Dinheiro%0A%0A" +

      "Entrega estimada:%0A" +
      "40 minutos%0A%0A" +

      "Obrigado pela preferencia!"

    const url =
      "https://api.whatsapp.com/send?phone=5512988736751&text=" +
      mensagem

    window.open(url, "_blank")

    setCarrinho([])
    setNome("")
    setEndereco("")
    setTelefone("")
    setAbrirCarrinho(false)
  }

  async function loginAdmin() {

    const { error } =
      await supabase.auth.signInWithPassword({
        email: emailAdmin,
        password: senhaAdmin,
      })

    if (error) {
      alert("Login inválido")
      return
    }

    router.push("/admin")
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

          <div>

            <h1 className="text-3xl font-black text-red-600">
              Açougue Premium
            </h1>

            <p className="text-zinc-400 text-sm">
              Carnes frescas todos os dias
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setAbrirCarrinho(true)
              }
              className="bg-red-600 px-5 py-3 rounded-2xl font-bold"
            >
              Carrinho ({carrinho.length})
            </button>

            <button
              onClick={() =>
                setAbrirAdmin(true)
              }
              className="text-zinc-500 text-2xl"
            >
              ⚙️
            </button>

          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-4">

          <button className="bg-red-600 px-4 py-2 rounded-xl whitespace-nowrap">
            Promoções
          </button>

          <button className="bg-zinc-800 px-4 py-2 rounded-xl whitespace-nowrap">
            Bovinos
          </button>

          <button className="bg-zinc-800 px-4 py-2 rounded-xl whitespace-nowrap">
            Frango
          </button>

          <button className="bg-zinc-800 px-4 py-2 rounded-xl whitespace-nowrap">
            Suínos
          </button>

          <button className="bg-zinc-800 px-4 py-2 rounded-xl whitespace-nowrap">
            Churrasco
          </button>

        </div>
      </header>

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
      </div>

      {abrirCarrinho && (

        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">

          <div className="bg-zinc-950 w-full md:w-[500px] h-screen p-6 overflow-y-auto">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-4xl font-bold">
                Carrinho
              </h2>

              <button
                onClick={() =>
                  setAbrirCarrinho(false)
                }
                className="bg-red-600 px-4 py-2 rounded-xl"
              >
                Fechar
              </button>

            </div>

            {carrinho.map((item, index) => (

              <div
                key={index}
                className="bg-zinc-900 p-4 rounded-2xl mb-4"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xl font-bold">
                      {item.nome}
                    </p>

                    <p className="text-green-400 mt-1">
                      R$ {item.preco}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        diminuirQuantidade(item.id)
                      }
                      className="bg-red-600 w-10 h-10 rounded-xl text-xl"
                    >
                      -
                    </button>

                    <span className="text-xl font-bold">
                      {item.quantidade}
                    </span>

                    <button
                      onClick={() =>
                        aumentarQuantidade(item.id)
                      }
                      className="bg-green-600 w-10 h-10 rounded-xl text-xl"
                    >
                      +
                    </button>

                  </div>
                </div>
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
                onChange={(e) =>
                  setNome(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full text-lg"
              />

              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) =>
                  setEndereco(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full text-lg"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
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
      )}

      {abrirAdmin && (

        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

          <div className="bg-zinc-950 p-8 rounded-3xl w-[400px]">

            <h2 className="text-3xl font-black mb-6 text-center">
              Login Admin
            </h2>

            <div className="space-y-4">

              <input
                type="email"
                placeholder="Email"
                value={emailAdmin}
                onChange={(e) =>
                  setEmailAdmin(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full"
              />

              <input
                type="password"
                placeholder="Senha"
                value={senhaAdmin}
                onChange={(e) =>
                  setSenhaAdmin(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full"
              />

              <button
                onClick={loginAdmin}
                className="bg-red-600 w-full py-4 rounded-2xl font-bold"
              >
                Entrar
              </button>

              <button
                onClick={() =>
                  setAbrirAdmin(false)
                }
                className="bg-zinc-800 w-full py-4 rounded-2xl font-bold"
              >
                Fechar
              </button>

            </div>
          </div>
        </div>
      )}

      {carrinho.length > 0 && (

        <button
          onClick={() =>
            setAbrirCarrinho(true)
          }
          className="fixed bottom-6 right-6 bg-red-600 px-6 py-4 rounded-full text-xl font-bold shadow-2xl z-50"
        >
          Ver Carrinho ({carrinho.length})
        </button>

      )}

    </main>
  )
}