document.getElementById("roleSelect").addEventListener("change", function() {
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
