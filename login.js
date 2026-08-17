let email = document.getElementById("email")
let password=document.getElementById("password")
let login = document.getElementById("submit")
let emailError = document.getElementById("emailError") 
let passwordError = document.getElementById("passwordError")
let loginError = document.getElementById("loginError")
let emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

email.onfocus = function () {
    emailError.textContent = "";
    loginError.textContent = "";
};

email.onblur = function () {
    if (email.value === "") {
        emailError.textContent = "Please enter your email";
        loginError.textContent = "";
    }
    else if (!emailRegex.test(email.value)) {
        emailError.textContent = "your email is invalid";
    }
};

password.onfocus = function () {
    passwordError.textContent = "";
    loginError.textContent = "";
};

password.onblur = function () {
    if (password.value === "") {
        passwordError.textContent = "Please enter your password";
        loginError.textContent = "";
    }
    else if (!/[!@#$%^*]/.test(password.value) || password.value.length < 8) {
        passwordError.textContent = "your password must have a special character and at least contain 8 character";
    }
};


let savedUser = JSON.parse(localStorage.getItem("user"));

login.addEventListener("click",function () {
    if (!/[!@#$%^*]/.test(password.value) && password.value.length < 8 && password.value !=="" && email.value !== "" && emailRegex.test(email.value)) {
        loginError.textContent = "Your email or password is invalid";
        return;
    }
    // No account
    if (savedUser === null) {
        loginError.textContent =
            "You don't have an account. Please Sign Up.";
        return;
    }
    // Email not registered
    if (email.value !== savedUser.email) {
        loginError.textContent =
            "This email is not registered. Please Sign Up.";
        return;
    }
    // Wrong password
    if (password.value !== savedUser.password) {
        loginError.textContent =
            "Incorrect password.";
        return;
    }
    // Everything is correct
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "store.html";
})




//save data when refresh
// Load saved values when page opens
email.value = localStorage.getItem("loginEmail") || "";
password.value = localStorage.getItem("loginPassword") || "";

email.addEventListener("input", function () {
    localStorage.setItem("loginEmail", email.value);
});

password.addEventListener("input", function () {
    localStorage.setItem("loginPassword", password.value);
});
    