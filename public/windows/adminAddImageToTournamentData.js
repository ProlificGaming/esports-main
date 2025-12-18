// Admin Assign Tournament Image Nodes: 
const adminControlPanelSection2 = document.querySelector('.admin-control-panel-section-2'); 
const adminAssignTournamentImageForm = document.getElementById('admin-assign-tournament-image'); 
const adminAssignTournamentImageBtns = document.querySelectorAll('#admin-assign-tournament-image > div');
const addImageWindows = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3)'); 
const closeWindowBtns = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3) > div > svg');
const fileInputs = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3) > input');
const submitBtns = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3) > button'); 
const openButton = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(4) > button');


// Admin Update & Delete Tournament Image Nodes:
const adminDeleteUpdateTournamentImage = document.querySelectorAll('#admin-update-delete-tournament-image'); 
const updateImageWindows = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(3)');
const closeUpdateWindowBtns = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(3) > div > svg'); 
const updateImageBtns = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(4) > button'); 

// Set each "add image window" the same size as the "tournament log button". 
addImageWindows.forEach((window) => {
    window.style.setProperty('--add-image-window-width', `${adminAssignTournamentImageBtns[0].clientWidth}px`); 
    window.style.setProperty('--add-image-window-height', `${adminAssignTournamentImageBtns[0].clientHeight}px`); 
}); 

openButton.forEach((button) => {
    button.addEventListener('click', OpenAddImageWindow); 
});

closeWindowBtns.forEach((button) => {
    button.addEventListener('click', CloseAddImageWindow);
}); 


// OpenAddImageWindow(): Opens the 'add image window' to add images for the tournaments log.
function OpenAddImageWindow(e){
    addImageWindows.forEach((window) => {
        if (window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 

    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open');
        }
    });

    e.target.offsetParent.children[2].classList.add('admin-add-image-window-open'); 
}

// CloseAddImageWindow(): Closes the 'add image window'.
function CloseAddImageWindow(e){
    addImageWindows.forEach((window) => {
        if (window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set each "update image window" as the same size as the "update & delete tournament log". 
updateImageWindows.forEach((window) => {
    window.style.setProperty('--update-image-window-width', `${adminDeleteUpdateTournamentImage[0].clientWidth}px`);
    window.style.setProperty('--update-image-window-height', `${adminDeleteUpdateTournamentImage[0].clientHeight}px`);
}); 

updateImageBtns.forEach((button) => {
    button.addEventListener('click', OpenUpdateImageWindow);
});

closeUpdateWindowBtns.forEach((button) => {
    button.addEventListener('click', CloseUpdateImageWindow); 
}); 

// OpenUpdateImageWindow(): Will open the "update image window". 
function OpenUpdateImageWindow(e){
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open');  
        }
    }); 

    addImageWindows.forEach((window) => {
        if(window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 

    e.target.offsetParent.children[2].classList.add('admin-update-image-window-open'); 
}

// CloseUpdateImageWindow(): Closes the 'update image window'.
function CloseUpdateImageWindow(e){
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open'); 
        }
    }); 
}