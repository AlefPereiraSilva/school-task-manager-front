import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Calendario from './Calendario';
import api from '../../servicos/api';

vi.mock('../../servicos/api');

describe('Página Calendario', () => {
  it('deve renderizar o calendário e exibir tarefas na data correspondente', async () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dataIso = `${ano}-${mes}-15T23:59:00`;

    api.get.mockImplementation((url) => {
      if (url === '/tarefas') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              titulo: 'Entrega de Spring Boot',
              dataEntrega: dataIso,
              materia: { nome: 'Programação', cor: '#3b82f6' },
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <Calendario />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Entrega de Spring Boot')).toBeInTheDocument();
    });
  });
});
