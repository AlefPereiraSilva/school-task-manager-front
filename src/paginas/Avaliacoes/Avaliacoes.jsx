import { useState, useEffect } from 'react';
import api from '../../servicos/api.js';
import * as dadosMaterias from '../../dados/materias.js';
import './Avaliacoes.css';

const MATERIAS_SUGERIDAS =
  Object.values(dadosMaterias).find((item) => Array.isArray(item)) || [];

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [materiasBanco, setMateriasBanco] = useState([]);

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('PROVA');
  const [dataAvaliacao, setDataAvaliacao] = useState('');
  const [nota, setNota] = useState('');
  const [selecaoMateria, setSelecaoMateria] = useState('');
  const [novaMateriaNome, setNovaMateriaNome] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [notaEditada, setNotaEditada] = useState('');

  async function carregarDados() {
    try {
      const [respAv, respMat] = await Promise.all([
        api.get('/avaliacoes'),
        api.get('/materias'),
      ]);
      setAvaliacoes(respAv.data || []);
      setMateriasBanco(respMat.data || []);
    } catch (erro) {
      console.error('Erro ao carregar avaliações:', erro);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function buscarInicial() {
      try {
        const [respAv, respMat] = await Promise.all([
          api.get('/avaliacoes'),
          api.get('/materias'),
        ]);
        if (ativo) {
          setAvaliacoes(respAv.data || []);
          setMateriasBanco(respMat.data || []);
        }
      } catch (erro) {
        console.error('Erro ao carregar avaliações:', erro);
      }
    }

    buscarInicial();
    return () => {
      ativo = false;
    };
  }, []);

  const nomesNoBanco = new Set(
    materiasBanco.map((m) => m.nome.trim().toLowerCase())
  );

  const sugestoesDisponiveis = MATERIAS_SUGERIDAS.map((item, idx) => ({
    chave: `sug-${idx}`,
    nome: typeof item === 'string' ? item : item.nome,
  })).filter(
    (sug) => sug.nome && !nomesNoBanco.has(sug.nome.trim().toLowerCase())
  );

  async function handleCriar(e) {
    e.preventDefault();
    if (!titulo || !dataAvaliacao) return;

    let materiaId = null;
    let nomeNovaMateria = null;

    if (selecaoMateria === 'NOVA') {
      nomeNovaMateria = novaMateriaNome;
    } else if (selecaoMateria.startsWith('SUGESTAO:')) {
      nomeNovaMateria = selecaoMateria.replace('SUGESTAO:', '');
    } else if (selecaoMateria !== '') {
      materiaId = Number(selecaoMateria);
    }

    const payload = {
      titulo,
      descricao: '',
      tipo,
      dataAvaliacao: `${dataAvaliacao}T08:00:00`,
      nota: nota !== '' ? parseFloat(nota) : null,
      notaMaxima: 10.0,
      materiaId,
      novaMateriaNome: nomeNovaMateria,
    };

    try {
      await api.post('/avaliacoes', payload);
      setTitulo('');
      setDataAvaliacao('');
      setNota('');
      setSelecaoMateria('');
      setNovaMateriaNome('');
      carregarDados();
    } catch (erro) {
      alert(erro.response?.data?.message || 'Erro ao salvar avaliação.');
    }
  }

  function iniciarEdicaoNota(av) {
    setEditandoId(av.id);
    setNotaEditada(av.nota !== null && av.nota !== undefined ? String(av.nota) : '');
  }

  function cancelarEdicaoNota() {
    setEditandoId(null);
    setNotaEditada('');
  }

  async function handleSalvarNota(av) {
    const payload = {
      titulo: av.titulo,
      descricao: av.descricao || '',
      tipo: av.tipo,
      dataAvaliacao: av.dataAvaliacao,
      nota: notaEditada !== '' ? parseFloat(notaEditada) : null,
      notaMaxima: av.notaMaxima || 10.0,
      materiaId: av.materia ? av.materia.id : null,
      novaMateriaNome: null,
    };

    try {
      await api.put(`/avaliacoes/${av.id}`, payload);
      setEditandoId(null);
      setNotaEditada('');
      carregarDados();
    } catch (erro) {
      alert(erro.response?.data?.message || 'Erro ao atualizar nota.');
    }
  }

  async function handleExcluir(id) {
    try {
      await api.delete(`/avaliacoes/${id}`);
      setAvaliacoes((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Erro ao excluir avaliação.');
    }
  }

  const avaliacoesComNota = avaliacoes.filter((a) => a.nota !== null && a.nota !== undefined);
  const mediaGeral =
    avaliacoesComNota.length > 0
      ? (
          avaliacoesComNota.reduce((acc, a) => acc + Number(a.nota), 0) /
          avaliacoesComNota.length
        ).toFixed(1)
      : '-';

  return (
    <main className="avaliacoes-conteudo">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1>Avaliações e Notas</h1>
        <p>Gerencie suas provas, seminários e acompanhe sua média geral.</p>
      </header>

      <div className="avaliacoes-resumo">
        <div className="avaliacoes-card-stat">
          <span>Total de Avaliações</span>
          <strong>{avaliacoes.length}</strong>
        </div>
        <div className="avaliacoes-card-stat">
          <span>Avaliações Corrigidas</span>
          <strong>{avaliacoesComNota.length}</strong>
        </div>
        <div className="avaliacoes-card-stat">
          <span>Média Geral</span>
          <strong>{mediaGeral}</strong>
        </div>
      </div>

      <form className="avaliacoes-form" onSubmit={handleCriar}>
        <input
          type="text"
          placeholder="Título (ex: Prova Bimestral)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="PROVA">Prova</option>
          <option value="TRABALHO">Trabalho Avaliativo</option>
          <option value="SEMINARIO">Seminário</option>
          <option value="SIMULADO">Simulado</option>
        </select>

        <input
          type="date"
          value={dataAvaliacao}
          onChange={(e) => setDataAvaliacao(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          placeholder="Nota (opcional)"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />

        <select
          value={selecaoMateria}
          onChange={(e) => setSelecaoMateria(e.target.value)}
        >
          <option value="">Sem matéria</option>

          {materiasBanco.length > 0 && (
            <optgroup label="Minhas Matérias">
              {materiasBanco.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.nome}
                </option>
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

          <option value="NOVA">+ Digitar outra matéria...</option>
        </select>

        {selecaoMateria === 'NOVA' && (
          <input
            type="text"
            placeholder="Nome da nova matéria"
            value={novaMateriaNome}
            onChange={(e) => setNovaMateriaNome(e.target.value)}
            required
          />
        )}

        <button type="submit" className="avaliacoes-btn-salvar">
          Cadastrar Avaliação
        </button>
      </form>

      <div className="avaliacoes-lista">
        {avaliacoes.length === 0 ? (
          <p>Nenhuma avaliação cadastrada ainda.</p>
        ) : (
          avaliacoes.map((av) => (
            <div
              key={av.id}
              className="avaliacao-item"
              style={{ borderLeftColor: av.materia?.cor || '#8b5cf6' }}
            >
              <div>
                <span className="avaliacao-badge">{av.tipo}</span>
                <strong>{av.titulo}</strong>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Data: {new Date(av.dataAvaliacao).toLocaleDateString('pt-BR')}
                  {av.materia ? ` • Matéria: ${av.materia.nome}` : ''}
                </p>
              </div>

              <div className="avaliacao-acoes">
                {editandoId === av.id ? (
                  <div className="avaliacao-edicao-nota">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      aria-label="Editar nota"
                      className="avaliacao-input-nota"
                      value={notaEditada}
                      onChange={(e) => setNotaEditada(e.target.value)}
                    />
                    <button
                      type="button"
                      className="avaliacao-btn-confirmar"
                      onClick={() => handleSalvarNota(av)}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="avaliacao-btn-cancelar"
                      onClick={cancelarEdicaoNota}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <strong>
                      {av.nota !== null && av.nota !== undefined
                        ? `Nota: ${av.nota} / ${av.notaMaxima || 10}`
                        : 'Aguardando nota'}
                    </strong>
                    <button
                      type="button"
                      className="avaliacao-btn-editar"
                      onClick={() => iniciarEdicaoNota(av)}
                    >
                      {av.nota !== null && av.nota !== undefined ? 'Editar Nota' : 'Lançar Nota'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="avaliacao-btn-excluir"
                  onClick={() => handleExcluir(av.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
