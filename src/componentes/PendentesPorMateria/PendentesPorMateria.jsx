// Quantas tarefas pendentes tem em cada matéria.

import './PendentesPorMateria.css'

function PendentesPorMateria({ tarefas }) {
  const pendentes = tarefas.filter((tarefa) => !tarefa.concluida)

  // Conta as pendentes de cada matéria. Exemplo: { Física: 2, História: 1 }
  const contagem = {}
  pendentes.forEach((tarefa) => {
    contagem[tarefa.materia] = (contagem[tarefa.materia] || 0) + 1
  })

  // Transforma em lista, da matéria com mais pendentes para a com menos
  const materias = Object.keys(contagem)
    .map((nome) => ({ nome: nome, quantidade: contagem[nome] }))
    .sort((a, b) => b.quantidade - a.quantidade)

  // A matéria com mais pendentes fica com a barra cheia
  const maior = materias.length > 0 ? materias[0].quantidade : 0

  return (
    <section className="cartao-lateral" id="materias" aria-label="Pendentes por matéria">
      <h2 className="cartao-lateral-titulo">Pendentes por matéria</h2>

      {materias.length === 0 ? (
        <p className="cartao-lateral-vazio">Nenhuma tarefa pendente.</p>
      ) : (
        <ul className="materias-lista">
          {materias.map((materia) => (
            <li key={materia.nome} className="materia">
              <div className="materia-topo">
                <span>{materia.nome}</span>
                <span className="materia-quantidade">{materia.quantidade}</span>
              </div>
              <div className="materia-barra">
                <div
                  className="materia-barra-preenchida"
                  style={{ width: (materia.quantidade / maior) * 100 + '%' }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PendentesPorMateria
