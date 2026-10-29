// todas as tarefas.

import ItemTarefa from '../ItemTarefa/ItemTarefa.jsx'
import './ListaTarefas.css'

function ListaTarefas({ tarefas, hoje, aoMarcar, aoExcluir }) {
  if (tarefas.length === 0) {
    return <p className="lista-tarefas-vazia">Nenhuma tarefa por aqui.</p>
  }

  return (
    <ul className="lista-tarefas">
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
  )
}

export default ListaTarefas
