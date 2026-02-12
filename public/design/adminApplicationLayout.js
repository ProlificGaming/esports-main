const homepageTournamentLayoutSectionForm = document.querySelector('.homepage-tournament-layout-section > form');
const homepageTournamentLayoutInputs = document.querySelectorAll('.homepage-tournament-layout-section > form > label > div:nth-child(1) > input');

/**
 ****************************************************** HOMEPAGE ******************************************************
 */
/**
 ************************* Tournament Section *************************
 */
// Click event on the aspect ratio checkmarks.
homepageTournamentLayoutInputs.forEach((input) => {
    input.addEventListener('click', UnclickPreviousAspectRatios);
}); 

// Will uncheck previous aspect ratios when the current aspect ratio is checked. 
function UnclickPreviousAspectRatios(e){
    homepageTournamentLayoutInputs.forEach((input) => {
        if (e.target !== input)
        {
            input.checked = false; 
        }
    });
}