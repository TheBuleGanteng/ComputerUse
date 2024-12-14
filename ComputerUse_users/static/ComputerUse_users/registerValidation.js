import { csrfToken, debounce, setGreen, setRed } from '/static/ComputerUse_users/utils.js'

document.addEventListener('DOMContentLoaded', function() {
    console.log(`running uservalidation.js ... DOM content loaded`);
    console.log(`running uservalidation.js ... current origin is: ${ window.location.origin }`);
    
    
    
    // Register settings --------------------------------------------------    
    var RegisterForm = document.getElementById('RegisterForm');
    
    if (RegisterForm) {
        console.log("running uservalidation.js ... RegisterForm detected ");
        
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const passwordConfirmation = document.getElementById('password-confirmation');
        
        const debouncedPasswordValidation = debounce(jsPasswordValidation, 400);
        const debouncedPasswordConfirmationValidation = debounce(jsPasswordConfirmationValidation, 400)

        
        if (password) {
            password.addEventListener('input', function() {
                debouncedPasswordValidation(); // Enable or disable submit, depending on outcome of function
            });
        }
                
        if (passwordConfirmation) {
            passwordConfirmation.addEventListener('input', function() {
                debouncedPasswordConfirmationValidation();
            });
        }
    
    }
    // Register settings --------------------------------------------------
    
    
    
    
    
    
    // Provides feedback to user whether user-inputted PW meets PW requirements.
    function jsPasswordValidation() {
        return new Promise((resolve, reject) => {
            const password_element = document.getElementById('password') 
            var password = password_element.value.trim();
            var passwordConfirmation = document.getElementById('password-confirmation').value.trim();
            var regLiMinTotChars = document.getElementById('pw-min-tot-chars-li');
            var regLiMinLetters = document.getElementById('pw-min-letters-li');
            var regLiMinNum = document.getElementById('pw-min-num-li');
            var regLiMinSym = document.getElementById('pw-min-sym-li');
            console.log(`running uservalidation.js ... Running jsPasswordValidation()`)
            
            if (password_element) {
                // If password is blank, reset the color of the elements below and return false.
                if (password === '') {
                    setRed([regLiMinTotChars, regLiMinLetters, regLiMinNum, regLiMinSym]);
                    return resolve(false);
                }
                // If password is not blank, then toss the value over to the /check_password_strength in app.py
                fetch('/check_password_valid/', {
                    method: 'POST',
                    body: new URLSearchParams({ 
                        'password': password,
                        'password_confirmation': passwordConfirmation
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrfToken,
                    }
                })
                // Do the following with the result received back from app.py
                .then(response => response.json())
                .then(data => {
                    if (data.checks_passed.includes('pw-req-length')) {
                        setGreen(regLiMinTotChars);
                    } else {
                        setRed(regLiMinTotChars);
                    }
                    if (data.checks_passed.includes('pw-req-letter')) {
                        setGreen(regLiMinLetters);
                    } else {
                        setRed(regLiMinLetters);
                    }
                    if (data.checks_passed.includes('pw-req-num')) {
                        setGreen(regLiMinNum);
                    } else {
                        setRed(regLiMinNum);
                    }
                    if (data.checks_passed.includes('pw-req-symbol')) {
                        setGreen(regLiMinSym);
                    } else {
                        setRed(regLiMinSym);
                    }
                })
                .catch(error => {
                    console.error('Error: password checking in registration has hit an error.', error);
                    reject(error);
                });
            }
        });
    }



    //---------------------------------------------------------------



    // Provides feedback to user regarding whether user-inputted password == user-inputted passwordConfirmation.
    function jsPasswordConfirmationValidation() {
        
        const password_element = document.getElementById('password');
        const password = password_element.value.trim();
        const passwordConfirmation = document.getElementById('password-confirmation').value.trim();
        const passwordConfirmationValidationMatch = document.getElementById('password-confirmation-validation-match') 
        console.log(`running uservalidation.js ... Running jsPasswordConfirmationValidation()`)
        
        if (password_element) { 
            // If password is blank, reset the color of the elements below and return false.
            if (passwordConfirmation === '') {
                setRed([passwordConfirmationValidationMatch]);
            }
            // If password is not blank, then toss the value over to the /check_password_strength in app.py
            fetch('/check_password_valid/', {
                method: 'POST',
                body: new URLSearchParams({ 
                    'password': password,
                    'password_confirmation': passwordConfirmation
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                }
            })
            // Do the following with the result received back from app.py
            .then(response => response.json())
            .then(data => {
                if (data.confirmation_match == true) {
                    console.log(`running jsPasswordConfirmationValidation()... data.confirmation_match is: ${ data.confirmation_match }`);
                    console.log(`running jsPasswordConfirmationValidation()... setting color to green`);
                    setGreen(passwordConfirmationValidationMatch);
                } else {
                    setRed(passwordConfirmationValidationMatch);

                }
            })
            .catch(error => {
                console.error('Error: password checking in registration has hit an error.', error);
                reject(error);
            });
        }
    };
    


    

});