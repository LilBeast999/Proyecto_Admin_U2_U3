const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

// define las rutas para operaciones con usuarios
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);


// exporta el router configurado
module.exports = router;