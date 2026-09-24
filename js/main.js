/**
 * JAKUB JATKOWSKI — PORTFOLIO JAVASCRIPT ENGINE
 * Efekt WOW: Smooth Typewriter (Pisanie i usuwanie litera po literze) & Live 24 FPS Timecode (Zero Gradients)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
  initPortfolioFilters();
  initProjectLightbox();
  initEmailCopy();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. SILNIK TYPEWRITER (PISANIE -> PAUZA -> USUWANIE BACKSPACE -> KOLEJNY NAPIS)
   -------------------------------------------------------------------------- */
class TypewriterSlot {
  constructor(wordEl, cursorEl, phrases, options = {}) {
    this.wordEl = wordEl;
    this.cursorEl = cursorEl;
    this.phrases = phrases;
    this.phraseIndex = 0;
    this.charIndex = phrases[0] ? phrases[0].length : 0;
    this.isDeleting = false;

    this.typeSpeed = options.typeSpeed || 75;
    this.deleteSpeed = options.deleteSpeed || 35;
    this.pauseDuration = options.pauseDuration || 3600;

    this.timer = null;
  }

  start(initialDelay = 0) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.isDeleting = true;
      this.tick();
    }, initialDelay);
  }

  next() {
    if (this.timer) clearTimeout(this.timer);
    this.isDeleting = true;
    this.tick();
  }

  tick() {
    const currentPhrase = this.phrases[this.phraseIndex];

    if (this.isDeleting) {
      if (this.cursorEl) this.cursorEl.classList.add('typing');
      this.charIndex--;
      this.wordEl.textContent = currentPhrase.substring(0, this.charIndex);

      if (this.charIndex <= 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timer = setTimeout(() => this.tick(), 140);
        return;
      }

      this.timer = setTimeout(() => this.tick(), this.deleteSpeed);
    } else {
      const nextPhrase = this.phrases[this.phraseIndex];
      if (this.cursorEl) this.cursorEl.classList.add('typing');
      this.charIndex++;
      this.wordEl.textContent = nextPhrase.substring(0, this.charIndex);

      if (this.charIndex >= nextPhrase.length) {
        if (this.cursorEl) this.cursorEl.classList.remove('typing');
        this.isDeleting = true;
        this.timer = setTimeout(() => this.tick(), this.pauseDuration);
        return;
      }

      const jitter = Math.random() * 15;
      this.timer = setTimeout(() => this.tick(), this.typeSpeed + jitter);
    }
  }
}

function initHeroTypewriter() {
  const dynamicEl = document.getElementById('typeDynamic');
  const cursorEl = document.getElementById('cursorDynamic');

  if (!dynamicEl) return;

  const phrases = JSON.parse(dynamicEl.getAttribute('data-phrases') || '[]');
  if (!phrases.length) return;

  // Ustawienie początkowego tekstu
  dynamicEl.textContent = phrases[0];

  const typewriter = new TypewriterSlot(dynamicEl, cursorEl, phrases, {
    typeSpeed: 50,
    deleteSpeed: 24,
    pauseDuration: 1500
  });

  // Start po początkowej pauzie
  typewriter.start(1400);

  // Kliknięcie / dotknięcie natychmiast usuwa i pisze kolejną frazę
  dynamicEl.addEventListener('click', (e) => {
    e.preventDefault();
    typewriter.next();
  });
}

/* --------------------------------------------------------------------------
   2. FILTRY KATEGORII W PORTFOLIO
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.work-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. DANE I LIGHTBOX PODGLĄDU PROJEKTU
   -------------------------------------------------------------------------- */
const projectsData = {
  'reel-1': {
    title: 'Dynamiczny montaż rolki edukacyjnej',
    category: 'Wideo • Rolki / Shorts / TikTok',
    desc: 'Projekt montażowy w formacie 9:16 zoptymalizowany pod utrzymanie uwagi. Precyzyjne cięcia, wycięte pauzy, kinetyczne i kontrastowe napisy oraz dopasowany warstwowy sound design.',
    tags: ['DaVinci Resolve', 'CapCut', 'Format 9:16', 'Sound Design', 'Kinetyczne Napisy'],
    img: 'assets/images/reel_preview.jpg'
  },
  'reel-2': {
    title: 'Wideo produktowe pod social media',
    category: 'Wideo • Reklama & Ads',
    desc: 'Krótki format promocyjny do kampanii płatnych i organicznych. Dynamiczne przejścia produktowe, animacje tekstowe oraz podkład muzyczny zsynchronizowany z ujęciami.',
    tags: ['CapCut', 'DaVinci Resolve', 'Wideo Ads', 'Krótkie Formy'],
    img: 'assets/images/ads_showcase.jpg'
  },
  'social-1': {
    title: 'Siatka postów na profil & karuzela',
    category: 'Grafika • Social Media',
    desc: 'Kompletna identyfikacja wizualna profilu: spójna siatka postów, zestaw ikon relacji wyróżnionych oraz wieloslajdowa karuzela z przejrzystą infografiką.',
    tags: ['Affinity', 'Canva', 'Instagram Grid', 'Karuzele'],
    img: 'assets/images/social_grid.jpg'
  },
  'dtp-1': {
    title: 'Plakat promocyjny i materiały do druku',
    category: 'Druk • Poligrafia (CMYK)',
    desc: 'Przygotowanie zestawu poligraficznego do druku: plakat B1, roll-up 85x200 oraz ulotki. Prawidłowy profil barw CMYK, spad 3mm, wektoryzowane fonty i marginesy bezpieczeństwa.',
    tags: ['Affinity', 'Druk CMYK', 'Spady 3mm', 'Pliki PDF/X'],
    img: 'assets/images/dtp_print_mockup.jpg'
  },
  'branding-1': {
    title: 'Projekt logo & tożsamość marki',
    category: 'Branding • Identyfikacja',
    desc: 'Projekt wektorowego logo z kompletną paczką plików (SVG, EPS, PNG), doborem typografii oraz paletą barw z mini-przewodnikiem stosowania znaku.',
    tags: ['Affinity', 'Wektor (SVG/EPS)', 'Logo Design', 'Typografia'],
    img: 'assets/images/branding_showcase.jpg'
  }
};

function initProjectLightbox() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');

  if (!modal) return;

  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const data = projectsData[id];

      if (data) {
        modalImg.src = data.img;
        modalCat.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        modalTags.innerHTML = '';
        data.tags.forEach((tag) => {
          const span = document.createElement('span');
          span.className = 'tag-badge';
          span.textContent = tag;
          modalTags.appendChild(span);
        });

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. ONE-CLICK EMAIL COPY Z INFORMACJĄ ZWROTNĄ
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const defaultEmail = 'jakubjatkowski@gmail.com';

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const email = btn.getAttribute('data-email') || defaultEmail;

      navigator.clipboard.writeText(email).then(() => {
        showToast(`Skopiowano adres: ${email}`);

        const icon = btn.querySelector('i');
        if (icon) {
          const prevClass = icon.className;
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = prevClass;
          }, 2000);
        }
      }).catch(() => {
        showToast(`Adres e-mail: ${email}`);
      });
    });
  });
}

// Zapisanie znacznika czasu załadowania strony do detekcji botów
const PAGE_LOADED_AT = Date.now();

/* --------------------------------------------------------------------------
   6. BEZPOŚREDNI FORMULARZ KONTAKTOWY Z ZABEZPIECZENIAMI ANTY-SPAM & ANTY-BOT
   -------------------------------------------------------------------------- */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Usuwanie znaków kontrolnych
    .replace(/[<>]/g, '') // Usunięcie tagów HTML / ochrona przed XSS
    .trim();
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. ZABEZPIECZENIE HONEYPOT (Pułapka na automatyczne boty)
    const honeypot = document.getElementById('formHoneypot');
    if (honeypot && honeypot.value.trim() !== '') {
      // Ciche odrzucenie bota - fałszywy sukces, zero działania
      showToast('Wiadomość została przetworzona.');
      form.reset();
      return;
    }

    // 2. ZABEZPIECZENIE CZASOWE (Time-trap: boty wysyłają natychmiast)
    const elapsedSinceLoad = Date.now() - PAGE_LOADED_AT;
    if (elapsedSinceLoad < 2000) {
      showToast('Wypełnij formularz uważnie przed wysłaniem.');
      return;
    }

    // 3. RATE LIMITING / OCHRONA ANTY-FLOOD (30s cooldown między wysyłkami)
    const lastSubmitTime = parseInt(localStorage.getItem('jj_form_cooldown') || '0', 10);
    const now = Date.now();
    const COOLDOWN_TIME = 30000; // 30 sekund
    if (now - lastSubmitTime < COOLDOWN_TIME) {
      const remainingSeconds = Math.ceil((COOLDOWN_TIME - (now - lastSubmitTime)) / 1000);
      showToast(`Odczekaj ${remainingSeconds}s przed kolejnym kontaktem (anty-flood).`);
      return;
    }

    // Pobranie i sanityzacja pól formularza
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const serviceInput = document.getElementById('formService');
    const messageInput = document.getElementById('formMessage');

    const rawName = nameInput ? nameInput.value : '';
    const rawEmail = emailInput ? emailInput.value : '';
    const rawService = serviceInput ? serviceInput.value : 'Współpraca';
    const rawMessage = messageInput ? messageInput.value : '';

    const name = sanitizeInput(rawName).slice(0, 80);
    const email = sanitizeInput(rawEmail).slice(0, 100);
    const service = sanitizeInput(rawService).slice(0, 80);
    const message = sanitizeInput(rawMessage).slice(0, 2000);

    // 4. WALIDACJA PÓL
    if (name.length < 2) {
      showToast('Wpisz swoje imię lub nazwę firmy (min. 2 znaki)');
      if (nameInput) nameInput.focus();
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showToast('Wpisz poprawny adres e-mail (np. kontakt@domena.pl)');
      if (emailInput) emailInput.focus();
      return;
    }

    if (message.length < 5) {
      showToast('Napisz krótką treść wiadomości (min. 5 znaków)');
      if (messageInput) messageInput.focus();
      return;
    }

    // 5. BUDOWANIE BEZPOŚREDNIEJ WIADOMOŚCI E-MAIL
    const targetEmail = 'jakubjatkowski@gmail.com';
    const emailSubject = `Współpraca: ${service} — ${name}`;
    const emailBody = 
`Cześć Jakub,

Piszę w sprawie projektu z formularza na Twojej stronie portfolio.

Dane kontaktowe:
• Imię / Firma: ${name}
• Adres e-mail zwrotny: ${email}
• Wybrany zakres: ${service}

Treść wiadomości:
${message}

---
Wysłano bezpośrednio z formularza portfolio (jakubjatkowski.github.io)`;

    // Przygotowanie linku mailto
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Zapisanie cooldownu
    localStorage.setItem('jj_form_cooldown', now.toString());

    // Wizualna informacja zwrotna na przycisku
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Otwieranie poczty...</span>';
    submitBtn.style.backgroundColor = '#3b82f6';
    submitBtn.disabled = true;

    // Automatyczna kopia do schowka jako niezawodny backup
    navigator.clipboard.writeText(emailBody).then(() => {
      showToast('Otwieram pocztę. Treść została również bezpiecznie skopiowana do schowka!');
    }).catch(() => {
      showToast('Otwieram program pocztowy...');
    });

    // Bezpośrednie wywołanie klienta poczty
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 250);

    // Reset formularza i przywrócenie stanu przycisku
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.style.backgroundColor = '';
      submitBtn.disabled = false;
    }, 4000);
  });
}

/* --------------------------------------------------------------------------
   7. POWIADOMIENIE TOAST
   -------------------------------------------------------------------------- */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
