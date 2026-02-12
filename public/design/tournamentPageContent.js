const tournamentImageContainer = document.querySelector('.single-tournament-image-container'); 
const tournamentImage = document.querySelector('.single-tournament-image-container > img[src]');
const quads = document.querySelectorAll('.quad');

tournamentImageContainer.addEventListener('mouseover', ImageContainerMovement);
tournamentImageContainer.addEventListener('mouseout', ImageContainerOriginal)

function ImageContainerMovement(e){
    if (e.target.classList.contains('quad'))
    {
        tournamentImageContainer.classList.add('single-tournament-image-container-box-shadow-added');
        tournamentImage.classList.add('single-tournament-image-filter-added'); 
    }

    if (e.target.classList.contains('quad-1'))
    {
        tournamentImageContainer.style.transform = `perspective(800px) rotateY(28deg) rotateX(10deg)`; 
    }
    else if (e.target.classList.contains('quad-2'))
    {
        tournamentImageContainer.style.transform = `perspective(800px) rotateY(33deg) rotateX(10deg)`; 
    }
    else if (e.target.classList.contains('quad-3'))
    {
        tournamentImageContainer.style.transform = `perspective(800px) rotateY(28deg) rotateX(-10deg)`;
    }
    else if (e.target.classList.contains('quad-4'))
    {
        tournamentImageContainer.style.transform = `perspective(800px) rotateY(33deg) rotateX(-10deg)`; 
    }
}

function ImageContainerOriginal(e){
    if (e.target.classList.contains('quad'))
    {
        tournamentImageContainer.style.transform = `perspective(800px) rotateY(30deg) rotateX(0deg)`;  
        tournamentImageContainer.classList.remove('single-tournament-image-container-box-shadow-added');
        tournamentImage.classList.remove('single-tournament-image-filter-added'); 
    }
}