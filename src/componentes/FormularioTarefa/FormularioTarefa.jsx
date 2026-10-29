// janela para criar uma tarefa nova

import { useState } from 'react'
import materias from '../../dados/materias.js'
import './FormularioTarefa.css'

function FormularioTarefa({ aoSalvar, aoFechar }) {
  const [titulo, setTitulo] = useState('')
  const [materia, setMateria] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [erro, setErro] = useState('')

  function salvar(e) {
    e.preventDefault() // não deixa a página recarregar

    if (!titulo || !materia || !dataEntrega) {
      setErro('Preencha todos os campos.')
      return
    }

    aoSalvar({ titulo, materia, dataEntrega })
  }

  return (
    <div className="janela-fundo">
      <form className="janela" onSubmit={salvar}>
        <h2 className="janela-titulo">Nova tarefa</h2>

        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          placeholder="Ex.: Lista de exercícios"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          autoFocus
        />

        <label htmlFor="materia">Matéria</label>
        <select id="materia" value={materia} onChange={(e) => setMateria(e.target.value)}>
          <option value="">Selecione</option>
          {materias.map((nome) => (
            <option key={nome}>{nome}</option>
          ))}
        </select>

        <label htmlFor="data">Data de entrega</label>
        <input
          id="data"
          type="date"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
        />

        {erro && <p className="janela-erro">{erro}</p>}

        <div className="janela-botoes">
          <button type="button" className="botao-secundario" onClick={aoFechar}>
            Cancelar
          </button>
          <button type="submit" className="botao-principal">
            Salvar tarefa
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioTarefa
