const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// Sign Up route
router.post('/signup', async (req, res) => {
  const { name, studentId, dormName, roomNumber, email, password } = req.body;

  if (!name || !studentId || !dormName || !roomNumber || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new student
    await db.query(
      'INSERT INTO students (name, studentId, dormName, roomNumber, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, studentId, dormName, roomNumber, email, hashedPassword]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// Sign In route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, student: { name: user.name, dormName: user.dormName, studentId: user.studentId, email: user.email } });

  } catch (err) {
    console.error('Signin error:', err);
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
