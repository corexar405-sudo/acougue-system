"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../lib/supabase"
import { ifError } from "assert"

export default function Produtos() {

  const [produtos, setProdutos] = useState<any[]>([])
  const [carrinho, setCarrinho] = useState<any[]>([])
  const [abrirCarrinho, setAbrirCarrinho] = useState(false)
  const [toast, setToast] = useState("")  

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

  setToast(
    `${produto.nome} adicionado ao carrinho`
  )

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

    const item = carrinho.find(
      (item) => item.id === id
    )

    if (!item) return

    if (item.quantidade === 1) {

      setCarrinho(
        carrinho.filter(
          (item) => item.id !== id
        )
      )

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
      Number(item.preco) *
        item.quantidade,
    0
  )
async function finalizarPedido() {
  
  console.log(nome)

  if (carrinho.length === 0) {
    return
  }

  const pedidoTexto = carrinho
    .map(
      (item) =>
        `${item.nome} x${item.quantidade}`
    )
    .join(", ")

  const totalPedido = carrinho.reduce(
    (acc, item) =>
      acc +
      Number(item.preco) *
        item.quantidade,
    0
  )

  const { error } = await supabase
  .from("pedidos")
  
            .insert([
  {
    cliente: nome,
    endereco: endereco,
    telefone: telefone,
    pedido: pedidoTexto,
    total: totalPedido,
    status: "Pendente",
  },
])

   if (error) {

  console.log(error)

  alert(error.message)

  return
}
  setCarrinho([])

  setToast("Pedido realizado com sucesso!")

  setTimeout(() => {
    setToast("")
  }, 3000)
}
  return (
    <main className="min-h-screen bg-black text-white scroll-smooth">

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

          <div className="flex items-center gap-4">

            <a
              href="/login"
              className="
                bg-zinc-800
                hover:bg-zinc-700
                px-5
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              Admin
            </a>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              animate={{
                boxShadow: [
                  "0px 0px 0px #dc2626",
                  "0px 0px 25px #dc2626",
                  "0px 0px 0px #dc2626",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
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
              Carrinho (
              {
                carrinho.reduce(
                  (acc, item) =>
                    acc + item.quantidade,
                  0
                )
              }
              )
            </motion.button>

          </div>

        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-4">

          <a
            href="#promocoes"
            className="
              bg-red-600
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-2xl
              font-bold
              whitespace-nowrap
            "
          >
            Promoções
          </a>

          <a
            href="#bovinos"
            className="
              bg-zinc-800
              hover:bg-red-600
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-2xl
              whitespace-nowrap
            "
          >
            Bovinos
          </a>

          <a
            href="#frango"
            className="
              bg-zinc-800
              hover:bg-red-600
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-2xl
              whitespace-nowrap
            "
          >
            Frango
          </a>

          <a
            href="#suinos"
            className="
              bg-zinc-800
              hover:bg-red-600
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-2xl
              whitespace-nowrap
            "
          >
            Suínos
          </a>

          <a
            href="#churrasco"
            className="
              bg-zinc-800
              hover:bg-red-600
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-2xl
              whitespace-nowrap
            "
          >
            Churrasco
          </a>

        </div>

      </header>

      <motion.div
        initial={{
          opacity: 0,
          scale: 1.1,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1,
        }}
        className="relative h-[500px] overflow-hidden"
      >

        <motion.img
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <motion.h1
            initial={{
              opacity: 0,
              y: -40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-5xl md:text-8xl font-black text-red-600"
          >
            Açougue Premium
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="text-zinc-200 mt-4 text-2xl"
          >
            🔥 Promoções frescas todos os dias
          </motion.p>

        </div>

      </motion.div>

      <div
        id="promocoes"
        className="p-6 md:p-10 pb-40"
      >

        <motion.h2
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          className="text-5xl font-black mb-12 text-center"
        >
          🔥 Produtos Premium
        </motion.h2>

        {[
          {
            id: "bovinos",
            titulo: "🥩 Bovinos",
            categoria: "bovinos",
          },
          {
            id: "frango",
            titulo: "🍗 Frango",
            categoria: "frango",
          },
          {
            id: "suinos",
            titulo: "🐷 Suínos",
            categoria: "suinos",
          },
          {
            id: "churrasco",
            titulo: "🔥 Churrasco",
            categoria: "churrasco",
          },
        ].map((secao) => (

          <div
            key={secao.id}
            id={secao.id}
            className="mb-24"
          >

            <motion.h2
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              className="text-4xl font-black mb-8"
            >
              {secao.titulo}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {produtos
                .filter(
                  (produto) =>
                    produto.categoria ===
                    secao.categoria
                )
                .map((produto, index) => (

                  <motion.div
                    key={produto.id}
                    initial={{
                      opacity: 0,
                      y: 60,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.04,
                      y: -12,
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
                      whileHover={{
                        scale: 1.1,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      src={produto.imagem}
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

                      {produto.estoque <= 5 ? (

                        <div
                          className="
                            bg-yellow-700
                            text-yellow-100
                            mt-4
                            p-3
                            rounded-xl
                            text-center
                            font-bold
                          "
                        >
                          ⚠️ Últimas {produto.estoque} unidades
                        </div>

                      ) : (

                        <div
                          className="
                            bg-green-700
                            text-green-100
                            mt-4
                            p-3
                            rounded-xl
                            text-center
                            font-bold
                          "
                        >
                          ✅ {produto.estoque} disponíveis
                        </div>

                      )}

                      <motion.button
                        whileHover={{
                          scale: 1.05,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
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

        ))}

      </div>

      <AnimatePresence>

        {abrirCarrinho && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/70 z-50 flex justify-end"
          >

            <motion.div
              initial={{
                x: 500,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: 500,
              }}
              transition={{
                duration: 0.3,
              }}
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

              {carrinho.map((item) => (

                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: 30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
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

                </motion.div>

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
  className="
    bg-zinc-800
    p-4
    rounded-2xl
    w-full
  "
/>
                

                <input
  type="text"
  placeholder="Endereço"
  value={endereco}
  onChange={(e) =>
    setEndereco(e.target.value)
  }
  className="
    bg-zinc-800
    p-4
    rounded-2xl
    w-full
  "
/>

                <input
  type="text"
  placeholder="Telefone"
  value={telefone}
  onChange={(e) =>
    setTelefone(e.target.value)
  }
  className="
    bg-zinc-800
    p-4
    rounded-2xl
    w-full
  "
/>

                <motion.button
  whileHover={{
    scale: 1.02,
  }}
  whileTap={{
    scale: 0.97,
  }}
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
                </motion.button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
      <AnimatePresence>

  {toast && (

    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        fixed
        bottom-10
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

</AnimatePresence>

    </main>
  )
}