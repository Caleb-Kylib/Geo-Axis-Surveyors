/**
 * Main JavaScript for Land Surveyor Website
 * Handles animations, smooth scroll, and form feedback
 */

document.addEventListener('DOMContentLoaded', () => {
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

    // 3. Parallax Effect
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Hero Parallax
        if (hero) {
            hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
        }
    });

    // 4. Counter Animation Logic (Modern IntersectionObserver + requestAnimationFrame)
    const initCounters = () => {
        const statsSection = document.getElementById('stats-section');
        const counters = document.querySelectorAll('.counter-value');

        if (!statsSection || !counters.length) return;

        const animateCounter = (el) => {
            const target = +el.getAttribute('data-target');
            const duration = 2500; // Duration in ms
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // Ease out cubic function for smooth ending
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOutCubic * target);

                el.innerText = currentCount;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.innerText = target;
                }
            };

            requestAnimationFrame(step);
        };

        const observerOptions = {
            threshold: 0.5 // Trigger when 50% of the section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => animateCounter(counter));
                    observer.unobserve(entry.target); // Run only once
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    };

    // Initialize counters
    initCounters();

    // 4. Contact Form Handling (Formspree Integration via Fetch)
    const handleFormSubmission = (formId, statusContainerId, statusBadgeId, submitBtnId) => {
        const formElement = document.getElementById(formId);
        const statusContainer = document.getElementById(statusContainerId);
        const statusBadge = document.getElementById(statusBadgeId);
        const submitBtn = document.getElementById(submitBtnId);

        if (formElement) {
            formElement.addEventListener('submit', async function (event) {
                event.preventDefault();

                // Show loading state
                submitBtn.disabled = true;
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
                statusContainer.classList.add('d-none');

                const formData = new FormData(formElement);

                try {
                    const response = await fetch(formElement.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success handling
                        statusBadge.className = 'badge rounded-pill bg-success px-3 py-2';
                        statusBadge.innerHTML = '<i class="fa-solid fa-check-circle me-1"></i> Message sent successfully! We\'ll get back to you soon.';
                        statusContainer.classList.remove('d-none');
                        formElement.reset();
                    } else {
                        // Error handling from Formspree
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to send message');
                    }
                } catch (error) {
                    console.error('Submission Error:', error);
                    statusBadge.className = 'badge rounded-pill bg-danger px-3 py-2';
                    statusBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation me-1"></i> Oops! There was a problem. Please try again.';
                    statusContainer.classList.remove('d-none');
                } finally {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        }
    };

    // Initialize the contact form
    handleFormSubmission('contact-form', 'form-status', 'status-badge', 'submit-btn');

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
