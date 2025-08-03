// variables for the script

const toggleBtn= document.getElementById("dropdownToggle");
const dropdown= document.getElementById("dropdownContent");

toggleBtn.addEventListener("", () => {
    dropdown.classList.toggle("visable");
});


const galloper = document.querySelectorAll('.slide');
let index = 0;// Array starts at zero 

function prevGalloper(){
    galloper[index].classList.remove('active');
    index--;

    if(index < 0)
        index = galloper.length -1;

    galloper[index].classList.add('active');      
}

document.querySelector('.prevBtn').addEventListener('click', e => {
    prevSlide();
});

function nextGalloper(){
    galloper[index].classList.remove('active');
    index++;

    if(index > galloper.length -1)
        index = 0;

    galloper[index].classList.add('active');      
}

document.querySelector('.next').addEventListener('click', e => {
    nextGalloper();
});

// Timer for carousel
function startCarousel() {
 setInterval(() => {
    nextGalloper();
 }, 5000);
}
    
document.getElementById("startCarousel").addEventListener("click", () => {
startCarousel();    
});


const dotsContainer = document.querySelector('.dots');

galloper.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === index) dot.classList.add('active');
  dot.addEventListener('click', () => {
    galloper[index].classList.remove('active');
    dotsContainer.children[index].classList.remove('active');
    index = i;
    galloper[index].classList.add('active');
    dotsContainer.children[index].classList.add('active');
  });
  dotsContainer.appendChild(dot);
});
