// Navigation and Scroll Handling
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    const sections = ['home', 'about', 'hobbies', 'projects', 'contact'];
    
    // Mobile Menu Toggle
    menuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        menuButton.innerHTML = isOpen 
            ? '<svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>'
            : '<svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    });

    // Smooth Scrolling
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });
            mobileMenu.classList.remove('active');
        });
    });

    // Active Section Highlighting
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSection = entry.target.id;
                updateActiveNavItem(activeSection);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) observer.observe(section);
    });

    function updateActiveNavItem(sectionId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === sectionId);
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message (in a real app, do this after successful submission)
        alert('Message sent successfully!');
        contactForm.reset();
    });

    // Update Copyright Year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Scroll to section function (used by buttons)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

