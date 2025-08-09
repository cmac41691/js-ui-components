// ====== Dropdown ======
const toggleBtn = document.getElementById('dropdownToggle');
const dropdown = document.getElementById('dropdownContent');

toggleBtn.addEventListener('click', () => {
  const open = dropdown.classList.toggle('visible');
  toggleBtn.setAttribute('aria-expanded', open);
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const inside = dropdown.contains(e.target) || toggleBtn.contains(e.target);
  if (!inside) {
    dropdown.classList.remove('visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
});

// ====== Carousel state & elements ======
const galloper = document.querySelectorAll('.slide');
let index = 0;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startCarousel');
const dotsContainer = document.querySelector('.dots');
const carouselEl = document.querySelector('.carousel');

// ====== Autoplay state/helpers (toggleable) ======
let carouselInterval = null;
let isRunning = false;

function startCarousel() {
  if (isRunning) return;
  carouselInterval = setInterval(nextGalloper, 5000);
  isRunning = true;
  startBtn.textContent = '⏸ Pause Carousel';
  startBtn.setAttribute('aria-label', 'Pause Carousel');
}

function pauseCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = null;
  isRunning = false;
  startBtn.textContent = '▶ Start Carousel';
  startBtn.setAttribute('aria-label', 'Start Carousel');
}

function toggleCarousel() {
  if (isRunning) pauseCarousel();
  else startCarousel();
}

function resetTimer() {
  if (!isRunning) return; // only if autoplay is on
  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextGalloper, 5000);
}

// ====== Navigation (keeps dots in sync) ======
function prevGalloper() {
  galloper[index].classList.remove('active');
  dotsContainer?.children[index]?.classList.remove('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'false');

  index = (index - 1 + galloper.length) % galloper.length;

  galloper[index].classList.add('active');
  dotsContainer?.children[index]?.classList.add('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'true');
}

function nextGalloper() {
  galloper[index].classList.remove('active');
  dotsContainer?.children[index]?.classList.remove('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'false');

  index = (index + 1) % galloper.length;

  galloper[index].classList.add('active');
  dotsContainer?.children[index]?.classList.add('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'true');
}

// Wire buttons & reset timer on manual actions
prevBtn.addEventListener('click', () => { prevGalloper(); resetTimer(); });
nextBtn.addEventListener('click', () => { nextGalloper(); resetTimer(); });
startBtn.addEventListener('click', toggleCarousel);

// Pause on hover, resume on leave (respect toggle)
carouselEl.addEventListener('mouseenter', () => {
  if (isRunning && carouselInterval) clearInterval(carouselInterval);
});
carouselEl.addEventListener('mouseleave', () => {
  if (isRunning) {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextGalloper, 5000);
  }
});

// Keyboard nav
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { nextGalloper(); resetTimer(); }
  if (e.key === 'ArrowLeft')  { prevGalloper(); resetTimer(); }
  if (e.key === 'Escape')     { dropdown.classList.remove('visible'); toggleBtn.setAttribute('aria-expanded', 'false'); }
});

// ====== Dots (build + a11y + click/keyboard) ======
galloper.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === index) dot.classList.add('active');

  // accessibility
  dot.setAttribute('role', 'button');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.setAttribute('aria-current', i === index ? 'true' : 'false');
  dot.tabIndex = 0;

  // mouse
  dot.addEventListener('click', () => {
    galloper[index].classList.remove('active');
    dotsContainer.children[index].classList.remove('active');
    dotsContainer.children[index].setAttribute('aria-current', 'false');

    index = i;

    galloper[index].classList.add('active');
    dotsContainer.children[index].classList.add('active');
    dotsContainer.children[index].setAttribute('aria-current', 'true');

    resetTimer();
  });

  // keyboard activate on Enter/Space
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dot.click();
    }
  });

  dotsContainer.appendChild(dot);
});
