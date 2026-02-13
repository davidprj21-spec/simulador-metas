// Função para carregar o Header (Menu)
function loadHeader() {
    const isSubFolder = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/calculadora');
    const path = isSubFolder ? '../' : './';

    const headerHTML = `
    <nav class="site-nav menu-container">
        <a href="javascript:void(0)" onclick="carregarPagina('home')" class="menu-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="#4db8ff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
        <span class="menu-text">METAS</span>
    </a>

    <a href="javascript:void(0)" onclick="carregarPagina('salario-liquido')" class="menu-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M12 11h.01"></path><path d="M16 8h.01"></path><path d="M16 12h.01"></path><path d="M16 16h.01"></path></svg>
        <span class="menu-text">SALÁRIO</span>
    </a>

    <a href="javascript:void(0)" onclick="carregarPagina('13-salario')" class="menu-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="#f1c40f" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
        <span class="menu-text">13º SALARIO</span>
    </a>

    <a href="javascript:void(0)" onclick="carregarPagina('blog')" class="menu-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
        <span class="menu-text">BLOG</span>
    </a>
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
    if (!alvo) return; 
    
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

            // --- NOVO: COMANDO PARA RECARREGAR ANÚNCIOS ADSENSE ---
            try {
                // Isso avisa ao Google que a página mudou e ele deve buscar novos anúncios
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                // Silencioso: evita erros caso o AdSense ainda não tenha carregado o script principal
                console.log("AdSense: Aguardando inicialização ou bloco já preenchido.");
            }
            // -----------------------------------------------------

            if (nomeDaPagina === 'home' && typeof carregarTaxas === 'function') {
                carregarTaxas();
            }
        })
        .catch(err => {
            console.error(err);
            alvo.innerHTML = "<div class='page-card'><p style='color:red'>Erro ao carregar conteúdo.</p></div>";
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