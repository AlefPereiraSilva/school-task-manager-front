import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import ItemTarefa from './ItemTarefa.jsx'

vi.mock('../../utilitarios/datas.js', () => ({
    formatarData: (data) => data
}))

describe('Componente ItemTarefa', () => {
    const tarefaMock = {
        id: 42,
        titulo: 'Fazer commits no GitHub',
        materia: 'Git e Métodos Ágeis',
        dataEntrega: '2026-11-15',
        concluida: false,
    }

    it('deve renderizar as informacoes da tarefa corretamente', () => {
        render(
            <ItemTarefa
                tarefa = {tarefaMock}
                hoje = "2026-11-10"
                aoMarcar = {() => {}}
                aoExcluir = {() => {}}
                />
        )

        expect(screen.getByText('Fazer commits no GitHub')).toBeInTheDocument()
        expect(screen.getByText('Git e Métodos Ágeis')).toBeInTheDocument()
        expect(screen.getByText(/2026-11-15/)).toBeInTheDocument()
    })

    it('deve aplicar classe de atrasada se a data de entrega for menor que hoje e nao estiver concluida', () => {
        render(
            <ItemTarefa
                tarefa = {tarefaMock}
                hoje = "2026-11-20"
                aoMarcar = {() => {}}
                aoExcluir = {() => {}}
                />
        )

        const elementoData = screen.getByText(/Atrasada/)
        expect(elementoData).toBeInTheDocument()
        expect(elementoData).toHaveClass('item-tarefa-atrasada')
    })

    it('deve disparar a funcao aoMarcar com ID correto ao clicar no checkbox', () => {
        const funcaoMarcar = vi.fn()
        render(
            <ItemTarefa
                tarefa = {tarefaMock}
                hoje = "2026-11-10"
                aoMarcar = {funcaoMarcar}
                aoExcluir = {() => {}}
                />
        )

        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)

        expect(funcaoMarcar).toHaveBeenCalledTimes(1)
        expect(funcaoMarcar).toHaveBeenCalledWith(42)
    })

    it('deve disparar a funcao aoExcluir com o ID ao clicar no botao de exclusao', () => {
        const funcaoExcluir = vi.fn()
        render(
            <ItemTarefa
                tarefa = {tarefaMock}
                hoje = "2026-11-10"
                aoMarcar = {() => {}}
                aoExcluir = {funcaoExcluir}
                />
        )

        const botaoExcluir = screen.getByRole('button', {name: /excluir/i})
        fireEvent.click(botaoExcluir)

        expect(funcaoExcluir).toHaveBeenCalledTimes(1)
        expect(funcaoExcluir).toHaveBeenCalledWith(42)
    })
})
