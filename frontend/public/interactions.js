//MENU DESPLEGABLE

        // Función para mostrar/ocultar el menú
        function toggleDropdown() {
            document.getElementById("myDropdown").classList.toggle("show");
        }

        // Cierra el menú si el usuario hace clic fuera de él
        window.onclick = function(event) {
            if (!event.target.matches('.dropdown-button')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

//SLIDER DE IMAGENES
document.addEventListener('DOMContentLoaded', () => {
            const slider = document.getElementById('slider');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const dotsContainer = document.getElementById('dots-container');
            const slides = document.querySelectorAll('.slide');
            const totalSlides = slides.length;
            let currentSlide = 0;
            let intervalId;

            // Función para actualizar el slider
            const updateSlider = () => {
                slider.style.transform = `translateX(${-currentSlide * 100}%)`;
                updateDots();
            };

            // Función para actualizar los puntos indicadores
            const updateDots = () => {
                dotsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    }
                    dot.addEventListener('click', () => {
                        currentSlide = index;
                        updateSlider();
                        resetInterval();
                    });
                    dotsContainer.appendChild(dot);
                });
            };

            // Función para ir a la siguiente imagen
            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            };

            // Función para ir a la imagen anterior
            const prevSlide = () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            };

            // Función para reiniciar el intervalo del slider automático
            const resetInterval = () => {
                clearInterval(intervalId);
                intervalId = setInterval(nextSlide, 3000); // Cambia de imagen cada 3 segundos
            };

            // Eventos para los botones
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });

            // Iniciar el slider
            updateSlider();
            resetInterval();

            // Pausar el slider al pasar el mouse sobre él
            document.querySelector('.slider-container').addEventListener('mouseenter', () => {
                clearInterval(intervalId);
            });
            document.querySelector('.slider-container').addEventListener('mouseleave', () => {
                resetInterval();
            });
        });
//TERMINA SLIDER DE IMAGENES

