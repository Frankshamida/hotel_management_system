document.addEventListener("DOMContentLoaded", function () {
    const createUserBtn = document.getElementById("createUserBtn");
    const viewEmployeesBtn = document.getElementById("viewEmployeesBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const contentDiv = document.getElementById("content");

    // Load default content
    contentDiv.innerHTML = "<h2>Welcome, Admin</h2><p>Select an option from the sidebar to get started.</p>";

    // Create User Button
    createUserBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Create User Account</h2>
            <form id="createUserForm">
                <label for="first_name">First Name:</label>
                <input type="text" id="first_name" name="first_name" required>

                <label for="last_name">Last Name:</label>
                <input type="text" id="last_name" name="last_name" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <label for="phone_number">Phone Number:</label>
                <input type="text" id="phone_number" name="phone_number">

                <label for="hire_date">Hire Date:</label>
                <input type="date" id="hire_date" name="hire_date" required>

                <label for="salary">Salary:</label>
                <input type="number" id="salary" name="salary" step="0.01" required>

                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>

                <label for="role">Role:</label>
                <select id="role" name="role" required>
                    <option value="head_housekeeping">Head Housekeeping</option>
                    <option value="head_frontdesk">Head Front Desk</option>
                    <option value="housekeeping_staff">Housekeeping Staff</option>
                    <option value="frontdesk_staff">Front Desk Staff</option>
                    <option value="maintenance">Maintenance</option>
                </select>

                <!-- Add Company ID Field -->
                <label for="company_id">Company ID:</label>
                <input type="text" id="company_id" name="company_id" readonly required>
                <button type="button" id="generateCompanyIdBtn">Generate Company ID</button>

                <button type="submit">Create Account</button>
            </form>
        `;

        // Generate Company ID
        const generateCompanyIdBtn = document.getElementById("generateCompanyIdBtn");
        const companyIdInput = document.getElementById("company_id");

        generateCompanyIdBtn.addEventListener("click", function () {
            const uniqueId = generateUniqueId(); // Generate a unique ID
            companyIdInput.value = uniqueId;
        });

        // Function to generate a unique ID
        function generateUniqueId() {
            return "EMP-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        // Handle form submission
        const form = document.getElementById("createUserForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const employee = {
                first_name: document.getElementById("first_name").value,
                last_name: document.getElementById("last_name").value,
                email: document.getElementById("email").value,
                phone_number: document.getElementById("phone_number").value,
                hire_date: document.getElementById("hire_date").value,
                salary: document.getElementById("salary").value,
                department: document.getElementById("department").value,
                role: document.getElementById("role").value,
                company_id: document.getElementById("company_id").value, // Include company_id
            };

            console.log("Employee Data:", employee); // Debugging: Log the employee object

            // Send data to the backend
            fetch("http://localhost:3000/create-employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employee),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error); // Show error message from the backend
                    } else {
                        alert("User account created successfully!");
                        form.reset();
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to create user account.");
                });
        });
    });

    // View Employees Button
    viewEmployeesBtn.addEventListener("click", function () {
        fetch("http://localhost:3000/get-employees")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    contentDiv.innerHTML = `<h2>Error: ${data.error}</h2>`;
                } else {
                    let employeesHTML = "<h2>Employees</h2><ul>";
                    data.forEach((employee) => {
                        employeesHTML += `
                            <li>
                                <strong>${employee.first_name} ${employee.last_name}</strong>
                                <p>Email: ${employee.email}</p>
                                <p>Department: ${employee.department}</p>
                                <p>Role: ${employee.role_name}</p>
                                <p>Company ID: ${employee.company_id}</p>  <!-- Display Company ID -->
                            </li>
                        `;
                    });
                    employeesHTML += "</ul>";
                    contentDiv.innerHTML = employeesHTML;
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                contentDiv.innerHTML = "<h2>Error loading employees.</h2>";
            });
    });

    // Logout Button
    logoutBtn.addEventListener("click", function () {
        window.location.href = "/login.html"; // Redirect to login page
    });
});