document.addEventListener('DOMContentLoaded', () => {
    // Navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.doc-section');
    
    function highlightNav() {
        const scrollPos = window.scrollY;
        
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos < bottom) {
                link?.classList.add('active');
            } else {
                link?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    
    // Search functionality
    const searchInput = document.getElementById('search');
    const content = document.querySelector('.content');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sections = content.querySelectorAll('.doc-section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
    
    // Mobile navigation
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.innerHTML = '☰';
    document.body.appendChild(menuButton);
    
    menuButton.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    });
    
    // Code highlighting
    Prism.highlightAll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Theme switcher functionality
    function initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme based on user preference
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeButton('light');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeButton(newTheme === 'dark' ? 'light' : 'dark');
        });
    }
    
    function updateThemeButton(mode) {
        const button = document.getElementById('theme-toggle');
        const icon = mode === 'dark' ? '🌙' : '☀️';
        const text = mode === 'dark' ? 'Dark Mode' : 'Light Mode';
        
        button.innerHTML = `
            <span class="icon">${icon}</span>
            <span class="text">${text}</span>
        `;
    }
    
    // Initialize theme when DOM is loaded
    initializeTheme();
});

// Add copy button to code blocks
document.querySelectorAll('pre code').forEach((block) => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
    
    const container = block.parentElement;
    container.style.position = 'relative';
    container.appendChild(button);
}); 