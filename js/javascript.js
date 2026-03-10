// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const magicButton = document.getElementById('magicButton');
    const mainTitle = document.querySelector('h1');
    const tags = document.querySelectorAll('.fact-tag');
    
    // ===== ELEMENTOS DEL DISCO Y AUDIO =====
    const disk = document.getElementById('disk');
    
    // Creamos el elemento de audio
    const backgroundMusic = new Audio();
    backgroundMusic.src = 'audio/background-music.mp3'; 
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusic.preload = 'auto';
    
    // Estado del reproductor
    let isPlaying = false;
    let audioInitialized = false;
    let fadeInterval = null;
    
    /**
     * FUNCIÓN: Mostrar tooltip temporal
     */
    function showTooltip(message, duration = 3000) {
        // Crear tooltip si no existe
        let tooltip = document.querySelector('.disk-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'disk-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.style.opacity = '1';
        
        // Posicionar cerca del disco
        const diskRect = disk.getBoundingClientRect();
        tooltip.style.top = diskRect.bottom + 10 + 'px';
        tooltip.style.right = (window.innerWidth - diskRect.right - 10) + 'px'; // Ajustado
        
        // Ocultar después de X segundos
        setTimeout(() => {
            tooltip.style.opacity = '0';
        }, duration);
    }
    
    /**
     * FUNCIÓN: Inicializar audio (primera interacción)
     */
    function initializeAudio() {
        if (audioInitialized) return;
        
        audioInitialized = true;
        isPlaying = true;
        
        // Quitamos la clase paused si la tenía
        disk.classList.remove('paused');
        
        // Iniciamos reproducción con fade in
        backgroundMusic.volume = 0;
        backgroundMusic.play()
            .then(() => {
                fadeIn(1500);
                console.log('%c🎵 Música activada', 'color: #451952');
            })
            .catch(e => {
                console.log('Error al reproducir:', e);
                // Si falla, reintentamos con interacción más fuerte
                audioInitialized = false;
                showTooltip('🔊 Haz click de nuevo para activar la música', 4000);
            });
    }
    
    /**
     * FUNCIÓN: Fade In del audio
     */
    function fadeIn(duration = 1000) {
        if (fadeInterval) clearInterval(fadeInterval);
        
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = 0.3 / steps;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep <= steps) {
                backgroundMusic.volume = volumeStep * currentStep;
            } else {
                clearInterval(fadeInterval);
                fadeInterval = null;
            }
        }, stepTime);
    }
    
    /**
     * FUNCIÓN: Fade Out del audio
     */
    function fadeOut(duration = 1000) {
        if (fadeInterval) clearInterval(fadeInterval);
        
        const steps = 20;
        const stepTime = duration / steps;
        const initialVolume = backgroundMusic.volume;
        const volumeStep = initialVolume / steps;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep <= steps) {
                backgroundMusic.volume = initialVolume - (volumeStep * currentStep);
            } else {
                clearInterval(fadeInterval);
                fadeInterval = null;
                backgroundMusic.pause();
                backgroundMusic.volume = 0.3;
            }
        }, stepTime);
    }
    
    /**
     * INICIALIZACIÓN: Mostramos tooltip y preparamos el disco
     */
    if (disk) {
        // Mostramos tooltip amigable al cargar
        setTimeout(() => {
            showTooltip('💿 Haz click en el disco para activar la música', 4000);
        }, 500);
        
        // Click en el disco
        disk.addEventListener('click', function() {
            // Si el audio no está inicializado, lo iniciamos
            if (!audioInitialized) {
                initializeAudio();
                return;
            }
            
            // Si ya está inicializado, toggle normal
            if (isPlaying) {
                fadeOut(800);
                disk.classList.add('paused');
                disk.src = 'images/disk-muted.png';
                isPlaying = false;
            } else {
                fadeIn(800);
                disk.classList.remove('paused');
                disk.src = 'images/disk.png';
                isPlaying = true;
            }
        });
    }
    
    // ===== RESTO DE FUNCIONALIDADES =====
    let magiaActivada = false;

    /**
     * FUNCIÓN 1: Botón mágico
     */
    if (magicButton) {
        magicButton.addEventListener('click', function() {
            if (!magiaActivada) {
                mainTitle.innerHTML = '✨ Hola, soy <span class="highlight">Tu Nombre</span> ✨';
                magicButton.textContent = '↯ magia activada';
                magiaActivada = true;
                
                mainTitle.style.transition = 'text-shadow 0.3s ease';
                mainTitle.style.textShadow = '0 0 15px #451952';
                
                setTimeout(() => {
                    mainTitle.style.textShadow = 'none';
                }, 1000);
                
            } else {
                mainTitle.innerHTML = 'Hola, soy <span class="highlight">Tu Nombre</span>';
                magicButton.textContent = '↯ pulse para magia';
                magiaActivada = false;
            }
        });
    }

    /**
     * FUNCIÓN 2: Tags interactivos
     */
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            
            let mensaje = '';
            if (tagText.includes('🎧')) {
                mensaje = '🎵 Mi banda sonora: desde jazz hasta metal, siempre hay música de fondo';
            } else if (tagText.includes('☕')) {
                mensaje = '☕ Fun fact: puedo identificar un buen espresso solo por el olor... y tomo demasiados';
            } else if (tagText.includes('🌙')) {
                mensaje = '🌙 Mi cerebro funciona mejor después de las 22:00, no pregunten por qué';
            } else if (tagText.includes('📚')) {
                mensaje = '📚 Último libro: "El hombre en busca de sentido". Recomendado 100%';
            } else if (tagText.includes('🧩')) {
                mensaje = '🧩 Me encanta resolver problemas, especialmente si son tipo puzzle o lógica';
            } else {
                mensaje = `✨ "${tagText}" es parte de mi esencia`;
            }
            
            alert(mensaje);
            
            this.style.backgroundColor = '#451952';
            this.style.color = '#0a0a0a';
            
            setTimeout(() => {
                this.style.backgroundColor = '#1e1e1e';
                this.style.color = '#451952';
            }, 300);
        });
        
        tag.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    /**
     * FUNCIÓN 3: Consola amigable
     */
    console.log('%c✨ Hey! Bienvenido a mi portfolio ✨', 'color: #451952; font-size: 16px; font-weight: bold;');
    console.log('%cExplora el código, todo está hecho con ❤️ y ☕', 'color: #a0a0a0; font-size: 14px;');
    console.log('%c💿 El disco mágico controla la música... Haz click en él', 'color: #451952; font-size: 12px;');
});