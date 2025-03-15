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
            employees.company_id,  -- Include company_id
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

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});