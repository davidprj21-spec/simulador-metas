// 1. ConfiguraÃ§Ãµes de InternacionalizaÃ§Ã£o
const isInternational = !navigator.language.startsWith('pt');
const moedaSimbolo = isInternational ? '$' : 'R$';
const localeSet = isInternational ? 'en-US' : 'pt-BR';
const moedaCod = isInternational ? 'USD' : 'BRL';

// 2. FunÃ§Ã£o de FormataÃ§Ã£o AutomÃ¡tica
function formatarMoeda(elemento) {
    let valor = elemento.value.replace(/\D/g, ""); 
    if (valor === "") {
        elemento.value = "";
        return;
    }
    valor = (parseFloat(valor) / 100).toLocaleString(localeSet, {
        style: 'currency',
        currency: moedaCod
    });
    elemento.value = valor;
}

// 3. TraduÃ§Ã£o e ConfiguraÃ§Ãµes de InicializaÃ§Ã£o (RodapÃ© e Menu)
window.addEventListener('load', () => {
    if (isInternational) {
        // TraduÃ§Ãµes BÃ¡sicas do RodapÃ©
        if(document.getElementById('footer-rights')) document.getElementById('footer-rights').innerText = "All rights reserved.";
        if(document.getElementById('footer-dev')) document.getElementById('footer-dev').innerText = "Developed to help your financial freedom.";
        
        // TraduÃ§Ã£o do Novo Aviso de IsenÃ§Ã£o (Disclaimer) e Contato
        const disclaimer = document.getElementById('footer-disclaimer');
        if (disclaimer) {
            disclaimer.innerHTML = "<strong>Disclaimer:</strong> The calculations displayed are estimates based on current rates and are for informational purposes only. They do not constitute official financial advice or investment recommendations.";
        }
        const contactText = document.getElementById('footer-contact-text');
        if (contactText) {
            contactText.innerText = "Contact:";
        }

        // TraduÃ§Ã£o dos Links do RodapÃ©
        const linksFooter = document.querySelectorAll('footer a');
        if (linksFooter.length >= 4) {
            linksFooter[0].innerText = "About";
            linksFooter[1].innerText = "Contact";
            linksFooter[2].innerText = "Privacy";
            linksFooter[3].innerText = "Terms of Use";
        }

        // TraduÃ§Ãµes do Menu Superior
        if(document.getElementById('nav-home')) document.getElementById('nav-home').innerText = "Home";
        if(document.getElementById('nav-salary')) document.getElementById('nav-salary').innerText = "Salary";
        if(document.getElementById('nav-13')) document.getElementById('nav-13').innerText = "13th Salary";
        
        // TraduÃ§Ã£o de TÃ­tulos de PÃ¡ginas Institucionais
        const tituloPrincipal = document.querySelector('h1');
        if (tituloPrincipal) {
            if (window.location.href.includes('sobre.html')) tituloPrincipal.innerText = "About Us";
            if (window.location.href.includes('contato.html')) tituloPrincipal.innerText = "Contact Us";
            if (window.location.href.includes('termos.html')) tituloPrincipal.innerText = "Terms of Use";
            if (window.location.href.includes('politica.html')) tituloPrincipal.innerText = "Privacy Policy";
        }
    }
});

// 4. FunÃ§Ã£o da Calculadora de SalÃ¡rio
function calcularSalario() {
    const bruto = parseFloat(document.getElementById('salario-bruto').value.replace(/\D/g, '')) / 100 || 0;
    const dependentes = parseInt(document.getElementById('dependentes').value) || 0;

    if (bruto <= 0) return;

    let inss = 0;
    if (bruto <= 1412) inss = bruto * 0.075;
    else if (bruto <= 2666) inss = (1412 * 0.075) + ((bruto - 1412) * 0.09);
    else if (bruto <= 4000) inss = (1412 * 0.075) + (1254 * 0.09) + ((bruto - 2666) * 0.12);
    else inss = 900.10; 

    const baseIRRF = bruto - inss - (dependentes * 189.59);
    let irrf = 0;
    if (baseIRRF > 2259 && baseIRRF <= 2826) irrf = (baseIRRF * 0.075) - 169.44;
    else if (baseIRRF > 2826 && baseIRRF <= 3751) irrf = (baseIRRF * 0.15) - 381.44;
    else if (baseIRRF > 3751) irrf = (baseIRRF * 0.225) - 662.77;

    const liquido = bruto - inss - irrf;

    document.getElementById('resultado-salario').innerHTML = `
        <div class="result-card result-card--success">
            <p class="result-label">${isInternational ? 'Estimated Net Salary:' : 'Salário Líquido Estimado:'}</p>
            <h2 class="result-value result-value--success">${moedaSimbolo} ${liquido.toLocaleString(localeSet, {minimumFractionDigits: 2})}</h2>
            <div class="result-meta">
                <span>INSS: -${moedaSimbolo}${inss.toFixed(2)}</span>
                <span>IRRF: -${moedaSimbolo}${irrf.toFixed(2)}</span>
            </div>
        </div>
    `;
    if(document.getElementById('btn-whatsapp')) document.getElementById('btn-whatsapp').style.display = 'flex';
}

// 5. FunÃ§Ã£o Calculadora de Metas
function calcular() {
    const capitalInicial = parseFloat(document.getElementById('capital').value.replace(/\D/g, '')) / 100 || 0;
    const metaFinal = parseFloat(document.getElementById('meta').value.replace(/\D/g, '')) / 100 || 0;
    const aporteMensal = parseFloat(document.getElementById('mensal').value.replace(/\D/g, '')) / 100 || 0;

    let taxaTexto = document.getElementById('taxa-cdi').innerText;
    let taxaAnual = parseFloat(taxaTexto.replace('%', '').replace(',', '.')) || 14.90; 
    let taxaMensal = Math.pow((1 + (taxaAnual / 100)), (1 / 12)) - 1;

    if (metaFinal <= capitalInicial) {
        document.getElementById('resultado').innerHTML = isInternational 
            ? "Your goal must be higher than the starting balance! ðŸ˜‰" 
            : "Sua meta deve ser maior que o valor inicial! ðŸ˜‰";
        return;
    }

    let saldoAtual = capitalInicial;
    let meses = 0;
    let labelsGrafico = [isInternational ? 'Start' : 'InÃ­cio'];
    let dadosGrafico = [capitalInicial];

    while (saldoAtual < metaFinal && meses < 600) {
        saldoAtual += saldoAtual * taxaMensal;
        saldoAtual += aporteMensal;
        meses++;
        if (meses % 6 === 0 || saldoAtual >= metaFinal) {
            labelsGrafico.push(isInternational ? `Month ${meses}` : `MÃªs ${meses}`);
            dadosGrafico.push(parseFloat(saldoAtual.toFixed(2)));
        }
    }

    document.getElementById('container-grafico').style.display = 'block';
    const ctx = document.getElementById('meuGraficoMetas').getContext('2d');
    if (window.graficoMetas) window.graficoMetas.destroy();

    window.graficoMetas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsGrafico,
            datasets: [{
                label: isInternational ? 'Balance Evolution' : 'EvoluÃ§Ã£o do Saldo',
                data: dadosGrafico,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });

    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    let tempoTexto = "";
    if (isInternational) {
        if (anos > 0) tempoTexto += `${anos} ${anos > 1 ? 'years' : 'year'}`;
        if (mesesRestantes > 0) tempoTexto += `${anos > 0 ? ' and ' : ''}${mesesRestantes} ${mesesRestantes > 1 ? 'months' : 'month'}`;
    } else {
        if (anos > 0) tempoTexto += `${anos} ${anos > 1 ? 'anos' : 'ano'}`;
        if (mesesRestantes > 0) tempoTexto += `${anos > 0 ? ' e ' : ''}${mesesRestantes} ${mesesRestantes > 1 ? 'meses' : 'mÃªs'}`;
    }

    const totalInvestido = capitalInicial + (aporteMensal * meses);
    const totalJuros = saldoAtual - totalInvestido;

    document.getElementById('resultado').innerHTML = `
        <div class="result-card result-card--primary">
            <p class="result-label">${isInternational ? 'You will reach your goal in:' : 'Você atingirá sua meta em:'}</p>
            <h2 class="result-value result-value--primary">${tempoTexto}</h2>
            <div class="result-split">
                <div>
                    <p class="result-small">${isInternational ? 'Total Accumulated:' : 'Total Acumulado:'}</p>
                    <b class="result-emphasis">${moedaSimbolo} ${saldoAtual.toLocaleString(localeSet, {minimumFractionDigits: 2})}</b>
                </div>
                <div>
                    <p class="result-small">${isInternational ? 'Interest Earnings:' : 'Ganhos em Juros:'}</p>
                    <b class="result-emphasis result-emphasis--success">${moedaSimbolo} ${totalJuros.toLocaleString(localeSet, {minimumFractionDigits: 2})}</b>
                </div>
            </div>
        </div>
    `;
    if(document.getElementById('btn-whatsapp')) document.getElementById('btn-whatsapp').style.display = 'flex';
}

// 6. FunÃ§Ãµes de Limpeza
function limparCampos() {
    document.getElementById('salario-bruto').value = "";
    document.getElementById('dependentes').value = "0";
    document.getElementById('resultado-salario').innerHTML = "";
    if(document.getElementById('btn-whatsapp')) document.getElementById('btn-whatsapp').style.display = 'none';
    document.getElementById('salario-bruto').focus();
}

function limpar13() {
    document.getElementById('salario-bruto-13').value = "";
    document.getElementById('meses-trabalhados').value = "12";
    document.getElementById('resultado-13').innerHTML = "";
    if(document.getElementById('btn-whatsapp')) document.getElementById('btn-whatsapp').style.display = 'none';
}

// 7. Calculadora de 13Âº SalÃ¡rio
function calcular13() {
    const bruto = parseFloat(document.getElementById('salario-bruto-13').value.replace(/\D/g, '')) / 100 || 0;
    const meses = parseInt(document.getElementById('meses-trabalhados').value) || 0;

    if (bruto <= 0) return;

    const valorProporcional = (bruto / 12) * meses;
    const primeiraParcela = valorProporcional * 0.5;

    let inss = 0;
    if (valorProporcional <= 1412) inss = valorProporcional * 0.075;
    else if (valorProporcional <= 2666) inss = (1412 * 0.075) + ((valorProporcional - 1412) * 0.09);
    else inss = (1412 * 0.075) + (1254 * 0.09) + ((valorProporcional - 2666) * 0.12);

    let irrf = 0;
    const baseIRRF = valorProporcional - inss;
    if (baseIRRF > 2259) irrf = (baseIRRF * 0.075) - 169.44;

    const segundaParcela = valorProporcional - primeiraParcela - inss - irrf;
    const totalLiquido = primeiraParcela + segundaParcela;

    document.getElementById('resultado-13').innerHTML = `
        <div class="result-card result-card--warning">
            <div class="result-center">
                <p class="result-label">Total Líquido do 13º:</p>
                <h2 class="result-value result-value--warning">R$ ${totalLiquido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
            </div>
            <div class="result-stack">
                <div class="result-row"><span>1ª Parcela (Nov):</span> <b>R$ ${primeiraParcela.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div>
                <div class="result-row"><span>2ª Parcela (Dez):</span> <b>R$ ${segundaParcela.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div>
            </div>
        </div>
    `;
    if(document.getElementById('btn-whatsapp')) document.getElementById('btn-whatsapp').style.display = 'flex';
}

// 8. FunÃ§Ã£o de Compartilhamento
function compartilharWhatsApp() {
    const urlPagina = window.location.href;
    const resultado = document.querySelector('#resultado h2, #resultado-salario h2, #resultado-13 h2')?.innerText || "";
    let saudacao = isInternational ? "Check out this financial calculator: " : "Olha que legal essa calculadora financeira: ";
    if(resultado) saudacao = isInternational ? `My result was ${resultado}. Check yours here: ` : `Meu resultado deu ${resultado}. FaÃ§a o seu aqui: `;
    const mensagem = encodeURIComponent(saudacao + urlPagina);
    const linkZap = "https://api.whatsapp.com/send?text=" + mensagem;
    window.open(linkZap, "_blank");
}

// 9. Alternador de Idioma Manual (BotÃ£o)
document.getElementById('toggle-language')?.addEventListener('click', function(e) {
    e.preventDefault();
    const isEnglish = this.innerText === "English Version" || this.innerText === "English";
    this.innerText = isEnglish ? "VersÃ£o em PortuguÃªs" : "English Version";
    
    const title = document.getElementById('page-title');
    if (title) {
        title.innerText = isEnglish ? "General Terms and Conditions" : "Termos e CondiÃ§Ãµes Gerais";
    }
    
    const content = document.getElementById('page-content');
    if (content && isEnglish) {
        content.innerHTML = "<p>Welcome to our terms page. By using our tool, you agree to our conditions...</p>";
    }
});
