document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginLink = document.getElementById("showLoginLink");
    const showRegisterLink = document.getElementById("showRegisterLink");
    const loginError = document.getElementById("loginError");
    const registerError = document.getElementById("registerError");

    // Toggle between Login and Registration forms
    showRegisterLink.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden"); // Hide Login Form
        registrationForm.classList.remove("hidden"); // Show Registration Form
        clearRegistrationFields(); // Clear registration fields
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        registrationForm.classList.add("hidden"); // Hide Registration Form
        loginForm.classList.remove("hidden"); // Show Login Form
        clearRegistrationFields(); // Clear registration fields
    });

    // Clear registration fields
    function clearRegistrationFields() {
        document.getElementById("companyId").value = "";
        document.getElementById("regUsername").value = "";
        document.getElementById("regPassword").value = "";
        document.getElementById("regConfirmPassword").value = "";
        document.getElementById("regRole").value = "";
        document.getElementById("companyIdCheck").innerHTML = "";
        document.getElementById("companyIdCheck").classList.remove("valid", "invalid");
        registerError.textContent = "";
    }

    // Validate Company ID and Fetch Role (Registration Form)
    document.getElementById("companyId").addEventListener("input", function () {
        const companyId = this.value.trim();
        console.log("Entered company_id:", companyId);

        const validationIcon = document.getElementById("companyIdCheck");
        const registerBtn = document.getElementById("registerBtn");
        const regUsernameInput = document.getElementById("regUsername");
        const regRoleInput = document.getElementById("regRole");

        if (companyId) {
            fetch(`http://localhost:3000/validateCompanyId?companyId=${encodeURIComponent(companyId)}`)
                .then(response => response.json())
                .then(data => {
                    console.log("API Data:", data);
                    if (data.valid) {
                        validationIcon.innerHTML = '<i class="fa fa-check-circle" style="color:green"></i>';
                        validationIcon.classList.remove("invalid");
                        validationIcon.classList.add("valid");
                        registerBtn.disabled = false;

                        regUsernameInput.value = data.email;
                        regRoleInput.value = data.role;
                    } else {
                        validationIcon.innerHTML = '<i class="fa fa-times-circle" style="color:red"></i>';
                        validationIcon.classList.remove("valid");
                        validationIcon.classList.add("invalid");
                        registerBtn.disabled = true;
                        regUsernameInput.value = "";
                        regRoleInput.value = "";
                    }
                })
                .catch(error => {
                    console.error('API Error:', error);
                    validationIcon.innerHTML = '<i class="fa-solid fa-times"></i>';
                    validationIcon.classList.remove("valid");
                    validationIcon.classList.add("invalid");
                    registerBtn.disabled = true;
                    regUsernameInput.value = "";
                    regRoleInput.value = "";
                });
        } else {
            validationIcon.innerHTML = '';
            validationIcon.classList.remove("valid", "invalid");
            registerBtn.disabled = true;
            regUsernameInput.value = "";
            regRoleInput.value = "";
        }
    });

    // Handle Registration Form Submission
    document.getElementById("registerBtn").addEventListener("click", function (event) {
        event.preventDefault();

        const companyId = document.getElementById("companyId").value.trim();
        const username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const confirmPassword = document.getElementById("regConfirmPassword").value.trim();
        const role = document.getElementById("regRole").value;

        if (password !== confirmPassword) {
            registerError.textContent = "Passwords do not match!";
            return;
        }

        const registrationData = {
            companyId: companyId,
            username: username,
            password: password,
            role: role
        };

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Registration successful! Please login.");
                    registrationForm.classList.add("hidden"); // Hide Registration Form
                    loginForm.classList.remove("hidden"); // Show Login Form
                    clearRegistrationFields(); // Clear registration fields
                } else {
                    registerError.textContent = data.message || "Registration failed!";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                registerError.textContent = "An error occurred during registration.";
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
                    // Redirect to dashboard or another page
                    window.location.href = "/Housekeeping Login/Housekeeping_Dashboard.html";
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