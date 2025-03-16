document.addEventListener("DOMContentLoaded", function () {
    const dashboardBtn = document.getElementById("dashboardBtn");
    const reservedRoomBtn = document.getElementById("reservedRoomBtn");
    const reportsBtn = document.getElementById("reportsBtn");
    const updateRoomsBtn = document.getElementById("updateRoomsBtn");
    const requestHousekeepingBtn = document.getElementById("requestHousekeepingBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const contentDiv = document.getElementById("content");

    // Load default content
    contentDiv.innerHTML = "<h2>Welcome, Frontdesk</h2><p>Select an option from the sidebar to get started.</p>";

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

    // Reserved Room Button
    reservedRoomBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Reserved Rooms</h2>
            <div class="reserved-rooms-container">
                <div class="filters">
                    <input type="text" id="searchRoom" placeholder="Search by Room Number...">
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
                <table id="reservedRoomsTable">
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Status</th>
                            <th>Room Type</th>
                            <th>Amenities</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="reservedRoomsList"></tbody>
                </table>
            </div>
        `;

        // Fetch and display reserved rooms
        fetchReservedRooms();

        // Add event listeners for search and filters
        const searchRoomInput = document.getElementById("searchRoom");
        const filterRoomTypeSelect = document.getElementById("filterRoomType");
        const filterStatusSelect = document.getElementById("filterStatus");

        searchRoomInput.addEventListener("input", applyFilters);
        filterRoomTypeSelect.addEventListener("change", applyFilters);
        filterStatusSelect.addEventListener("change", applyFilters);
    });

    // Reports Button
    reportsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Reports</h2>
            <div class="reports-container">
                <div class="report-filters">
                    <input type="date" id="startDate" placeholder="Start Date">
                    <input type="date" id="endDate" placeholder="End Date">
                    <button id="generateReportBtn">Generate Report</button>
                </div>
                <div id="reportResults"></div>
            </div>
        `;

        // Generate Report Button
        const generateReportBtn = document.getElementById("generateReportBtn");
        generateReportBtn.addEventListener("click", function () {
            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;

            if (!startDate || !endDate) {
                alert("Please select both start and end dates.");
                return;
            }

            fetchReports(startDate, endDate);
        });
    });

    // Update Rooms to Checkout Button
    updateRoomsBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Update Rooms to Checkout</h2>
            <div class="update-rooms-container">
                <table id="updateRoomsTable">
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Floor</th>
                            <th>Room Type</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="updateRoomsList"></tbody>
                </table>
            </div>
        `;

        // Fetch and display rooms for checkout
        fetchRoomsForCheckout();
    });

    // Request Housekeeping Button
    requestHousekeepingBtn.addEventListener("click", function () {
        contentDiv.innerHTML = `
            <h2>Request Housekeeping</h2>
            <div class="request-housekeeping-container">
                <form id="requestHousekeepingForm">
                    <div class="form-group">
                        <label for="roomNumber">Room Number:</label>
                        <input type="text" id="roomNumber" name="roomNumber" required>
                    </div>
                    <div class="form-group">
                        <label for="requestType">Request Type:</label>
                        <select id="requestType" name="requestType" required>
                            <option value="clean">Clean</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" required></textarea>
                    </div>
                    <button type="submit">Submit Request</button>
                </form>
            </div>
        `;

        // Handle form submission
        const form = document.getElementById("requestHousekeepingForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const request = {
                roomNumber: document.getElementById("roomNumber").value,
                requestType: document.getElementById("requestType").value,
                description: document.getElementById("description").value,
            };

            // Send request to the backend
            fetch("http://localhost:3000/request-housekeeping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Housekeeping request submitted successfully!");
                        form.reset();
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to submit housekeeping request.");
                });
        });
    });

    // Logout Button
    logoutBtn.addEventListener("click", function () {
        window.location.href = "/login.html"; // Redirect to login page
    });

    // Function to fetch room data for the dashboard
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

    // Function to render the bar chart
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

    // Function to fetch reserved rooms
    function fetchReservedRooms() {
        fetch("http://localhost:3000/get-reserved-rooms")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error fetching reserved rooms:", data.error);
                    return;
                }

                const reservedRoomsList = document.getElementById("reservedRoomsList");
                reservedRoomsList.innerHTML = data
                    .map(
                        (room) => `
                        <tr>
                            <td>${room.room_number}</td>
                            <td>${room.floor}</td>
                            <td>${room.room_type}</td>
                            <td>${room.reserved_by}</td>
                            <td>${room.check_in_date}</td>
                            <td>${room.check_out_date}</td>
                        </tr>
                    `
                    )
                    .join("");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Function to fetch reports
    function fetchReports(startDate, endDate) {
        fetch(`http://localhost:3000/get-reports?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error fetching reports:", data.error);
                    return;
                }

                const reportResults = document.getElementById("reportResults");
                reportResults.innerHTML = `
                    <h3>Report from ${startDate} to ${endDate}</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Function to fetch rooms for checkout
    function fetchRoomsForCheckout() {
        fetch("http://localhost:3000/get-rooms-for-checkout")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error fetching rooms for checkout:", data.error);
                    return;
                }

                const updateRoomsList = document.getElementById("updateRoomsList");
                updateRoomsList.innerHTML = data
                    .map(
                        (room) => `
                        <tr>
                            <td>${room.room_number}</td>
                            <td>${room.floor}</td>
                            <td>${room.room_type}</td>
                            <td>${room.status}</td>
                            <td><button onclick="updateRoomStatus('${room.room_number}', 'checked-out')">Checkout</button></td>
                        </tr>
                    `
                    )
                    .join("");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Function to update room status
    window.updateRoomStatus = function (roomNumber, status) {
        fetch("http://localhost:3000/update-room-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomNumber, status }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                return;
                }
                alert("Room status updated successfully!");
                fetchRoomsForCheckout(); // Refresh the list
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to update room status.");
            });
    };
});

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default action of the button

            // Perform any logout operations here, such as clearing session data or tokens

            // Redirect to the login page
            window.location.href = 'Front_Desk_Staff_Login.html'; // Update the path to your login page
        });
    }
});