// ItemTarefa.jsx: uma linha da lista com uma tarefa.

import { formatarData } from '../../utilitarios/datas.js'
import { IconeLixeira } from '../Icones/Icones.jsx'
import './ItemTarefa.css'

function ItemTarefa({ tarefa, hoje, aoMarcar, aoExcluir }) {
  const estaAtrasada = !tarefa.concluida && tarefa.dataEntrega < hoje // quando atrasar

  return (
    <li className="item-tarefa">
      <label className="item-tarefa-marcar">
        <input
          type="checkbox"
          checked={tarefa.concluida}
          onChange={() => aoMarcar(tarefa.id)}
        />
        <span className="item-tarefa-textos">
          <span className={tarefa.concluida ? 'item-tarefa-titulo item-tarefa-feita' : 'item-tarefa-titulo'}>
            {tarefa.titulo}
          </span>
          <span className="item-tarefa-materia">{tarefa.materia}</span>
        </span>
      </label>

      {estaAtrasada ? (
        <span className="item-tarefa-data item-tarefa-atrasada">
          Atrasada · {formatarData(tarefa.dataEntrega)}
        </span>
      ) : (
        <span className="item-tarefa-data">
          Entrega {formatarData(tarefa.dataEntrega)}
        </span>
      )}

      <button
        type="button"
        className="item-tarefa-excluir"
        aria-label="Excluir tarefa"
        onClick={() => aoExcluir(tarefa.id)}
      >
        <IconeLixeira />
      </button>
    </li>
  )
}

export default ItemTarefa
