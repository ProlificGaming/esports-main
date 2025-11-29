const passwordInput = document.getElementById("setPassword");
const strengthBar = document.getElementById("strength-bar");

const rules = {
    length: document.getElementById("rule-length"),
    lower: document.getElementById("rule-lower"),
    upper: document.getElementById("rule-upper"),
    number: document.getElementById("rule-number"),
    special: document.getElementById("rule-special"), 
}; 

passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    let score = 0;

    const checks = {
        length: value.length >= 12,
        lower: /[a-z]/.test(value),
        upper: /[A-Z]/.test(value),
        number: /\d/.test(value),
        special: /[\W_]/.test(value),
    }; 

    Object.keys(checks).forEach(key => {
        if (checks[key])
        {
            rules[key].classList.add("valid");
            rules[key].classList.remove("invalid");
            score++;
        }
        else
        {
            rules[key].classList.remove("valid");
            rules[key].classList.add("invalid");
        }
    });

    const percent = (score / 5) * 100;
    strengthBar.style.width = percent + "%";

    if (percent < 40) strengthBar.style.background = "red"; 
    else if (percent < 80) strengthBar.style.background = "orange";
    else strengthBar.style.background = "green"; 
});