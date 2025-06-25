const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { initDb } = require('./utils/db'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // prepara el servidor para recibir json

// Health real bajo /api/users/health
app.get('/api/users/health', (req, res) => {
  res.status(200).json({ status: 'users_healthy' });
});

// Rutas
app.use('/api/users', userRoutes); // registra rutas de usuario

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'user-service' }); // endpoint para comprobar que el servicio está activo
});

// Iniciar servidor
app.listen(PORT, () => {
  initDb();
  console.log(`User service running on port ${PORT}`); // arranca el servidor y prepara la base de datos
});