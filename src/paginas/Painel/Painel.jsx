import { useState } from 'react'
import BarraProgresso from '../../componentes/BarraProgresso/BarraProgresso.jsx' // página inicial do site.
import Cabecalho from '../../componentes/Cabecalho/Cabecalho.jsx'
import CartaoResumo from '../../componentes/CartaoResumo/CartaoResumo.jsx'
import FiltrosTarefas from '../../componentes/FiltrosTarefas/FiltrosTarefas.jsx'
import ListaTarefas from '../../componentes/ListaTarefas/ListaTarefas.jsx'
import tarefasDeExemplo from '../../dados/tarefasDeExemplo.js'
import './Painel.css'

function pegarHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return ano + '-' + mes + '-' + dia
}

function Painel() {
  // Quando as tarefas mudam a tela atualiza sozinha.
  const [tarefas, setTarefas] = useState(tarefasDeExemplo)
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('entrega')

  const hoje = pegarHoje()
  const pendentes = tarefas.filter((tarefa) => !tarefa.concluida)
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida)
  const atrasadas = pendentes.filter((tarefa) => tarefa.dataEntrega < hoje)

  const filtros = [
    { id: 'todas', nome: 'Todas', quantidade: tarefas.length, lista: tarefas },
    { id: 'pendentes', nome: 'Pendentes', quantidade: pendentes.length, lista: pendentes },
    { id: 'atrasadas', nome: 'Atrasadas', quantidade: atrasadas.length, lista: atrasadas },
    { id: 'concluidas', nome: 'Concluídas', quantidade: concluidas.length, lista: concluidas },
  ]

  // Pega a lista do filtro escolhido
  const filtroEscolhido = filtros.find((item) => item.id === filtro)

  // Busca pelo título ou pela matéria
  const textoBuscado = busca.trim().toLowerCase()
  const tarefasBuscadas = filtroEscolhido.lista.filter((tarefa) => {
    const texto = (tarefa.titulo + ' ' + tarefa.materia).toLowerCase()
    return texto.includes(textoBuscado)
  })

  // Ordena por data de entrega ou por matéria. As concluídas ficam no fim.
  const tarefasVisiveis = [...tarefasBuscadas].sort((a, b) => {
    if (a.concluida !== b.concluida) {
      return a.concluida ? 1 : -1
    }
    if (ordem === 'materia') {
      return a.materia.localeCompare(b.materia)
    }
    return a.dataEntrega.localeCompare(b.dataEntrega)
  })

  // Marca ou desmarca uma tarefa como concluída
  function marcarTarefa(id) {
    const novasTarefas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return { ...tarefa, concluida: !tarefa.concluida }
      }
      return tarefa
    })
    setTarefas(novasTarefas)
  }

  // Tira a tarefa da lista
  function excluirTarefa(id) {
    const novasTarefas = tarefas.filter((tarefa) => tarefa.id !== id)
    setTarefas(novasTarefas)
  }

  return (
    <main className="painel">
      <div className="painel-conteudo">
        <Cabecalho titulo="Painel" />

        <section className="painel-resumo" aria-label="Resumo">
          <div className="painel-cartoes">
            <CartaoResumo nome="Total" valor={tarefas.length} />
            <CartaoResumo nome="Pendentes" valor={pendentes.length} cor="var(--cor-destaque)" />
            <CartaoResumo nome="Atrasadas" valor={atrasadas.length} cor="var(--cor-atrasada)" />
            <CartaoResumo nome="Concluídas" valor={concluidas.length} />
          </div>

          <BarraProgresso concluidas={concluidas.length} total={tarefas.length} />
        </section>

        <section className="painel-tarefas" aria-label="Lista de tarefas">
          <h2 className="painel-subtitulo">Minhas tarefas</h2>

          <FiltrosTarefas
            filtros={filtros}
            filtroAtual={filtro}
            aoTrocarFiltro={setFiltro}
            busca={busca}
            aoBuscar={setBusca}
            ordem={ordem}
            aoOrdenar={setOrdem}
          />

          <ListaTarefas
            tarefas={tarefasVisiveis}
            hoje={hoje}
            aoMarcar={marcarTarefa}
            aoExcluir={excluirTarefa}
          />
        </section>
      </div>
    </main>
  )
}

export default Painel
