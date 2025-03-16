document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    // Default admin credentials
    const DEFAULT_USERNAME = "admin";
    const DEFAULT_PASSWORD = "password";

    // Handle login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values
        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        // Validate credentials
        if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
            alert("Login successful!");
            // Redirect to the admin dashboard
            window.location.href = "/Admin/Admin.html"; // Update the path as needed
        } else {
            alert("Invalid credentials, please try again.");
        }
    });
});