import { useEffect, useState } from 'react'
import BarraProgresso from '../../componentes/BarraProgresso/BarraProgresso.jsx' // página inicial do site.
import Cabecalho from '../../componentes/Cabecalho/Cabecalho.jsx'
import CartaoResumo from '../../componentes/CartaoResumo/CartaoResumo.jsx'
import FiltrosTarefas from '../../componentes/FiltrosTarefas/FiltrosTarefas.jsx'
import FormularioTarefa from '../../componentes/FormularioTarefa/FormularioTarefa.jsx'
import ListaTarefas from '../../componentes/ListaTarefas/ListaTarefas.jsx'
import PendentesPorMateria from '../../componentes/PendentesPorMateria/PendentesPorMateria.jsx'
import ProximasEntregas from '../../componentes/ProximasEntregas/ProximasEntregas.jsx'
import { pegarHoje } from '../../utilitarios/datas.js'
import './Painel.css'

function Painel() {
  // pega as tarefas salvas no navegador (se não tiver nada começa vazio)
  const [tarefas, setTarefas] = useState(() => JSON.parse(localStorage.getItem('tarefas-escolares')) || [])
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('entrega')
  const [formularioAberto, setFormularioAberto] = useState(false)

  // Sempre que a lista mudar vai salvar no navegador
  useEffect(() => {
    localStorage.setItem('tarefas-escolares', JSON.stringify(tarefas))
  }, [tarefas])

  const hoje = pegarHoje()
  const pendentes = tarefas.filter((tarefa) => !tarefa.concluida)
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida)
  const atrasadas = pendentes.filter((tarefa) => tarefa.dataEntrega < hoje)

  // Vai pegar lista do filtro escolhido
  let lista = tarefas
  if (filtro === 'pendentes') lista = pendentes
  if (filtro === 'atrasadas') lista = atrasadas
  if (filtro === 'concluidas') lista = concluidas

  // busca pelo título ou pela matéria
  lista = lista.filter((tarefa) =>
    (tarefa.titulo + ' ' + tarefa.materia).toLowerCase().includes(busca.toLowerCase())
  )

  // ordena por entrega ou por matéria
  lista = [...lista].sort((a, b) => {
    if (ordem === 'materia') return a.materia.localeCompare(b.materia)
    return a.dataEntrega.localeCompare(b.dataEntrega)
  })

  function marcarTarefa(id) {
    setTarefas(tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    ))
  }

  function adicionarTarefa(nova) {
    setTarefas([...tarefas, { ...nova, id: Date.now(), concluida: false }])
    setFormularioAberto(false)
  }

  function excluirTarefa(id) {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id))
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
          aoSalvar={adicionarTarefa}
          aoFechar={() => setFormularioAberto(false)}
        />
      )}
    </main>
  )
}

export default Painel
