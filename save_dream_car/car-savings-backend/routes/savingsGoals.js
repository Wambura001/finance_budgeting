const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres', 
  host: 'localhost', 
  database: 'car_saving_db', 
  password: '1738', 
  port: 5432,
});

// Route for creating a new savings goal
router.post('/', async (req, res) => {
  try {
    const { userId, carId, carPrice, targetDate } = req.body;

    // Input validation
    if (!userId || !carId || !carPrice || !targetDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await pool.query(
      'INSERT INTO savings_goals (user_id, car_id, car_price, target_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, carId, carPrice, targetDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating savings goal:', error);
    res.status(500).json({ error: 'Failed to create savings goal.' });
  }
});

// Get all savings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); // Parse userId from URL parameter

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const result = await pool.query(
      'SELECT * FROM savings_goals WHERE user_id = $1',
      [userId]
    );

    res.status(200).json(result.rows); // 200 OK
  } catch (error) {
    console.error('Error getting savings goals:', error);
    res.status(500).json({ error: 'Failed to get savings goals.' });
  }
});

// Get a specific savings goal by ID
router.get('/:goalId', async (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);

    if (isNaN(goalId)) {
      return res.status(400).json({ error: 'Invalid goal ID.' });
    }

    const result = await pool.query(
      'SELECT * FROM savings_goals WHERE id = $1',
      [goalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found.' }); // 404 Not Found
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error getting savings goal:', error);
    res.status(500).json({ error: 'Failed to get savings goal.' });
  }
});

// Update Operation
router.put('/:goalId', async (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);
    const { carId, carPrice, targetDate } = req.body;

    if (isNaN(goalId)) {
      return res.status(400).json({ error: 'Invalid goal ID.' });
    }

    // Input validation
    if (!carId || !carPrice || !targetDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await pool.query(
      'UPDATE savings_goals SET car_id = $1, car_price = $2, target_date = $3 WHERE id = $4 RETURNING *',
      [carId, carPrice, targetDate, goalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found.' });
    }

    res.status(200).json(result.rows[0]); // 200 OK
  } catch (error) {
    console.error('Error updating savings goal:', error);
    res.status(500).json({ error: 'Failed to update savings goal.' });
  }
});

// Delete Operation
router.delete('/:goalId', async (req, res) => {
  try {
    const goalId = parseInt(req.params.goalId);

    if (isNaN(goalId)) {
      return res.status(400).json({ error: 'Invalid goal ID.' });
    }

    const result = await pool.query(
      'DELETE FROM savings_goals WHERE id = $1 RETURNING *',
      [goalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found.' });
    }

    res.status(200).json({ message: 'Savings goal deleted successfully.' });
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    res.status(500).json({ error: 'Failed to delete savings goal.' });
  }
});

module.exports = router;