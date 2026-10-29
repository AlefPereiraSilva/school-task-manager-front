// MenuLateral.jsx: o menu que fica na esquerda do site.

import { useState } from 'react'
import {
  IconeCalendario,
  IconeConcluido,
  IconeMaterias,
  IconePainel,
  IconeTarefas,
} from '../Icones/Icones.jsx'
import './MenuLateral.css'

// Lista com os itens do menu.
// Cada item leva para uma parte do painel (o "id" da seção).
const itensDoMenu = [
  { id: 'painel', nome: 'Painel', icone: <IconePainel /> },
  { id: 'tarefas', nome: 'Tarefas', icone: <IconeTarefas /> },
  { id: 'entregas', nome: 'Entregas', icone: <IconeCalendario /> },
  { id: 'materias', nome: 'Matérias', icone: <IconeMaterias /> },
]

function MenuLateral() {
  // Guarda qual item foi clicado por último, para deixar ele destacado
  const [itemAtivo, setItemAtivo] = useState('painel')

  return (
    <nav className="menu-lateral" aria-label="Menu principal">
      <div className="menu-logo">
        <span className="menu-logo-icone">
          <IconeConcluido />
        </span>
        <span className="menu-logo-nome">Tarefas</span>
      </div>

      <div className="menu-itens">
        {itensDoMenu.map((item) => {
          const estaAtivo = item.id === itemAtivo

          return (
            <a
              key={item.id}
              href={'#' + item.id}
              aria-current={estaAtivo ? 'true' : undefined}
              className={estaAtivo ? 'menu-item menu-item-ativo' : 'menu-item'}
              onClick={() => setItemAtivo(item.id)}
            >
              {item.icone}
              {item.nome}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default MenuLateral
