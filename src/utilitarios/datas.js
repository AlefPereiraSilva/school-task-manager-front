// Funções de data usadas em várias partes do site.

// Data de hoje no formato das tarefas: "2026-10-29"
export function pegarHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return ano + '-' + mes + '-' + dia
}

// Transforma "2026-10-20" em "20/10"
export function formatarData(data) {
  const partes = data.split('-')
  return partes[2] + '/' + partes[1]
}
