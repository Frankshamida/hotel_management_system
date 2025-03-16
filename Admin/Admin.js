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
            <form id="createUserForm" class="form-grid">
                <div class="form-group">
                    <label for="first_name">First Name:</label>
                    <input type="text" id="first_name" name="first_name" required>
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name:</label>
                    <input type="text" id="last_name" name="last_name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone_number">Phone Number:</label>
                    <input type="text" id="phone_number" name="phone_number">
                </div>
                <div class="form-group">
                    <label for="hire_date">Hire Date:</label>
                    <input type="date" id="hire_date" name="hire_date" required>
                </div>
                <div class="form-group">
                    <label for="salary">Salary:</label>
                    <input type="number" id="salary" name="salary" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="department">Department:</label>
                    <select id="department" name="department" required>
                        <option value="Front Desk">Front Desk</option>
                        <option value="House Keeping">House Keeping</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="head_housekeeping">Head Housekeeping</option>
                        <option value="head_frontdesk">Head Front Desk</option>
                        <option value="housekeeping_staff">Housekeeping Staff</option>
                        <option value="frontdesk_staff">Front Desk Staff</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="company_id">Company ID:</label>
                    <input type="text" id="company_id" name="company_id" readonly required>
                    <button type="button" id="generateCompanyIdBtn">Generate Company ID</button>
                </div>
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
            <div class="search-filter-container">
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
            <table id="employeeTable">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Company ID</th>
                    </tr>
                </thead>
                <tbody id="employeeList"></tbody>
            </table>
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
                        employeeList.innerHTML = `<tr><td colspan="5">Error: ${data.error}</td></tr>`;
                    } else {
                        allEmployees = data; // Store all employees
                        applyFilters(); // Apply filters after fetching
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    employeeList.innerHTML = "<tr><td colspan='5'>Error loading employees.</td></tr>";
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
                    <tr>
                        <td>${employee.first_name} ${employee.last_name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.department}</td>
                        <td>${employee.role_name}</td>
                        <td>${employee.company_id}</td>
                    </tr>
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

document.addEventListener("DOMContentLoaded", function () {
    const createUserBtn = document.getElementById("createUserBtn");
    const viewEmployeesBtn = document.getElementById("viewEmployeesBtn");
    const viewUserAccountsBtn = document.getElementById("viewUserAccountsBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const contentDiv = document.getElementById("content");

    // Load default content
    contentDiv.innerHTML = "<h2>Welcome, Admin</h2><p>Select an option from the sidebar to get started.</p>";
    
    // Create User Button (existing code)
    createUserBtn.addEventListener("click", function () {
        // Existing code for creating a user
    });

    // View Employees Button (existing code)
    viewEmployeesBtn.addEventListener("click", function () {
        // Existing code for viewing employees
    });

    // View Employee User Accounts Button
    viewUserAccountsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Employee User Accounts</h2>
            <div class="search-filter-container">
                <input type="text" id="searchUserAccount" placeholder="Search by name...">
                <select id="filterUserRole">
                    <option value="">All Roles</option>
                    <option value="head_housekeeping">Head Housekeeping</option>
                    <option value="head_frontdesk">Head Front Desk</option>
                    <option value="housekeeping_staff">Housekeeping Staff</option>
                    <option value="frontdesk_staff">Front Desk Staff</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>
            <table id="userAccountsTable">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Company ID</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Username</th>
                        <th>Account Created</th>
                    </tr>
                </thead>
                <tbody id="userAccountsList"></tbody>
            </table>
        `;
    
        // Fetch and display user accounts
        fetchAndDisplayUserAccounts();
    
    
        const searchUserAccountInput = document.getElementById("searchUserAccount");
        const filterUserRoleSelect = document.getElementById("filterUserRole");
        const userAccountsList = document.getElementById("userAccountsList");
    
        let allUserAccounts = []; // Store all user accounts fetched from the server
    
        // Function to fetch and display user accounts
        function fetchAndDisplayUserAccounts() {
            fetch("http://localhost:3000/get-user-accounts")
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        userAccountsList.innerHTML = `<tr><td colspan="6">Error: ${data.error}</td></tr>`;
                    } else {
                        allUserAccounts = data; // Store all user accounts
                        applyUserAccountFilters(); // Apply filters after fetching
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    userAccountsList.innerHTML = "<tr><td colspan='6'>Error loading user accounts.</td></tr>";
                });
        }
    
        // Function to apply all filters (search, role)
        function applyUserAccountFilters() {
            const searchTerm = searchUserAccountInput.value.toLowerCase();
            const selectedRole = filterUserRoleSelect.value;
    
            const filteredUserAccounts = allUserAccounts.filter((user) => {
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                const role = user.role;
    
                // Check if the user matches all filters
                return (
                    (searchTerm === "" || fullName.includes(searchTerm)) &&
                    (selectedRole === "" || role === selectedRole)
                );
            });
    
            // Display filtered user accounts
            let userAccountsHTML = "";
            filteredUserAccounts.forEach((user) => {
                userAccountsHTML += `
                    <tr>
                        <td>${user.first_name} ${user.last_name}</td>
                        <td>${user.company_id}</td>
                        <td>${user.department}</td>
                        <td>${user.role}</td>
                        <td>${user.username}</td>
                        <td>${user.created_at}</td>
                    </tr>
                `;
            });
            userAccountsList.innerHTML = userAccountsHTML;
        }
    
        // Initial fetch and display
        fetchAndDisplayUserAccounts();
    
        // Add event listeners for search and filters
        searchUserAccountInput.addEventListener("input", applyUserAccountFilters);
        filterUserRoleSelect.addEventListener("change", applyUserAccountFilters);
    });

    // Logout Button (existing code)
    logoutBtn.addEventListener("click", function () {
        window.location.href = "/login.html"; // Redirect to login page
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dashboardBtn = document.getElementById("dashboardBtn");
    const contentDiv = document.getElementById("content");

    // Dashboard Button
    dashboardBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Dashboard</h2>
            <div class="dashboard-container">
                <div class="counter-boxes">
                    <div class="counter-box available-rooms">
                        <h3>Available Rooms</h3>
                        <p id="availableRoomsCount">0</p>
                    </div>
                    <div class="counter-box vacant-rooms">
                        <h3>Vacant Rooms</h3>
                        <p id="vacantRoomsCount">0</p>
                    </div>
                    <div class="counter-box reserved-rooms">
                        <h3>Reserved Rooms</h3>
                        <p id="reservedRoomsCount">0</p>
                    </div>
                    <div class="counter-box occupied-rooms">
                        <h3>Occupied Rooms</h3>
                        <p id="occupiedRoomsCount">0</p>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="roomTypeBarChart"></canvas>
                </div>
            </div>
        `;
    
        // Fetch room data and update counters and bar graph
        fetchRoomDataForDashboard();
    });
    
    function fetchRoomDataForDashboard() {
        fetch("http://localhost:3000/get-rooms")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error fetching room data:", data.error);
                    return;
                }
    
                // Update counters
                const availableRooms = data.filter((room) => room.status === "available").length;
                const vacantRooms = data.filter((room) => room.status === "vacant").length;
                const reservedRooms = data.filter((room) => room.status === "reserved").length;
                const occupiedRooms = data.filter((room) => room.status === "occupied").length;
    
                document.getElementById("availableRoomsCount").textContent = availableRooms;
                document.getElementById("vacantRoomsCount").textContent = vacantRooms;
                document.getElementById("reservedRoomsCount").textContent = reservedRooms;
                document.getElementById("occupiedRoomsCount").textContent = occupiedRooms;
    
                // Update bar graph
                const roomTypeCounts = {
                    standard: data.filter((room) => room.room_type === "standard").length,
                    deluxe: data.filter((room) => room.room_type === "deluxe").length,
                    suite: data.filter((room) => room.room_type === "suite").length,
                };
    
                renderBarChart(roomTypeCounts);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    
    function renderBarChart(roomTypeCounts) {
        const ctx = document.getElementById("roomTypeBarChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Standard", "Deluxe", "Suite"],
                datasets: [{
                    label: "Room Types",
                    data: [roomTypeCounts.standard, roomTypeCounts.deluxe, roomTypeCounts.suite],
                    backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const createRoomsBtn = document.getElementById("createRoomsBtn");
    const contentDiv = document.getElementById("content");

    // Create Rooms Button
    createRoomsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Create Rooms</h2>
            <div class="create-room-container">
                <div class="filters-and-button">
                    <div class="filters">
                        <input type="text" id="searchRoom" placeholder="Search by Room Number or Price...">
                        <select id="filterFloor">
                            <option value="">All Floors</option>
                            ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Floor ${i + 1}</option>`).join("")}
                        </select>
                        <select id="filterRoomType">
                            <option value="">All Room Types</option>
                            <option value="standard">Standard</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="suite">Suite</option>
                        </select>
                        <select id="filterStatus">
                            <option value="">All Statuses</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <button id="openAddRoomModal" class="add-room-button">Add Room</button>
                </div>
                <div id="addRoomModal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>Add Room</h2>
                        <form id="createRoomForm">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="room_number">Room Number:</label>
                                    <input type="text" id="room_number" name="room_number" required>
                                </div>
                                <div class="form-group">
                                    <label for="floor">Floor:</label>
                                    <input type="number" id="floor" name="floor" required>
                                </div>
                                <div class="form-group">
                                    <label for="room_type">Room Type:</label>
                                    <select id="room_type" name="room_type" required>
                                        <option value="standard">Standard</option>
                                        <option value="deluxe">Deluxe</option>
                                        <option value="suite">Suite</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="bed_type">Bed Type:</label>
                                    <select id="bed_type" name="bed_type" required>
                                        <!-- Bed types will be dynamically populated based on room type -->
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="price_per_night">Price Per Night:</label>
                                    <input type="number" id="price_per_night" name="price_per_night" step="0.01" required>
                                </div>
                                <div class="form-group">
                                    <label for="status">Status:</label>
                                    <select id="status" name="status" required>
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="reserved">Reserved</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="max_occupancy">Max Occupancy:</label>
                                    <input type="number" id="max_occupancy" name="max_occupancy" required>
                                </div>
                                <div class="form-group">
                                    <label for="amenities">Amenities:</label>
                                    <div id="amenitiesCheckboxes" class="amenities-checkboxes"></div>
                                </div>
                                <div class="form-group">
                                    <label for="image_url">Image URL:</label>
                                    <input type="text" id="image_url" name="image_url">
                                </div>
                            </div>
                            <button type="submit">Add Room</button>
                        </form>
                    </div>
                </div>
                <div class="rooms-table-container">
                    <h3>Room List</h3>
                    <table id="roomsTable">
                        <thead>
                            <tr>
                                <th>Room Number</th>
                                <th>Floor</th>
                                <th>Room Type</th>
                                <th>Bed Type</th>
                                <th>Price Per Night</th>
                                <th>Status</th>
                                <th>Amenities</th>
                            </tr>
                        </thead>
                        <tbody id="roomsList"></tbody>
                    </table>
                </div>
            </div>
        `;

        // Modal functionality
        const modal = document.getElementById("addRoomModal");
        const openModalBtn = document.getElementById("openAddRoomModal");
        const closeModalBtn = document.querySelector(".close");

        openModalBtn.addEventListener("click", () => {
            modal.style.display = "block";
        });

        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        // Dynamically populate bed types and amenities
        const roomTypeSelect = document.getElementById("room_type");
        const bedTypeSelect = document.getElementById("bed_type");
        const amenitiesCheckboxes = document.getElementById("amenitiesCheckboxes");

        const bedTypes = {
            standard: ["Single (Twin) Bed", "Twin XL Bed", "Full (Double) Bed", "Bunk Bed"],
            deluxe: ["Queen Bed", "King Bed", "Sofa Bed"],
            suite: ["California King Bed", "Four-Poster Bed", "Round Bed", "Murphy Bed"],
        };

        const amenities = {
            standard: [
                "Basic Cable TV",
                "Free Standard WiFi",
                "Private Bathroom with Shower",
                "Air Conditioning",
                "Mini Fridge",
                "Complimentary Toiletries",
            ],
            deluxe: [
                "Smart TV with Streaming (Netflix, YouTube)",
                "Free High-Speed WiFi",
                "Private Bathroom with Bathtub",
                "Balcony with View",
                "Coffee Maker",
                "Work Desk",
                "Premium Toiletries",
            ],
            suite: [
                "55-inch Smart TV with Streaming Services",
                "High-Speed WiFi with Dedicated Router",
                "Jacuzzi or Spa Bath",
                "Walk-in Shower",
                "Living Room Area",
                "Dining Table",
                "Private Lounge Access",
                "Complimentary Snacks & Drinks",
                "Bathrobe & Slippers",
            ],
        };

        roomTypeSelect.addEventListener("change", function () {
            const selectedRoomType = roomTypeSelect.value;
            bedTypeSelect.innerHTML = bedTypes[selectedRoomType]
                .map((bedType) => `<option value="${bedType}">${bedType}</option>`)
                .join("");

            amenitiesCheckboxes.innerHTML = amenities[selectedRoomType]
                .map(
                    (amenity) => `
                    <label>
                        <input type="checkbox" name="amenities" value="${amenity}"> ${amenity}
                    </label>
                `
                )
                .join("");
        });

        // Trigger change event to populate bed types and amenities initially
        roomTypeSelect.dispatchEvent(new Event("change"));

        // Handle form submission
        const form = document.getElementById("createRoomForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const selectedAmenities = Array.from(
                document.querySelectorAll('input[name="amenities"]:checked')
            ).map((checkbox) => checkbox.value);

            const room = {
                room_number: document.getElementById("room_number").value,
                floor: document.getElementById("floor").value,
                room_type: document.getElementById("room_type").value,
                bed_type: document.getElementById("bed_type").value,
                price_per_night: document.getElementById("price_per_night").value,
                status: document.getElementById("status").value,
                max_occupancy: document.getElementById("max_occupancy").value,
                amenities: selectedAmenities.join(", "),
                image_url: document.getElementById("image_url").value,
            };

            // Send data to the backend
            fetch("http://localhost:3000/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(room),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Room created successfully!");
                        form.reset();
                        modal.style.display = "none";
                        fetchAndDisplayRooms(); // Refresh the room list
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to create room.");
                });
        });

        // Fetch and display rooms
        fetchAndDisplayRooms();

        // Add event listeners for search and filters
        const searchRoomInput = document.getElementById("searchRoom");
        const filterFloorSelect = document.getElementById("filterFloor");
        const filterRoomTypeSelect = document.getElementById("filterRoomType");
        const filterStatusSelect = document.getElementById("filterStatus");

        searchRoomInput.addEventListener("input", applyFilters);
        filterFloorSelect.addEventListener("change", applyFilters);
        filterRoomTypeSelect.addEventListener("change", applyFilters);
        filterStatusSelect.addEventListener("change", applyFilters);
    });

    // Function to fetch and display rooms
    function fetchAndDisplayRooms() {
        fetch("http://localhost:3000/get-rooms")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error fetching rooms:", data.error);
                    return;
                }

                const roomsList = document.getElementById("roomsList");
                roomsList.innerHTML = data
                    .map(
                        (room) => `
                        <tr>
                            <td>${room.room_number}</td>
                            <td>${room.floor}</td>
                            <td>${room.room_type}</td>
                            <td>${room.bed_type}</td>
                            <td>$${room.price_per_night}</td>
                            <td>${room.status}</td>
                            <td><ul>${room.amenities.split(", ").map((amenity) => `<li>${amenity}</li>`).join("")}</ul></td>
                        </tr>
                    `
                    )
                    .join("");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Function to apply filters
    function applyFilters() {
        const searchTerm = document.getElementById("searchRoom").value.toLowerCase();
        const selectedFloor = document.getElementById("filterFloor").value;
        const selectedRoomType = document.getElementById("filterRoomType").value;
        const selectedStatus = document.getElementById("filterStatus").value;

        fetch("http://localhost:3000/get-rooms")
            .then((response) => response.json())
            .then((data) => {
                const filteredRooms = data.filter((room) => {
                    const matchesSearch =
                        room.room_number.toLowerCase().includes(searchTerm) ||
                        room.price_per_night.toString().includes(searchTerm);
                    const matchesFloor = selectedFloor === "" || room.floor.toString() === selectedFloor;
                    const matchesRoomType = selectedRoomType === "" || room.room_type === selectedRoomType;
                    const matchesStatus = selectedStatus === "" || room.status === selectedStatus;

                    return matchesSearch && matchesFloor && matchesRoomType && matchesStatus;
                });

                const roomsList = document.getElementById("roomsList");
                roomsList.innerHTML = filteredRooms
                    .map(
                        (room) => `
                        <tr>
                            <td>${room.room_number}</td>
                            <td>${room.floor}</td>
                            <td>${room.room_type}</td>
                            <td>${room.bed_type}</td>
                            <td>$${room.price_per_night}</td>
                            <td>${room.status}</td>
                            <td><ul>${room.amenities.split(", ").map((amenity) => `<li>${amenity}</li>`).join("")}</ul></td>
                        </tr>
                    `
                    )
                    .join("");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
});

