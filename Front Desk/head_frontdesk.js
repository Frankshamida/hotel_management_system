document.addEventListener("DOMContentLoaded", function () {
    const reportsBtn = document.getElementById("reportsBtn");
    const roomsBtn = document.getElementById("roomsBtn");
    const createAccountsBtn = document.getElementById("createAccountsBtn");
    const contentDiv = document.getElementById("content");

    // Load default content
    contentDiv.innerHTML = "<h2>Welcome</h2><p>Select an option from the sidebar to get started.</p>";

    // Reports Button
    reportsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = "<h2>Reports</h2><p>Here you can view and generate reports.</p>";
    });

    // Rooms Button
    roomsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = "<h2>Rooms</h2><p>Manage and view room statuses here.</p>";
    });

    // Create Accounts Button
    createAccountsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Create Staff Account</h2>
            <form id="createStaffForm">
                <label for="staff_id">Staff ID:</label>
                <input type="text" id="staff_id" name="staff_id" required>

                <label for="first_name">First Name:</label>
                <input type="text" id="first_name" name="first_name" required>

                <label for="last_name">Last Name:</label>
                <input type="text" id="last_name" name="last_name" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>

                <label for="role">Role:</label>
                <input type="text" id="role" name="role" required>

                <button type="submit">Create Account</button>
            </form>
        `;

        const form = document.getElementById("createStaffForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Get form data
            const staff = {
                staff_id: document.getElementById("staff_id").value,
                first_name: document.getElementById("first_name").value,
                last_name: document.getElementById("last_name").value,
                email: document.getElementById("email").value,
                password_hash: document.getElementById("password").value, // In a real app, hash this password!
                role: document.getElementById("role").value,
                created_by_head_staff_id: "HEAD_STAFF_001", // Hardcoded for now
                created_at: new Date().toISOString(),
            };

            // Save to local storage (simulating a backend)
            let staffAccounts = JSON.parse(localStorage.getItem("staffAccounts")) || [];
            staffAccounts.push(staff);
            localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));

            // Clear form and show success message
            form.reset();
            alert("Staff account created successfully!");
        });
    });
});