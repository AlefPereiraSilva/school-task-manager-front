import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioTarefa from './FormularioTarefa.jsx'
import api from '../../servicos/api.js'

vi.mock('../../servicos/api.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    }
}))

describe('Componente FormularioTarefa', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'alert').mockImplementation(() => {})
        api.get.mockResolvedValue({
            data: [
                { id: 1, nome: 'Programacao' },
                { id: 2, nome: 'Matemática' }
            ]
        })
    })

    it('deve renderizar os campos do formulario corretamente', async () => {
        render(<FormularioTarefa aoSalvarSucesso={() => {}} aoFechar={() => {}} />)

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Matéria/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Data de Entrega/i)).toBeInTheDocument()
        expect(await screen.findByRole('option', { name: 'Programacao' })).toBeInTheDocument()
    })

    it('deve exibir alerta ao tentar submeter com campos obrigatorios vazios', async () => {
        const { container } = render(<FormularioTarefa aoSalvarSucesso={() => {}} aoFechar={() => {}} />)

        await screen.findByRole('option', { name: 'Programacao' })

        const form = container.querySelector('form')
        fireEvent.submit(form)

        expect(window.alert).toHaveBeenCalledWith('Por favor, preencha o título e a data de entrega.')
        expect(api.post).not.toHaveBeenCalled()
    })

    it('deve enviar os dados corretos para API e chamar aoSalvarSucesso', async () => {
        const funcaoSalvarSucesso = vi.fn()
        const funcaoFechar = vi.fn()
        api.post.mockResolvedValueOnce({ data: { id: 10 } })

        render(<FormularioTarefa aoSalvarSucesso={funcaoSalvarSucesso} aoFechar={funcaoFechar} />)

        await screen.findByRole('option', { name: 'Programacao' })

        fireEvent.change(screen.getByLabelText(/Título/i), {
            target: { value: 'Estudar React' },
        })
        fireEvent.change(screen.getByLabelText(/Matéria/i), {
            target: { value: '1' },
        })
        fireEvent.change(screen.getByLabelText(/Data de Entrega/i), {
            target: { value: '2026-12-01' },
        })

        const botaoSalvar = screen.getByRole('button', { name: /Salvar Tarefa/i })
        fireEvent.click(botaoSalvar)

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/tarefas', {
                titulo: 'Estudar React',
                descricao: null,
                dataEntrega: '2026-12-01T23:59:00',
                prioridade: 'MEDIA',
                materiaId: 1,
                novaMateriaNome: null,
            })
            expect(funcaoSalvarSucesso).toHaveBeenCalledTimes(1)
            expect(funcaoFechar).toHaveBeenCalledTimes(1)
        })
    })

    it('deve permitir criar tarefa selecionando uma sugestao de materia do materias.js', async () => {
        const funcaoSalvarSucesso = vi.fn()
        api.post.mockResolvedValueOnce({ data: { id: 11 } })

        render(<FormularioTarefa aoSalvarSucesso={funcaoSalvarSucesso} aoFechar={() => {}} />)

        const opcaoHistoria = await screen.findByRole('option', { name: 'História' })
        expect(opcaoHistoria).toBeInTheDocument()

        fireEvent.change(screen.getByLabelText(/Título/i), {
            target: { value: 'Resumo Segunda Guerra' },
        })
        fireEvent.change(screen.getByLabelText(/Matéria/i), {
            target: { value: 'SUGESTAO:História' },
        })
        fireEvent.change(screen.getByLabelText(/Data de Entrega/i), {
            target: { value: '2026-12-10' },
        })

        fireEvent.click(screen.getByRole('button', { name: /Salvar Tarefa/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/tarefas', {
                titulo: 'Resumo Segunda Guerra',
                descricao: null,
                dataEntrega: '2026-12-10T23:59:00',
                prioridade: 'MEDIA',
                materiaId: null,
                novaMateriaNome: 'História',
            })
            expect(funcaoSalvarSucesso).toHaveBeenCalledTimes(1)
        })
    })
})
