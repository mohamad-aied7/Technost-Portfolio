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

    // 2. التمرير السلس (Smooth Scrolling)
    document.querySelectorAll('nav a[href^="#"], .btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // For smooth scrolling to a section, adjust for fixed header height
                const headerOffset = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open after clicking a link
                const mainNav = document.getElementById('main-nav');
                const menuToggle = document.querySelector('.menu-toggle');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // 3. التحقق من صحة حقول نموذج الاتصال (Form Validation)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي للصفحة

            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            let isValid = true;
            let errorMessage = '';

            // التحقق من الاسم
            if (name.trim() === '') {
                isValid = false;
                errorMessage += 'الرجاء إدخال اسمك.\n';
            }

            // التحقق من البريد الإلكتروني باستخدام تعبير عادي بسيط
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                isValid = false;
                errorMessage += 'الرجاء إدخال بريد إلكتروني صالح.\n';
            }

            // التحقق من الرسالة
            if (message.trim() === '') {
                isValid = false;
                errorMessage += 'الرجاء كتابة رسالتك.\n';
            }

            if (!isValid) {
                alert('خطأ في الإدخال:\n' + errorMessage);
            } else {
                // إذا كانت البيانات صحيحة، يمكنك إرسال النموذج هنا
                // For demonstration, just show an alert
                alert('تم إرسال رسالتك بنجاح! (هذا النموذج تجريبي)');
                this.reset(); // مسح حقول النموذج بعد الإرسال
                // في مشروع حقيقي، ستقوم بإرسال البيانات إلى خادم (backend) باستخدام Fetch API أو XMLHttpRequest
                // مثال: fetch('/submit-form', { method: 'POST', body: new FormData(this) })
            }
        });
    }

    // 4. تأثيرات حركية (Fade-in on scroll for sections)
    const observerOptions = {
        root: null, // العنصر الذي يكون جزءاً منه Target (viewport في هذه الحالة)
        rootMargin: '0px',
        threshold: 0.1 // عندما يكون 10% من العنصر مرئياً
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // أضف الكلاس بدلاً من تعديل الـ style مباشرة
                observer.unobserve(entry.target); // إيقاف المراقبة بعد الظهور مرة واحدة
            }
        });
    }, observerOptions);

    // تطبيق التأثير على الأقسام الرئيسية في الصفحة
    document.querySelectorAll('section.fade-in-on-scroll').forEach(section => {
        // تأكد أن هذا الكود لا يطبق على splash-screen أو الأقسام التي لا تريد أن تختفي بالبداية
        // الأقسام مثل Hero Section لا تحتاج لأن تكون fade-in-on-scroll لأنها تكون مرئية مباشرة
        // لذلك، يستهدف هذا الكود فقط الأقسام التي تحتوي على الكلاس 'fade-in-on-scroll'
        // ولا تستثني أي كلاسات أخرى عن طريق الخطأ.
        if (section.id !== 'splash-screen' && section.id !== 'hero') {
            sectionObserver.observe(section);
        }
    });

    // 5. Hamburger Menu Toggle for Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Optional: Add class to body to prevent scrolling when menu is open
        });

        // Close menu when a navigation link is clicked (for smooth scroll)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is open before trying to close
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // 6. Header Scrolled Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // After scrolling 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // *******************************************************************
    // ************* منطق عرض أنظمة ERP في إطارات لابتوب (محدث) *************
    // *******************************************************************

    // Intersection Observer لتشغيل حركة دخول اللابتوب عند التمرير
    const laptopContainers = document.querySelectorAll('.laptop-container');

    const laptopObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // عندما يكون 20% من العنصر مرئياً
    };

    const laptopObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // قم بتطبيق الحركة المتتابعة
                // بدلاً من entry.target.parentElement.children، نستخدم querySelectorAll ضمن القسم
                // لضمان الحصول على جميع اللابتوبات داخل قسم الـ ERP المحدد
                const erpSection = document.getElementById('our-erp-showcase');
                if (erpSection) {
                    const elements = erpSection.querySelectorAll('.laptop-container');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate-in');
                        }, index * 150); // تأخير 150 مللي ثانية لكل عنصر
                    });
                }
                // توقف عن مراقبة العنصر الأب (الشبكة) بعد تشغيل الحركة
                observer.unobserve(entry.target);
            }
        });
    }, laptopObserverOptions);

    // راقب العنصر الأب الذي يحتوي على جميع اللابتوبات (grid)
    const erpShowcaseSection = document.getElementById('our-erp-showcase');
    if (erpShowcaseSection) {
        laptopObserver.observe(erpShowcaseSection);
    }
    
    // *******************************************************************
    // ************* منطق النافذة المنبثقة (Modal Overlay) *************
    // *******************************************************************
    const erpModalOverlay = document.getElementById('erp-modal-overlay');
    const erpModalIframe = document.getElementById('erp-modal-iframe');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const loadingOverlayModal = document.querySelector('.loading-overlay-modal');

    // فتح النافذة المنبثقة عند الضغط على أي لابتوب
    laptopContainers.forEach(laptop => {
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
            document.body.style.overflow = ''; // إعادة التمرير في الخلفية
            erpModalIframe.src = ''; // مسح مصدر الـ iframe لإيقاف المحتوى
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
