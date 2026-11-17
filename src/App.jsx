import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MenuLateral from './componentes/MenuLateral/MenuLateral.jsx'
import Painel from './paginas/Painel/Painel.jsx'
import Calendario from './paginas/Calendario/Calendario.jsx'
import Avaliacoes from './paginas/Avaliacoes/Avaliacoes.jsx'
import Login from './paginas/Login/Login.jsx'
import Cadastro from './paginas/Cadastro/Cadastro.jsx'
import RecuperarSenha from './paginas/RecuperarSenha/RecuperarSenha.jsx'
import RotaProtegida from './componentes/RotaProtegida/RotaProtegida.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <div className="aplicativo">
                <MenuLateral />
                <Painel />
              </div>
            </RotaProtegida>
          } 
        />

        <Route 
          path="/calendario" 
          element={
            <RotaProtegida>
              <div className="aplicativo">
                <MenuLateral />
                <Calendario />
              </div>
            </RotaProtegida>
          } 
        />

        <Route 
          path="/avaliacoes" 
          element={
            <RotaProtegida>
              <div className="aplicativo">
                <MenuLateral />
                <Avaliacoes />
              </div>
            </RotaProtegida>
          } 
        />

        {/* Redirecionamento Padrão: qualquer rota desconhecida joga para o painel */}
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
