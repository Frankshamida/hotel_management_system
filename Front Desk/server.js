const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Frank@030901',
    database: 'retra_hotel_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Validate Company ID
app.get('/validateCompanyId', (req, res) => {
    const companyId = req.query.companyId.trim(); // Trim whitespace

    const query = 'SELECT * FROM employees WHERE TRIM(company_id) = ?';
    db.query(query, [companyId], (err, results) => {
        if (err) {
            return res.status(500).json({ valid: false });
        }

        if (results.length > 0) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { companyId, username, password, role } = req.body;

    // Validate inputs
    if (!companyId || !username || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if company_id exists and role matches
    const checkCompanyQuery = `
        SELECT e.employee_id, r.role_name 
        FROM employees e
        JOIN employee_roles er ON e.employee_id = er.employee_id
        JOIN roles r ON er.role_id = r.role_id
        WHERE e.company_id = ? AND r.role_name = ?
    `;

    db.query(checkCompanyQuery, [companyId, role], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid Company ID or Role' });
        }

        // Check if username already exists
        const checkUserQuery = 'SELECT * FROM front_desk_users WHERE username = ?';
        db.query(checkUserQuery, [username], (err, userResults) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (userResults.length > 0) {
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }

            // Hash the password
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error hashing password' });
                }

                // Insert new user into front_desk_users table
                const insertUserQuery = 'INSERT INTO front_desk_users (company_id, username, password, role) VALUES (?, ?, ?, ?)';
                db.query(insertUserQuery, [companyId, username, hash, role], (err, insertResults) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Database error' });
                    }

                    res.json({ success: true, message: 'Registration successful' });
                });
            });
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});