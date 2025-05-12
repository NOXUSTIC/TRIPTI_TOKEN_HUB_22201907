const express = require('express');
const router = express.Router();
const db = require('../db');
const moment = require('moment');

// Helper function to get current week-year string
function getCurrentWeekYear() {
  return moment().format('YYYY-[W]WW');
}

// Get token info for a student
router.get('/token-info/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Food_Table WHERE studentId = ? ORDER BY id DESC LIMIT 1', [studentId]);
    if (rows.length === 0) {
      // No record found, return default values
      return res.json({
        mealType: null,
        usedTokens: 0,
        remainingTokens: 13,
        totalTokens: 13,
        tokenWeekYear: null,
      });
    }
    const record = rows[0];
    res.json({
      mealType: record.mealType,
      usedTokens: record.usedTokens,
      remainingTokens: record.remainingTokens,
      totalTokens: 13,
      tokenWeekYear: record.tokenWeekYear,
    });
  } catch (err) {
    console.error('Get token info error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit token choice
router.post('/submit-token', async (req, res) => {
  const { studentId, mealType } = req.body;
  if (!studentId || !mealType) {
    return res.status(400).json({ message: 'studentId and mealType are required' });
  }

  const currentWeekYear = getCurrentWeekYear();

  try {
    // Check if token already taken this week
    const [existing] = await db.query(
      'SELECT * FROM Food_Table WHERE studentId = ? AND tokenWeekYear = ?',
      [studentId, currentWeekYear]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Token limit reached for this week' });
    }

    // Get last token record to calculate used and remaining tokens
    const [lastRecords] = await db.query(
      'SELECT * FROM Food_Table WHERE studentId = ? ORDER BY id DESC LIMIT 1',
      [studentId]
    );

    let usedTokens = 0;
    let remainingTokens = 13;

    if (lastRecords.length > 0) {
      usedTokens = lastRecords[0].usedTokens;
      remainingTokens = lastRecords[0].remainingTokens;
    }

    // Update tokens: usedTokens + 1, remainingTokens - 1
    usedTokens += 1;
    remainingTokens -= 1;

    // Insert new token record with item, quantity, and tokens_confirmed for orders summary and tokens used
    await db.query(
      'INSERT INTO Food_Table (studentId, mealType, usedTokens, remainingTokens, tokenWeekYear, item, quantity, tokens_confirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [studentId, mealType, usedTokens, remainingTokens, currentWeekYear, mealType, 1, 1]
    );

    res.json({ message: 'Token confirmed', usedTokens, remainingTokens, mealType });
  } catch (err) {
    console.error('Submit token error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
