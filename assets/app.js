/* ==========================================================================
   HP EliteBook 845 G8 - Documentation Portal Client-Side Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const docContent = document.getElementById('docContent');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentDocTitle = document.getElementById('currentDocTitle');
    const themeToggle = document.getElementById('themeToggle');
    const themeText = document.getElementById('themeText');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Configuración de Marked.js
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (__) {}
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // 1. Gestión de Tema (Oscuro / Claro)
    const savedTheme = localStorage.getItem('hp-theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeText.textContent = 'Modo Oscuro';
            localStorage.setItem('hp-theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            themeText.textContent = 'Modo Claro';
            localStorage.setItem('hp-theme', 'dark');
        }
    }

    // 2. Control de Menú Móvil
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // 3. Carga Dinámica de Documentos (.md)
    function getFileFromHash() {
        const hash = window.location.hash.replace('#', '');
        return hash || 'README.md';
    }

    async function loadDocument(filePath) {
        // Mostrar spinner de carga
        docContent.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Cargando ${filePath}...</p>
            </div>
        `;

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo (${response.status})`);
            }

            const markdownText = await response.text();
            
            // Convertir Markdown a HTML
            let htmlContent = marked.parse(markdownText);

            // Interceptar enlaces a otros archivos .md locales para convertirlos en navegación Hash SPA
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            const links = tempDiv.querySelectorAll('a');
            links.forEach(a => {
                const href = a.getAttribute('href');
                if (href && (href.endsWith('.md') || href.includes('.md#'))) {
                    // Limpiar rutas como ./OPTIMIZACIONES.md o file:///...
                    const cleanFileName = href.split('/').pop();
                    a.setAttribute('href', `#${cleanFileName}`);
                }
            });

            // Insertar contenido final
            docContent.innerHTML = tempDiv.innerHTML;

            // Re-ejecutar resaltado de sintaxis
            docContent.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // Actualizar interfaz y navegación activa
            updateActiveNavLink(filePath);

        } catch (error) {
            docContent.innerHTML = `
                <div class="loading-spinner" style="color: #ef4444;">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="margin-top:12px; color:var(--text-primary);">Error al cargar documento</h3>
                    <p style="font-size:0.9rem;">${error.message}</p>
                </div>
            `;
        }
    }

    function updateActiveNavLink(filePath) {
        navLinks.forEach(link => {
            const linkFile = link.getAttribute('data-file');
            if (linkFile === filePath) {
                link.classList.add('active');
                currentDocTitle.textContent = link.querySelector('span').textContent;
            } else {
                link.classList.remove('active');
            }
        });

        // Cerrar menú móvil si está abierto
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Escuchar cambios de Hash en la URL
    window.addEventListener('hashchange', () => {
        loadDocument(getFileFromHash());
    });

    // Carga inicial
    loadDocument(getFileFromHash());
});
