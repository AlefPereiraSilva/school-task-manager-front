import { useEffect, useState } from 'react'
import BarraProgresso from '../../componentes/BarraProgresso/BarraProgresso.jsx' // página inicial do site.
import Cabecalho from '../../componentes/Cabecalho/Cabecalho.jsx'
import CartaoResumo from '../../componentes/CartaoResumo/CartaoResumo.jsx'
import FiltrosTarefas from '../../componentes/FiltrosTarefas/FiltrosTarefas.jsx'
import FormularioTarefa from '../../componentes/FormularioTarefa/FormularioTarefa.jsx'
import ListaTarefas from '../../componentes/ListaTarefas/ListaTarefas.jsx'
import PendentesPorMateria from '../../componentes/PendentesPorMateria/PendentesPorMateria.jsx'
import ProximasEntregas from '../../componentes/ProximasEntregas/ProximasEntregas.jsx'
import { carregarTarefas, salvarTarefas } from '../../servicos/armazenamento.js'
import { pegarHoje } from '../../utilitarios/datas.js'
import './Painel.css'

function Painel() {
  // Quando as tarefas mudam a tela atualiza sozinha.
  const [tarefas, setTarefas] = useState(carregarTarefas)
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('entrega')
  const [formularioAberto, setFormularioAberto] = useState(false)

  // Sempre que a lista mudar vai salvar no navegador
  useEffect(() => {
    salvarTarefas(tarefas)
  }, [tarefas])

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

  // Vai pegar lista do filtro escolhido
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

  // Aviso quando a lista estiver vazia
  const mensagemVazia = tarefas.length === 0
    ? 'Você ainda não tem tarefas. Clique em "Nova tarefa" para começar.'
    : 'Nenhuma tarefa encontrada.'

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

  // Coloca a tarefa nova na lista e fecha a janela
  function adicionarTarefa(dados) {
    const novaTarefa = {
      id: Date.now(), // número diferente para cada tarefa
      titulo: dados.titulo,
      materia: dados.materia,
      dataEntrega: dados.dataEntrega,
      concluida: false,
    }
    setTarefas([...tarefas, novaTarefa])
    setFormularioAberto(false)
  }

  // Tira a tarefa da lista
  function excluirTarefa(id) {
    const novasTarefas = tarefas.filter((tarefa) => tarefa.id !== id)
    setTarefas(novasTarefas)
  }

  return (
    <main className="painel" id="painel">
      <div className="painel-conteudo">
        <Cabecalho titulo="Painel" aoClicarNovaTarefa={() => setFormularioAberto(true)} />

        <section className="painel-resumo" aria-label="Resumo">
          <div className="painel-cartoes">
            <CartaoResumo nome="Total" valor={tarefas.length} />
            <CartaoResumo nome="Pendentes" valor={pendentes.length} cor="var(--cor-destaque)" />
            <CartaoResumo nome="Atrasadas" valor={atrasadas.length} cor="var(--cor-atrasada)" />
            <CartaoResumo nome="Concluídas" valor={concluidas.length} />
          </div>

          <BarraProgresso concluidas={concluidas.length} total={tarefas.length} />
        </section>

        {/* Lista na esquerda e cartões na direita */}
        <div className="painel-colunas">
          <section className="painel-tarefas" id="tarefas" aria-label="Lista de tarefas">
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
              mensagemVazia={mensagemVazia}
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
          aoSalvar={adicionarTarefa}
          aoFechar={() => setFormularioAberto(false)}
        />
      )}
    </main>
  )
}

export default Painel
