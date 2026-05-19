"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../lib/supabase"

export default function Produtos() {

  const [produtos, setProdutos] = useState<any[]>([])
  const [carrinho, setCarrinho] = useState<any[]>([])
  const [toast, setToast] = useState("")

  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [telefone, setTelefone] = useState("")

  const [abrirCarrinho, setAbrirCarrinho] = useState(false)

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

    setToast(`${produto.nome} adicionado ao carrinho`)

    setTimeout(() => {
      setToast("")
    }, 2500)

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
      .map((item) =>
        `${item.nome} x${item.quantidade}`
      )
      .join("\n")

    const mensagem = `
Pedido realizado com sucesso!

Pedido #${numeroPedido}

----------------------------

DETALHES DO PEDIDO

${pedidoTexto}

----------------------------

Total: R$ ${total.toFixed(2)}

Endereco:
${endereco}

Telefone:
${telefone}

Forma de pagamento:
PIX ou Dinheiro

Obrigado pela preferencia!
`

    const url =
      "https://api.whatsapp.com/send?phone=5512988736751&text=" +
      encodeURIComponent(mensagem)

    window.open(url, "_blank")

    setCarrinho([])
    setNome("")
    setEndereco("")
    setTelefone("")
    setAbrirCarrinho(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

          <div>

            <h1 className="text-4xl font-black text-red-600">
              Açougue Premium
            </h1>

            <p className="text-zinc-400">
              Carnes frescas todos os dias
            </p>

          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setAbrirCarrinho(true)
            }
            className="
              bg-red-600
              px-6
              py-4
              rounded-2xl
              font-bold
              shadow-2xl
            "
          >
            Carrinho ({carrinho.length})
          </motion.button>

        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-4">

          <button className="bg-red-600 px-5 py-3 rounded-2xl">
            Promoções
          </button>

          <button className="bg-zinc-800 px-5 py-3 rounded-2xl">
            Bovinos
          </button>

          <button className="bg-zinc-800 px-5 py-3 rounded-2xl">
            Frango
          </button>

          <button className="bg-zinc-800 px-5 py-3 rounded-2xl">
            Suínos
          </button>

          <button className="bg-zinc-800 px-5 py-3 rounded-2xl">
            Churrasco
          </button>

        </div>

      </header>

      <div className="relative h-[340px] overflow-hidden">

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute inset-0"
        >

          <img
            src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
            className="w-full h-full object-cover opacity-40"
          />

        </motion.div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-red-600"
          >
            Açougue Premium
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-200 mt-4 text-xl"
          >
            🔥 Promoções frescas todos os dias
          </motion.p>

          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="
              mt-8
              bg-red-600
              px-8
              py-4
              rounded-2xl
              font-black
              text-xl
              shadow-2xl
            "
          >
            Entrega Rápida 🚀
          </motion.div>

        </div>

      </div>

      <div className="p-6 md:p-10 pb-40 bg-gradient-to-b from-black via-zinc-950 to-black">

        <h2 className="text-5xl font-black mb-12 text-center">
          🔥 Produtos Premium
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {produtos.map((produto, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.04,
                y: -10,
              }}
              className="
                bg-zinc-900
                rounded-[35px]
                overflow-hidden
                border border-red-900/40
                shadow-2xl
              "
            >

              <motion.img
                whileHover={{ scale: 1.1 }}
                src={
                  produto.imagem ||
                  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
                }
                alt={produto.nome}
                className="w-full h-72 object-cover"
              />

              <div className="p-7">

                <h2 className="text-4xl font-black capitalize">
                  {produto.nome}
                </h2>

                <p className="text-green-400 text-4xl font-black mt-5">
                  R$ {produto.preco}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() =>
                    adicionarCarrinho(produto)
                  }
                  className="
                    bg-red-600
                    hover:bg-red-700
                    w-full
                    mt-6
                    py-4
                    rounded-2xl
                    font-black
                    text-xl
                  "
                >
                  Comprar
                </motion.button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

      {abrirCarrinho && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 z-50 flex justify-end"
        >

          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            className="
              bg-zinc-950
              w-full
              md:w-[500px]
              h-screen
              p-6
              overflow-y-auto
            "
          >

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

                    <p className="text-green-400">
                      R$ {item.preco}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        diminuirQuantidade(item.id)
                      }
                      className="bg-red-600 w-10 h-10 rounded-xl"
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
                      className="bg-green-600 w-10 h-10 rounded-xl"
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
                className="bg-zinc-800 p-4 rounded-2xl w-full"
              />

              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) =>
                  setEndereco(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
                className="bg-zinc-800 p-4 rounded-2xl w-full"
              />

              <button
                onClick={finalizarPedido}
                className="
                  bg-green-600
                  hover:bg-green-700
                  w-full
                  py-5
                  rounded-2xl
                  font-black
                  text-2xl
                "
              >
                Finalizar Pedido
              </button>

            </div>

          </motion.div>

        </motion.div>

      )}

      {toast && (

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            fixed
            bottom-24
            right-6
            bg-red-600
            px-6
            py-4
            rounded-2xl
            shadow-2xl
            z-[9999]
            font-bold
          "
        >
          🥩 {toast}
        </motion.div>

      )}

      {carrinho.length > 0 && (

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setAbrirCarrinho(true)
          }
          className="
            fixed
            bottom-10
            md:bottom-6
            right-6
            bg-red-600
            px-6
            py-4
            rounded-full
            text-xl
            font-bold
            shadow-2xl
            z-50
          "
        >
          Ver Carrinho ({carrinho.length})
        </motion.button>

      )}

    </main>
  )
}