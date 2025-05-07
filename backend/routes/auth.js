  
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

// Password reset route with captcha validation
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, captchaResult, num1, num2, operation } = req.body;

  if (!email || !newPassword || !captchaResult || !num1 || !num2 || !operation) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  // Validate captcha result
  let validResult;
  switch (operation) {
    case 'add':
      validResult = num1 + num2;
      break;
    case 'subtract':
      validResult = num1 - num2;
      break;
    case 'multiply':
      validResult = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) {
        return res.json({ success: false, message: 'Division by zero is not allowed' });
      }
      validResult = num1 / num2;
      break;
    default:
      return res.json({ success: false, message: 'Invalid operation' });
  }

  if (parseFloat(captchaResult) !== validResult) {
    return res.json({ success: false, message: 'Captcha validation failed' });
  }

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const [result] = await db.query('UPDATE students SET password = ? WHERE email = ?', [hashedPassword, email]);

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'Email not found' });
    }

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
