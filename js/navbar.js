/**
 * Shared Navbar Component for GeoAxis Surveyors
 * Handles Top Bar, Navigation, Dropdowns, and Active States
 */

const navbarHTML = `
<!-- Trust indicators strip (Optional/Premium touch) -->
<div class="trust-indicators-bar d-none d-lg-block">
    <div class="container d-flex justify-content-center gap-4 py-1">
        <span><i class="fa-solid fa-check-circle"></i> Licensed Surveyors</span>
        <span><i class="fa-solid fa-check-circle"></i> GIS Specialists</span>
        <span><i class="fa-solid fa-check-circle"></i> Drone Mapping Experts</span>
        <span><i class="fa-solid fa-check-circle"></i> Accurate & Reliable Results</span>
    </div>
</div>

<div class="top-info-bar">
    <div class="container">
        <div class="info-left">
            <span><i class="fa-solid fa-location-dot"></i> Nairobi, Kenya</span>
            <span><i class="fa-solid fa-phone"></i> +254 700 000 000</span>
            <span><i class="fa-solid fa-envelope"></i> info@geoaxis.co.ke</span>
        </div>
        <div class="info-right">
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="https://wa.me/254700000000" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
    </div>
</div>

<nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
        <a class="navbar-brand" href="index.html">
            <div class="logo-wrapper">
                <i class="fa-solid fa-compass-drafting"></i>
                <div class="brand-text">
                    <span class="main-title">GEOAXIS SURVEYORS</span>
                    <span class="tagline">Licensed Surveying & GIS Consultants</span>
                </div>
            </div>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <div class="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="about.html">About Us</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="services.html" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Services
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="servicesDropdown">
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-mountain-sun"></i> Topographical Surveys</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-draw-polygon"></i> Boundary Surveys</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-road"></i> Engineering Surveys</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-building-circle-check"></i> Construction Setting Out</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-map-location-dot"></i> GIS Mapping</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-drone"></i> Drone Surveys</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-layer-group"></i> Land Subdivision</a></li>
                        <li><a class="dropdown-item" href="services.html"><i class="fa-solid fa-handshake-angle"></i> Land Consultancy</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="projects.html">Projects</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="blog.html">Blog</a>
                </li>
                <li class="nav-item ms-lg-3">
                    <a href="contact.html" class="btn btn-nav-cta">
                        <i class="fa-solid fa-paper-plane"></i> Request Survey Quote
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;

function injectNavbar() {
    // Find the placeholder or the first nav/header to replace
    const placeholder = document.getElementById('navbar-placeholder');
    const existingNav = document.querySelector('nav');

    if (placeholder) {
        placeholder.innerHTML = navbarHTML;
    } else if (existingNav) {
        // If no placeholder, replace existing navbar
        const wrapper = document.createElement('div');
        wrapper.id = 'navbar-placeholder';
        wrapper.innerHTML = navbarHTML;
        existingNav.parentNode.replaceChild(wrapper, existingNav);
    } else {
        // Fallback: prepend to body
        const wrapper = document.createElement('div');
        wrapper.id = 'navbar-placeholder';
        wrapper.innerHTML = navbarHTML;
        document.body.prepend(wrapper);
    }

    initNavbarLogic();
}

function initNavbarLogic() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    // Set Active Link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle root path
        if ((currentPath === '/' || currentPath.endsWith('index.html')) && href === 'index.html') {
            link.classList.add('active');
        } else if (href !== 'index.html' && currentPath.includes(href)) {
            link.classList.add('active');
        }

        // Blog pages active state logic
        if (currentPath.includes('blog') && href === 'blog.html') {
            link.classList.add('active');
        }
    });

    // Sticky Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
}

// Run injection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbar);
} else {
    injectNavbar();
}
