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

// Close dropdown when clicking any menu item
dropdown.addEventListener('click', (e) => {
  if (e.target.matches('.dropdown-content a')) {
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
  startBtn.disabled = false; // when enable the user can pause
}

function pauseCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = null;
  isRunning = false;
  startBtn.textContent = '▶ Start Carousel';
  startBtn.setAttribute('aria-label', 'Start Carousel');
  startBtn.disabled = false;  // makes it clickable to start again
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

// ====== Button state (bounded mode) ======
function updateButtonStates() {
  if (!galloper.length) return;
  prevBtn.disabled = (index === 0);
  nextBtn.disabled = (index === galloper.length - 1);
}

// ====== Navigation (bounded: no wrap) ======
function prevGalloper() {
  if (index === 0) {
    // Pause autoplay at the start edge so UI matches state
    if (isRunning) pauseCarousel();
    return;
  }
  galloper[index].classList.remove('active');
  dotsContainer?.children[index]?.classList.remove('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'false');

  index = index - 1;

  galloper[index].classList.add('active');
  dotsContainer?.children[index]?.classList.add('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'true');

  updateButtonStates();
}

function nextGalloper() {
  if (index === galloper.length - 1) {
    // Pause autoplay at the end edge so UI matches state
    if (isRunning) pauseCarousel();
    return;
  }
  galloper[index].classList.remove('active');
  dotsContainer?.children[index]?.classList.remove('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'false');

  index = index + 1;

  galloper[index].classList.add('active');
  dotsContainer?.children[index]?.classList.add('active');
  dotsContainer?.children[index]?.setAttribute('aria-current', 'true');

  updateButtonStates();
}

// ====== Initial Start/Pause button state ======
function setInitialButtonState() {
  isRunning = false;
  startBtn.disabled = false;
  startBtn.textContent = '▶ Start Carousel';
  startBtn.setAttribute('aria-label', 'Start Carousel');
}
setInitialButtonState();

// ====== Wire buttons & reset timer on manual actions ======
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

// Keyboard nav (bounded: handlers already guard the ends)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { nextGalloper(); resetTimer(); }
  if (e.key === 'ArrowLeft')  { prevGalloper(); resetTimer(); }
  if (e.key === 'Escape')     { dropdown.classList.remove('visible'); toggleBtn.setAttribute('aria-expanded', 'false'); }
});

// ====== Dots (build + a11y + click/keyboard) ======
if (!dotsContainer || !galloper.length) {
  updateButtonStates(); // still set prev/next correctly
} else {
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

      updateButtonStates();
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
}

// Set initial Prev/Next disabled state on load
updateButtonStates();


