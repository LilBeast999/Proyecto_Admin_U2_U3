const express = require('express');
const router = express.Router();

// Importa los controladores usando destructuring
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask
} = require('../controllers/taskController');


// define las rutas disponibles para las tareas
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);

// exporta el router de tareas
module.exports = router;