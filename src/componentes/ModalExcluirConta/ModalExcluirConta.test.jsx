import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ModalExcluirConta from './ModalExcluirConta.jsx'
import api from '../../servicos/api.js'

vi.mock('../../servicos/api.js', () => ({
    default: {
        delete: vi.fn()
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

describe('Componente ModalExcluirConta', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('localStorage', {
            removeItem: vi.fn(),
            getItem: vi.fn(() => 'token-teste'),
            setItem: vi.fn()
        })
    })

    it('nao deve renderizar nada quando aberto for false', () => {
        const { container } = render(
            <MemoryRouter>
                <ModalExcluirConta aberto={false} aoFechar={() => {}} />
            </MemoryRouter>
        )

        expect(container.firstChild).toBeNull()
    })

    it('deve chamar aoFechar ao clicar em Cancelar', () => {
        const funcaoFechar = vi.fn()

        render(
            <MemoryRouter>
                <ModalExcluirConta aberto={true} aoFechar={funcaoFechar} />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
        expect(funcaoFechar).toHaveBeenCalledTimes(1)
    })

    it('deve excluir a conta, limpar localStorage e redirecionar para login ao confirmar', async () => {
        api.delete.mockResolvedValueOnce({})

        render(
            <MemoryRouter>
                <ModalExcluirConta aberto={true} aoFechar={() => {}} />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /sim, excluir minha conta/i }))

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/conta')
            expect(localStorage.removeItem).toHaveBeenCalledWith('token')
            expect(localStorage.removeItem).toHaveBeenCalledWith('nomeUsuario')
            expect(mockNavigate).toHaveBeenCalledWith('/login')
        })
    })
})
