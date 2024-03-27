// Objeto para armazenar os lembretes
const lembretes = {};

// Função para criar o calendário
function criarCalendario(mes, ano) {
  const dias = new Date(ano, mes + 1, 0).getDate(); // Quantidade de dias no mês
  const primeirodia = new Date(ano, mes, 1).getDay(); // Dia da semana em que o mês começa (0 = domingo, 1 = segunda, ..., 6 = sábado)
  const ConteudoTabela = document.getElementById('corpo-tabela');
  const mesSelect = document.getElementById('select-mes').value;
  const nomeMes = document.getElementById('select-mes').options[mesSelect].text;

  let html = '';

  let dia = 1;
  const atual = new Date();
  const diaAtual = atual.getDate();
  const mesAtual = atual.getMonth();

  for (let i = 0; i < 6; i++) { 
    html += '<tr>';
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < primeirodia) || dia > dias) {
        html += '<td></td>'; 
      } else {
        if (dia === diaAtual && mes === mesAtual && ano === atual.getFullYear()) {
          html += `<td class="destacado">${dia}</td>`;
        } else {
          html += `<td data-dia="${dia}">${dia}</td>`;
        }
        dia++;
      }
    }
    html += '</tr>';
    if (dia > dias) break; 
  }

  ConteudoTabela.innerHTML = html;

  // Atualiza o conteúdo do mês selecionado
  document.querySelector('.ano').innerHTML = `<span>2024</span><span></span><span>•</span><span></span><span>${nomeMes}</span>`;

  // Adicione indicadores visuais para os dias com lembretes
  for (const dia in lembretes) {
    const elementosDia = document.querySelectorAll(`td[data-dia="${dia}"]:not(.destacado)`); // Selecione todas as células que não estão vazias e não estão destacadas
    for (const elemento of elementosDia) {
      elemento.classList.add('com-lembrete');
    }
  }
}

// Abra o modal de adicionar lembrete ao clicar em um dia do calendário
document.getElementById('corpo-tabela').addEventListener('click', function(event) {
  const target = event.target;
  if (target.tagName === 'TD' && target.dataset.dia) {
    const dia = target.dataset.dia;

    // Exibir modal de adicionar lembrete
    document.getElementById('modalAdicionar').style.display = 'block';
    // Definir o dia no modal
    document.getElementById('modal').dataset.dia = dia;
  }
});

// Adicione um evento de envio ao formulário para processar o lembrete
document.getElementById('lembrete-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o comportamento padrão de enviar o formulário
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const dia = document.getElementById('modal').dataset.dia;

  // Armazene as informações do lembrete no objeto associado ao dia correspondente
  if (!lembretes[dia]) {
    lembretes[dia] = [];
  }
  lembretes[dia].push({ titulo, descricao });

  // Feche o modal de adicionar lembrete
  document.getElementById('modalAdicionar').style.display = 'none';
  // Limpe o formulário para futuros lembretes
  document.getElementById('lembrete-form').reset();

  // Exibir modal de visualizar lembrete
  exibirModalVisualizar(titulo, descricao);
});

// Função para exibir o modal de visualizar lembrete
function exibirModalVisualizar(titulo, descricao) {
  const modalVisualizar = document.getElementById('modalVisualizar');
  const lembreteVisualizacao = document.getElementById('lembreteVisualizacao');
  lembreteVisualizacao.innerHTML = `
    <p><strong>Título:</strong> ${titulo}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
  `;
  modalVisualizar.style.display = 'block';
}

// Fechar o modal de adicionar lembrete ao clicar no botão Fechar (X)
document.getElementById('closeAdicionar').addEventListener('click', function() {
  document.getElementById('modalAdicionar').style.display = 'none';
});

// Fechar o modal de visualizar lembrete ao clicar no botão Fechar (X)
document.getElementById('closeVisualizar').addEventListener('click', function() {
  document.getElementById('modalVisualizar').style.display = 'none';
});

// Fechar o modal de visualizar lembrete ao clicar fora do modal
window.onclick = function(event) {
  const modalVisualizar = document.getElementById('modalVisualizar');
  if (event.target == modalVisualizar) {
    modalVisualizar.style.display = 'none';
  }
};

// Atualizar Calendário
document.getElementById('select-mes').addEventListener('change', function() {
  const mesSelect = parseInt(this.value);
  const anoAtual = 2024; // Altere o ano conforme necessário
  criarCalendario(mesSelect, anoAtual);
});

// Inicializar o calendário com o mês atual
document.addEventListener('DOMContentLoaded', function() {
  const atual = new Date();
  const mesAtual = atual.getMonth();
  const anoAtual = atual.getFullYear();
  document.getElementById('select-mes').value = mesAtual;
  criarCalendario(mesAtual, anoAtual);
});
