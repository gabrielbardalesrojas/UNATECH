/*===========================
    INICIALIZACIÓN
=============================*/
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Remover preloader
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Scroll y Navegación
    setupScrolling();
    
    // Menú móvil
    setupMobileMenu();
    
    // Contador de estadísticas
    setupCounters();
    
    // Filtro de proyectos
    setupProjectFilters();
    
    // Testimonios slider
    setupTestimonialSlider();
    
    // FAQ Accordion
    setupFaqAccordion();
    
    // Configuración de seguridad
    setupSecurity();
    
    // Configurar newsletter (versión estática)
    setupNewsletter();
    
    // Configurar efecto header al hacer scroll
    setupHeaderEffect();
    
    // Configurar botón volver arriba
    setupBackToTop();
});

/*===========================
    SCROLL SUAVE
=============================*/
function setupScrolling() {
    // Enlaces internos con scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const navlinks = document.querySelector('.navlinks');
                const menuBtn = document.querySelector('.menu-btn');
                if (navlinks.classList.contains('active')) {
                    navlinks.classList.remove('active');
                    menuBtn.classList.remove('open');
                }
            }
        });
    });
    
    // Activar enlace de navegación según la sección visible
    const navLinks = document.querySelectorAll('.navlink');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const navHeight = document.querySelector('#header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/*===========================
    MENÚ MÓVIL
=============================*/
function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navlinks = document.querySelector('.navlinks');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('open');
            navlinks.classList.toggle('active');
        });
    }
}

/*===========================
    ANIMACIÓN DE CONTADORES
=============================*/
function setupCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    function startCounting() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const count = parseInt(counter.innerText);
            const speed = 200; // Velocidad de la animación (menor = más rápido)
            
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(startCounting, 10);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Iniciar conteo cuando sea visible
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounting();
                observer.unobserve(counterSection);
            }
        }, { threshold: 0.3 });
        
        observer.observe(counterSection);
    }
}

/*===========================
    FILTRO DE PROYECTOS
=============================*/
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase activa de todos los botones
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase activa al botón cliqueado
                this.classList.add('active');
                
                // Obtener categoría del botón
                const filterValue = this.getAttribute('data-filter');
                
                // Filtrar proyectos
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        
                        // Agregar animación al mostrar
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                            card.style.opacity = '1';
                        }, 100);
                    } else {
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            
                            // Agregar animación al mostrar
                            setTimeout(() => {
                                card.style.transform = 'translateY(0)';
                                card.style.opacity = '1';
                            }, 100);
                        } else {
                            card.style.transform = 'translateY(20px)';
                            card.style.opacity = '0';
                            
                            // Ocultar después de animación
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });
    }
}

/*===========================
    SLIDER DE TESTIMONIOS
=============================*/
function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (slider && prevBtn && nextBtn) {
        const cardWidth = slider.querySelector('.testimonial-card').offsetWidth + 32; // ancho + gap
        
        // Botón siguiente
        nextBtn.addEventListener('click', function() {
            slider.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        });
        
        // Botón anterior
        prevBtn.addEventListener('click', function() {
            slider.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        });
        
        // Desplazamiento automático cada 5 segundos
        let autoScroll = setInterval(function() {
            if (!isInViewport(slider)) return;
            
            // Si el scroll está en el final, volver al inicio
            if (slider.scrollLeft >= slider.scrollWidth - slider.offsetWidth - 10) {
                slider.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                slider.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            }
        }, 5000);
        
        // Detener scroll automático al interactuar
        slider.addEventListener('mouseenter', function() {
            clearInterval(autoScroll);
        });
        
        slider.addEventListener('mouseleave', function() {
            autoScroll = setInterval(function() {
                if (!isInViewport(slider)) return;
                
                if (slider.scrollLeft >= slider.scrollWidth - slider.offsetWidth - 10) {
                    slider.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    slider.scrollBy({
                        left: cardWidth,
                        behavior: 'smooth'
                    });
                }
            }, 5000);
        });
    }
}

// Verificar si un elemento está visible en la pantalla
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/*===========================
    FAQ ACCORDION
=============================*/
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Cerrar todos los accordions
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Si no estaba activo, abrir el actual
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // Abrir primer accordion por defecto
        faqItems[0].classList.add('active');
    }
}

/*===========================
    CONFIGURACIÓN DE SEGURIDAD
=============================*/
function setupSecurity() {
    // Prevenir inspección con F12 y Ctrl+Shift+I
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevenir clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevenir selección de texto (código fuente)
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevenir ver código fuente
    document.onkeydown = function(e) {
        if (e.ctrlKey && 
            (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 123)) {
            return false;
        }
    };
}

/*===========================
    CONFIGURACIÓN NEWSLETTER (ESTÁTICO)
=============================*/
function setupNewsletter() {
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const newsletterInput = document.querySelector('.newsletter-input');
    
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterInput.value.trim();
            
            if (email === '') {
                showToast('Por favor, ingresa tu correo electrónico');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Por favor, ingresa un correo electrónico válido');
                return;
            }
            
            showToast('¡Gracias por suscribirte! Recibirás nuestras novedades.');
            newsletterInput.value = '';
        });
    }
}

// Validar email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Mostrar notificación toast
function showToast(message) {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Aplicar estilos
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'var(--dark-color)';
    toast.style.color = 'var(--light-color)';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = 'var(--border-radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    
    // Añadir al DOM
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/*===========================
    HEADER AL HACER SCROLL
=============================*/
function setupHeaderEffect() {
    const header = document.getElementById('header');
    const navbar = header.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/*===========================
    BOTÓN VOLVER ARRIBA
=============================*/
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}