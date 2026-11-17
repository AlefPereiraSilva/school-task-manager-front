import { useEffect, useState } from 'react'
import BarraProgresso from '../../componentes/BarraProgresso/BarraProgresso.jsx'
import Cabecalho from '../../componentes/Cabecalho/Cabecalho.jsx'
import CartaoResumo from '../../componentes/CartaoResumo/CartaoResumo.jsx'
import FiltrosTarefas from '../../componentes/FiltrosTarefas/FiltrosTarefas.jsx'
import FormularioTarefa from '../../componentes/FormularioTarefa/FormularioTarefa.jsx'
import ListaTarefas from '../../componentes/ListaTarefas/ListaTarefas.jsx'
import PendentesPorMateria from '../../componentes/PendentesPorMateria/PendentesPorMateria.jsx'
import ProximasEntregas from '../../componentes/ProximasEntregas/ProximasEntregas.jsx'
import api from '../../servicos/api.js'
import { pegarHoje } from '../../utilitarios/datas.js'
import './Painel.css'

function Painel() {

  const [tarefas, setTarefas] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('entrega')
  const [formularioAberto, setFormularioAberto] = useState(false)

  async function carregarTarefas() {
    try {
      const resposta = await api.get('/tarefas')
      setTarefas(resposta.data)
    } catch (erro) {
      console.error('Erro ao carregar tarefas do servidor:', erro)
    }
  }

  useEffect(() => {
    let ativo = true

    async function buscarInicial() {
      try {
        const resposta = await api.get('/tarefas')
        if (ativo) {
          setTarefas(resposta.data)
        }
      } catch (erro) {
        console.error('Erro ao carregar tarefas do servidor:', erro)
      }
    }

    buscarInicial()
    return () => {
      ativo = false
    }
  }, [])

  function obterNomeMateria(tarefa) {
    if (!tarefa.materia) return ''
    return typeof tarefa.materia === 'object' ? (tarefa.materia.nome || '') : String(tarefa.materia)
  }

  const hoje = pegarHoje()
  const pendentes = tarefas.filter((tarefa) => !tarefa.concluida && tarefa.status !== 'CONCLUIDA')
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida || tarefa.status === 'CONCLUIDA')
  const atrasadas = pendentes.filter((tarefa) => (tarefa.dataEntrega || '').slice(0, 10) < hoje)

  let lista = tarefas
  if (filtro === 'pendentes') lista = pendentes
  if (filtro === 'atrasadas') lista = atrasadas
  if (filtro === 'concluidas') lista = concluidas

  lista = lista.filter((tarefa) =>
    (tarefa.titulo + ' ' + obterNomeMateria(tarefa)).toLowerCase().includes(busca.toLowerCase())
  )

  lista = [...lista].sort((a, b) => {
    if (ordem === 'materia') return obterNomeMateria(a).localeCompare(obterNomeMateria(b))
    return (a.dataEntrega || '').localeCompare(b.dataEntrega || '')
  })

  async function marcarTarefa(id) {
    try {
      const tarefaAtual = tarefas.find(t => t.id === id)
      if (!tarefaAtual) return

      const jaConcluida = tarefaAtual.concluida || tarefaAtual.status === 'CONCLUIDA'
      const novoStatus = !jaConcluida

      const resposta = await api.put(`/tarefas/${id}`, {
        titulo: tarefaAtual.titulo,
        descricao: tarefaAtual.descricao,
        dataEntrega: tarefaAtual.dataEntrega,
        materiaId: tarefaAtual.materia?.id ?? tarefaAtual.materiaId ?? null,
        prioridade: tarefaAtual.prioridade,
        status: novoStatus ? 'CONCLUIDA' : 'PENDENTE',
      })

      setTarefas(tarefas.map((tarefa) => (tarefa.id === id ? resposta.data : tarefa)))
    } catch (erro) {
      console.error('Erro ao atualizar tarefa:', erro)
    }
  }

  async function excluirTarefa(id) {
    try {
      await api.delete(`/tarefas/${id}`)
      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id))
    } catch (erro) {
      console.error('Erro ao excluir tarefa:', erro)
    }
  }

  return (
    <main className="painel" id="painel">
      <div className="painel-conteudo">
        <Cabecalho titulo="Painel" aoClicarNovaTarefa={() => setFormularioAberto(true)} />

        <section className="painel-resumo">
          <div className="painel-cartoes">
            <CartaoResumo nome="Total" valor={tarefas.length} />
            <CartaoResumo nome="Pendentes" valor={pendentes.length} cor="var(--cor-destaque)" />
            <CartaoResumo nome="Atrasadas" valor={atrasadas.length} cor="var(--cor-atrasada)" />
            <CartaoResumo nome="Concluídas" valor={concluidas.length} />
          </div>

          <BarraProgresso concluidas={concluidas.length} total={tarefas.length} />
        </section>

        <div className="painel-colunas">
          <section className="painel-tarefas" id="tarefas">
            <h2 className="painel-subtitulo">Minhas tarefas</h2>

            <FiltrosTarefas
              filtro={filtro}
              setFiltro={setFiltro}
              busca={busca}
              setBusca={setBusca}
              ordem={ordem}
              setOrdem={setOrdem}
              quantidades={{
                todas: tarefas.length,
                pendentes: pendentes.length,
                atrasadas: atrasadas.length,
                concluidas: concluidas.length,
              }}
            />

            <ListaTarefas
              tarefas={lista}
              hoje={hoje}
              aoMarcar={marcarTarefa}
              aoExcluir={excluirTarefa}
            />
          </section>

          <aside className="painel-lateral">
            <ProximasEntregas tarefas={tarefas} hoje={hoje} />
            <PendentesPorMateria tarefas={tarefas} />
          </aside>
        </div>
      </div>

      {formularioAberto && (
        <FormularioTarefa
          aoSalvarSucesso={carregarTarefas}
          aoFechar={() => setFormularioAberto(false)}
        />
      )}
    </main>
  )
}

export default Painel
