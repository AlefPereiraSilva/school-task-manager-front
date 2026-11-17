import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import ListaTarefas from '../../componentes/ListaTarefas/ListaTarefas.jsx'

describe('Componente ListaTarefas', () => {
    const tarefasMock = [
        {
            id: 1,
            titulo: 'Fazer trabalho de Biologia',
            materia: 'Biologia',
            dataEntrega: '2026-11-20',
            concluida: false,
        },
    ]

    it('deve renderizar a lista de tarefas', () => {
        render(
            <ListaTarefas
            tarefas={tarefasMock}
            hoje="2026-11-08"
            aoMarcar={() => {}}
            aoExcluir={() => {}}
            />
        )

        expect(screen.getByText('Fazer trabalho de Biologia')).toBeInTheDocument()
        expect(screen.getByText('Biologia')).toBeInTheDocument()
    })

    it('deve disparar a funcao de marcar tarefa ao clicar no ckeckbox/botao de conclusao', () => {
        const funcaoMarcar = vi.fn()
        render(
            <ListaTarefas
            tarefas={tarefasMock}
            hoje="2026-11-08"
            aoMarcar={funcaoMarcar}
            aoExcluir={() => {}}
            />
        )

        const botaoMarcar = screen.queryByRole('checkbox') || screen.getByRole('button')
        fireEvent.click(botaoMarcar)

        expect(funcaoMarcar).toHaveBeenCalledWith(1)
    })
})
