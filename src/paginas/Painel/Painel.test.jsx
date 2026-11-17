import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Painel from './Painel.jsx'
import api from '../../servicos/api.js'

vi.mock('../../servicos/api.js', () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}))

describe('Pagina Painel (Dashboard)', () => {
    const listaTarefas = [
        {
            id: 1,
            titulo: 'Trabalho de Biologia',
            descricao: 'Resumo celular',
            materia: { id: 10, nome: 'Biologia' },
            dataEntrega: '2026-12-10T23:59:00',
            prioridade: 'ALTA',
            status: 'PENDENTE',
            concluida: false
        },
        {
            id: 2,
            titulo: 'Lista de Álgebra',
            descricao: 'Equações',
            materia: { id: 20, nome: 'Matemática' },
            dataEntrega: '2026-12-12T23:59:00',
            prioridade: 'MEDIA',
            status: 'CONCLUIDA',
            concluida: true
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        api.get.mockResolvedValue({ data: listaTarefas })
    })

    it('deve carregar e exibir as tarefas e os cartoes de resumo', async () => {
        render(<Painel />)

        const ocorrencias = await screen.findAllByText('Trabalho de Biologia')
        expect(ocorrencias.length).toBeGreaterThan(0)
        expect(screen.getByText('Lista de Álgebra')).toBeInTheDocument()
    })

    it('deve alternar conclusao de uma tarefa ao clicar no checkbox', async () => {
        api.put.mockResolvedValueOnce({
            data: { ...listaTarefas[0], concluida: true, status: 'CONCLUIDA' }
        })

        render(<Painel />)
        await screen.findAllByText('Trabalho de Biologia')

        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('/tarefas/1', expect.any(Object))
        })
    })

    it('deve excluir uma tarefa ao clicar no botao de excluir', async () => {
        api.delete.mockResolvedValueOnce({})

        render(<Painel />)
        await screen.findAllByText('Trabalho de Biologia')

        const botoesExcluir = screen.getAllByRole('button', { name: /Excluir/i })
        fireEvent.click(botoesExcluir[0])

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/tarefas/1')
        })
    })
})
