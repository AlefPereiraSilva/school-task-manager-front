// as 3 próximas entregas

import { formatarData } from '../../utilitarios/datas.js'
import './ProximasEntregas.css'

function ProximasEntregas({ tarefas, hoje }) {
  const proximas = tarefas
    .filter((tarefa) => !tarefa.concluida && tarefa.dataEntrega >= hoje)
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))
    .slice(0, 3)

  return (
    <section className="cartao-lateral" id="entregas">
      <h2 className="cartao-lateral-titulo">Próximas entregas</h2>

      {proximas.length === 0 && <p className="cartao-lateral-vazio">Nada por enquanto.</p>}

      <ul className="proximas-lista">
        {proximas.map((tarefa) => (
          <li key={tarefa.id} className="proxima">
            <span className="proxima-data">{formatarData(tarefa.dataEntrega)}</span>
            <span className="proxima-textos">
              <span className="proxima-titulo">{tarefa.titulo}</span>
              <span className="proxima-materia">{tarefa.materia}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProximasEntregas
