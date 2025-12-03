
// Variáveis globais
let currentSlide = 0;
let desktopSlides = document.querySelectorAll('.hero-slider .slide');
let mobileSlides = document.querySelectorAll('.hero-slider-mobile .slide');
let slideInterval;

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initDisclaimer();
    initNavigation();
    initGallery();
    initSlider();
    initScrollEffects();
    initForm();
});

// Disclaimer Modal
function initDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    const enterBtn = document.getElementById('enter-btn');
    const exitBtn = document.getElementById('exit-btn');

    // Mostrar modal ao carregar a página
    modal.style.display = 'flex';

    // Botão Entrar
    enterBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startSlider();
    });

    // Botão Sair
    exitBtn.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });

    // Impedir scroll quando modal está aberto
    document.body.style.overflow = 'hidden';
}

// Navegação com Menu Hambúrguer (Desktop e Mobile)
function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeMenu = document.getElementById('close-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle do menu (apenas mobile)
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.add('active');
            menuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Fechar menu com botão X
    if (closeMenu) {
        closeMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        });
    }

    // Fechar menu ao clicar fora dele (apenas mobile)
    if (navMenu) {
        navMenu.addEventListener('click', function(e) {
            if (e.target === navMenu) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Navegação ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se for um link interno (começa com #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                
                // Fechar menu mobile se estiver aberto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                    document.body.style.overflow = 'auto';
                }
                
                // Fazer scroll suave para a seção
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        }
    });
}

// Galeria - Modal de imagem
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Criar modal para visualizar imagem em tamanho maior
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <button class="close-modal" aria-label="Fechar imagem">&times;</button>
                    <img src="${this.src}" alt="${this.alt}">
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Função para fechar o modal
            function closeModal() {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (modal.parentNode) {
                        document.body.removeChild(modal);
                    }
                    document.body.style.overflow = 'auto';
                }, 300);
            }
            
            // Fechar ao clicar no botão X
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
            
            // Fechar ao clicar fora da imagem
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Fechar ao pressionar ESC
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    });
}

// Slider de Imagens
function initSlider() {
    if (isMobile()) {
        if (mobileSlides.length > 0) mobileSlides[0].classList.add('active');
    } else {
        if (desktopSlides.length > 0) desktopSlides[0].classList.add('active');
    }
}

function startSlider() {
    const slides = isMobile() ? mobileSlides : desktopSlides;
    if (slides.length <= 1) return;

    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Trocar slide a cada 5 segundos
}

function changeSlide(direction) {
    const slides = isMobile() ? mobileSlides : desktopSlides;
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    slides[currentSlide].classList.add('active');
    
    // Reiniciar o timer automático
    clearInterval(slideInterval);
    startSlider();
}

function nextSlide() {
    changeSlide(1);
}

function prevSlide() {
    changeSlide(-1);
}

// Efeitos de Scroll
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animação de fade-in para seções
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Formulário de Contato
function initForm() {
    const form = document.querySelector('.booking-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(form);
            const data = {};
            
            // Converter FormData para objeto
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validação básica
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                } else {
                    field.style.borderColor = '#d4af37';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simular envio do formulário
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simular delay de envio
            setTimeout(() => {
                alert('Message sent successfully! I will contact you soon.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preloader (opcional)
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
}

// Controles de teclado para o slider
document.addEventListener('keydown', function(e) {
    const navMenu = document.getElementById('nav-menu');
    
    // Não interferir com navegação se menu estiver aberto
    if (navMenu && navMenu.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Pausar slider quando mouse está sobre ele
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
        startSlider();
    });
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 480;
}

// Ajustar comportamento baseado no dispositivo
window.addEventListener('resize', debounce(() => {
    // Reajustar elementos se necessário
}, 250));
