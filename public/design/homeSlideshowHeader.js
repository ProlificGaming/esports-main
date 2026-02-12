const slides = document.querySelectorAll(".slide"); 
const flash = document.querySelector(".flash"); 
const nextBtn = document.querySelector(".next"); 
const prevBtn = document.querySelector(".prev"); 

let index = 0;
let interval; 

function ShowSlide(i){
    slides.forEach(slide => slide.classList.remove("active")); 
    slides[i].classList.add('active');

    flash.classList.add("active"); 
    setTimeout(() => flash.classList.remove("active"), 350);
}

function NextSlide(){
    index = (index + 1) % slides.length;
    ShowSlide(index); 
}

function PrevSlide(){
    index = (index - 1 + slides.length) % slides.length; 
    ShowSlide(index); 
}

function StartAuto(){
    interval = setInterval(NextSlide, 7000); 
}

function ResetAuto(){
    ClearInterval(interval); 
    StartAuto();
}

nextBtn.addEventListener('click', () => {
    NextSlide();
    ResetAuto(); 
});

prevBtn.addEventListener('click', () => {
    PrevSlide();
    ResetAuto(); 
});

StartAuto();