import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../servicos/api.js'
import './ModalExcluirConta.css'

function ModalExcluirConta({ aberto, aoFechar }) {
    const [excluindo, setExcluindo] = useState(false)
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    if (!aberto) return null

    async function handleConfirmarExclusao() {
        setErro('')
        setExcluindo(true)

        try {
            await api.delete('/conta')
            localStorage.removeItem('token')
            localStorage.removeItem('nomeUsuario')
            navigate('/login')
        } catch (err) {
            setErro(err.response?.data?.message || 'Não foi possível excluir a conta agora.')
            setExcluindo(false)
        }
    }

    return (
        <div className="modal-excluir-fundo" onClick={aoFechar}>
            <div className="modal-excluir-caixa" onClick={(e) => e.stopPropagation()}>
                <h3>Excluir conta permanentemente?</h3>
                <p>
                    Tem certeza que deseja apagar sua conta? Todas as suas <strong>tarefas</strong> e{' '}
                    <strong>matérias</strong> cadastradas serão removidas e essa ação não poderá ser desfeita.
                </p>

                {erro && <p className="modal-excluir-erro">{erro}</p>}

                <div className="modal-excluir-acoes">
                    <button
                        type="button"
                        className="btn-cancelar-exclusao"
                        onClick={aoFechar}
                        disabled={excluindo}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn-confirmar-exclusao"
                        onClick={handleConfirmarExclusao}
                        disabled={excluindo}
                    >
                        {excluindo ? 'Excluindo...' : 'Sim, excluir minha conta'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalExcluirConta
