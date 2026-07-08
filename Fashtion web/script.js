/* ==========================================
   HERO IMAGE SLIDER
========================================== */

const slides = document.querySelectorAll('.slide');
const themeToggle = document.getElementById('themeToggle');
const header = document.querySelector('header');
const body = document.body;

let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove('active'));
    if (slides[index]) {
        slides[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}

setInterval(nextSlide, 4000);
showSlide(currentSlide);

/* ==========================================
   SMOOTH SCROLL FOR NAVIGATION
========================================== */

const links = document.querySelectorAll('.nav-links a');

links.forEach((link) => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ==========================================
   STICKY HEADER SHADOW
========================================== */

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,.15)';
    } else {
        header.style.boxShadow = '0 2px 15px rgba(0,0,0,.08)';
    }
});

/* ==========================================
   DARK / LIGHT MODE TOGGLE
========================================== */

function applyTheme(theme) {
    const isDark = theme === 'dark';
    body.classList.toggle('dark', isDark);

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const label = themeToggle.querySelector('span');

        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        label.textContent = isDark ? 'Light' : 'Dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }

    localStorage.setItem('haruna-theme', theme);
}

const savedTheme = localStorage.getItem('haruna-theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle?.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
});

/* ==========================================
   FADE-IN ANIMATION WHEN SCROLLING
========================================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('section').forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = '.8s';
    observer.observe(section);
});

const detailModal = document.getElementById('detailModal');
const modalImage = detailModal.querySelector('.modal-image img');
const modalTitle = detailModal.querySelector('#modalTitle');
const modalPrice = detailModal.querySelector('.modal-price');
const modalDescription = detailModal.querySelector('.modal-description');
const closeModalButton = detailModal.querySelector('.modal-close');

const orderForm = document.getElementById('orderForm');
const detailsSection = detailModal.querySelector('.details-section');
const orderSection = detailModal.querySelector('.order-section');

function openDetailModal(card) {
    const cardImage = card.querySelector('img');
    const cardTitle = card.querySelector('h3')?.textContent || 'Product';
    const cardPrice = card.querySelector('p')?.textContent || '';
    const altText = cardImage.getAttribute('alt') || cardTitle;

    modalTitle.textContent = cardTitle;
    modalPrice.textContent = cardPrice;
    // details-only: show image info, hide ordering form
    modalDescription.textContent = altText || `Details about ${cardTitle}`;
    modalImage.src = cardImage.src;
    modalImage.alt = altText;

    if (detailsSection) detailsSection.style.display = '';
    if (orderSection) orderSection.style.display = 'none';

    detailModal.classList.add('open');
    detailModal.setAttribute('aria-hidden', 'false');
}

function openOrderModal(card) {
    const cardImage = card.querySelector('img');
    const cardTitle = card.querySelector('h3')?.textContent || 'Product';
    const cardPrice = card.querySelector('p')?.textContent || '';
    const altText = cardImage.getAttribute('alt') || cardTitle;

    modalTitle.textContent = cardTitle;
    modalPrice.textContent = cardPrice;
    modalImage.src = cardImage.src;
    modalImage.alt = altText;

    if (detailsSection) detailsSection.style.display = 'none';
    if (orderSection) orderSection.style.display = '';

    detailModal.classList.add('open');
    detailModal.setAttribute('aria-hidden', 'false');

    if (orderForm) {
        setTimeout(() => {
            const qty = orderForm.querySelector('input[name="quantity"]');
            if (qty) qty.focus();
        }, 120);
    }
}

function closeDetailModal() {
    detailModal.classList.remove('open');
    detailModal.setAttribute('aria-hidden', 'true');
}

// Details buttons: open modal with product info
document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        if (card) openDetailModal(card);
    });
});

// Order buttons: open order-only modal
document.querySelectorAll('.order-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        if (card) openOrderModal(card);
    });
});

// Order form submission: open WhatsApp with prefilled order message
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(orderForm);
        const name = formData.get('customerName') || '';
        const phone = formData.get('customerPhone') || '';
        const quantity = formData.get('quantity') || '1';
        const paymentMethod = formData.get('paymentMethod') || '';
        const product = modalTitle.textContent || 'Product';
        const price = modalPrice.textContent || '';

        const rawMessage = `Order request\nProduct: ${product}\nPrice: ${price}\nQuantity: ${quantity}\nCustomer: ${name}\nPhone: ${phone}\nPayment method: ${paymentMethod}`;
        const waNumber = '2349136149825';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

        window.open(waUrl, '_blank');
    });
}

closeModalButton.addEventListener('click', closeDetailModal);

detailModal.addEventListener('click', (event) => {
    if (event.target === detailModal) {
        closeDetailModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailModal.classList.contains('open')) {
        closeDetailModal();
    }
});