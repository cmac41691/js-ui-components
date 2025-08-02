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
