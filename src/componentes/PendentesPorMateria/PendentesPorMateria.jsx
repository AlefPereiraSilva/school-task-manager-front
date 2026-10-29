// quantas pendentes tem em cada matéria

import './PendentesPorMateria.css'

function PendentesPorMateria({ tarefas }) {
  // ex: { Física: 2, História: 1 }
  const contagem = {}
  tarefas.forEach((tarefa) => {
    if (!tarefa.concluida) {
      contagem[tarefa.materia] = (contagem[tarefa.materia] || 0) + 1
    }
  })

  const materias = Object.keys(contagem)
  const maior = Math.max(...Object.values(contagem))

  return (
    <section className="cartao-lateral" id="materias">
      <h2 className="cartao-lateral-titulo">Pendentes por matéria</h2>

      {materias.length === 0 && <p className="cartao-lateral-vazio">Nenhuma pendente.</p>}

      <ul className="materias-lista">
        {materias.map((materia) => (
          <li key={materia} className="materia">
            <div className="materia-topo">
              <span>{materia}</span>
              <strong>{contagem[materia]}</strong>
            </div>
            <div className="materia-barra">
              <div
                className="materia-barra-preenchida"
                style={{ width: (contagem[materia] / maior) * 100 + '%' }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PendentesPorMateria
