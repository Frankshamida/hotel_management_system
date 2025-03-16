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

// Validate Company ID and Fetch Role
app.get('/validateCompanyId', (req, res) => {
    const companyId = req.query.companyId.trim();
    console.log("Validating company_id:", companyId);

    const query = `
        SELECT email, department AS role
        FROM employees
        WHERE TRIM(company_id) = ?
    `;

    db.query(query, [companyId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ valid: false });
        }

        if (results.length > 0) {
            res.json({ valid: true, email: results[0].email, role: results[0].role });
        } else {
            res.json({ valid: false, message: 'No matching company ID found' });
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

// Login endpoint
// GET endpoint for login
app.get('/login', (req, res) => {
    const { username, password } = req.query; // Get data from query parameters

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});