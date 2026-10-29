// Janela com o formulário para criar uma tarefa nova.

import { useState } from 'react'
import materias from '../../dados/materias.js'
import './FormularioTarefa.css'

function FormularioTarefa({ aoSalvar, aoFechar }) {
  const [titulo, setTitulo] = useState('')
  const [materia, setMateria] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [erro, setErro] = useState('')

  function salvar(evento) {
    // Não deixa a página recarregar ao enviar o formulário
    evento.preventDefault()

    if (titulo.trim() === '' || materia === '' || dataEntrega === '') {
      setErro('Preencha todos os campos.')
      return
    }

    aoSalvar({ titulo: titulo.trim(), materia: materia, dataEntrega: dataEntrega })
  }

  // Fecha a janela com a tecla Esc
  function verificarTecla(evento) {
    if (evento.key === 'Escape') {
      aoFechar()
    }
  }

  return (
    <div className="janela-fundo" onKeyDown={verificarTecla}>
      <form
        className="janela"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-janela"
        onSubmit={salvar}
      >
        <h2 id="titulo-janela" className="janela-titulo">Nova tarefa</h2>

        <div className="campo">
          <label htmlFor="campo-titulo">Título</label>
          <input
            id="campo-titulo"
            type="text"
            placeholder="Ex.: Lista de exercícios"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            autoFocus
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-materia">Matéria</label>
          <select id="campo-materia" value={materia} onChange={(evento) => setMateria(evento.target.value)}>
            <option value="">Selecione</option>
            {materias.map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="campo-data">Data de entrega</label>
          <input
            id="campo-data"
            type="date"
            value={dataEntrega}
            onChange={(evento) => setDataEntrega(evento.target.value)}
          />
        </div>

        {erro !== '' && <p className="janela-erro" role="alert">{erro}</p>}

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
