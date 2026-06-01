document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change hamburger icon to close icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Close menu when clicking on link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    /* ==========================================================================
       REAL-TIME PRICE CALCULATOR
       ========================================================================== */
    const quoteForm = document.getElementById('quoteForm');
    const serviceTypeSelect = document.getElementById('serviceType');
    const surfaceAreaInput = document.getElementById('surfaceArea');
    const surfaceVal = document.getElementById('surfaceVal');
    const extraCheckboxes = document.querySelectorAll('input[name="extra"]');
    const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
    
    const totalPriceDisplay = document.getElementById('totalPrice');
    const priceBreakdownDisplay = document.getElementById('priceBreakdown');

    function calculateEstimatedHours(surface) {
        if (surface <= 40) return 2;
        if (surface <= 80) return 3;
        if (surface <= 120) return 4;
        if (surface <= 160) return 5;
        if (surface <= 200) return 6;
        return 8;
    }

    function updatePrice() {
        if (!serviceTypeSelect || !surfaceAreaInput || !totalPriceDisplay) return;

        // 1. Get base parameters
        const baseHourlyRate = parseFloat(serviceTypeSelect.value);
        const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].getAttribute('data-name');
        const surface = parseInt(surfaceAreaInput.value);
        
        // Update surface slider text value
        if (surfaceVal) {
            surfaceVal.textContent = `${surface} m²`;
        }

        // 2. Calculate hours based on surface area
        const hours = calculateEstimatedHours(surface);
        
        // 3. Calculate base price
        let totalPrice = hours * baseHourlyRate;

        // 4. Add extras
        let extrasTotal = 0;
        let selectedExtrasText = [];
        extraCheckboxes.forEach(cb => {
            if (cb.checked) {
                const value = parseFloat(cb.value);
                extrasTotal += value;
                selectedExtrasText.push(cb.getAttribute('data-name').toLowerCase());
            }
        });
        totalPrice += extrasTotal;

        // 5. Apply frequency discount
        let frequencyMultiplier = 1;
        let frequencyText = "ponctuel";
        
        frequencyRadios.forEach(radio => {
            if (radio.checked) {
                frequencyMultiplier = parseFloat(radio.value);
                if (frequencyMultiplier === 0.9) frequencyText = "hebdomadaire (-10%)";
                if (frequencyMultiplier === 0.95) frequencyText = "mensuel (-5%)";
            }
        });
        
        totalPrice = totalPrice * frequencyMultiplier;
        
        // 6. Round and update UI
        const roundedPrice = Math.round(totalPrice);
        totalPriceDisplay.textContent = roundedPrice;

        // 7. Update breakdown text
        let breakdown = `Estimation basée sur ~${hours}h de ${serviceName.toLowerCase()}`;
        if (selectedExtrasText.length > 0) {
            breakdown += ` avec option(s) : ${selectedExtrasText.join(', ')}`;
        }
        breakdown += ` (${frequencyText}).`;
        
        if (priceBreakdownDisplay) {
            priceBreakdownDisplay.textContent = breakdown;
        }
    }

    // Attach event listeners to all calculator elements
    if (serviceTypeSelect) serviceTypeSelect.addEventListener('change', updatePrice);
    if (surfaceAreaInput) surfaceAreaInput.addEventListener('input', updatePrice);
    extraCheckboxes.forEach(cb => cb.addEventListener('change', updatePrice));
    frequencyRadios.forEach(radio => radio.addEventListener('change', updatePrice));

    // Run once initially
    updatePrice();

    /* ==========================================================================
       TESTIMONIALS SLIDER
       ========================================================================== */
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (testimonialSlides.length === 0) return;

        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + testimonialSlides.length) % testimonialSlides.length;
        
        testimonialSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000); // Change testimonial every 6 seconds
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                showSlide(targetIndex);
                resetSlideShow();
            });
        });
        
        // Start automatic transition
        startSlideShow();
    }

    /* ==========================================================================
       SCROLL NAV HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       MODALS & FORM SUBMISSIONS
       ========================================================================== */
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalMsg = document.getElementById('modalMsg');
    
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');

    function showModal(message) {
        if (successModal && modalMsg) {
            modalMsg.textContent = message;
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
        });

        // Close on clicking outside the modal content
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('custName').value;
            const service = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].getAttribute('data-name');
            const totalVal = totalPriceDisplay.textContent;
            
            const successMessage = `Merci, ${name} ! Votre demande de réservation pour le service "${service}" (devis estimé à ${totalVal}€) a bien été reçue. Notre équipe vous contactera dans les 2 prochaines heures par téléphone ou par email pour fixer les détails.`;
            
            showModal(successMessage);
            bookingForm.reset();
            updatePrice(); // reset price values
        });
    }

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const successMessage = `Merci ${name}, votre message a bien été envoyé ! Notre équipe commerciale vous répondra sous 24 heures ouvrées.`;
            
            showModal(successMessage);
            contactForm.reset();
        });
    }
});
