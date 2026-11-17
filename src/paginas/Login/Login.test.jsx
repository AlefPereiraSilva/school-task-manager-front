import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login.jsx'
import api from '../../servicos/api.js'

vi.mock('../../servicos/api.js', () => ({
    default: {
        post: vi.fn()
    }
}))

vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }) => (
        <button
            data-testid="mock-google-login"
            onClick={() => onSuccess({ credential: 'mock-google-token' })}
        >
            Google Sign In
        </button>
    )
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const atual = await vi.importActual('react-router-dom')
    return {
        ...atual,
        useNavigate: () => mockNavigate
    }
})

describe('Componente Login com Rotas Protegidas', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        
        vi.stubGlobal('localStorage', {
            setItem: vi.fn(),
            getItem: vi.fn(() => null),
        })
    })

    it('deve renderizar os campos do formulario e o botao do Google corretamente', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
        expect(screen.getByTestId('mock-google-login')).toBeInTheDocument()
    })

    it('deve realizar login tradicional com sucesso, salvar token e navegar para o painel', async () => {
        api.post.mockResolvedValueOnce({ data: { token: 'meu-token-jwt-valido', nomeUsuario: 'Carlos' } })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'teste@email.com' } })
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } })
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'teste@email.com',
                senha: '123456'
            })
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'meu-token-jwt-valido')
            expect(localStorage.setItem).toHaveBeenCalledWith('nomeUsuario', 'Carlos')
            expect(mockNavigate).toHaveBeenCalledWith('/painel')
        })
    })

    it('deve realizar login via Google OAuth com sucesso e navegar para o painel', async () => {
        api.post.mockResolvedValueOnce({ data: { token: 'token-jwt-do-google', nomeUsuario: 'Carlos Google' } })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByTestId('mock-google-login'))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/google', {
                idToken: 'mock-google-token'
            })
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token-jwt-do-google')
            expect(localStorage.setItem).toHaveBeenCalledWith('nomeUsuario', 'Carlos Google')
            expect(mockNavigate).toHaveBeenCalledWith('/painel')
        })
    })

    it('deve navegar para a tela de cadastro ao clicar no link de registro', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByText(/cadastre-se aqui/i))
        expect(mockNavigate).toHaveBeenCalledWith('/cadastro')
    })
})
