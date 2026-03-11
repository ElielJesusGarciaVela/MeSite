// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const magicButton = document.getElementById('magicButton');
    const mainTitle = document.querySelector('h1');
    const tags = document.querySelectorAll('.fact-tag');
    
    // ===== ELEMENTOS DEL DISCO Y AUDIO =====
    const disk = document.getElementById('disk');
    
    // ===== PLAYLIST ALEATORIA =====
    const playlist = [
        'audio/ZZZ_OST_Fantasy-Serenity.mp3', 'audio/ZZZ_OST_Fantasy.mp3','audio/19.mp3'
    ];
    
    let availableSongs = [];
    let currentAudio = null;
    
    /**
     * FUNCIÓN: Inicializar o reiniciar la lista de canciones disponibles
     */
    function resetPlaylist() {
        availableSongs = [...playlist];
    }
    
    /**
     * FUNCIÓN: Obtener una canción aleatoria sin repetir
     */
    function getRandomSong() {
        if (availableSongs.length === 0) {
            resetPlaylist();
            console.log('%c🔄 Playlist reiniciada', 'color: #E1FF00; font-size: 12px;');
        }
        
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        const selectedSong = availableSongs[randomIndex];
        availableSongs.splice(randomIndex, 1);
        
        return selectedSong;
    }
    
    /**
     * FUNCIÓN: Crear nuevo elemento de audio con una canción aleatoria
     */
    function createNewAudio() {
        const audio = new Audio();
        audio.src = getRandomSong();
        audio.volume = 0.3;
        audio.preload = 'auto';
        
        audio.addEventListener('ended', function() {
            console.log('%c⏭️ Siguiente canción...', 'color: #E1FF00; font-size: 12px;');
            playNextSong();
        });
        
        return audio;
    }
    
    /**
     * FUNCIÓN: Reproducir siguiente canción
     */
    function playNextSong() {
        if (!isPlaying) return;
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
        }
        
        currentAudio = createNewAudio();
        
        if (fadeInterval) clearInterval(fadeInterval);
        currentAudio.volume = 0;
        currentAudio.play().catch(e => console.log("Error al reproducir:", e));
        
        const steps = 20;
        const stepTime = 1000 / steps;
        const volumeStep = 0.3 / steps;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep <= steps && currentAudio) {
                currentAudio.volume = volumeStep * currentStep;
            } else {
                clearInterval(fadeInterval);
                fadeInterval = null;
            }
        }, stepTime);
        
        const songName = currentAudio.src.split('/').pop();
        console.log('%c🎵 Reproduciendo: ' + songName, 'color: #E1FF00; font-size: 12px;');
    }
    
    // Estado del reproductor
    let isPlaying = true;
    let fadeInterval = null;
    
    /**
     * FUNCIÓN: Fade Out y pausa
     */
    function fadeOut(duration = 800) {
        if (fadeInterval) clearInterval(fadeInterval);
        
        if (!currentAudio) return;
        
        const steps = 20;
        const stepTime = duration / steps;
        const initialVolume = currentAudio.volume;
        const volumeStep = initialVolume / steps;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep <= steps && currentAudio) {
                currentAudio.volume = initialVolume - (volumeStep * currentStep);
            } else {
                clearInterval(fadeInterval);
                fadeInterval = null;
                if (currentAudio) {
                    currentAudio.pause();
                }
            }
        }, stepTime);
    }
    
    /**
     * FUNCIÓN: Iniciar reproducción (primera vez)
     */
    function startPlayback() {
        resetPlaylist();
        playNextSong();
    }
    
    /**
     * INICIALIZACIÓN
     */
    if (disk) {
        startPlayback();
        
        disk.addEventListener('click', function() {
            if (isPlaying) {
                fadeOut(800);
                disk.classList.add('paused');
                disk.src = 'images/note_muted.png';
                isPlaying = false;
            } else {
                disk.classList.remove('paused');
                disk.src = 'images/note.png';
                isPlaying = true;
                
                if (!currentAudio || currentAudio.paused) {
                    playNextSong();
                } else {
                    if (fadeInterval) clearInterval(fadeInterval);
                    currentAudio.volume = 0;
                    currentAudio.play().catch(e => console.log("Error al reproducir:", e));
                    
                    const steps = 20;
                    const stepTime = 800 / steps;
                    const volumeStep = 0.3 / steps;
                    let currentStep = 0;
                    
                    fadeInterval = setInterval(() => {
                        currentStep++;
                        if (currentStep <= steps && currentAudio) {
                            currentAudio.volume = volumeStep * currentStep;
                        } else {
                            clearInterval(fadeInterval);
                            fadeInterval = null;
                        }
                    }, stepTime);
                }
            }
        });
    }
    
    // ===== RESTO DE FUNCIONALIDADES =====
    let magiaActivada = false;

    if (magicButton) {
        magicButton.addEventListener('click', function() {
            if (!magiaActivada) {
                mainTitle.innerHTML = '✨ Hola, soy <span class="highlight">Tu Nombre</span> ✨';
                magicButton.textContent = '↯ magia activada';
                magiaActivada = true;
                
                mainTitle.style.transition = 'text-shadow 0.3s ease';
                mainTitle.style.textShadow = '0 0 15px #E1FF00';
                
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
            
            this.style.backgroundColor = '#E1FF00';
            this.style.color = '#000000';
            
            setTimeout(() => {
                this.style.backgroundColor = '#1e1e1e';
                this.style.color = '#E1FF00';
            }, 300);
        });
        
        tag.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    console.log('%c✨ Hey! Bienvenido a mi portfolio ✨', 'color: #E1FF00; font-size: 16px; font-weight: bold;');
    console.log('%cExplora el código, todo está hecho con ❤️ y ☕', 'color: #CCCCCC; font-size: 14px;');
    console.log('%c💿 Playlist aleatoria - Sin repeticiones hasta reiniciar', 'color: #E1FF00; font-size: 12px;');

    document.addEventListener('click', function initAudio() {
        if ((!currentAudio || currentAudio.paused) && isPlaying) {
            playNextSong();
            document.removeEventListener('click', initAudio);
        }
    }, { once: true });

    /*  ============= TYPEWRITER EFFECT =============== */
    
    /**
     * FUNCIÓN: Efecto de máquina de escribir
     */
    const typewriterElement = document.getElementById('typewriterText');
    const phrases = [
        "Coming Soon...",
        "Under Construction...",
        "Come back another day..."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Borrando caracteres
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            // Si ya borró todo, cambia a la siguiente frase
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                // Pequeña pausa antes de escribir la siguiente
                setTimeout(typeWriter, 500);
                return;
            }
        } else {
            // Escribiendo caracteres
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            // Si terminó de escribir, espera y luego empieza a borrar
            if (charIndex === currentPhrase.length) {
                isWaiting = true;
                setTimeout(() => {
                    isDeleting = true;
                    isWaiting = false;
                    typeWriter();
                }, 2000); // Espera 2 segundos antes de borrar
                return;
            }
        }
        
        // Velocidad de escritura/borrado
        const typingSpeed = isDeleting ? 50 : 100; // Borra más rápido que escribe
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Iniciar el efecto
    if (typewriterElement) {
        setTimeout(typeWriter, 1000); // Pequeño delay inicial
    }
});