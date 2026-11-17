import { useState, useEffect } from 'react';
import api from '../../servicos/api.js';
import './Calendario.css';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function Calendario() {
  const [dataAtual, setDataAtual] = useState(() => new Date());
  const [hoje] = useState(() => new Date());
  const [tarefas, setTarefas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      try {
        const respTarefas = await api.get('/tarefas');
        if (ativo) {
          setTarefas(respTarefas.data || []);
        }
      } catch (erro) {
        console.error('Erro ao carregar tarefas no calendário:', erro);
      }

      try {
        const respAvaliacoes = await api.get('/avaliacoes');
        if (ativo) {
          setAvaliacoes(respAvaliacoes.data || []);
        }
      } catch {
        if (ativo) {
          setAvaliacoes([]);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarEventos();
    return () => {
      ativo = false;
    };
  }, []);

  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const primeiroDiaMes = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

  const nomeMes = dataAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  function mudarMes(delta) {
    setDataAtual(new Date(ano, mes + delta, 1));
  }

  function eventosDoDia(dia) {
    const prefixoData = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const tarefasDia = tarefas
      .filter((t) => t.dataEntrega && t.dataEntrega.startsWith(prefixoData))
      .map((t) => ({
        id: `t-${t.id}`,
        titulo: t.titulo,
        cor: t.materia?.cor || '#3b82f6',
        tipo: 'tarefa',
      }));

    const avaliacoesDia = avaliacoes
      .filter((a) => a.dataAvaliacao && a.dataAvaliacao.startsWith(prefixoData))
      .map((a) => ({
        id: `a-${a.id}`,
        titulo: `[${a.tipo}] ${a.titulo}`,
        cor: a.materia?.cor || '#8b5cf6',
        tipo: 'avaliacao',
      }));

    return [...avaliacoesDia, ...tarefasDia];
  }

  const ehHoje = (dia) =>
    hoje.getDate() === dia &&
    hoje.getMonth() === mes &&
    hoje.getFullYear() === ano;

  const celulas = [];
  for (let i = 0; i < primeiroDiaMes; i++) {
    celulas.push(<div key={`vazio-${i}`} className="calendario-celula vazia" />);
  }
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const eventos = eventosDoDia(dia);
    celulas.push(
      <div
        key={`dia-${dia}`}
        className={`calendario-celula ${ehHoje(dia) ? 'hoje' : ''}`}
      >
        <span className="calendario-numero-dia">{dia}</span>
        {eventos.map((ev) => (
          <div
            key={ev.id}
            className={`calendario-evento ${ev.tipo}`}
            style={{ backgroundColor: ev.cor }}
            title={ev.titulo}
          >
            {ev.titulo}
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="calendario-conteudo">
      <header className="calendario-topo">
        <div>
          <h1>Calendário Acadêmico</h1>
          <p>Acompanhe suas entregas e provas organizadas por data.</p>
        </div>
        <div className="calendario-controles">
          <button
            type="button"
            className="calendario-btn-nav"
            onClick={() => mudarMes(-1)}
          >
            &larr; Anterior
          </button>
          <span className="calendario-mes-titulo">{nomeMes}</span>
          <button
            type="button"
            className="calendario-btn-nav"
            onClick={() => mudarMes(1)}
          >
            Próximo &rarr;
          </button>
        </div>
      </header>

      {carregando ? (
        <p>Carregando calendário...</p>
      ) : (
        <>
          <div className="calendario-grade" role="grid">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="calendario-dia-semana">
                {dia}
              </div>
            ))}
            {celulas}
          </div>
          <div className="calendario-legenda">
            <span>■ Cor da Matéria = Tarefa</span>
            <span>▌ Borda Escura = Avaliação / Prova</span>
          </div>
        </>
      )}
    </main>
  );
}
