import { IconeMais } from '../Icones/Icones.jsx' // Mostra o título a data de hoje e o botão de nova tarefa.
import './Cabecalho.css'

function pegarDataDeHoje() {
  const texto = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function Cabecalho({ titulo, aoClicarNovaTarefa }) {
  const dataDeHoje = pegarDataDeHoje()

  return (
    <header className="cabecalho">
      <div>
        <h1 className="cabecalho-titulo">{titulo}</h1>
        <p className="cabecalho-data">{dataDeHoje}</p>
      </div>

      {/* Abre a janela de nova tarefa */}
      <button type="button" className="botao-principal" onClick={aoClicarNovaTarefa}>
        <IconeMais />
        Nova tarefa
      </button>
    </header>
  )
}

export default Cabecalho
