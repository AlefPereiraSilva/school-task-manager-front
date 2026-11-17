import './PendentesPorMateria.css'

function PendentesPorMateria({ tarefas }) {
  const contagem = {}
  tarefas.forEach((tarefa) => {
    const concluida = Boolean(tarefa.concluida || tarefa.status === 'CONCLUIDA')
    if (!concluida) {
      const nomeMateria = typeof tarefa.materia === 'object'
        ? (tarefa.materia?.nome || 'Sem matéria')
        : (tarefa.materia || 'Sem matéria')
      contagem[nomeMateria] = (contagem[nomeMateria] || 0) + 1
    }
  })

  const materias = Object.keys(contagem)
  const maior = materias.length > 0 ? Math.max(...Object.values(contagem)) : 1

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
