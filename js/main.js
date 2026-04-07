/**
 * Main JavaScript for Land Surveyor Website
 * Handles animations, smooth scroll, and form feedback
 */

// EmailJS Configuration - Centralized for easier management
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'hp0bLAoKz-yXUGZFa',
    SERVICE_ID: 'service_106r1qm',
    TEMPLATE_ID: 'template_ujq9eskUR'
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Navbar & Parallax & Counter Trigger
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    const statsSection = document.querySelector('.bg-light'); // The section containing stats
    let counterStarted = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar effect
        if (scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = '#ffffff';
        }

        // Hero Parallax
        if (hero) {
            hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
        }

        // Stats Counter Trigger
        if (statsSection && !counterStarted) {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.2;
            if (sectionPos < screenPos) {
                startCounters();
                counterStarted = true;
            }
        }
    });

    // 4. Counter Animation Logic
    function startCounters() {
        const counters = document.querySelectorAll('.counter-value');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 16ms approx for 60fps

            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // 4. Contact Form Handling (EmailJS Integration)
    const handleEmailJSForm = (formId, statusContainerId, statusBadgeId, submitBtnId) => {
        const formElement = document.getElementById(formId);
        const statusContainer = document.getElementById(statusContainerId);
        const statusBadge = document.getElementById(statusBadgeId);
        const submitBtn = document.getElementById(submitBtnId);

        if (formElement) {
            formElement.addEventListener('submit', function (event) {
                event.preventDefault();

                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
                statusContainer.classList.add('d-none');

                // Generate a random contact number (optional, for tracking)
                this.contact_number = Math.random() * 100000 | 0;

                // Use centralized IDs from configuration
                emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, this)
                    .then(function () {
                        // Success handling
                        statusBadge.className = 'badge rounded-pill bg-success px-3 py-2';
                        statusBadge.innerHTML = '<i class="fa-solid fa-check-circle me-1"></i> Message sent successfully!';
                        statusContainer.classList.remove('d-none');
                        formElement.reset();
                    }, function (error) {
                        // Error handling
                        console.error('EmailJS Error:', error);
                        statusBadge.className = 'badge rounded-pill bg-danger px-3 py-2';
                        statusBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation me-1"></i> Failed to send message. Please try again.';
                        statusContainer.classList.remove('d-none');
                    })
                    .finally(function () {
                        // Restore button state
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Send Message';
                    });
            });
        }
    };

    // Initialize both forms
    handleEmailJSForm('contact-form-emailjs', 'form-status', 'status-badge', 'submit-btn');
    handleEmailJSForm('quote-form-emailjs', 'quote-form-status', 'quote-status-badge', 'quote-submit-btn');

    // 5. Testimonial Carousel
    const initTestimonialCarousel = () => {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const wrapper = document.querySelector('.testimonials-wrapper');
        const indicatorsContainer = document.getElementById('carouselIndicators');

        if (!testimonialCards.length || !wrapper) return;

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let autoPlayInterval;

        // Determine how many cards to show based on screen width
        function getCardsPerView() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        // Calculate max index based on cards per view
        function getMaxIndex() {
            return Math.max(0, testimonialCards.length - cardsPerView);
        }

        // Create indicator dots
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            const maxIndex = getMaxIndex();

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = `indicator-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                    resetAutoPlay();
                });
                indicatorsContainer.appendChild(dot);
            }
        }

        // Update carousel position and indicators
        function updateCarousel() {
            const maxIndex = getMaxIndex();
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

            const cardWidth = testimonialCards[0].offsetWidth;
            const gap = 24; // 1.5rem in pixels
            const translateValue = -currentIndex * (cardWidth + gap);

            wrapper.style.transform = `translateX(${translateValue}px)`;

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === maxIndex;

            // Update indicators
            document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Auto-play functionality
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                const maxIndex = getMaxIndex();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 8000); // Change testimonial every 8 seconds
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
            resetAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
            resetAutoPlay();
        });

        // Stop auto-play on hover
        wrapper.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        wrapper.addEventListener('mouseleave', () => {
            startAutoPlay();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                createIndicators();
                updateCarousel();
            }
        });

        // Initialize on page load
        createIndicators();
        updateCarousel();
        startAutoPlay();
    };

    // 6. Project Filtering Logic
    const initProjectFilters = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        if (!filterBtns.length || !projectItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hide');
                        // Re-trigger AOS
                        item.setAttribute('data-aos', 'fade-up');
                    } else {
                        item.classList.add('hide');
                    }
                });

                // Refresh AOS for visible elements
                AOS.refresh();
            });
        });
    };

    // Initialize Project Filters
    initProjectFilters();

    // 7. Copy Link Functionality for Blog
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const successMsg = document.getElementById('copySuccessMsg');
                if (successMsg) {
                    successMsg.classList.remove('d-none');
                    copyLinkBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copied!';
                    setTimeout(() => {
                        successMsg.classList.add('d-none');
                        copyLinkBtn.innerHTML = '<i class="fa-solid fa-link me-1"></i> Copy Link';
                    }, 3000);
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // Initialize carousel when DOM is ready
    setTimeout(initTestimonialCarousel, 100);
});

