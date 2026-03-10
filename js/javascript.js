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
    backgroundMusic.src = 'audio/ZZZ_OST_Fantasy-Serenity.mp3'; 
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    backgroundMusic.preload = 'auto';
    
    // Estado del reproductor
    let isPlaying = true; // Por defecto, la música empieza sonando
    let fadeInterval = null;
    
    /**
     * FUNCIÓN: Fade In del audio
     */
    function fadeIn(duration = 1000) {
        if (fadeInterval) clearInterval(fadeInterval);
        
        backgroundMusic.volume = 0;
        backgroundMusic.play().catch(e => console.log("Error al reproducir:", e));
        
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
     * INICIALIZACIÓN: Empezamos con música y disco girando
     */
    if (disk) {
        // Intentamos reproducir (los navegadores pueden bloquear autoplay)
        fadeIn(1500);
        
        // Click en el disco
        disk.addEventListener('click', function() {
            if (isPlaying) {
                // Parar música
                fadeOut(800);
                disk.classList.add('paused');
                disk.src = 'images/disk-muted.png';
                isPlaying = false;
            } else {
                // Reanudar música
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
    console.log('%c💿 El disco mágico controla la música...', 'color: #451952; font-size: 12px;');

    /**
     * FUNCIÓN 4: Manejamos posible bloqueo de autoplay
     */
    document.addEventListener('click', function initAudio() {
        // Si el audio no ha empezado por autoplay, intentamos con el primer click en cualquier parte
        if (backgroundMusic.paused && isPlaying) {
            fadeIn(1500);
            document.removeEventListener('click', initAudio);
        }
    }, { once: true });
});