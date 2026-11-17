import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import RecuperarSenha from './RecuperarSenha.jsx'
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

describe('Componente RecuperarSenha', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve solicitar o token na etapa 1 e avancar para redefinicao de senha', async () => {
        api.post.mockResolvedValueOnce({
            data: { tokenRecuperacao: 'token-jwt-15min', message: 'Token gerado' }
        })

        render(
            <MemoryRouter>
                <RecuperarSenha />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/e-mail cadastrado/i), {
            target: { value: 'aluno@teste.com' }
        })
        fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/esqueceu-senha', {
                email: 'aluno@teste.com'
            })
            expect(screen.getByLabelText(/nova senha \(mín\. 6 caracteres\)/i)).toBeInTheDocument()
        })
    })

    it('deve validar se as senhas coincidem antes de enviar', async () => {
        api.post.mockResolvedValueOnce({
            data: { tokenRecuperacao: 'token-jwt-15min' }
        })

        render(
            <MemoryRouter>
                <RecuperarSenha />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/e-mail cadastrado/i), {
            target: { value: 'aluno@teste.com' }
        })
        fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

        await screen.findByLabelText(/nova senha \(mín\. 6 caracteres\)/i)

        fireEvent.change(screen.getByLabelText(/nova senha \(mín\. 6 caracteres\)/i), {
            target: { value: '123456' }
        })
        fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), {
            target: { value: '654321' }
        })
        fireEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

        expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument()
        expect(api.post).toHaveBeenCalledTimes(1)
    })

    it('deve redefinir a senha com sucesso na etapa 2', async () => {
        api.post
            .mockResolvedValueOnce({ data: { tokenRecuperacao: 'token-jwt-15min' } })
            .mockResolvedValueOnce({ data: { message: 'Senha atualizada com sucesso!' } })

        render(
            <MemoryRouter>
                <RecuperarSenha />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/e-mail cadastrado/i), {
            target: { value: 'aluno@teste.com' }
        })
        fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

        await screen.findByLabelText(/nova senha \(mín\. 6 caracteres\)/i)

        fireEvent.change(screen.getByLabelText(/nova senha \(mín\. 6 caracteres\)/i), {
            target: { value: 'novaSenha123' }
        })
        fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), {
            target: { value: 'novaSenha123' }
        })
        fireEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/redefinir-senha', {
                email: 'aluno@teste.com',
                tokenRecuperacao: 'token-jwt-15min',
                novaSenha: 'novaSenha123'
            })
            expect(screen.getByText(/senha redefinida com sucesso/i)).toBeInTheDocument()
        })
    })
})
