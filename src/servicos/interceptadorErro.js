import api from './api.js'

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response && (erro.response.status === 401 || erro.response.status === 403)) {
      const rotaAtual = window.location.pathname
      if (rotaAtual !== '/login' && rotaAtual !== '/cadastro') {
        localStorage.removeItem('token')
        localStorage.removeItem('nomeUsuario')
        window.location.href = '/login'
      }
    }
    return Promise.reject(erro)
  }
)
