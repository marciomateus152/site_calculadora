document.addEventListener('DOMContentLoaded', () => {
    const elementoVisor = document.getElementById('visor');
    const containerBotoes = document.querySelector('.botoes');

    let valorAtual = '0';
    let valorAnterior = '';
    let operador = null;
    let aguardandoSegundoValor = false;
    const TAMANHO_MAX_VISOR = 10;

    function atualizarVisor() {
        let valorNoVisor = valorAtual;

        if (valorNoVisor.length > TAMANHO_MAX_VISOR) {
            valorNoVisor = parseFloat(valorNoVisor).toPrecision(7);
        }

        elementoVisor.textContent = valorNoVisor.replace('.', ',');

        if (valorNoVisor.length > 9) {
            elementoVisor.style.fontSize = '2.5rem';
        } else if (valorNoVisor.length > 6) {
            elementoVisor.style.fontSize = '3rem';
        } else {
            elementoVisor.style.fontSize = '3.5rem';
        }
    }

    function limparCalculadora() {
        valorAtual = '0';
        valorAnterior = '';
        operador = null;
        aguardandoSegundoValor = false;
        atualizarVisor();
    }

    function inserirNumero(numero) {
        if (aguardandoSegundoValor) {
            valorAtual = numero;
            aguardandoSegundoValor = false;
        } else {
            if (valorAtual === '0') {
                valorAtual = numero;
            } else if (valorAtual.length < TAMANHO_MAX_VISOR) {
                valorAtual += numero;
            }
        }
        atualizarVisor();
    }

    function inserirDecimal() {
        if (aguardandoSegundoValor) {
            valorAtual = '0.';
            aguardandoSegundoValor = false;
            atualizarVisor();
            return;
        }
        
        if (!valorAtual.includes('.')) {
            valorAtual += '.';
        }
        atualizarVisor();
    }

    function lidarOperador(proximoOperador) {
        const valor = parseFloat(valorAtual);

        if (operador && !aguardandoSegundoValor) {
            const resultado = executarCalculo();
            if (resultado === 'Erro') {
                valorAtual = 'Erro';
            } else {
                valorAtual = `${resultado}`;
            }
            valorAnterior = valorAtual;
        } else {
            valorAnterior = valorAtual;
        }

        aguardandoSegundoValor = true;
        operador = proximoOperador;
        atualizarVisor(); 
    }

    function executarCalculo() {
        const valAnterior = parseFloat(valorAnterior);
        const valAtual = parseFloat(valorAtual);

        if (isNaN(valAnterior) || isNaN(valAtual)) return;

        switch (operador) {
            case '+': return valAnterior + valAtual;
            case '-': return valAnterior - valAtual;
            case '*': return valAnterior * valAtual;
            case '/':
                if (valAtual === 0) return 'Erro';
                return valAnterior / valAtual;
            default:
                return valAtual;
        }
    }

    function calcular() {
        if (operador === null || aguardandoSegundoValor) return;
        
        const resultado = executarCalculo();

        if (resultado === 'Erro') {
            valorAtual = 'Erro';
            aguardandoSegundoValor = true;
        } else {
            valorAtual = `${parseFloat(resultado.toFixed(10))}`;
            operador = null;
            valorAnterior = '';
            aguardandoSegundoValor = false;
        }
        atualizarVisor();
    }

    function inverterSinal() {
        valorAtual = (parseFloat(valorAtual) * -1).toString();
        atualizarVisor();
    }

    function lidarPorcentagem() {
        valorAtual = (parseFloat(valorAtual) / 100).toString();
        atualizarVisor();
    }

    containerBotoes.addEventListener('click', (evento) => {
        const { target: alvo } = evento;
        if (!alvo.matches('button')) return;

        const { value: valor, acao } = alvo.dataset;

        if (valorAtual === 'Erro' && acao !== 'limpar') return;

        if (valor) {
            if (alvo.classList.contains('operador')) {
                lidarOperador(valor);
            } else {
                inserirNumero(valor);
            }
            return;
        }

        if (acao) {
            switch (acao) {
                case 'limpar':
                    limparCalculadora();
                    break;
                case 'calcular':
                    calcular();
                    break;
                case 'decimal':
                    inserirDecimal();
                    break;
                case 'inverter-sinal':
                    inverterSinal();
                    break;
                case 'porcentagem':
                    lidarPorcentagem();
                    break;
            }
            return;
        }
    });

    atualizarVisor();
});