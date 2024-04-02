// Objeto para armazenar os lembretes
const lembretes = {};

// Função para criar o calendário
function criarCalendario(mes, ano) {
    const dias = new Date(ano, mes + 1, 0).getDate(); // Quantidade de dias no mês
    const primeirodia = new Date(ano, mes, 1).getDay(); // Dia da semana em que o mês começa (0 = domingo, 1 = segunda, ..., 6 = sábado)
    const ConteudoTabela = document.getElementById('body-table');
    const mesSelect = document.getElementById('mes').value;
    const nomeMes = document.getElementById('mes').options[mesSelect].text;

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
                    html += `<td class="destacado" onclick="onOff(this)">${dia}</td>`; // Marca o dia atual como destacado e permite adicionar lembrete
                } else {
                    html += `<td data-dia="${dia}" onclick="onOff(this)">${dia}</td>`; // Adicionando evento de clique para abrir o modal
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

// Atualizar Calendário
document.getElementById('mes').addEventListener('change', function() {
    const mesSelect = parseInt(this.value);
    const anoAtual = 2024; // Altere o ano conforme necessário
    criarCalendario(mesSelect, anoAtual);
});

// Inicializar o calendário com o mês atual
document.addEventListener('DOMContentLoaded', function() {
    const atual = new Date();
    const mesAtual = atual.getMonth();
    const anoAtual = atual.getFullYear();
    document.getElementById('mes').value = mesAtual;
    criarCalendario(mesAtual, anoAtual);
});

const modal = document.getElementById("modal");

function onOff(element) {
    modal.classList.toggle("hide");
    if (!modal.classList.contains("hide")) { // Verifica se o modal está sendo exibido
        const dia = element.getAttribute('data-dia');

        // Verifica se o dia clicado possui um lembrete
        const lembreteDoDia = lembretes[dia];
        if (lembreteDoDia) {
            // Preenche o modal com as informações do lembrete
            document.getElementById("lembrete1").value = lembreteDoDia.titulo;
            document.getElementById("appt").value = lembreteDoDia.horario;
            document.getElementById("appt1").value = lembreteDoDia.horario1;
        } else {
            // Limpa o modal
            document.getElementById("lembrete1").value = '';
            document.getElementById("appt").value = '';
            document.getElementById("appt1").value = '';
        }

        const form = document.getElementById("lembrete");
        form.onsubmit = function(event) {
            event.preventDefault();
            const lembreteTitulo = document.getElementById("lembrete1").value;
            const lembreteHorario = document.getElementById("appt").value;
            const lembreteHorario1 = document.getElementById("appt1").value;
            const lembrete = document.createElement('div');
            lembrete.textContent = `${lembreteTitulo} - ${lembreteHorario} - ${lembreteHorario1}`;
            lembretes[dia] = { titulo: lembreteTitulo, horario: lembreteHorario, horario1: lembreteHorario1 };
            element.appendChild(lembrete);
            modal.classList.add("hide");

            // Verifica se o lembrete é para o dia e horário atual
            const hoje = new Date();
            const diaAtual = hoje.getDate().toString().padStart(2, '0');
            const mesAtual = (hoje.getMonth() + 1).toString().padStart(2, '0');
            const anoAtual = hoje.getFullYear();
            const horarioAtual = hoje.getHours().toString().padStart(2, '0') + ':' + hoje.getMinutes().toString().padStart(2, '0');

            if (dia === diaAtual && lembreteHorario === horarioAtual) {
                mostrarNotificacao(lembreteTitulo, lembreteHorario);
            }
        };
    }
}

// Função para mostrar notificação
function mostrarNotificacao(titulo, horario) {
    if (!Notification) {
        alert('Este navegador não suporta notificações!');
        return;
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    } else {
        const notification = new Notification('Lembrete:', {
            icon: 'caminho_para_o_icone.png', // Insira o caminho para o ícone desejado
            body: `Lembrete: ${titulo} às ${horario}`,
        });

        // Adicionar som à notificação
        const audio = new Audio('caminho_para_o_som.mp3'); // Insira o caminho para o arquivo de áudio desejado
        audio.play();

        notification.onclick = function() {
            window.focus();
        };
    }
}

function editarLembrete(dia) {
  const lembreteDoDia = lembretes[dia];
  if (lembreteDoDia) {
      document.getElementById("lembrete1").value = lembreteDoDia.titulo;
      document.getElementById("appt").value = lembreteDoDia.horario;
      document.getElementById("appt1").value = lembreteDoDia.horario1;

      // Exibe o botão "Salvar" e esconde o botão "Editar"
      document.getElementById("salvarBtn").style.display = 'inline';
      document.getElementById("editarBtn").style.display = 'none';

      // Remove o lembrete do dia atual
      delete lembretes[dia];

      // Atualiza o calendário
      criarCalendario(new Date().getMonth(), new Date().getFullYear());
  }
}

// Função para excluir lembrete
function excluirLembrete(dia) {
  const confirmacao = confirm("Tem certeza que deseja excluir este lembrete?");
  if (confirmacao) {
      delete lembretes[dia];
      criarCalendario(new Date().getMonth(), new Date().getFullYear());
  }
}