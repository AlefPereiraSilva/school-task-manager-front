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

// cada item leva para uma parte do painel
const itensDoMenu = [
  { id: 'painel', nome: 'Painel', icone: <IconePainel /> },
  { id: 'tarefas', nome: 'Tarefas', icone: <IconeTarefas /> },
  { id: 'entregas', nome: 'Entregas', icone: <IconeCalendario /> },
  { id: 'materias', nome: 'Matérias', icone: <IconeMaterias /> },
]

function MenuLateral() {
  const [ativo, setAtivo] = useState('painel')

  return (
    <nav className="menu-lateral">
      <div className="menu-logo">
        <span className="menu-logo-icone">
          <IconeConcluido />
        </span>
        <span className="menu-logo-nome">Tarefas</span>
      </div>

      <div className="menu-itens">
        {itensDoMenu.map((item) => (
          <a
            key={item.id}
            href={'#' + item.id}
            className={ativo === item.id ? 'menu-item menu-item-ativo' : 'menu-item'}
            onClick={() => setAtivo(item.id)}
          >
            {item.icone}
            {item.nome}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default MenuLateral
