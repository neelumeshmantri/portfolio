// Dropdown Toggle
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Close dropdown when clicking on a dropdown link
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function() {
        const dropdown = document.querySelector('.nav-dropdown');
        dropdown.classList.remove('active');
    });
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const burgerMenu = document.querySelector('.burger-menu');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');

        if (navLinks.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navMenuLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = document.querySelector('.nav').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navMenuLinks.forEach(link => {
        link.style.opacity = '1';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.opacity = '0.6';
        }
    });
});

// Hide scroll indicator on scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// Update progress bar based on current section
const progressBar = document.querySelector('.progress-bar');

window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = document.querySelector('.nav').offsetHeight;

    // Detect current section with special handling for Contact
    let foundCurrent = false;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // For Contact section, trigger earlier when it's in view
        if (sectionId === 'contact') {
            const contactTop = section.offsetTop - navHeight - 300; // Trigger 300px earlier
            if (window.pageYOffset >= contactTop) {
                current = 'contact';
                foundCurrent = true;
            }
        } else if (!foundCurrent && window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    // Find the active nav link and extend progress bar to its position
    const activeLink = document.querySelector(`.nav-links a[href="#${current}"]`);

    if (activeLink) {
        // For Home section, no progress bar
        if (current === 'home') {
            progressBar.style.width = '0%';
        }
        // For Contact section, fill the entire progress bar (100%)
        else if (current === 'contact') {
            progressBar.style.width = '100%';
        } else {
            // For other sections, extend to the center of the link
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = document.querySelector('.nav').getBoundingClientRect();
            const linkCenter = linkRect.left - navRect.left + (linkRect.width / 2);
            progressBar.style.width = linkCenter + 'px';
        }
    } else if (window.pageYOffset < 100) {
        // At top of page (hero section)
        progressBar.style.width = '0%';
    }
});

// Modal Functions
function openExtracurricularModal(section) {
    const modal = document.getElementById('extracurricularModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Remove any existing highlights
    document.querySelectorAll('.modal-section.highlight').forEach(el => {
        el.classList.remove('highlight');
    });

    // Wait for modal to be fully displayed, then scroll to section
    setTimeout(() => {
        if (section) {
            const targetSection = document.getElementById('modal-' + section);
            if (targetSection) {
                const modalContent = document.querySelector('.modal-content');
                // Calculate scroll position (section offset relative to modal content)
                const sectionTop = targetSection.offsetTop - modalContent.offsetTop - 20; // 20px offset for spacing
                modalContent.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });

                // Add highlight to the clicked section
                targetSection.classList.add('highlight');

                // Remove highlight after 3 seconds
                setTimeout(() => {
                    targetSection.classList.remove('highlight');
                }, 3000);
            }
        } else {
            // If no section specified, scroll to top
            document.querySelector('.modal-content').scrollTop = 0;
        }
    }, 100);
}

function closeExtracurricularModal() {
    const modal = document.getElementById('extracurricularModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('extracurricularModal');
    if (event.target === modal) {
        closeExtracurricularModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeExtracurricularModal();
    }
});

// Projects Carousel
let currentSlide = 0;
const totalSlides = 3;

function updateCarousel() {
    const cards = document.querySelectorAll('.project-carousel-card');
    const indicators = document.querySelectorAll('.indicator');

    // Update card positions
    cards.forEach((card, index) => {
        card.classList.remove('prev', 'active', 'next');

        if (index === currentSlide) {
            card.classList.add('active');
        } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
            card.classList.add('prev');
        } else if (index === (currentSlide + 1) % totalSlides) {
            card.classList.add('next');
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCarousel();
});

function moveCarousel(direction) {
    currentSlide += direction;

    // Loop around
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Keyboard navigation for carousel
document.addEventListener('keydown', function(event) {
    // Only activate if we're in the projects section
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isInView) {
        if (event.key === 'ArrowLeft') {
            moveCarousel(-1);
        } else if (event.key === 'ArrowRight') {
            moveCarousel(1);
        }
    }
});

// Touch/Swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for a swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next slide
                moveCarousel(1);
            } else {
                // Swipe right - go to previous slide
                moveCarousel(-1);
            }
        }
    }
}

// Projects Modal Functions
function openProjectsModal(section) {
    const modal = document.getElementById('projectsModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Remove any existing highlights
    document.querySelectorAll('#projectsModal .modal-section.highlight').forEach(el => {
        el.classList.remove('highlight');
    });

    // Wait for modal to be fully displayed, then scroll to section
    setTimeout(() => {
        if (section) {
            const targetSection = document.getElementById('modal-' + section);
            if (targetSection) {
                const modalContent = document.querySelector('#projectsModal .modal-content');
                // Calculate scroll position (section offset relative to modal content)
                const sectionTop = targetSection.offsetTop - modalContent.offsetTop - 20; // 20px offset for spacing
                modalContent.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });

                // Add highlight to the clicked section
                targetSection.classList.add('highlight');

                // Remove highlight after 3 seconds
                setTimeout(() => {
                    targetSection.classList.remove('highlight');
                }, 3000);
            }
        } else {
            // If no section specified, scroll to top
            document.querySelector('#projectsModal .modal-content').scrollTop = 0;
        }
    }, 100);
}

function closeProjectsModal() {
    const modal = document.getElementById('projectsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close projects modal when clicking outside of it
window.addEventListener('click', function(event) {
    const projectsModal = document.getElementById('projectsModal');
    if (event.target === projectsModal) {
        closeProjectsModal();
    }
});

// Close projects modal with Escape key (extends existing escape key functionality)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const projectsModal = document.getElementById('projectsModal');
        if (projectsModal && projectsModal.style.display === 'block') {
            closeProjectsModal();
        }
    }
});
