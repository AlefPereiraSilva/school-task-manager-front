import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import api from '../../servicos/api.js'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    async function handleLoginTradicional(e) {
        e.preventDefault()
        setErro('')
        try {
            const resposta = await api.post('/auth/login', { email, senha })
            
            localStorage.setItem('token', resposta.data.token)
            localStorage.setItem('nomeUsuario', resposta.data.nomeUsuario)

            navigate('/painel')
        } catch (err) {
            alert("Falha no login tradicional: " + (err.response?.data?.message || err.message))
            setErro('Email ou senha inválidos.')
            console.error(err)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        setErro('')
        try {
            const resposta = await api.post('/auth/google', {
                idToken: credentialResponse.credential
            })
            
            localStorage.setItem('token', resposta.data.token)
            localStorage.setItem('nomeUsuario', resposta.data.nomeUsuario)

            navigate('/painel')
        } catch (err) {
            setErro('Erro ao autentificar com o Google no servidor.')
            console.error(err)
        }
    }

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleLoginTradicional}>
                <h2>Acesse sua conta</h2>

                <div className="campo-grupo">
                    <label htmlFor="email">E-mail</label>
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="senha">Senha</label>
                    <input 
                        id="senha" 
                        type="password" 
                        placeholder="Sua senha" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        required 
                    />
                    <p className="alternar-link" style={{ textAlign: 'right', marginTop: '0.2rem' }}>
                        <span onClick={() => navigate('/recuperar-senha')}>Esqueceu sua senha?</span>
                    </p>
                </div>

                {erro && <p className="login-erro">{erro}</p>}

                <button type="submit" className="botao-principal">Entrar</button>

                <p className="alternar-link">
                    Não tem uma conta? <span onClick={() => navigate('/cadastro')}>Cadastre-se aqui</span>
                </p>

                <div className="divisor"><span>ou</span></div>

                <div className="google-btn-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess} 
                        onError={() => setErro('Falha na resposta do Google.')} 
                        useOneTap 
                    />
                </div>
            </form>
        </div>
    )
}

export default Login
