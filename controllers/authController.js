const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

module.exports = { registerUser, loginUser };
