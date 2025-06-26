const db = require('../utils/db');
const { runQuery } = require('../utils/db');
const os = require('os');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // revisa que name y email estén presentes
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    // valida que el email tenga @
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    // inserta el nuevo usuario en la bd
    const result = await runQuery(
      'INSERT INTO users (name, email) VALUES (?, ?) RETURNING *',
      [name, email]
    );
    
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await runQuery('SELECT * FROM users');
    res.status(200).json({ instance: os.hostname(), data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // validar que el ID sea un número válido
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const users = await runQuery('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // devolver el usuario (no un array)
    res.status(200).json({ instance: os.hostname(), data: users[0] });
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
};