let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

let signup = document.getElementById("signupBtn");

let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let confirmPasswordError = document.getElementById("confirmPasswordError");

let profileImage = document.getElementById("profileImage");
let imagePreview = document.getElementById("imagePreview");
let imageError = document.getElementById("imageError");

let selectedImage = "";

let emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
let passwordRegex = /[!@#$%^*]/;

//image preview
profileImage.addEventListener("change", function () {

    let file = profileImage.files[0];

    if (!file) {
        return;
    }

    let reader = new FileReader();

    reader.onload = function (e) {

        selectedImage = e.target.result;

        imagePreview.innerHTML = `
            <img src="${selectedImage}" alt="Profile Preview">
        `;
    };

    reader.readAsDataURL(file);

});

signup.addEventListener("click", function () {

    // Clear old errors
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let valid = true;

    // Name
    if (name.value.trim() === "") {
        nameError.textContent = "Please enter your name";
        valid = false;
    }


    // Email
    if (email.value === "") {
        emailError.textContent = "Please enter your email";
        valid = false;
    }
    else if (!emailRegex.test(email.value)) {
        emailError.textContent = "Your email is invalid";
        valid = false;
    }


    // Password
    if (password.value === "") {
        passwordError.textContent = "Please enter your password";
        valid = false;
    }
    else if (!passwordRegex.test(password.value) || password.value.length < 8){
        passwordError.textContent = "Password must contain at least 8 characters and a special character";
        valid = false;
    }

    // Confirm password
    if (confirmPassword.value === "") {
        confirmPasswordError.textContent =
            "Please confirm your password";
        valid = false;
    }
    else if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent =
            "Passwords do not match";
        valid = false;
    }

    //image
    if (selectedImage === "") {
    imageError.textContent = "Please choose a profile photo";
    valid = false;
    }

    // Stop
    if (!valid) {
        return;
    }

    let user = {
        name: name.value.trim(),
        email: email.value,
        password: password.value,
        image: selectedImage
    };

     // Save user
    localStorage.setItem("user", JSON.stringify(user));

    // Go to Login
    window.location.href = "store.html";

});
    

//save data when refresh
// Load saved values when page opens
name.value = localStorage.getItem("signupName") || "";
email.value = localStorage.getItem("signupEmail") || "";
password.value = localStorage.getItem("signupPassword") || "";
confirmPassword.value = localStorage.getItem("signupConfirmPassword") || "";

name.addEventListener("input", function () {
    localStorage.setItem("signupName", name.value);
});

email.addEventListener("input", function () {
    localStorage.setItem("signupEmail", email.value);
});

password.addEventListener("input", function () {
    localStorage.setItem("signupPassword", password.value);
});

confirmPassword.addEventListener("input", function () {
    localStorage.setItem("signupConfirmPassword", confirmPassword.value);
});