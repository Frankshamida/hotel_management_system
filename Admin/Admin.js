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
                <select id="department" name="department" required>
                    <option value="Front Desk">Front Desk</option>
                    <option value="House Keeping">House Keeping</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

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
            const uniqueId = generateUniqueId(); // Generate a unique 8-digit numeric ID
            companyIdInput.value = uniqueId;

            // Trigger validation (if needed)
            const event = new Event("input", { bubbles: true });
            companyIdInput.dispatchEvent(event);
        });

        // Function to generate a unique 8-digit numeric ID
        function generateUniqueId() {
            const min = 10000000; // Minimum 8-digit number (10000000)
            const max = 99999999; // Maximum 8-digit number (99999999)
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random 8-digit number
            return randomNumber.toString(); // Convert the number to a string
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
        contentDiv.innerHTML = `
            <h2>Employees</h2>
            <div>
                <input type="text" id="searchEmployee" placeholder="Search by name...">
                <select id="filterRole">
                    <option value="">All Roles</option>
                    <option value="head_housekeeping">Head Housekeeping</option>
                    <option value="head_frontdesk">Head Front Desk</option>
                    <option value="housekeeping_staff">Housekeeping Staff</option>
                    <option value="frontdesk_staff">Front Desk Staff</option>
                    <option value="maintenance">Maintenance</option>
                </select>
                <select id="filterDepartment">
                    <option value="">All Departments</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="House Keeping">House Keeping</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
            </div>
            <ul id="employeeList"></ul>
        `;

        const searchEmployeeInput = document.getElementById("searchEmployee");
        const filterRoleSelect = document.getElementById("filterRole");
        const filterDepartmentSelect = document.getElementById("filterDepartment");
        const employeeList = document.getElementById("employeeList");

        let allEmployees = []; // Store all employees fetched from the server

        // Function to fetch and display employees
        function fetchAndDisplayEmployees() {
            fetch("http://localhost:3000/get-employees")
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        employeeList.innerHTML = `<li>Error: ${data.error}</li>`;
                    } else {
                        allEmployees = data; // Store all employees
                        applyFilters(); // Apply filters after fetching
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    employeeList.innerHTML = "<li>Error loading employees.</li>";
                });
        }

        // Function to apply all filters (search, role, department)
        function applyFilters() {
            const searchTerm = searchEmployeeInput.value.toLowerCase();
            const selectedRole = filterRoleSelect.value;
            const selectedDepartment = filterDepartmentSelect.value;

            const filteredEmployees = allEmployees.filter((employee) => {
                const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
                const role = employee.role_name;
                const department = employee.department;

                // Check if the employee matches all filters
                return (
                    (searchTerm === "" || fullName.includes(searchTerm)) &&
                    (selectedRole === "" || role === selectedRole) &&
                    (selectedDepartment === "" || department === selectedDepartment)
                );
            });

            // Display filtered employees
            let employeesHTML = "";
            filteredEmployees.forEach((employee) => {
                employeesHTML += `
                    <li>
                        <strong>${employee.first_name} ${employee.last_name}</strong>
                        <p>Email: ${employee.email}</p>
                        <p>Department: ${employee.department}</p>
                        <p>Role: ${employee.role_name}</p>
                        <p>Company ID: ${employee.company_id}</p>
                    </li>
                `;
            });
            employeeList.innerHTML = employeesHTML;
        }

        // Initial fetch and display
        fetchAndDisplayEmployees();

        // Add event listeners for search and filters
        searchEmployeeInput.addEventListener("input", applyFilters);
        filterRoleSelect.addEventListener("change", applyFilters);
        filterDepartmentSelect.addEventListener("change", applyFilters);
    });

    // Logout Button
    logoutBtn.addEventListener("click", function () {
        window.location.href = "/login.html"; // Redirect to login page
    });
});