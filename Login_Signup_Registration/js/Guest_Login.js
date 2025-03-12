document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let formTitle = document.getElementById("formTitle");

    let showRegister = document.getElementById("showRegister");
    let showLogin = document.getElementById("showLogin");

    let registerBtn = document.querySelector("#registerForm button[type='submit']");
    let termsCheck = document.getElementById("terms");

    // Toggle to registration form
    showRegister.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.textContent = "REGISTRATION";
    });

    // Toggle to login form
    showLogin.addEventListener("click", function (event) {
        event.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        formTitle.textContent = "GUEST LOGIN";
    });

    // Enable register button only if terms are checked
    termsCheck.addEventListener("change", function () {
        registerBtn.disabled = !termsCheck.checked;
    });

    // Handle login
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let username = document.getElementById("guestUsername").value.trim();
        let password = document.getElementById("guestPassword").value.trim();

        if (username === "" || password === "") {
            alert("Please fill in both username and password.");
        } else {
            alert("Logging in...");
            // Perform login validation here
        }
    });

    // Handle registration
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let requiredFields = [
            "fullName", "dob", "gender", "nationality", 
            "phone", "email", "address", "registerUsername", "registerPassword"
        ];
        
        let allFilled = requiredFields.every(id => document.getElementById(id).value.trim() !== "");

        if (!allFilled) {
            alert("Please fill all required fields.");
            return;
        }

        if (!termsCheck.checked) {
            alert("You must agree to the Terms and Conditions.");
            return;
        }

        alert("Registration successful! Redirecting to login...");
        
        // Simulate a short delay before switching back to login
        setTimeout(() => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            formTitle.textContent = "GUEST LOGIN";
        }, 1500);
    });
});
