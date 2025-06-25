const express = require('express');
const taskRoutes = require('./routes/taskRoutes'); 
const { initDb } = require('./utils/db');  // Corregir la importación

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // prepara el servidor para procesar json

// Health check
app.get('/api/tasks/health', (req, res) => {
  res.status(200).json({ status: 'tasks_healthy' });
});

// Rutas
app.use('/api/tasks', taskRoutes); // configura las rutas de tareas

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'task-service' }); // endpoint para comprobar que el servicio está activo
});

// Iniciar servidor
app.listen(PORT, () => {
  initDb().then(() => {
    console.log('database initialized');
  }).catch(err => {
    console.error('database initialization failed:', err);
  });
  console.log(`task service running on port ${PORT}`);
});