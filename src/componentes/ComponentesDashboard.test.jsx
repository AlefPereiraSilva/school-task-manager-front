import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MenuLateral from './MenuLateral/MenuLateral.jsx'
import Cabecalho from './Cabecalho/Cabecalho.jsx'
import BarraProgresso from './BarraProgresso/BarraProgresso.jsx'
import CartaoResumo from './CartaoResumo/CartaoResumo.jsx'
import FiltrosTarefas from './FiltrosTarefas/FiltrosTarefas.jsx'
import ProximasEntregas from './ProximasEntregas/ProximasEntregas.jsx'
import PendentesPorMateria from './PendentesPorMateria/PendentesPorMateria.jsx'

describe('Componentes Visuais do Dashboard', () => {
    const tarefasNormalizadas = [
        {
            id: 1,
            titulo: 'Prova de História',
            materia: 'História',
            dataEntrega: '2026-12-15',
            concluida: false
        },
        {
            id: 2,
            titulo: 'Exercício de Física',
            materia: 'Física',
            dataEntrega: '2026-12-20',
            concluida: true
        }
    ]

    it('deve renderizar MenuLateral com links de navegacao e abrir modal de exclusao', () => {
        render(
            <MemoryRouter initialEntries={['/painel']}>
                <MenuLateral />
            </MemoryRouter>
        )

        expect(screen.getByText(/Minhas Tarefas/i)).toBeInTheDocument()
        expect(screen.getByText(/Calendário/i)).toBeInTheDocument()
        expect(screen.getByText(/Avaliações e Notas/i)).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }))
        expect(screen.getByText(/Excluir conta permanentemente/i)).toBeInTheDocument()
    })

    it('deve renderizar Cabecalho, BarraProgresso e CartaoResumo', () => {
        const aoClicar = vi.fn()
        render(
            <>
                <Cabecalho aoClicarNovaTarefa={aoClicar} />
                <BarraProgresso total={2} concluidas={1} />
                <CartaoResumo nome="Pendentes" valor={1} tipo="pendentes" />
            </>
        )

        fireEvent.click(screen.getByRole('button', { name: /Nova tarefa/i }))
        expect(aoClicar).toHaveBeenCalledTimes(1)
        expect(screen.getByText(/concluídas · 50%/i)).toBeInTheDocument()
        expect(screen.getByText('Pendentes')).toBeInTheDocument()
    })

    it('deve renderizar FiltrosTarefas, ProximasEntregas e PendentesPorMateria', () => {
        const setFiltro = vi.fn()
        const setBusca = vi.fn()
        const setOrdem = vi.fn()

        render(
            <>
                <FiltrosTarefas
                    filtro="todas"
                    setFiltro={setFiltro}
                    busca=""
                    setBusca={setBusca}
                    ordem="entrega"
                    setOrdem={setOrdem}
                    quantidades={{ todas: 2, pendentes: 1, atrasadas: 0, concluidas: 1 }}
                />
                <ProximasEntregas tarefas={tarefasNormalizadas} hoje="2026-12-01" />
                <PendentesPorMateria tarefas={tarefasNormalizadas} />
            </>
        )

        expect(screen.getAllByText(/Prova de História/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/História/i).length).toBeGreaterThan(0)
    })
})
