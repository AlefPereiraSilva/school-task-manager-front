// Botões de filtro, campo de busca e ordenação da lista.

import './FiltrosTarefas.css'

function FiltrosTarefas({ filtros, filtroAtual, aoTrocarFiltro, busca, aoBuscar, ordem, aoOrdenar }) {
  return (
    <div className="filtros-tarefas">
      <div className="filtros-botoes">
        {filtros.map((filtro) => (
          <button
            key={filtro.id}
            type="button"
            aria-pressed={filtro.id === filtroAtual}
            className={filtro.id === filtroAtual ? 'filtro filtro-ativo' : 'filtro'}
            onClick={() => aoTrocarFiltro(filtro.id)}
          >
            {filtro.nome} ({filtro.quantidade})
          </button>
        ))}
      </div>

      <div className="filtros-campos">
        <input
          type="search"
          className="filtros-busca"
          aria-label="Buscar tarefa"
          placeholder="Buscar tarefa"
          value={busca}
          onChange={(evento) => aoBuscar(evento.target.value)}
        />

        <select
          className="filtros-ordem"
          aria-label="Ordenar por"
          value={ordem}
          onChange={(evento) => aoOrdenar(evento.target.value)}
        >
          <option value="entrega">Ordenar por entrega</option>
          <option value="materia">Ordenar por matéria</option>
        </select>
      </div>
    </div>
  )
}

export default FiltrosTarefas
