document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registrationForm = document.getElementById("registrationForm");
    const showLoginLink = document.getElementById("showLoginLink");
    const showRegisterLink = document.getElementById("showRegisterLink");
    const guestType = document.getElementById("guestType");
    const localFields = document.getElementById("localFields");
    const foreignFields = document.getElementById("foreignFields");
    const foreignNationality = document.getElementById("foreignNationality");
    const foreignCountry = document.getElementById("foreignCountry");
    const agreeTerms = document.getElementById("agreeTerms");
    const accountFields = document.getElementById("accountFields");
    const registrationError = document.getElementById("registrationError");
    const loginError = document.getElementById("loginError");

    // Toggle between Login and Registration forms
    showRegisterLink.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden");
        registrationForm.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        registrationForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    // Show/hide fields based on guest type
    guestType.addEventListener("change", function () {
        const selectedType = guestType.value;

        if (selectedType === "local") {
            localFields.classList.remove("hidden");
            foreignFields.classList.add("hidden");
        } else if (selectedType === "foreign") {
            foreignFields.classList.remove("hidden");
            localFields.classList.add("hidden");
        } else {
            localFields.classList.add("hidden");
            foreignFields.classList.add("hidden");
        }
    });

    // Automatically set country for foreign guests based on nationality
    foreignNationality.addEventListener("change", function () {
        const nationality = foreignNationality.value;
        if (nationality === "Filipino") {
            foreignCountry.value = "Philippines";
        } else {
            foreignCountry.value = nationality; // Example: Set country based on nationality
        }
    });

    // Show username/password fields when terms are agreed
    agreeTerms.addEventListener("change", function () {
        if (agreeTerms.checked) {
            accountFields.classList.remove("hidden");
        } else {
            accountFields.classList.add("hidden");
        }
    });

    // Handle Registration Form Submission
    document.getElementById("registerBtn").addEventListener("click", function (event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            guestType: guestType.value,
            nationality: guestType.value === "local" ? "Filipino" : foreignNationality.value,
            country: guestType.value === "local" ? "Philippines" : foreignCountry.value,
            idType: guestType.value === "local" ? document.getElementById("localIdType").value : "Passport",
            idNumber: guestType.value === "local" ? document.getElementById("localIdNumber").value.trim() : document.getElementById("passportNumber").value.trim(),
            username: document.getElementById("username").value.trim(),
            password: document.getElementById("password").value.trim(),
            confirmPassword: document.getElementById("confirmPassword").value.trim(),
        };

        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.guestType || !formData.nationality || !formData.country || !formData.idType || !formData.idNumber || !formData.username || !formData.password || !formData.confirmPassword) {
            registrationError.textContent = "Please fill in all required fields.";
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            registrationError.textContent = "Passwords do not match.";
            return;
        }

        // Submit data to the server
        fetch('http://localhost:3000/registerGuest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Guest registration successful!");
                    window.location.href = "login.html"; // Redirect to login page
                } else {
                    registrationError.textContent = data.message || "Registration failed!";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                registrationError.textContent = "An error occurred during registration.";
            });
    });

    // Handle Login Form Submission
    document.getElementById("loginBtn").addEventListener("click", function (event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!username || !password) {
            loginError.textContent = "Please fill in all fields.";
            return;
        }

        const loginData = {
            username: username,
            password: password
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Login successful!");
                    window.location.href = "homepage.html"; // Redirect to homepage
                } else {
                    loginError.textContent = data.message || "Login failed!";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                loginError.textContent = "An error occurred during login.";
            });
    });
});