// filtros, busca e ordem da lista

import './FiltrosTarefas.css'

const botoes = [
  { id: 'todas', nome: 'Todas' },
  { id: 'pendentes', nome: 'Pendentes' },
  { id: 'atrasadas', nome: 'Atrasadas' },
  { id: 'concluidas', nome: 'Concluídas' },
]

function FiltrosTarefas({ filtro, setFiltro, busca, setBusca, ordem, setOrdem, quantidades }) {
  return (
    <div className="filtros-tarefas">
      <div className="filtros-botoes">
        {botoes.map((botao) => (
          <button
            key={botao.id}
            className={filtro === botao.id ? 'filtro filtro-ativo' : 'filtro'}
            onClick={() => setFiltro(botao.id)}
          >
            {botao.nome} ({quantidades[botao.id]})
          </button>
        ))}
      </div>

      <div className="filtros-campos">
        <input
          className="filtros-busca"
          placeholder="Buscar tarefa"
          aria-label="Buscar tarefa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          className="filtros-ordem"
          aria-label="Ordenar"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
        >
          <option value="entrega">Ordenar por entrega</option>
          <option value="materia">Ordenar por matéria</option>
        </select>
      </div>
    </div>
  )
}

export default FiltrosTarefas
