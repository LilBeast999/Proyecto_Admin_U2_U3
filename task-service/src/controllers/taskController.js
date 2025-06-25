const { runQuery } = require('../utils/db');  // Importar el db correcto
const axios = require('axios');
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5000';


// obtiene todas las tareas o filtra por usuario si envían user_id
exports.getAllTasks = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    // construye consulta básica
    let query = 'SELECT * FROM tasks';
    let params = [];
    
    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
    }
    
    const tasks = await runQuery(query, params);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// busca una tarea por su id y la devuelve si existe
exports.getTaskById = async (req, res) => {
  try {
    const tasks = await runQuery('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(tasks[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualiza el estado de una tarea validando valores permitidos
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;
    // verifica que status venga en el body
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    // define estados válidos
    const validStatuses = ['pending', 'in progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Valid options: ${validStatuses.join(', ')}` 
      });
    }
    
    // Actualizar tarea
    const result = await runQuery(
      'UPDATE tasks SET status = ? WHERE id = ? RETURNING *',
      [status, taskId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// crea una nueva tarea y primero comprueba que el usuario exista
exports.createTask = async (req, res) => {
  try {
    const { title, user_id } = req.body;
    
    // validaciones básicas
    if (!title || !user_id) {
      return res.status(400).json({ error: 'Title and user_id are required' });
    }

    // validar que el user_id sea un número válido
    if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
      return res.status(400).json({ error: 'user_id must be a positive integer' });
    }

    // verificar que el usuario existe en el servicio de usuarios
    try {
      console.log(`Validating user ${user_id} exists...`);
      const userResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${user_id}`, {
        timeout: 5000 // timeout de 5 segundos
      });
      
      // verificar que la respuesta contenga datos válidos del usuario
      if (!userResponse.data || userResponse.data.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      console.log(`User ${user_id} validated successfully`);
    } catch (userError) {
      console.error(`User validation failed for user_id ${user_id}:`, userError.message);
      
      // manejar diferentes tipos de errores
      if (userError.response) {
        // el servicio de usuarios respondió con un error
        if (userError.response.status === 404) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Error validating user' });
      } else if (userError.code === 'ECONNREFUSED' || userError.code === 'ETIMEDOUT') {
        // error de conexión con el servicio de usuarios
        return res.status(503).json({ error: 'User service unavailable' });
      } else {
        // otros errores de red
        return res.status(500).json({ error: 'Failed to validate user' });
      }
    }

    // Modificar la consulta para no incluir la columna description
    await runQuery(
      'INSERT INTO tasks (title, user_id) VALUES (?, ?)',
      [title, user_id]
    );

    // obtener la tarea recién creada
    const rows = await runQuery(
      'SELECT * FROM tasks WHERE id = last_insert_rowid()'
    );

    console.log(`Task created successfully for user ${user_id}`);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Task creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
};