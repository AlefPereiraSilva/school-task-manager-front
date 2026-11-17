import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Avaliacoes from './Avaliacoes';
import api from '../../servicos/api';

vi.mock('../../servicos/api');

describe('Página Avaliacoes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar avaliações, lançar/editar nota, cadastrar nova com sugestão e excluir', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/avaliacoes') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              titulo: 'Prova de Cálculo',
              tipo: 'PROVA',
              dataAvaliacao: '2026-11-20T08:00:00',
              nota: null,
              notaMaxima: 10.0,
              materia: { id: 1, nome: 'Matemática', cor: '#3b82f6' },
            },
          ],
        });
      }
      if (url === '/materias') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    api.put.mockResolvedValueOnce({ data: { id: 1, nota: 9.5 } });
    api.post.mockResolvedValueOnce({ data: { id: 2, titulo: 'Prova de História' } });
    api.delete.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <Avaliacoes />
      </BrowserRouter>
    );

    
    expect(await screen.findByText('Prova de Cálculo')).toBeInTheDocument();
    expect(screen.getByText('Aguardando nota')).toBeInTheDocument();

    
    fireEvent.click(screen.getByRole('button', { name: /Lançar Nota/i }));
    fireEvent.change(screen.getByLabelText(/Editar nota/i), { target: { value: '9.5' } });
    fireEvent.click(screen.getByRole('button', { name: /^Salvar$/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        '/avaliacoes/1',
        expect.objectContaining({
          titulo: 'Prova de Cálculo',
          nota: 9.5,
        })
      );
    });

    
    fireEvent.change(screen.getByPlaceholderText(/Título/i), {
      target: { value: 'Prova de História' },
    });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'SUGESTAO:História' } });

    const inputData = document.querySelector('input[type="date"]');
    fireEvent.change(inputData, { target: { value: '2026-11-25' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Avaliação/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/avaliacoes',
        expect.objectContaining({
          titulo: 'Prova de História',
          materiaId: null,
          novaMateriaNome: 'História',
        })
      );
    });

    
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/avaliacoes/1');
    });
  });
});
