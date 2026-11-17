import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../servicos/api.js'
import './RecuperarSenha.css'

function RecuperarSenha() {
    const [etapa, setEtapa] = useState(1)
    const [email, setEmail] = useState('')
    const [tokenRecuperacao, setTokenRecuperacao] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)
    const navigate = useNavigate()

    async function handleSolicitarToken(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')
        setCarregando(true)

        try {
            const resposta = await api.post('/auth/esqueceu-senha', { email })
            if (resposta.data.tokenRecuperacao) {
                setTokenRecuperacao(resposta.data.tokenRecuperacao)
            }
            setSucesso('Código de verificação gerado! Agora defina sua nova senha.')
            setEtapa(2)
        } catch (err) {
            setErro(err.response?.data?.message || 'E-mail não encontrado no sistema.')
        } finally {
            setCarregando(false)
        }
    }

    async function handleRedefinirSenha(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')

        if (novaSenha.length < 6) {
            setErro('A nova senha deve ter no mínimo 6 caracteres.')
            return
        }

        if (novaSenha !== confirmarSenha) {
            setErro('As senhas não coincidem.')
            return
        }

        setCarregando(true)

        try {
            await api.post('/auth/redefinir-senha', {
                email,
                tokenRecuperacao,
                novaSenha
            })
            setSucesso('Senha redefinida com sucesso! Redirecionando para o login...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setErro(err.response?.data?.message || 'Token expirado ou inválido. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="recuperar-container">
            <div className="recuperar-box">
                <h2>Recuperar senha</h2>
                <p className="recuperar-subtitulo">
                    {etapa === 1
                        ? 'Informe o e-mail cadastrado para gerar seu código de recuperação.'
                        : 'Digite sua nova senha abaixo para concluir a alteração.'}
                </p>

                {etapa === 1 ? (
                    <form onSubmit={handleSolicitarToken} className="recuperar-form">
                        <div className="campo-grupo">
                            <label htmlFor="email-recuperacao">E-mail cadastrado</label>
                            <input
                                id="email-recuperacao"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {erro && <p className="recuperar-erro">{erro}</p>}

                        <button type="submit" className="botao-principal" disabled={carregando}>
                            {carregando ? 'Verificando...' : 'Continuar'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRedefinirSenha} className="recuperar-form">
                        <div className="campo-grupo">
                            <label htmlFor="nova-senha">Nova senha (mín. 6 caracteres)</label>
                            <input
                                id="nova-senha"
                                type="password"
                                placeholder="Digite a nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                            />
                        </div>

                        <div className="campo-grupo">
                            <label htmlFor="confirmar-nova-senha">Confirmar nova senha</label>
                            <input
                                id="confirmar-nova-senha"
                                type="password"
                                placeholder="Repita a nova senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                            />
                        </div>

                        {erro && <p className="recuperar-erro">{erro}</p>}
                        {sucesso && <p className="recuperar-sucesso">{sucesso}</p>}

                        <button type="submit" className="botao-principal" disabled={carregando}>
                            {carregando ? 'Salvando...' : 'Redefinir Senha'}
                        </button>
                    </form>
                )}

                <p className="alternar-link">
                    Lembrou sua senha? <span onClick={() => navigate('/login')}>Voltar para o login</span>
                </p>
            </div>
        </div>
    )
}

export default RecuperarSenha
