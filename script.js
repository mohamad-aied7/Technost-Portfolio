// JavaScript code for the splash screen - Runs when the entire page has loaded
window.addEventListener('load', function() {
    const splashScreen = document.getElementById('splash-screen');
    
    // Hide the splash screen after a short delay
    // 3000 milliseconds = 3 seconds (You can change this value)
    setTimeout(() => {
        if (splashScreen) { // Ensure the element exists before manipulating it
            splashScreen.style.opacity = '0';
            splashScreen.style.visibility = 'hidden';
            splashScreen.style.pointerEvents = 'none'; // Make it not clickable after fading out
        }
    }, 3000); // 3 seconds delay before starting to fade out
});


// All your existing JavaScript code should be wrapped inside DOMContentLoaded
// because it deals with elements that need to be present when the DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
    // 1. تحديث السنة الحالية في الفوتر تلقائياً
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const currentYear2Span = document.getElementById('currentYear2'); // لصفحة دراسة الحالة (إذا كانت موجودة)
    if (currentYear2Span) {
        currentYear2Span.textContent = new Date().getFullYear();
    }

    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // Prevent body scroll when mobile menu is open
            if (mainNav.classList.contains('active')) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = 'auto';
            }
        });
    }

    // NEW: Dropdown Toggle for Mobile (for 'أنظمتنا')
    // Select the dropdown parent (li.dropdown) and the button that triggers it (a.dropbtn)
    const dropdownParent = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown > .dropbtn'); 

    if (dropdownParent && dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            // Only prevent default and toggle if on mobile (or small screen)
            // This allows desktop hover to work naturally for the dropdown
            if (window.innerWidth <= 768) { // Adjust breakpoint as needed, matches CSS media query
                e.preventDefault(); // Prevent default link behavior (e.g., scrolling to top)
                dropdownParent.classList.toggle('active'); // Toggle 'active' class on the parent li
            }
        });
    }

    // Smooth Scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get header height for offset
                const headerHeight = header ? header.offsetHeight : 0;
                // Add a small extra padding for better visual alignment below fixed header
                const extraPadding = 20; 
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - extraPadding;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu after clicking a link
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                document.body.style.overflowY = 'auto';
            }
            // Close mobile dropdown if open (important for when dropdown is part of mobile menu)
            if (dropdownParent && dropdownParent.classList.contains('active')) {
                dropdownParent.classList.remove('active');
            }
        });
    });

    // Scroll Reveal Animations for general sections
    const scrollElements = document.querySelectorAll('section.fade-in-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            // Only animate if it's not the splash screen or hero section (which are visible by default)
            if (el.id !== 'splash-screen' && el.id !== 'hero') {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                }
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Run on load to check initial visibility

    // *******************************************************************
    // ************* منطق عرض أنظمة ERP في إطارات لابتوب (محدث) *************
    // *******************************************************************

    // Select all laptop containers across all ERP-related sections
    const allLaptopContainers = document.querySelectorAll('.laptop-container');

    const laptopObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const laptopAnimationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get all laptop containers specifically within the currently intersecting section
                const laptopsInThisSection = entry.target.querySelectorAll('.laptop-container');
                laptopsInThisSection.forEach((laptop, index) => {
                    setTimeout(() => {
                        laptop.classList.add('animate-in');
                    }, index * 150); // Stagger animation
                });
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, laptopObserverOptions);

    // Observe each ERP-related section separately
    const erpShowcaseSection = document.getElementById('our-erp-showcase');
    const cbmSection = document.getElementById('cbm-showcase');
    const crmSection = document.getElementById('crm-showcase');

    if (erpShowcaseSection) laptopAnimationObserver.observe(erpShowcaseSection);
    if (cbmSection) laptopAnimationObserver.observe(cbmSection);
    if (crmSection) laptopAnimationObserver.observe(crmSection);
    
    // *******************************************************************
    // ************* منطق النافذة المنبثقة (Modal Overlay) *************
    // *******************************************************************
    const erpModalOverlay = document.getElementById('erp-modal-overlay');
    const erpModalIframe = document.getElementById('erp-modal-iframe');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const loadingOverlayModal = document.querySelector('.loading-overlay-modal');

    // فتح النافذة المنبثقة عند الضغط على أي لابتوب
    allLaptopContainers.forEach(laptop => { // Use allLaptopContainers to cover all sections
        laptop.addEventListener('click', function() {
            const erpSrc = this.getAttribute('data-erp-src');
            if (erpSrc) {
                // إظهار تراكب التحميل في المودال
                loadingOverlayModal.classList.remove('hidden');
                erpModalIframe.classList.remove('loaded'); // إخفاء الـ iframe القديم

                // تعيين مصدر الـ iframe
                erpModalIframe.src = erpSrc;
                
                // إظهار النافذة المنبثقة
                erpModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
            }
        });
    });

    // إخفاء تراكب التحميل وإظهار الـ iframe بعد تحميل المحتوى
    erpModalIframe.onload = () => {
        loadingOverlayModal.classList.add('hidden');
        erpModalIframe.classList.add('loaded');
    };

    // إغلاق النافذة المنبثقة عند الضغط على زر الإغلاق
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            erpModalOverlay.classList.remove('active');
            erpModalIframe.src = ''; // مسح مصدر الـ iframe لإيقاف المحتوى
            document.body.style.overflow = ''; // إعادة التمرير في الخلفية
        });
    }

    // إغلاق النافذة المنبثقة عند الضغط على مفتاح ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && erpModalOverlay.classList.contains('active')) {
            erpModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            erpModalIframe.src = '';
        }
    });
    // *******************************************************************
    // ************* نهاية منطق النافذة المنبثقة *************
    // *******************************************************************

});
