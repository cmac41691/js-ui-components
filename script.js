// ====== dropdown ======
const toggleBtn = document.getElementById('dropdownToggle');
const dropdown = document.getElementById('dropdownContent');

toggleBtn.addEventListener('click', () => {
  dropdown.classList.toggle('visible');
});

// close dropdown on outside click
document.addEventListener('click', (e) => {
  const inside = dropdown.contains(e.target) || toggleBtn.contains(e.target);
  if (!inside) dropdown.classList.remove('visible');
});

// ====== carousel state & elements ======
const galloper = document.querySelectorAll('.slide'); // no stray spaces
let index = 0;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.querySelector('.dots');
const carouselEl = document.querySelector('.carousel');

// ====== helpers ======
let carouselInterval;
function startCarousel() {
  if (carouselInterval) return; // prevent stacking
  carouselInterval = setInterval(nextGalloper, 5000);
}
function resetTimer() {
  if (!carouselInterval) return;
  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextGalloper, 5000);
}

// ====== navigation (keeps dots in sync) ======
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

// wire buttons + reset timer on manual actions
prevBtn.addEventListener('click', () => { prevGalloper(); resetTimer(); });
nextBtn.addEventListener('click', () => { nextGalloper(); resetTimer(); });

// ====== autoplay controls ======
document.getElementById('startCarousel').addEventListener('click', startCarousel);

// pause on hover, resume on leave
carouselEl.addEventListener('mouseenter', () => {
  if (carouselInterval) clearInterval(carouselInterval);
});
carouselEl.addEventListener('mouseleave', () => {
  carouselInterval = setInterval(nextGalloper, 5000);
});

// keyboard nav
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { nextGalloper(); resetTimer(); }
  if (e.key === 'ArrowLeft')  { prevGalloper(); resetTimer(); }
});

// ====== dots (build + a11y + click handlers) ======
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
