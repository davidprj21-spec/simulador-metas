// Função para carregar o Header (Menu)
function loadHeader() {
    const isSubFolder = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/calculadora');
    const path = isSubFolder ? '../' : './';

    const headerHTML = `
    <nav class="site-nav">
        <a href="${path}index.html" class="site-nav__link"> Metas</a>
        <a href="javascript:void(0)" onclick="carregarPagina('salario-liquido')" class="site-nav__link"> Salário</a>
        <a href="javascript:void(0)" onclick="carregarPagina('13-salario')" class="site-nav__link"> 13º Salário</a>
        <a href="javascript:void(0)" onclick="carregarPagina('blog')" class="site-nav__link"> Blog</a>
    </nav>
    `;
    const headerElement = document.getElementById('universal-header');
    if (headerElement) headerElement.innerHTML = headerHTML;
}

// Função para carregar o Footer (Rodapé)
function loadFooter() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-links">
            <a href="javascript:void(0)" onclick="carregarPagina('sobre')" class="footer-link">Sobre</a> |
            <a href="javascript:void(0)" onclick="carregarPagina('faq')" class="footer-link">Faq</a> |
            <a href="javascript:void(0)" onclick="carregarPagina('politica')" class="footer-link">Politica</a> | 
            <a href="javascript:void(0)" onclick="carregarPagina('termos')" class="footer-link">Termos</a>
        </div>
        <p>&copy; 2026 <strong>Simulador de Metas</strong></p>
    </footer>
    `;
    const footerElement = document.getElementById('universal-footer');
    if (footerElement) footerElement.innerHTML = footerHTML;
}

// Carrega tudo ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    
    // IMPORTANTE: Se estiver na index, carrega a calculadora automaticamente
    if (document.getElementById('conteudo-dinamico')) {
        carregarPagina('home'); 
    }
});

function carregarPagina(nomeDaPagina) {
    const alvo = document.getElementById('conteudo-dinamico');
    if (!alvo) return; // Segurança caso a div não exista
    
    // Efeito visual de carregamento
    alvo.style.opacity = '0.5';

    fetch(`paginas/${nomeDaPagina}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Arquivo não encontrado");
            return response.text();
        })
        .then(html => {
            alvo.innerHTML = html;
            alvo.style.opacity = '1';
            window.scrollTo(0, 0);

            // Re-executa as taxas se voltarmos para a home
            if (nomeDaPagina === 'home' && typeof carregarTaxas === 'function') {
                carregarTaxas();
            }
        })
        .catch(err => {
            console.error(err);
            alvo.innerHTML = "<div class='page-card'><p style='color:red'>Erro ao carregar conteúdo. Verifique a pasta 'paginas'.</p></div>";
            alvo.style.opacity = '1';
        });
}

// Função Mestre para trocar idiomas em qualquer página carregada
function trocarIdioma(lang, prefixo) {
    // Esconde todos os blocos e reseta botões
    const pt = document.getElementById(prefixo + '-pt');
    const en = document.getElementById(prefixo + '-en');
    const btnPt = document.getElementById('btn-' + prefixo + '-pt');
    const btnEn = document.getElementById('btn-' + prefixo + '-en');

    if (lang === 'pt') {
        if(pt) pt.style.display = 'block';
        if(en) en.style.display = 'none';
        if(btnPt) { btnPt.style.background = '#3483fa'; btnPt.style.color = 'white'; }
        if(btnEn) { btnEn.style.background = '#f5f5f5'; btnEn.style.color = '#666'; }
    } else {
        if(pt) pt.style.display = 'none';
        if(en) en.style.display = 'block';
        if(btnEn) { btnEn.style.background = '#3483fa'; btnEn.style.color = 'white'; }
        if(btnPt) { btnPt.style.background = '#f5f5f5'; btnPt.style.color = '#666'; }
    }
}