import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Cadastro from './Cadastro.jsx'
import api from '../../servicos/api.js'

vi.mock('../../servicos/api.js', () => ({
    default: {
        post: vi.fn()
    }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const atual = await vi.importActual('react-router-dom')
    return {
        ...atual,
        useNavigate: () => mockNavigate
    }
})

describe('Componente Cadastro', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('localStorage', {
            setItem: vi.fn(),
            getItem: vi.fn(() => null)
        })
    })

    it('deve renderizar todos os campos do formulario de cadastro', () => {
        render(
            <MemoryRouter>
                <Cadastro />
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument()
    })

    it('deve cadastrar usuario com sucesso e redirecionar', async () => {
        api.post.mockResolvedValueOnce({
            data: { token: 'token-novo', nomeUsuario: 'Ana Silva' }
        })

        render(
            <MemoryRouter>
                <Cadastro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/Nome Completo/i), { target: { value: 'Ana Silva' } })
        fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'ana@teste.com' } })
        fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: '123456' } })
        fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } })
        fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2005-05-10' } })

        fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/registro', expect.objectContaining({
                nome: 'Ana Silva',
                email: 'ana@teste.com',
                senha: '123456'
            }))
        })
    })
})
