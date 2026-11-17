import { formatarData } from '../../utilitarios/datas.js'
import { IconeLixeira } from '../Icones/Icones.jsx'
import './ItemTarefa.css'

function ItemTarefa({ tarefa, hoje, aoMarcar, aoExcluir }) {
  const concluida = Boolean(tarefa.concluida || tarefa.status === 'CONCLUIDA')
  const dataLimpa = (tarefa.dataEntrega || '').slice(0, 10)
  const atrasada = !concluida && dataLimpa < hoje
  const nomeMateria = typeof tarefa.materia === 'object'
    ? (tarefa.materia?.nome || 'Sem matéria')
    : (tarefa.materia || 'Sem matéria')

  return (
    <li className="item-tarefa">
      <label className="item-tarefa-marcar">
        <input
          type="checkbox"
          checked={concluida}
          onChange={() => aoMarcar(tarefa.id)}
        />
        <span className="item-tarefa-textos">
          <span className={concluida ? 'item-tarefa-titulo item-tarefa-feita' : 'item-tarefa-titulo'}>
            {tarefa.titulo}
          </span>
          <span className="item-tarefa-materia">{nomeMateria}</span>
        </span>
      </label>

      <span className={atrasada ? 'item-tarefa-data item-tarefa-atrasada' : 'item-tarefa-data'}>
        {atrasada ? 'Atrasada' : 'Entrega'} {formatarData(dataLimpa)}
      </span>

      <button className="item-tarefa-excluir" aria-label="Excluir" onClick={() => aoExcluir(tarefa.id)}>
        <IconeLixeira />
      </button>
    </li>
  )
}

export default ItemTarefa
