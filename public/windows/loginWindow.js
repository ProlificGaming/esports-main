const logInAcctImage = document.querySelector('#main-nav > svg:nth-child(3)'); 
const logInWindow = document.querySelector('.log-in-window');
const logInWindowCloseButton = document.querySelector('.log-in-window > div:nth-child(1) > svg'); 

logInAcctImage.addEventListener('click', OpenLogInAcctWindow);
logInWindowCloseButton.addEventListener('click', CloseLogInAcctWindow);

// OpenLogInAcctWindow(): Will open the log in window/portal for the user. 
function OpenLogInAcctWindow(e){
    logInWindow.classList.add('open-log-in-window');
}

// CloseLogInAcctWindow(): Will Close the log in window/portal for the user. 
function CloseLogInAcctWindow(e){
    logInWindow.classList.remove('open-log-in-window');  
}