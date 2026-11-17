import { formatarData } from '../../utilitarios/datas.js'
import './ProximasEntregas.css'

function ProximasEntregas({ tarefas, hoje }) {
  const proximas = tarefas
    .filter((tarefa) => {
      const concluida = Boolean(tarefa.concluida || tarefa.status === 'CONCLUIDA')
      const dataLimpa = (tarefa.dataEntrega || '').slice(0, 10)
      return !concluida && dataLimpa >= hoje
    })
    .sort((a, b) => (a.dataEntrega || '').localeCompare(b.dataEntrega || ''))
    .slice(0, 3)

  return (
    <section className="cartao-lateral" id="entregas">
      <h2 className="cartao-lateral-titulo">Próximas entregas</h2>

      {proximas.length === 0 && <p className="cartao-lateral-vazio">Nada por enquanto.</p>}

      <ul className="proximas-lista">
        {proximas.map((tarefa) => {
          const dataLimpa = (tarefa.dataEntrega || '').slice(0, 10)
          const nomeMateria = typeof tarefa.materia === 'object'
            ? (tarefa.materia?.nome || 'Sem matéria')
            : (tarefa.materia || 'Sem matéria')

          return (
            <li key={tarefa.id} className="proxima">
              <span className="proxima-data">{formatarData(dataLimpa)}</span>
              <span className="proxima-textos">
                <span className="proxima-titulo">{tarefa.titulo}</span>
                <span className="proxima-materia">{nomeMateria}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ProximasEntregas
