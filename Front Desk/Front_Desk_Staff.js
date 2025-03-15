document.getElementById("roleSelect").addEventListener("change", function () {
    let role = this.value;
    let headStaffLogin = document.getElementById("headStaffLogin");
    let staffLogin = document.getElementById("staffLogin");
    let loginButton = document.getElementById("loginBtn");

    // Hide login button first
    loginButton.style.display = "none";

    // Hide both login sections initially
    headStaffLogin.style.display = "none";
    staffLogin.style.display = "none";

    // Show the selected role's login fields
    if (role === "head_staff") {
        headStaffLogin.style.display = "block";
        document.getElementById("headUsername").value = "";
        document.getElementById("headPassword").value = "";
    } else if (role === "staff") {
        staffLogin.style.display = "block";
        document.getElementById("staffUsername").value = "";
        document.getElementById("staffPassword").value = "";
    }
});

// Function to check if both username & password are entered
function checkInputs() {
    let headUsername = document.getElementById("headUsername").value.trim();
    let headPassword = document.getElementById("headPassword").value.trim();
    let staffUsername = document.getElementById("staffUsername").value.trim();
    let staffPassword = document.getElementById("staffPassword").value.trim();
    let loginButton = document.getElementById("loginBtn");

    // Show login button only when both fields are filled
    if ((headUsername && headPassword) || (staffUsername && staffPassword)) {
        loginButton.style.display = "block";
    } else {
        loginButton.style.display = "none";
    }
}

// Attach event listeners to input fields to check when both fields are filled
document.getElementById("headUsername").addEventListener("input", checkInputs);
document.getElementById("headPassword").addEventListener("input", checkInputs);
document.getElementById("staffUsername").addEventListener("input", checkInputs);
document.getElementById("staffPassword").addEventListener("input", checkInputs);

// Toggle between Login and Registration forms
document.getElementById("registerLink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("formTitle").innerText = "FRONT DESK REGISTRATION";
});

document.getElementById("loginLink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("formTitle").innerText = "FRONT DESK LOGIN";
});

// Validate Company ID
document.getElementById("companyId").addEventListener("input", function () {
    const companyId = this.value.trim(); // Trim whitespace
    console.log("Entered company_id:", companyId); // Debugging

    const validationIcon = document.getElementById("companyIdCheck");
    const registerBtn = document.getElementById("registerBtn");

    if (companyId) {
        fetch(`/validateCompanyId?companyId=${encodeURIComponent(companyId)}`)
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    validationIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
                    validationIcon.classList.remove("invalid");
                    validationIcon.classList.add("valid");
                    registerBtn.disabled = false; // Enable the register button
                } else {
                    validationIcon.innerHTML = '<i class="fa-solid fa-times"></i>';
                    validationIcon.classList.remove("valid");
                    validationIcon.classList.add("invalid");
                    registerBtn.disabled = true; // Disable the register button
                }
            })
            .catch(error => {
                console.error('Error:', error);
                validationIcon.innerHTML = '<i class="fa-solid fa-times"></i>';
                validationIcon.classList.remove("valid");
                validationIcon.classList.add("invalid");
                registerBtn.disabled = true; // Disable the register button
            });
    } else {
        validationIcon.innerHTML = '';
        validationIcon.classList.remove("valid", "invalid");
        registerBtn.disabled = true; // Disable the register button
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
        alert("Passwords do not match!");
        return;
    }

    const registrationData = {
        companyId: companyId,
        username: username,
        password: password,
        role: role
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registration successful!");
                document.getElementById("registrationForm").style.display = "none";
                document.getElementById("loginForm").style.display = "block";
                document.getElementById("formTitle").innerText = "FRONT DESK LOGIN";
            } else {
                alert(data.message || "Registration failed!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during registration.");
        });
});