// todas as tarefas.

import ItemTarefa from '../ItemTarefa/ItemTarefa.jsx'
import './ListaTarefas.css'

function ListaTarefas({ tarefas, hoje, aoMarcar, aoExcluir }) {
  return (
    <section className="lista-tarefas" aria-label="Lista de tarefas">
      <h2 className="lista-tarefas-titulo">Minhas tarefas</h2>

      {/* Se não tiver nenhuma tarefa mostra um aviso */}
      {tarefas.length === 0 ? (
        <p className="lista-tarefas-vazia">Nenhuma tarefa por aqui.</p>
      ) : (
        <ul className="lista-tarefas-itens">
          {tarefas.map((tarefa) => (
            <ItemTarefa
              key={tarefa.id}
              tarefa={tarefa}
              hoje={hoje}
              aoMarcar={aoMarcar}
              aoExcluir={aoExcluir}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaTarefas
