const defaultImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop'
];


class Slider {
    constructor(options = {}) {
        
        this.container = document.querySelector(options.container || '#slider-container');
        this.track = this.container.querySelector('.slider-track');
        this.arrowsContainer = this.container.querySelector('.slider-arrows');
        this.dotsContainer = this.container.querySelector('.slider-dots');
        
        this.images = options.images || defaultImages;
        this.transitionSpeed = options.transitionSpeed || 500;
        this.autoplay = options.autoplay !== undefined ? options.autoplay : true;
        this.showArrows = options.showArrows !== undefined ? options.showArrows : true;
        this.showDots = options.showDots !== undefined ? options.showDots : true;
        this.autoplayInterval = options.autoplayInterval || 3000;
        
        this.currentSlide = 0;
        this.slidesCount = this.images.length;
        this.isPaused = false;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        this.createSlides();
        
        this.updateControlsVisibility();
        
        this.track.style.transitionDuration = `${this.transitionSpeed}ms`;
        
        this.setupEventListeners();
        
        this.goToSlide(0);
        
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
    
    createSlides() {
        this.track.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `Слайд ${index + 1}`;
            
            slide.appendChild(img);
            this.track.appendChild(slide);
        });
        
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.slidesCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.index = i;
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        const prevButton = this.container.querySelector('.arrow-left');
        const nextButton = this.container.querySelector('.arrow-right');
        
        prevButton.addEventListener('click', () => this.prevSlide());
        nextButton.addEventListener('click', () => this.nextSlide());
        
        this.container.addEventListener('mouseenter', () => {
            if (this.autoplay) {
                this.pauseAutoplay();
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (this.autoplay && this.isPaused) {
                this.resumeAutoplay();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    updateControlsVisibility() {
        if (this.showArrows) {
            this.arrowsContainer.classList.remove('hidden');
        } else {
            this.arrowsContainer.classList.add('hidden');
        }
        
        if (this.showDots) {
            this.dotsContainer.classList.remove('hidden');
        } else {
            this.dotsContainer.classList.add('hidden');
        }
    }
    
    goToSlide(index) {
        if (index < 0) {
            index = this.slidesCount - 1;
        } else if (index >= this.slidesCount) {
            index = 0;
        }
        
        this.currentSlide = index;
        
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            if (i === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.autoplayInterval);
    }
    
    pauseAutoplay() {
        this.isPaused = true;
    }
    
    resumeAutoplay() {
        this.isPaused = false;
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
    }
    
    updateSettings(settings) {
        if (settings.transitionSpeed !== undefined) {
            this.transitionSpeed = settings.transitionSpeed;
            this.track.style.transitionDuration = `${this.transitionSpeed}ms`;
        }
        
        if (settings.autoplay !== undefined) {
            this.autoplay = settings.autoplay;
            
            if (this.autoplayTimer) {
                this.stopAutoplay();
            }
            
            if (this.autoplay) {
                this.startAutoplay();
            }
        }
        
        if (settings.showArrows !== undefined) {
            this.showArrows = settings.showArrows;
        }
        
        if (settings.showDots !== undefined) {
            this.showDots = settings.showDots;
        }
        
        this.updateControlsVisibility();
    }
    
    updateSlider(options) {
        if (this.autoplayTimer) {
            this.stopAutoplay();
        }
        
        if (options.images) {
            this.images = options.images;
            this.slidesCount = this.images.length;
        }
        
        this.updateSettings(options);
        
        this.createSlides();
        
        this.goToSlide(0);
        
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = new Slider();
    
    const transitionSpeedInput = document.getElementById('transition-speed');
    const autoplayCheckbox = document.getElementById('autoplay-checkbox');
    const showArrowsCheckbox = document.getElementById('show-arrows-checkbox');
    const showDotsCheckbox = document.getElementById('show-dots-checkbox');
    const applySettingsButton = document.getElementById('apply-settings');
    
    applySettingsButton.addEventListener('click', () => {
        const settings = {
            transitionSpeed: parseInt(transitionSpeedInput.value) || 500,
            autoplay: autoplayCheckbox.checked,
            showArrows: showArrowsCheckbox.checked,
            showDots: showDotsCheckbox.checked
        };
        
        slider.updateSettings(settings);
    });
});