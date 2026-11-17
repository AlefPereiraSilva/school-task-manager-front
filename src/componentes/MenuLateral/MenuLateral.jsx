import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ModalExcluirConta from '../ModalExcluirConta/ModalExcluirConta.jsx'
import './MenuLateral.css'

function MenuLateral() {
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Estudante'

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('nomeUsuario')
        navigate('/login')
    }

    return (
        <aside className="menu-lateral">
            <div className="perfil-usuario">
                <div className="avatar">
                    {nomeUsuario.charAt(0).toUpperCase()}
                </div>
                <div className="info">
                    <h3>{nomeUsuario}</h3>
                    <span>Aluno</span>
                </div>
            </div>

            <nav className="menu-links">
                <button
                    type="button"
                    className={`link-item ${location.pathname === '/painel' ? 'active' : ''}`}
                    onClick={() => navigate('/painel')}
                >
                    📋 Minhas Tarefas
                </button>

                <button
                    type="button"
                    className={`link-item ${location.pathname === '/calendario' ? 'active' : ''}`}
                    onClick={() => navigate('/calendario')}
                >
                    📅 Calendário
                </button>

                <button
                    type="button"
                    className={`link-item ${location.pathname === '/avaliacoes' ? 'active' : ''}`}
                    onClick={() => navigate('/avaliacoes')}
                >
                    📝 Avaliações e Notas
                </button>
            </nav>

            <div className="menu-rodape">
                <button
                    type="button"
                    className="botao-excluir-conta"
                    onClick={() => setModalExcluirAberto(true)}
                >
                    🗑️ Excluir Conta
                </button>

                <button type="button" className="botao-sair" onClick={handleLogout}>
                    🚪 Sair da Conta
                </button>
            </div>

            <ModalExcluirConta
                aberto={modalExcluirAberto}
                aoFechar={() => setModalExcluirAberto(false)}
            />
        </aside>
    )
}

export default MenuLateral
