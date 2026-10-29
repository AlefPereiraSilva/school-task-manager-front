// Guarda as tarefas no navegador para não sumirem ao recarregar a página.

const CHAVE = 'tarefas-escolares'

export function carregarTarefas() {
  try {
    const texto = localStorage.getItem(CHAVE)
    return texto ? JSON.parse(texto) : []
  } catch {
    // Se o navegador bloquear o armazenamento, começa com a lista vazia
    return []
  }
}

export function salvarTarefas(tarefas) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(tarefas))
  } catch {
    // Se não der para salvar, o site continua funcionando normalmente
  }
}
