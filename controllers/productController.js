const pool = require('../db');

// Add a new product
const createProduct = async (req, res) => {
  const { userId, name, description, price, imageUrl } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (user_id, name, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, description, price, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

module.exports = { createProduct, getAllProducts };
