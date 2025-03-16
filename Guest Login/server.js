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

// Guest Registration Endpoint
app.post('/registerGuest', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        guestType,
        nationality,
        country,
        idType,
        idNumber,
        username,
        password,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !guestType || !nationality || !country || !idType || !idNumber || !username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error hashing password' });
        }

        // Insert guest into the database
        const insertQuery = `
            INSERT INTO guests (
                first_name, last_name, email, phone_number, guest_type, 
                nationality, country, id_type, id_number, username, password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [
            firstName,
            lastName,
            email,
            phoneNumber,
            guestType,
            nationality,
            country,
            idType,
            idNumber,
            username,
            hash,
        ], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            res.json({ success: true, message: 'Guest registration successful!' });
        });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM guests WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
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

            res.json({ success: true, message: 'Login successful!', redirectUrl: '/homepage.html' });
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});