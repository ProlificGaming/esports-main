function validateUsername(username){
    const usernameRegex = /^(?!.*[._]{2})[a-zA-Z][a-zA-Z0-9._]{4,18}[a-zA-Z0-9]$/;

    return usernameRegex.test(username); 
}

function validatePassword(password){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{12,}$/;
    
    return  passwordRegex.test(password);  
}

module.exports = {
    validateUsername,
    validatePassword, 
}
