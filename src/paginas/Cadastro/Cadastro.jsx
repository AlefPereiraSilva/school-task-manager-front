import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../servicos/api.js'
import './Cadastro.css'

function Cadastro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [telefone, setTelefone] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState(false)
    const navigate = useNavigate()

    async function handleCadastro(e) {
        e.preventDefault()
        setErro('')
        setSucesso(false)

        try {
            await api.post('/auth/registro', { nome, email, senha, telefone, dataNascimento })
            setSucesso(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setErro(err.response?.data?.message || 'Falha ao realizar o cadastro. Tente outro e-mail.')
            console.error(err)
        }
    }

    return (
        <div className="cadastro-container">
            <form className="cadastro-box" onSubmit={handleCadastro}>
                <h2>Crie sua conta</h2>

                <div className="campo-grupo">
                    <label htmlFor="nome">Nome Completo</label>
                    <input id="nome" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="senha">Senha</label>
                    <input id="senha" type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="telefone">Telefone</label>
                    <input id="telefone" type="text" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="dataNascimento">Data de Nascimento</label>
                    <input id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                </div>

                {erro && <p className="cadastro-erro">{erro}</p>}
                {sucesso && <p className="cadastro-sucesso">Cadastro realizado com sucesso! Redirecionando...</p>}

                <button type="submit" className="botao-principal">Cadastrar</button>

                <p className="alternar-link">
                    Já tem uma conta? <span onClick={() => navigate('/login')}>Acesse aqui</span>
                </p>
            </form>
        </div>
    )
}

export default Cadastro
