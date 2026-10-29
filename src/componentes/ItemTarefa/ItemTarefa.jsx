// uma tarefa da lista

import { formatarData } from '../../utilitarios/datas.js'
import { IconeLixeira } from '../Icones/Icones.jsx'
import './ItemTarefa.css'

function ItemTarefa({ tarefa, hoje, aoMarcar, aoExcluir }) {
  const atrasada = !tarefa.concluida && tarefa.dataEntrega < hoje

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

      <span className={atrasada ? 'item-tarefa-data item-tarefa-atrasada' : 'item-tarefa-data'}>
        {atrasada ? 'Atrasada' : 'Entrega'} {formatarData(tarefa.dataEntrega)}
      </span>

      <button className="item-tarefa-excluir" aria-label="Excluir" onClick={() => aoExcluir(tarefa.id)}>
        <IconeLixeira />
      </button>
    </li>
  )
}

export default ItemTarefa
