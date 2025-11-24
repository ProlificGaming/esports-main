const profileWindow = document.querySelector('.dashboard-profile-window');
const profileIcon = document.querySelector('#admin-nav > span > svg'); 
const profileWindowCloseBtn = document.querySelector('.dashboard-profile-window > div > svg'); 
const adminNavHeader = document.getElementById('admin-nav'); // Will blur 
const profileInfo = document.getElementById('dashboard-profile-info'); // Will blur
const mainSection = document.getElementById('dashboard-main'); // Will blur 

console.log(adminNavHeader); // Testing 
console.log(profileInfo); // Testing 
console.log(mainSection); // Testing 

profileIcon.addEventListener('click', OpenProfileWindow);
profileWindowCloseBtn.addEventListener('click', CloseProfileWindow); 

// OpenProfileWindow(): Will open the admin dashboard profile window.
function OpenProfileWindow(e){
    profileWindow.classList.add('open-admin-profile-window');

    adminNavHeader.setAttribute('style', 'filter: blur(3px);');
    profileInfo.setAttribute('style', 'filter: blur(3px);');
    mainSection.setAttribute('style', 'filter: blur(3px);'); 
}

// CloseProfileWindow(): Will close the admin dashboard profile window. 
function CloseProfileWindow(e){
    profileWindow.classList.remove('open-admin-profile-window'); 
    adminNavHeader.removeAttribute('style');
    profileInfo.removeAttribute('style'); 
    mainSection.removeAttribute('style'); 
}
