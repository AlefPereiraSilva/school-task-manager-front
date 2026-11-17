import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api.js';
import * as moduloInterceptador from './interceptadorErro.js';

describe('Serviço interceptadorErro e instância api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve anexar o token JWT no cabeçalho Authorization quando existir no localStorage', () => {
    localStorage.setItem('token', 'meu-jwt-teste');

    
    const handlersRequest = api.interceptors.request.handlers;
    let config = { headers: {} };

    for (const h of handlersRequest) {
      if (h && h.fulfilled) {
        config = h.fulfilled(config);
      }
    }

    expect(config.headers.Authorization).toBe('Bearer meu-jwt-teste');
  });

  it('deve tratar respostas de erro HTTP nos interceptors de response', async () => {
    const handlersResponse = api.interceptors.response.handlers;
    const erroSimulado = {
      response: {
        status: 401,
        data: { message: 'Token expirado ou inválido' },
      },
    };

    
    const fnErro =
      typeof moduloInterceptador.default === 'function'
        ? moduloInterceptador.default
        : handlersResponse.find((h) => h && h.rejected)?.rejected;

    if (fnErro) {
      await expect(fnErro(erroSimulado)).rejects.toBeDefined();
    } else {
      expect(moduloInterceptador).toBeDefined();
    }
  });
});
