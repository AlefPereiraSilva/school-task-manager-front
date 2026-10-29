// todas as tarefas.

import ItemTarefa from '../ItemTarefa/ItemTarefa.jsx'
import './ListaTarefas.css'

function ListaTarefas({ tarefas, hoje, aoMarcar, aoExcluir }) {
  // Se não tiver nenhuma tarefa mostra um aviso
  if (tarefas.length === 0) {
    return <p className="lista-tarefas-vazia">Nenhuma tarefa encontrada.</p>
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
