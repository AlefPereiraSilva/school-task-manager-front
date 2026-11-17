import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App.jsx'
import api from './servicos/api.js'

vi.mock('./servicos/api.js', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}))

vi.mock('./componentes/MenuLateral/MenuLateral.jsx', () => ({
    default: () => <nav>Menu Lateral</nav>
}))
vi.mock('./componentes/Cabecalho/Cabecalho.jsx', () => ({
    default: ({ aoClicarNovaTarefa }) => <header><button onClick={aoClicarNovaTarefa}>Nova Tarefa</button></header>
}))
vi.mock('./componentes/BarraProgresso/BarraProgresso.jsx', () => ({
    default: () => <div>Barra Progresso</div>
}))
vi.mock('./componentes/CartaoResumo/CartaoResumo.jsx', () => ({
    default: ({ nome, valor }) => <div>{nome}: {valor}</div>
}))
vi.mock('./componentes/FiltrosTarefas/FiltrosTarefas.jsx', () => ({
    default: () => <div>Filtros</div>
}))
vi.mock('./componentes/ProximasEntregas/ProximasEntregas.jsx', () => ({
    default: () => <div>Proximas Entregas</div>
}))
vi.mock('./componentes/PendentesPorMateria/PendentesPorMateria.jsx', () => ({
    default: () => <div>Pendentes Por Materias</div>
}))
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: () => <button>Google Login</button>
}))

describe('Teste de Integracao do Fluxo de Rotas e Dashboard', () => {
    let mockStorage = {}

    beforeEach(() => {
        vi.clearAllMocks()
        mockStorage = {}
        vi.spyOn(window, 'alert').mockImplementation(() => {})

        vi.stubGlobal('localStorage', {
            setItem: vi.fn((key, val) => { mockStorage[key] = val }),
            getItem: vi.fn((key) => mockStorage[key] || null),
            removeItem: vi.fn((key) => { delete mockStorage[key] })
        })

        window.history.pushState({}, '', '/login')
    })

    it('deve simular o fluxo completo: login, entrada na rota protegida e criacao de uma tarefa escolar', async () => {
        const { rerender } = render(<App />)
        expect(screen.getByText('Acesse sua conta')).toBeInTheDocument()

        api.post.mockResolvedValueOnce({ data: { token: 'jwt-valido-gerado', nomeUsuario: 'Aluno TI' } })
        api.get.mockResolvedValueOnce({ data: [] }) // Lista de tarefas inicia vazia

        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'aluno@ti.com' } })
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } })
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-valido-gerado')
        })

        mockStorage['token'] = 'jwt-valido-gerado'
        rerender(<App />)

        expect(screen.getByText('Menu Lateral')).toBeInTheDocument()
        expect(screen.getByText('Total: 0')).toBeInTheDocument()

        
        api.get.mockResolvedValueOnce({ data: [{ id: 1, nome: 'Programacao' }] })
        fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

        await screen.findByRole('option', { name: 'Programacao' })

        const novaTarefaResponse = {
            id: 100,
            titulo: 'Aprender Spring Boot',
            materia: { id: 1, nome: 'Programacao' },
            dataEntrega: '2026-12-05T23:59:00',
            concluida: false,
            status: 'PENDENTE'
        }
        api.post.mockResolvedValueOnce({ data: novaTarefaResponse })
        api.get.mockResolvedValueOnce({ data: [novaTarefaResponse] })

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Aprender Spring Boot' } })
        fireEvent.change(screen.getByLabelText(/matéria/i), { target: { value: '1' } })
        fireEvent.change(screen.getByLabelText(/data de entrega/i), { target: { value: '2026-12-05' } })

        fireEvent.click(screen.getByRole('button', { name: /salvar tarefa/i }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/tarefas', {
                titulo: 'Aprender Spring Boot',
                descricao: null,
                dataEntrega: '2026-12-05T23:59:00',
                prioridade: 'MEDIA',
                materiaId: 1,
                novaMateriaNome: null
            })
        })

        expect(await screen.findByText('Aprender Spring Boot')).toBeInTheDocument()
        expect(screen.getByText('Total: 1')).toBeInTheDocument()
    })

    it('deve renderizar as rotas protegidas de Calendario e Avaliacoes quando autenticado', async () => {
        mockStorage['token'] = 'jwt-valido-gerado'
        api.get.mockResolvedValue({ data: [] })

        
        window.history.pushState({}, '', '/calendario')
        const { unmount } = render(<App />)

        expect(screen.getByText('Menu Lateral')).toBeInTheDocument()
        expect(await screen.findByRole('heading', { name: /Calendário Acadêmico/i })).toBeInTheDocument()
        unmount()

        
        window.history.pushState({}, '', '/avaliacoes')
        render(<App />)

        expect(screen.getByText('Menu Lateral')).toBeInTheDocument()
        expect(await screen.findByRole('heading', { name: /Avaliações e Notas/i })).toBeInTheDocument()
    })
})
