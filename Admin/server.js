const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "Frank@030901", // Replace with your MySQL password
    database: "retra_hotel_system", // Replace with your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log("Database connected!");
});

// POST endpoint for login (existing code)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM front_desk_users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid username or password' });
            }

            // Redirect to dashboard on successful login
            res.json({
                success: true,
                message: 'Login successful',
                redirectUrl: '/Front Desk/Frontdesk_Dashboard.html'
            });
        });
    });
});

// Logout endpoint
app.get('/logout', (req, res) => {
    // Clear session or token (if applicable)
    // Example: If using sessions
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ success: false, message: "Logout failed" });
        }

        // Redirect to the login page
        res.redirect('/Front_Desk_Staff_Login.html');
    });
});

// Create Employee Endpoint
app.post("/create-employee", (req, res) => {
    const { first_name, last_name, email, phone_number, hire_date, salary, department, role, company_id } = req.body;

    // Validate required fields
    if (!company_id) {
        return res.status(400).json({ error: "Company ID is required." });
    }

    console.log("Received Data:", req.body); // Debugging: Log the received data

    // Insert into employees table
    const insertEmployeeSQL = `
        INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, salary, department, company_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertEmployeeSQL, [first_name, last_name, email, phone_number, hire_date, salary, department, company_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to create employee." });
        }

        const employeeId = result.insertId;

        // Find the role_id for the selected role
        const findRoleSQL = `SELECT role_id FROM roles WHERE role_name = ?`;
        db.query(findRoleSQL, [role], (err, roleResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to find role." });
            }

            const roleId = roleResult[0].role_id;

            // Insert into employee_roles table
            const assignRoleSQL = `
                INSERT INTO employee_roles (employee_id, role_id, assigned_date)
                VALUES (?, ?, ?)
            `;
            db.query(assignRoleSQL, [employeeId, roleId, hire_date], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Failed to assign role to employee." });
                }

                res.json({ message: "Employee created and role assigned successfully!" });
            });
        });
    });
});

// Get Employees Endpoint
app.get("/get-employees", (req, res) => {
    const sql = `
        SELECT 
            employees.employee_id,
            employees.first_name,
            employees.last_name,
            employees.email,
            employees.phone_number,
            employees.hire_date,
            employees.salary,
            employees.department,
            employees.company_id,
            roles.role_name
        FROM employees
        JOIN employee_roles ON employees.employee_id = employee_roles.employee_id
        JOIN roles ON employee_roles.role_id = roles.role_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch employees." });
        }
        console.log("Fetched Employees:", results); // Debugging: Log the fetched data
        res.json(results);
    });
});

// Get User Accounts Endpoint
app.get("/get-user-accounts", (req, res) => {
    const sql = `
        SELECT 
            employees.first_name,
            employees.last_name,
            employees.company_id,
            employees.department,
            front_desk_users.username,
            front_desk_users.role,
            front_desk_users.created_at
        FROM front_desk_users
        JOIN employees ON front_desk_users.company_id = employees.company_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch user accounts." });
        }
        console.log("Fetched User Accounts:", results); // Debugging: Log the fetched data
        res.json(results);
    });
});

app.get("/get-employees", (req, res) => {
    const sql = `
        SELECT 
            employees.employee_id,
            employees.first_name,
            employees.last_name,
            employees.email,
            employees.phone_number,
            employees.hire_date,
            employees.salary,
            employees.department,
            employees.company_id,
            roles.role_name
        FROM employees
        JOIN employee_roles ON employees.employee_id = employee_roles.employee_id
        JOIN roles ON employee_roles.role_id = roles.role_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch employees." });
        }
        res.json(results);
    });
});

app.post("/create-room", (req, res) => {
    const {
        room_number,
        floor,
        room_type,
        bed_type,
        price_per_night,
        status,
        max_occupancy,
        amenities,
        image_url,
    } = req.body;

    const sql = `
        INSERT INTO rooms (
            room_number, floor, room_type, bed_type, price_per_night, status, max_occupancy, amenities, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            room_number,
            floor,
            room_type,
            bed_type,
            price_per_night,
            status,
            max_occupancy,
            amenities,
            image_url,
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to create room." });
            }
            res.json({ message: "Room created successfully!" });
        }
    );
});

app.get("/get-rooms", (req, res) => {
    const sql = `SELECT * FROM rooms`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch rooms." });
        }
        res.json(results);
    });
});

app.post("/create-room", (req, res) => {
    const {
        room_number,
        floor,
        room_type,
        bed_type,
        price_per_night,
        status,
        max_occupancy,
        amenities,
        image_url,
    } = req.body;

    const sql = `
        INSERT INTO rooms (
            room_number, floor, room_type, bed_type, price_per_night, status, max_occupancy, amenities, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            room_number,
            floor,
            room_type,
            bed_type,
            price_per_night,
            status,
            max_occupancy,
            amenities,
            image_url,
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to create room." });
            }
            res.json({ message: "Room created successfully!" });
        }
    );
});

app.get("/get-rooms", (req, res) => {
    const sql = `SELECT * FROM rooms`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch rooms." });
        }
        res.json(results);
    });
});


// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});