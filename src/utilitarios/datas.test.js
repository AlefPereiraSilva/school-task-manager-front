import { describe, it, expect } from 'vitest'
import * as datas from './datas.js'
import materiasPadrao from '../dados/materias.js'

describe('Utilitarios de Datas e Dados de Materias', () => {
    it('deve formatar data YYYY-MM-DD corretamente para DD/MM', () => {
        expect(datas.formatarData('2026-12-25')).toBe('25/12')
        expect(datas.formatarData('2026-03-08')).toBe('08/03')
    })

    it('deve executar funcoes auxiliares de datas sem erro', () => {
        if (typeof datas.dataDeHoje === 'function') {
            expect(datas.dataDeHoje()).toBeTruthy()
        }
        if (typeof datas.diasRestantes === 'function') {
            expect(typeof datas.diasRestantes('2099-12-31')).toBe('number')
        }
    })

    it('deve exportar lista valida de materias padrao', () => {
        expect(Array.isArray(materiasPadrao)).toBe(true)
        expect(materiasPadrao.length).toBeGreaterThan(0)
    })
})
