// DOM Variables -> Tournament Games Slideshow Header:
const container = document.querySelector('#games-slideshow-container'); 
const gameCards = document.querySelectorAll('.game-card');
const leftButton = document.querySelector('.slideshow-button.left');
const rightButton = document.querySelector('.slideshow-button.right');
const allCard = document.querySelector(".game-card[data-game='all']"); 

// DOM Variables -> Tournament Viewport Section: 
const games = document.querySelectorAll('.game-viewport');
const gamesViewportContainer = document.getElementById('tournaments-viewport-container'); 
console.log("Games Viewport Container: ", gamesViewportContainer); // Testing 
console.log(games); // Testing 
games.forEach((game) => {
    console.log(game.dataset.game); // Testing 
}); 

/** 
------------------------------------ Tournament Games SlideShow Header ------------------------------------
*/
allCard.classList.add('current-card'); 

const visibleCards = 5;
let index = 0;

rightButton.addEventListener("click", () => {
    if (index < gameCards.length - visibleCards)
    {
        index++; 
        MoveSlide();
    }
});

leftButton.addEventListener("click", () => {
    if (index > 0){
        index--;
        MoveSlide(); 
    }
})

function MoveSlide(){
    const cardWidth = gameCards[0].offsetWidth + 20; // card width + gap
    console.log(cardWidth); // Testing 
    container.style.transform = `translateX(-${index * cardWidth}px)`;  
}


/** 
------------------------------------ Tournaments Viewport Section ------------------------------------
*/
// WGO: ... 
games.forEach((game) => {
    if (game.dataset.game === "all")
    {
        game.classList.add('game-select'); 
    }
});

gameCards.forEach((card) => {
    card.addEventListener('click', ViewTournaments); 
});

// ViewTournaments(): ...
function ViewTournaments(e){
    let removeSelect = false;

    // WGO: ...
    games.forEach((game) => {
        // If the games viewport matches the game card that was clicked on. 
        if (game.dataset.game === e.target.parentElement.dataset.game)
        {
            console.log('Choose: ', game.dataset.game); // Testing
            
            if (!e.target.parentElement.classList.contains('current-card'))
            {
                // Remove the previous current card after clicking on a new one.
                gameCards.forEach((card) => {
                    if (card.classList.contains('current-card'))
                    {
                        card.classList.remove('current-card'); 
                    }
                });

                e.target.parentElement.classList.add('current-card');
                removeSelect = true;
            }
        }
    }); 

    // WGO: Remove 'game-select' from the previous game. 
    games.forEach((game) => {
        if (game.classList.contains('game-select') && removeSelect)
        {
            game.classList.remove('game-select');  
        }
    });

    // WGO: ... 
    gameCards.forEach((card) => {
        if (card.classList.contains('current-card'))
        {
            games.forEach((game) => {
                if (game.dataset.game === card.dataset.game)
                {
                    setTimeout(() => {
                        game.classList.add('game-select');  
                    }, 300); 
                }
            });
        }
    });   
}