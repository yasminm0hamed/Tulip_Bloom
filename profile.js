let savedUser = JSON.parse(localStorage.getItem("user"));

let profileImage = document.getElementById("profileImage");
let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");

let infoName = document.getElementById("infoName");
let infoEmail = document.getElementById("infoEmail");

let logout = document.getElementById("logout");


if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.href = "login.html";

}
else if (savedUser) {

    profileImage.src = savedUser.image;

    userName.textContent = savedUser.name;
    userEmail.textContent = savedUser.email;

    infoName.textContent = savedUser.name;
    infoEmail.textContent = savedUser.email;

}


logout.addEventListener("click", function () {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";

});