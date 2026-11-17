import { useState, useEffect } from 'react'
import api from '../../servicos/api.js'
import * as dadosMaterias from '../../dados/materias.js'
import './FormularioTarefa.css'

const MATERIAS_SUGERIDAS =
    Object.values(dadosMaterias).find((item) => Array.isArray(item)) || []

function FormularioTarefa({ aoSalvarSucesso, aoFechar }) {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [prioridade, setPrioridade] = useState('MEDIA')
    const [materiaSelecionada, setMateriaSelecionada] = useState('')
    const [novaMateriaNome, setNovaMateriaNome] = useState('')
    const [listaMaterias, setListaMaterias] = useState([])
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        async function carregarMaterias() {
            try {
                const resposta = await api.get('/materias')
                setListaMaterias(resposta.data || [])
            } catch (err) {
                console.error('Erro ao buscar as matérias:', err)
            }
        }
        carregarMaterias()
    }, [])

    const nomesNoBanco = new Set(
        listaMaterias.map((m) => m.nome.trim().toLowerCase())
    )

    const sugestoesDisponiveis = MATERIAS_SUGERIDAS.map((item, idx) => ({
        chave: `sug-${idx}`,
        nome: typeof item === 'string' ? item : item.nome
    })).filter(
        (sug) => sug.nome && !nomesNoBanco.has(sug.nome.trim().toLowerCase())
    )

    async function handleSalvarTarefa(e) {
        e.preventDefault()
        if (!titulo.trim() || !dataEntrega) {
            alert('Por favor, preencha o título e a data de entrega.')
            return
        }
        if (materiaSelecionada === 'NOVA' && !novaMateriaNome.trim()) {
            alert('Por favor, digite o nome da nova matéria.')
            return
        }

        setCarregando(true)
        try {
            const dataFormatada = `${dataEntrega}T23:59:00`

            let materiaId = null
            let nomeNovaMateria = null

            if (materiaSelecionada === 'NOVA') {
                nomeNovaMateria = novaMateriaNome.trim()
            } else if (materiaSelecionada.startsWith('SUGESTAO:')) {
                nomeNovaMateria = materiaSelecionada.replace('SUGESTAO:', '').trim()
            } else if (materiaSelecionada !== '') {
                materiaId = Number(materiaSelecionada)
            }

            const dadosTarefa = {
                titulo: titulo.trim(),
                descricao: descricao.trim() || null,
                dataEntrega: dataFormatada,
                prioridade,
                materiaId,
                novaMateriaNome: nomeNovaMateria
            }

            await api.post('/tarefas', dadosTarefa)
            alert('Tarefa cadastrada com sucesso!')
            
            if (aoSalvarSucesso) aoSalvarSucesso()
            if (aoFechar) aoFechar()
        } catch (err) {
            console.error(err)
            alert("Erro ao salvar tarefa: " + (err.response?.data?.message || err.message))
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="modal-formulario">
            <form className="formulario-tarefa" onSubmit={handleSalvarTarefa}>
                <h2>Nova Tarefa Escolar</h2>

                <div className="campo-grupo">
                    <label htmlFor="titulo">Título *</label>
                    <input id="titulo" type="text" placeholder="Ex: Trabalho de Java" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea id="descricao" placeholder="Detalhes da entrega..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="dataEntrega">Data de Entrega *</label>
                    <input id="dataEntrega" type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} required />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="prioridade">Prioridade</label>
                    <select id="prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                        <option value="BAIXA">🟢 Baixa</option>
                        <option value="MEDIA">🟡 Média</option>
                        <option value="ALTA">🔴 Alta</option>
                    </select>
                </div>

                <div className="campo-grupo">
                    <label htmlFor="materia">Matéria</label>
                    <select id="materia" value={materiaSelecionada} onChange={(e) => setMateriaSelecionada(e.target.value)}>
                        <option value="">Nenhuma</option>

                        {listaMaterias.length > 0 && (
                            <optgroup label="Minhas Matérias">
                                {listaMaterias.map((mat) => (
                                    <option key={mat.id} value={String(mat.id)}>{mat.nome}</option>
                                ))}
                            </optgroup>
                        )}

                        {sugestoesDisponiveis.length > 0 && (
                            <optgroup label="Sugestões de Matérias">
                                {sugestoesDisponiveis.map((sug) => (
                                    <option key={sug.chave} value={`SUGESTAO:${sug.nome}`}>
                                        {sug.nome}
                                    </option>
                                ))}
                            </optgroup>
                        )}

                        <option value="NOVA" style={{ fontWeight: 'bold', color: '#3b82f6' }}>✨ Criar nova matéria...</option>
                    </select>
                </div>

                {materiaSelecionada === 'NOVA' && (
                    <div className="campo-grupo">
                        <label htmlFor="novaMateria">Nome da Nova Matéria *</label>
                        <input id="novaMateria" type="text" placeholder="Digite o nome da disciplina" value={novaMateriaNome} onChange={(e) => setNovaMateriaNome(e.target.value)} required />
                    </div>
                )}

                <div className="botoes-acoes">
                    <button type="button" className="botao-cancelar" onClick={aoFechar} disabled={carregando}>Cancelar</button>
                    <button type="submit" className="botao-salvar" disabled={carregando}>
                        {carregando ? 'Salvando...' : 'Salvar Tarefa'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioTarefa
