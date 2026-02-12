// Global Admin Tournament Route Nodes: 
const closeWindowBtns = document.querySelectorAll('svg[aria-label="close-button-icon"');
// const adminAllCloseWindowBtns = document.querySelectorAll('.close-button-icon'); 

// Admin Assign Tournament Image Nodes (Add tournament image window): 
const adminControlPanelSection2 = document.querySelector('.admin-control-panel-section-2'); 
const adminAssignTournamentImageForm = document.getElementById('admin-assign-tournament-image'); 
const adminAssignTournamentImageBtns = document.querySelectorAll('#admin-assign-tournament-image > div');
const addImageWindows = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3)'); 
const addImageWindowElements = document.querySelectorAll('.add-tournament-image-element'); 
const fileInputs = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3) > input');
const submitBtns = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(3) > button'); 
const openButton = document.querySelectorAll('#admin-assign-tournament-image > div > div:nth-child(4) > button');

// Admin Update & Delete Tournament Image Nodes:
const adminDeleteUpdateTournamentImage = document.querySelectorAll('#admin-update-delete-tournament-image'); 
const updateImageWindows = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(3)');
const updateImageWindowElements = document.querySelectorAll('.update-tournament-image-element'); 
const closeUpdateWindowBtns = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(3) > div > svg'); 
const updateImageBtns = document.querySelectorAll('#admin-update-delete-tournament-image > div:nth-child(4) > button'); 

// Admin Update/Delete Tournament Log Nodes:
const adminUpdateDeleteTournamentForms = document.querySelectorAll('#admin-update-delete-form');
const adminUpdateTournamentInputElements = document.querySelectorAll(".update-tournament-element"); 
const adminUpdateTournamentBtns = document.querySelectorAll('#admin-update-delete-form > div:nth-child(3) > div > button[aria-label="update-button"]');
const adminDeleteTournamentBtns = document.querySelectorAll('#admin-update-delete-form > div:nth-child(3) > div > button[aria-label="delete-button"]');
const adminDeleteTournamentWindows = document.querySelectorAll('#admin-update-delete-form > div:nth-child(4)'); 
const adminUpdateTournamentWindows = document.querySelectorAll('#admin-update-delete-form > div:nth-child(5)');  
const adminCloseUpdateWindows = document.querySelectorAll(".close-update-window-btn"); 
const adminCloseDeleteWindows = document.querySelectorAll(".close-delete-window-btn"); 
let adminDeleteTournamentWindowClosed = false;

// Set each "add image window" the same size as the "tournament log button". 
addImageWindows.forEach((window) => {
    window.style.setProperty('--add-image-window-width', `${adminAssignTournamentImageBtns[0].clientWidth}px`); 
    window.style.setProperty('--add-image-window-height', `${adminAssignTournamentImageBtns[0].clientHeight}px`); 
}); 

// Will enable the "add image window input elements" unclickable and non-focusable.
addImageWindowElements.forEach((addImageElement) => {
    addImageElement.classList.add('no-click'); 
    addImageElement.setAttribute('tabindex', '-1'); 
}); 

// ...
openButton.forEach((button) => {
    button.addEventListener('click', OpenAddImageWindow); 
});

// ... 
closeWindowBtns.forEach((button) => {
    button.addEventListener('click', CloseAddImageWindow);
}); 

// OpenAddImageWindow(): Opens the 'add image window' to add images for the tournaments log.
function OpenAddImageWindow(e){
    // Will close "add image window" when opening a new one.
    addImageWindows.forEach((window) => {
        if (window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 

    // Will enable the "add image window elements" unclickable and non-focusable 
    // when opening the "add image window". 
    addImageWindowElements.forEach((addImageElement) => {
        if (!addImageElement.hasAttribute('tabindex'))
        {
            addImageElement.classList.add('no-click'); 
            addImageElement.setAttribute('tabindex', '-1'); 
        }
    });

    // Will close "update image window" when opening the "add image window". 
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open');
        }
    });

    // Will enable the "update tournament image window elements" unclickable and non-focusable
    // when opening the "add image window".
    updateImageWindowElements.forEach((updateImageElement) => {
        if (!updateImageElement.hasAttribute('tabindex'))
        {
            updateImageElement.classList.add('no-click');
            updateImageElement.setAttribute('tabindex', '-1'); 
        }
    });

    // ==> Update and Delete Tournament Event Logs Activations:
    // Will close "update tournament window" when opening the "add image window".
    adminUpdateTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-update-tournament-window'))
        {
            window.classList.remove('open-update-tournament-window'); 
        }
    });  

    // (1) Will enable the "update tournament window elements" unclickable and non-focusable 
    // when opening the "add image window". 
    // (2) Will Remove 'required-remove' class list from from the 'update tournament window input elements,
    // and set some of the 'required attributes' on the 'update tournament window input elements' to true
    // when opening the 'add image window'. This is only enabled when the previous window opened before the 
    // current 'add image window' was the 'delete tournament window'. 
    adminUpdateTournamentInputElements.forEach((updateElement) => {
        // (1): 
        if (!updateElement.hasAttribute('tabindex'))
        {
            updateElement.classList.add('no-click');
            updateElement.setAttribute('tabindex', '-1'); 
        }

        // (2): 
        if (updateElement.classList.contains('required-removed'))
        {
            updateElement.classList.remove('required-removed'); 
            updateElement.setAttribute('required-removed', 'true');
        }
    }); 

    // Will close "delete tournament window" when opening the "add image window". 
    adminDeleteTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-delete-tournament-window'))
        {
            window.classList.remove('open-delete-tournament-window');
            setTimeout(() => {
                window.classList.add('hide'); 
            }, 500); 
        }
    }); 

    // Will make the "update/delete tournament log delete button" clickable when opening the "add image window".  
    adminDeleteTournamentBtns.forEach((button) => {
        button.classList.remove('no-click'); 
    });

    // Will make the "update/delete tournament log update button" clickable when opening the "add image window".
    adminUpdateTournamentBtns.forEach((button) => {
        button.classList.remove('no-click');
    });

    // Will remove the blur from the "update/delete tournament log" when opening the "add image window". 
    adminUpdateDeleteTournamentForms.forEach((form) => {
        if (form.classList.contains('blur-tournament-logs'))
        {
            form.classList.remove('blur-tournament-logs');
        }
    }); 


    e.target.offsetParent.children[2].classList.add('admin-add-image-window-open'); 

    // ==> Add Image Window Activations:
    // Will enable the "add image window input elements" clickable and focusable when opening the "add image window".
    e.target.form[0].classList.remove('no-click');
    e.target.form[0].removeAttribute('tabindex'); 

    e.target.form[1].classList.remove('no-click');
    e.target.form[1].removeAttribute('tabindex');  
}

// CloseAddImageWindow(): Closes the 'add image window'.
function CloseAddImageWindow(e){
    // ...
    addImageWindows.forEach((window) => {
        if (window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 

    // ...
    addImageWindowElements.forEach((addImageElement) => {
        if (!addImageElement.hasAttribute('tabindex'))
        {
            addImageElement.classList.add('no-click'); 
            addImageElement.setAttribute('tabindex', '-1');
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

// Will enable the "update tournament image window elements" unclickable and non-focusable. 
updateImageWindowElements.forEach((updateImageElement) => {
    updateImageElement.classList.add('no-click');
    updateImageElement.setAttribute('tabindex', '-1'); 
});

updateImageBtns.forEach((button) => {
    button.addEventListener('click', OpenUpdateImageWindow);
});

closeUpdateWindowBtns.forEach((button) => {
    button.addEventListener('click', CloseUpdateImageWindow); 
}); 

// OpenUpdateImageWindow(): Will open the "update image window". 
function OpenUpdateImageWindow(e){
    // Will close "update image window" when opening a new one.
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open');  
        }
    }); 

    // Will enable the "update tournament image window elements" unclickable and non-focusable
    // when opening a new "update image window".  
    updateImageWindowElements.forEach((updateImageElement) => {
        if (!updateImageElement.hasAttribute('tabindex'))
        {
            updateImageElement.classList.add('no-click'); 
            updateImageElement.setAttribute('tabindex', '-1'); 
        }
    }); 

    // Will close "add image window" when opening the "update image window".
    addImageWindows.forEach((window) => {
        if(window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    }); 

    // Will enable the "add tournament image window elements" unclickable and non-focusable
    // when opening a new "update image window".
    addImageWindowElements.forEach((addImageElement) => {
        if (!addImageElement.hasAttribute('tabindex'))
        {
            addImageElement.classList.add('no-click'); 
            addImageElement.setAttribute('tabindex', '-1'); 
        }
    });

    // ==> Update and Delete Tournament Event Logs Activations:
    // Will close "update tournament window" when opening the "update image window".
    adminUpdateTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-update-tournament-window'))
        {
            window.classList.remove('open-update-tournament-window'); 
        }
    });  

    // (1) Will enable the "update tournament window elements" unclickable and non-focusable 
    // when opening the "update image window". 
    // (2) Will Remove 'required-remove' class list from from the 'update tournament window input elements,
    // and set some of the 'required attributes' on the 'update tournament window input elements' to true
    // when opening the "update image window". This is only enabled if the previous window opened before the
    // current 'update image window' was the 'delete tournament window'. 
    adminUpdateTournamentInputElements.forEach((updateElement) => {
        // (1): 
        if (!updateElement.hasAttribute('tabindex'))
        {
            updateElement.classList.add('no-click');
            updateElement.setAttribute('tabindex', '-1'); 
        }

        // (2): 
        if (updateElement.classList.contains('required-removed'))
        {
            updateElement.classList.remove('required-removed');
            updateElement.setAttribute('required', 'true');
        }
    });

    // Will close "delete tournament window" when opening the "update image window".
    adminDeleteTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-delete-tournament-window'))
        {
            window.classList.remove('open-delete-tournament-window');
            setTimeout(() => {
                window.classList.add('hide');
            }, 500);
        }
    }); 

    // Will make the "update/delete tournament log delete button" clickable when opening the "update image window".  
    adminDeleteTournamentBtns.forEach((button) => {
        button.classList.remove('no-click'); 
    });

    // Will make the "update/delete tournament log update button" clickable when opening the "update image window".
    adminUpdateTournamentBtns.forEach((button) => {
        button.classList.remove('no-click');
    });

    // Will remove the blur from the "update/delete tournament log" when opening the "add image window". 
    adminUpdateDeleteTournamentForms.forEach((form) => {
        if (form.classList.contains('blur-tournament-logs'))
        {
            form.classList.remove('blur-tournament-logs'); 
        }
    });

    e.target.offsetParent.children[2].classList.add('admin-update-image-window-open'); 

    // ==> Update Image Window Activations:
    e.target.offsetParent.children[2].children[1][0].classList.remove('no-click'); // Update image window file input 
    e.target.offsetParent.children[2].children[1][0].removeAttribute('tabindex'); 

    e.target.offsetParent.children[2].children[1][1].classList.remove('no-click'); // Update image window submit button
    e.target.offsetParent.children[2].children[1][1].removeAttribute('tabindex');  
}

// CloseUpdateImageWindow(): Closes the 'update image window'.
function CloseUpdateImageWindow(e){
    //... 
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open'); 
        }
    }); 

    // ...
    updateImageWindowElements.forEach((updateImageElement) => {
        if (!updateImageElement.hasAttribute('tabindex'))
        {
            updateImageElement.classList.add('no-click');
            updateImageElement.setAttribute('tabindex', '-1'); 
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |Admin Update Delete Control Panel|


// -----------------------------------|Update Window|-----------------------------------
// Sets the "update tournamnet window" height and width of the "admin update delete tournament forms". 
adminUpdateTournamentWindows.forEach((window) => {
    window.style.setProperty('--update-tournament-window-width', `${adminUpdateDeleteTournamentForms[0].clientWidth}px`);
    window.style.setProperty('--update-tournament-window-height', `100vh`); 
}); 

// Will deactiavte and stop tab clicking  on the "update tournament inputs".
adminUpdateTournamentInputElements.forEach((updateElement) => { 
    updateElement.classList.add('no-click');
    updateElement.setAttribute("tabindex", "-1"); 
});  

// Button that will open the "update tournament window".
adminUpdateTournamentBtns.forEach((button) => {
    button.addEventListener('click', OpenUpdateTournamentWindows); 
});

// Button that will close the "update tournament window". 
adminCloseUpdateWindows.forEach((button) => {
    button.addEventListener('click', CloseUpdateTournamentWindows);
});

// OpenUpdateTournamentWindows(): The update tournament window. 
function OpenUpdateTournamentWindows(e){
    // Will close "update tournament window" when opening a new one.
    adminUpdateTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-update-tournament-window'))
        {
            window.classList.remove('open-update-tournament-window'); 
        }
    });  

    // (1) Will enable the "update tournament window inputs" unclickable and non-focusable
    // when opening a new "update tournament window". 
    // (2) Will Remove 'required-remove' class list from from the 'update tournament window input elements,
    // and set some of the 'required attributes' on the 'update tournament window input elements' to true
    // when opening a new "update tournament window". This is only enabled if the previous window opened before
    // the current 'update tournament window' was the 'delete tournament window'. 
    adminUpdateTournamentInputElements.forEach((updateElement) => {
        // (1):
        if (!updateElement.hasAttribute('tabindex'))
        {
            updateElement.classList.add('no-click');
            updateElement.setAttribute('tabindex', '-1');  
        }

        // (2): 
        if (updateElement.classList.contains('required-removed'))
        {
            updateElement.classList.remove('required-removed');
            updateElement.setAttribute('required', 'true'); 
        }
    });

    // Will close "add tournament image window" when opening the "update tournament window".
    addImageWindows.forEach((window) => {
        if (window.classList.contains('admin-add-image-window-open'))
        {
            window.classList.remove('admin-add-image-window-open'); 
        }
    });

    // Will enable the "add image window elements" unclickable and non-focusable 
    // when opening the "update tournament window". 
    addImageWindowElements.forEach((addImageElement) => {
        if (!addImageElement.hasAttribute('tabindex'))
        {
            addImageElement.classList.add('no-click');
            addImageElement.setAttribute('tabindex', '-1'); 
        }
    }); 

    // Will close "update tournament image window" when opening the "update tournament window"
    updateImageWindows.forEach((window) => {
        if (window.classList.contains('admin-update-image-window-open'))
        {
            window.classList.remove('admin-update-image-window-open');
        }
    });

    // Will enable the "update Image window elements" unclickable and non-focusable 
    // when opening the "update tournament window". 
    updateImageWindowElements.forEach((updateImageElement) => {
        if (!updateImageElement.hasAttribute('tabindex'))
        {
            updateImageElement.classList.add('no-click');
            updateImageElement.setAttribute('tabindex', '-1');
        }
    });

    // ==> Delete Tournament Window & Delete Button Activations:
    // Will close "delete tournament window" when opening the "update tournament window"
    adminDeleteTournamentWindows.forEach((window) => {
        window.classList.remove('open-delete-tournament-window');
        setTimeout(() => {
            window.classList.add('hide'); 
        }, 500); 
    }); 

    // Will make the "update/delete tournament log delete button" clickable when opening a new "update tournament window"
    adminDeleteTournamentBtns.forEach((button) => {
        button.classList.remove('no-click'); 
    });

    // Will make the "update/delete tournament log update button" clickable when opening a new "update tournament window". 
    adminUpdateTournamentBtns.forEach((button) => {
        button.classList.remove('no-click');
    });

    // ==> Delete Update Tournament Form Log Activations: 
    adminUpdateDeleteTournamentForms.forEach((form) => {
        form.classList.remove('blur-tournament-logs'); 
    }); 

    e.target.offsetParent.children[4].classList.add('open-update-tournament-window'); // Will open the window. 

    
    // ==> Update Tournament Window Activations (Input elements):
    e.target.offsetParent[3].removeAttribute('tabindex'); 
    e.target.offsetParent[3].classList.remove('no-click');

    e.target.offsetParent[4].removeAttribute('tabindex');
    e.target.offsetParent[4].classList.remove('no-click');

    e.target.offsetParent[5].removeAttribute('tabindex');
    e.target.offsetParent[5].classList.remove('no-click'); 

    e.target.offsetParent[6].removeAttribute('tabindex'); 
    e.target.offsetParent[6].classList.remove('no-click');

    e.target.offsetParent[7].removeAttribute('tabindex'); 
    e.target.offsetParent[7].classList.remove('no-click');

    e.target.offsetParent[8].removeAttribute('tabindex');  
    e.target.offsetParent[8].classList.remove('no-click'); 

    e.target.offsetParent[9].removeAttribute('tabindex');  
    e.target.offsetParent[9].classList.remove('no-click'); 

    e.target.offsetParent[10].removeAttribute('tabindex');  
    e.target.offsetParent[10].classList.remove('no-click'); 

    e.target.offsetParent[11].removeAttribute('tabindex');
    e.target.offsetParent[11].classList.remove('no-click'); 
}

// CloseUpdateTournamentWindows(): Closes the update tournament window.
function CloseUpdateTournamentWindows(e){
    console.log(e); // Testing 

    // ... 
    adminUpdateTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-update-tournament-window'))
        {
            window.classList.remove('open-update-tournament-window');
        }
    }); 

    // ...
    adminUpdateTournamentInputElements.forEach((updateElement) => {
        if (!updateElement.hasAttribute('tabindex'))
        {
            updateElement.classList.add('no-click');
            updateElement.setAttribute('tabindex', '-1');
        }
    });

}

// -----------------------------------|Delete Window|-----------------------------------
adminDeleteTournamentWindows.forEach((window) => {
    window.classList.add('hide'); 
    window.style.setProperty('--delete-tournament-window-left-position', `${adminUpdateDeleteTournamentForms[0].clientWidth / 2}px`);
    window.style.setProperty('--delete-tournamnet-window-top-position', `${adminUpdateDeleteTournamentForms[0].clientHeight / 2}px`); 
});

adminDeleteTournamentBtns.forEach((button) => {
    button.addEventListener('click', OpenDeleteTournamentWindows);
});

adminCloseDeleteWindows.forEach((button) => {
    button.addEventListener('click', CloseDeleteTournamentWindows); 
}); 

// OpenDeleteTournamentWindows(): ... 
function OpenDeleteTournamentWindows(e){
    console.log(e); // Testing  
    console.log(e.target.offsetParent.children[3]); // Testing 

    // Will close "delete tournament window" when opening a new "delete tournament window". 
    adminDeleteTournamentWindows.forEach((window) => {
        if (window.classList.contains('open-delete-tournament-window'))
        {
            window.classList.remove('open-delete-tournament-window'); 
            setTimeout(() => {
                window.classList.add('hide'); 
            }, 500);
        }
    });

    // Will unblur "update delete tournament log" when opening a new "delete tournament window". 
    adminUpdateDeleteTournamentForms.forEach((form) => {
        if (form.classList.contains('blur-tournament-logs'))
        {
            form.classList.remove('blur-tournament-logs'); 
        }
    });

    // Will make the "update/delete tournament log delete button" clickable when opening the "delete tournament window". 
    adminDeleteTournamentBtns.forEach((button) => {
        button.classList.remove('no-click'); 
    });
    
    // Will make the "update/delete tournament log update button" clickable when opening the "delete tournament window". 
    adminUpdateTournamentBtns.forEach((button) => {
        button.classList.remove('no-click');
    }); 

    // ==> Update Tournament Window Activations:
    // Close "update tournament window" when opening a new "delete tournament window". 
    adminUpdateTournamentWindows.forEach((window) => {
        window.classList.remove('open-update-tournament-window'); 
    }); 

    // (1) Will enable the "update tournament window inputs" unclickable and non-focusable
    // when opening a new "delete tournament window".
    // (2) Will Remove 'required-remove' class list from from the 'update tournament window input elements,
    // and set some of the 'required attributes' on the 'update tournament window input elements' to true
    // when opening a new 'delete tournament window'. This is only enabled if the previous window opened before
    // the current 'delete tournament window' was the 'delete tournament window'. 
    adminUpdateTournamentInputElements.forEach((updateElement) => {
        // (1): 
        if (!updateElement.hasAttribute('tabindex'))
        {
            updateElement.classList.add('no-click'); 
            updateElement.setAttribute('tabindex', '-1'); 
        }

        // (2): 
        if (updateElement.classList.contains('required-removed'))
        {
            updateElement.classList.remove('required-removed');
            updateElement.setAttribute('required', 'true');
        }
    });

    // ==> Add Tournament Image Window & Update Tournament Image Window Activations:
    // Will close "add tournament image window" when opening a new "delete tournament window". 
    addImageWindows.forEach((window) => {
        window.classList.remove('admin-add-image-window-open'); 
    }); 

    // Will enable the "add image window elements" unclickable and non-focusable
    // when opening the "delete tournament window". 
    addImageWindowElements.forEach((addImageElement) => {
        if (!addImageElement.hasAttribute('tabindex'))
        {
            addImageElement.classList.add('no-click');
            addImageElement.setAttribute('tabindex', '-1'); 
        }
    });

    // Will close "update tournament image window" when opening a new "delete tournament window". 
    updateImageWindows.forEach((window) => {
        window.classList.remove('admin-update-image-window-open'); 
    }); 

    // Will enable the "update image window elements" unclickable and non-focusable
    // when opening the "delete tournament window". 
    updateImageWindowElements.forEach((updateImageElement) => {
        if (!updateImageElement.hasAttribute('tabindex'))
        {
            updateImageElement.classList.add('no-click');
            updateImageElement.setAttribute('tabindex', '-1'); 
        }
    });

    adminDeleteTournamentWindowClosed = false; 

    e.target.offsetParent.children[3].classList.remove('hide');  
    e.target.offsetParent.classList.add('blur-tournament-logs');
    e.target.offsetParent.children[3].classList.add('open-delete-tournament-window'); 


    // ==> Update and Delete buttons become unclickable while the delete window is open. 
    e.target.offsetParent[0].classList.add('no-click'); 
    e.target.offsetParent[1].classList.add('no-click'); 

    // ==> Remove the 'required' attributes from the 'update tournament window input elements'. 
    e.target.form[3].removeAttribute('required');
    e.target.form[3].classList.add('required-removed'); 

    e.target.form[6].removeAttribute('required');
    e.target.form[6].classList.add('required-removed');

    e.target.form[8].removeAttribute('required');
    e.target.form[8].classList.add('required-removed'); 

    console.log(adminUpdateTournamentInputElements); // Testing  
    console.log("\n"); // Testing 
}

// CloseDeleteTournamentWindows(): ...
function CloseDeleteTournamentWindows(e){
    if (adminDeleteTournamentWindowClosed)
    {
        return; 
    }
    adminDeleteTournamentWindowClosed = true; 

    if (e.target.nodeName === "svg")
    {
        // Update & Delete buttons become clickable.
        e.target.parentElement.parentElement.parentElement[0].classList.remove('no-click');
        e.target.parentElement.parentElement.parentElement[1].classList.remove('no-click');  

        e.target.parentElement.offsetParent.classList.remove('open-delete-tournament-window'); 
        e.target.parentElement.offsetParent.offsetParent.classList.remove('blur-tournament-logs');

        // Add the 'required' attribute to the 'update tournament window input elements'. 
        e.target.parentElement.parentElement.parentElement[3].setAttribute('required', 'true');
        e.target.parentElement.parentElement.parentElement[3].classList.remove('required-removed');

        e.target.parentElement.parentElement.parentElement[6].setAttribute('required', 'true');
        e.target.parentElement.parentElement.parentElement[6].classList.remove('required-removed'); 

        e.target.parentElement.parentElement.parentElement[8].setAttribute('required', 'true'); 
        e.target.parentElement.parentElement.parentElement[8].classList.remove('required-removed'); 

        setTimeout(() => {
            e.target.parentElement.offsetParent.classList.add('hide'); 
        }, 500); 
    }
    else if (e.target.nodeName === "path")
    {
        // Update & Delete buttons become clickable.
        e.target.parentElement.parentElement.parentElement.parentElement[0].classList.remove('no-click');
        e.target.parentElement.parentElement.parentElement.parentElement[1].classList.remove('no-click'); 

        e.target.parentElement.parentElement.offsetParent.classList.remove('open-delete-tournament-window'); 
        e.target.parentElement.parentElement.offsetParent.offsetParent.classList.remove('blur-tournament-logs');

        // Add the 'required' attribute to the 'update torunament window input elements'. 
        e.target.parentElement.parentElement.parentElement.parentElement[3].setAttribute('required', 'true');
        e.target.parentElement.parentElement.parentElement.parentElement[3].classList.remove('required-removed');

        e.target.parentElement.parentElement.parentElement.parentElement[6].setAttribute('required', 'true');
        e.target.parentElement.parentElement.parentElement.parentElement[6].classList.remove('required-removed');

        e.target.parentElement.parentElement.parentElement.parentElement[8].setAttribute('required', 'true'); 
        e.target.parentElement.parentElement.parentElement.parentElement[8].classList.remove('required-removed'); 

        setTimeout(() => {
            e.target.parentElement.parentElement.offsetParent.classList.add('hide');
        }, 500);  
    }
}

