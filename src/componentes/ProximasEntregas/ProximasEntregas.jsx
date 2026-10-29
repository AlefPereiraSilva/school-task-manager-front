// As próximas tarefas que ainda não venceram.

import { formatarData } from '../../utilitarios/datas.js'
import './ProximasEntregas.css'

function ProximasEntregas({ tarefas, hoje }) {
  // Só as pendentes que vencem hoje ou depois, das mais perto para as mais longe
  const proximas = tarefas
    .filter((tarefa) => !tarefa.concluida && tarefa.dataEntrega >= hoje)
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega))
    .slice(0, 3)

  return (
    <section className="cartao-lateral" aria-label="Próximas entregas">
      <h2 className="cartao-lateral-titulo">Próximas entregas</h2>

      {proximas.length === 0 ? (
        <p className="cartao-lateral-vazio">Nada para entregar nos próximos dias.</p>
      ) : (
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
      )}
    </section>
  )
}

export default ProximasEntregas
