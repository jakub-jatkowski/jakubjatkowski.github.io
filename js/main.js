/**
 * JAKUB JATKOWSKI — PORTFOLIO JAVASCRIPT ENGINE
 * Zoptymalizowany, lekki skrypt obsługujący interakcje, modal i formularz.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initPortfolioFilters();
  initProjectLightbox();
  initEmailCopy();
  initContactForm();
});

/* ==========================================================================
   1. TYPEWRITER (PŁYNNA ZMIANA FRAZ W NAGŁÓWKU HERO)
   ========================================================================== */
class Typewriter {
  constructor(wordEl, cursorEl, phrases, options = {}) {
    this.wordEl = wordEl;
    this.cursorEl = cursorEl;
    this.phrases = phrases;
    this.phraseIndex = 0;
    this.charIndex = phrases[0] ? phrases[0].length : 0;
    this.isDeleting = false;

    this.typeSpeed = options.typeSpeed || 60;
    this.deleteSpeed = options.deleteSpeed || 28;
    this.pauseDuration = options.pauseDuration || 2200;

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

function initTypewriter() {
  const dynamicEl = document.getElementById('typeDynamic');
  const cursorEl = document.getElementById('cursorDynamic');

  if (!dynamicEl) return;

  const phrases = JSON.parse(dynamicEl.getAttribute('data-phrases') || '[]');
  if (!phrases.length) return;

  dynamicEl.textContent = phrases[0];

  const typewriter = new Typewriter(dynamicEl, cursorEl, phrases, {
    typeSpeed: 55,
    deleteSpeed: 25,
    pauseDuration: 2000
  });

  typewriter.start(1400);

  dynamicEl.addEventListener('click', (e) => {
    e.preventDefault();
    typewriter.next();
  });
}

/* ==========================================================================
   2. FILTRY KATEGORII W PORTFOLIO
   ========================================================================== */
function initPortfolioFilters() {
  const tabs = document.querySelectorAll('.filter-tabs .tab-btn');
  const cards = document.querySelectorAll('.project-card');

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

/* ==========================================================================
   3. LIGHTBOX MODAL Z DANYMI PROJEKTÓW
   ========================================================================== */
const projectsData = {
  'reel-1': {
    title: 'Dynamiczny montaż rolki edukacyjnej',
    category: 'Wideo • Rolki / Shorts / TikTok',
    desc: 'Montaż w formacie pionowym (9:16) zaprojektowany pod maksymalne utrzymanie uwagi widza. Precyzyjne cięcia eliminujące pauzy w wypowiedzi, kinetyczne napisy z akcentami kolorystycznymi oraz warstwowy sound design podbijający najważniejsze punkty merytoryczne.',
    tags: ['DaVinci Resolve', 'CapCut Pro', 'Format pionowy 9:16', 'Sound Design SFX', 'Kinetyczne napisy', 'Eksport 4K 60FPS'],
    img: 'assets/images/reel_preview.jpg'
  },
  'reel-2': {
    title: 'Wideo produktowe pod social media & ads',
    category: 'Wideo • Reklama & Ads',
    desc: 'Dynamiczny format promocyjny stworzony do płatnych kampanii reklamowych (Meta Ads, TikTok Ads) oraz publikacji organicznych. Szybkie przejścia montażowe, płynne prezentacje cech produktu oraz podkład muzyczny precyzyjnie zgrany z rytmem ujęć.',
    tags: ['CapCut Pro', 'DaVinci Resolve', 'Wideo reklamowe Ads', 'Color Grading', 'Krótkie formy'],
    img: 'assets/images/ads_showcase.jpg'
  },
  'social-1': {
    title: 'Siatka postów na profil i karuzela edukacyjna',
    category: 'Grafika • Social Media',
    desc: 'Kompleksowa identyfikacja wizualna profilu: spójna siatka postów, zestaw ikon relacji wyróżnionych (Stories Highlights) oraz wieloslajdowa karuzela edukacyjna łącząca przejrzystą infografikę z nowoczesną typografią.',
    tags: ['Affinity Designer', 'Canva', 'Siatka Instagram', 'Karuzele edukacyjne', 'Typografia'],
    img: 'assets/images/social_grid.jpg'
  },
  'dtp-1': {
    title: 'Plakat promocyjny i materiały poligraficzne',
    category: 'Druk • Poligrafia (CMYK 300 DPI)',
    desc: 'Profesjonalne przygotowanie materiałów do druku: plakat wielkoformatowy B1, rollup 85x200 cm oraz ulotki. Prawidłowy profil kolorystyczny CMYK (ISO Coated v2 / FOGRA39), 3 mm spadu drukarskiego, marginesy bezpieczeństwa i wektoryzacja wszystkich fontów.',
    tags: ['Affinity Designer', 'Druk CMYK (FOGRA39)', 'Spady 3 mm', 'Pliki produkcyjne PDF/X-1a', '300 DPI'],
    img: 'assets/images/dtp_print_mockup.jpg'
  },
  'branding-1': {
    title: 'Projekt logo i tożsamość wizualna marki',
    category: 'Branding • Identyfikacja Wizualna',
    desc: 'Projekt wektorowego logo wraz z kompletną paczką plików produkcyjnych (SVG, EPS, PDF, PNG), doborem krojów pisma oraz harmonijną paletą barw z mini-przewodnikiem prawidłowego stosowania znaku.',
    tags: ['Affinity Designer', 'Wektor (SVG/EPS)', 'Projekt logo', 'Księga znaku', 'Typografia'],
    img: 'assets/images/branding_showcase.jpg'
  },
  'brand-hero': {
    title: 'Oprawa graficzna i Key Visual marki',
    category: 'Grafika • Key Visual',
    desc: 'Nowoczesna koncepcja wizualna łącząca ciemną estetykę studyjną, szmaragdowe podświetlenie oraz dynamiczną, czytelną kompozycję zoptymalizowaną pod formaty 16:9 oraz 9:16.',
    tags: ['Affinity Photo', 'Kompozycja graficzna', 'Key Visual', 'Retusz'],
    img: 'assets/images/hero_portrait.jpg'
  }
};

function initProjectLightbox() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.querySelector('.modal-close');
  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');

  if (!modal) return;

  document.querySelectorAll('.project-card').forEach((card) => {
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
          span.className = 'tag-item';
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

/* ==========================================================================
   4. ONE-CLICK EMAIL COPY (KOPIOWANIE ADRESU E-MAIL)
   ========================================================================== */
function initEmailCopy() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const defaultEmail = 'jakubjatkowski@gmail.com';

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const email = btn.getAttribute('data-email') || defaultEmail;

      navigator.clipboard.writeText(email).then(() => {
        showToast(`Skopiowano adres e-mail: ${email}`);

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

/* ==========================================================================
   5. OBSŁUGA FORMULARZA KONTAKTOWEGO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      showToast('Wpisz swoje imię lub nazwę firmy');
      nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Wpisz poprawny adres e-mail');
      emailInput.focus();
      return;
    }

    if (!message) {
      showToast('Napisz krótką treść wiadomości');
      messageInput.focus();
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Wysyłanie wiadomości...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Wysłano pomyślnie!</span>';
      submitBtn.style.background = '#10b981';
      showToast('Dziękuję za wiadomość! Odpowiem tak szybko, jak to możliwe.');

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 800);
  });
}

/* ==========================================================================
   6. POWIADOMIENIE TOAST
   ========================================================================== */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
