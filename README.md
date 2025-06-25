# Proyecto de Administración de Sistemas - Unidades 2 y 3

## 📋 Descripción del Proyecto

Sistema de gestión de usuarios y tareas desarrollado con arquitectura de microservicios usando Node.js, Express, SQLite y Docker. El proyecto implementa un gateway Nginx Proxy Manager para el enrutamiento de peticiones entre servicios.

### Características Principales

- **Arquitectura de Microservicios**: Separación de responsabilidades entre servicio de usuarios y tareas
- **Gateway de API**: Nginx Proxy Manager para enrutamiento y balanceo de carga
- **Persistencia de Datos**: Base de datos SQLite con volúmenes Docker para persistencia
- **Health Checks**: Monitoreo de salud de servicios
- **Manejo de Errores**: Respuestas HTTP apropiadas y logging

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐
│  Nginx Proxy Mgr   │ ← Puerto 80/81/443
│     (Gateway)       │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼────┐ ┌───▼────┐
│ User   │ │ Task   │
│Service │ │Service │
│:5000   │ │:5001   │
└────────┘ └────────┘
```

## 🚀 Instrucciones de Despliegue

### Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Docker Compose disponible
- Git para clonar el repositorio
- PowerShell (Windows) o terminal compatible

### 1. Clonar el Repositorio

```powershell
git clone https://github.com/LilBeast999/Proyecto_Admin_U2_U3
cd Proyecto_Admin_U2_U3
```

### 1. Estructura del Proyecto

```
Proyecto_Admin_U2_U3/
├── docker-compose.yml          # Configuración de servicios
├── README.md                   # Este archivo
├── nginx-proxy-manager/        # Datos del proxy
├── user-service/              # Microservicio de usuarios
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── task-service/              # Microservicio de tareas
    ├── Dockerfile
    ├── package.json
    └── src/
```

### 3. Despliegue con Docker Compose

```powershell
# Construir e iniciar todos los servicios
docker-compose up --build -d

# Verificar que todos los contenedores estén ejecutándose
docker ps

# Ver logs en tiempo real (opcional)
docker-compose logs -f
```

### 4. Verificación del Despliegue

```powershell
# Verificar que todos los contenedores estén healthy
docker ps

# Health checks individuales
curl.exe -i http://localhost/api/users/health
curl.exe -i http://localhost/api/tasks/health
```

## 🔧 Configuración del Nginx Proxy Manager

1. **Acceder al panel de administración**:
   - URL: http://localhost:81
   - Email por defecto: `admin@example.com`
   - Contraseña por defecto: `changeme`

2. **Configurar Proxy Hosts** (si es necesario):
   - `/api/users/*` → `user-service:5000`
   - `/api/tasks/*` → `task-service:5001`

## 📡 API Endpoints

### Servicio de Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar todos los usuarios |
| GET | `/api/users/{id}` | Obtener usuario específico |
| POST | `/api/users` | Crear nuevo usuario |
| GET | `/api/users/health` | Health check del servicio |

### Servicio de Tareas (`/api/tasks`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar todas las tareas |
| GET | `/api/tasks?user_id={id}` | Filtrar tareas por usuario |
| GET | `/api/tasks/{id}` | Obtener tarea específica |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/{id}` | Actualizar estado de tarea |
| GET | `/api/tasks/health` | Health check del servicio |

## 🧪 Ejemplos de Uso

### 1. Gestión de Usuarios

```powershell
# Listar usuarios (inicialmente vacío)
curl.exe -i http://localhost/api/users

# Crear nuevo usuario
curl.exe -i -X POST http://localhost/api/users `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Juan Pérez\",\"email\":\"juan@utalca.cl\"}"

# Obtener usuario específico
curl.exe -i http://localhost/api/users/1

# Probar validación (email duplicado)
curl.exe -i -X POST http://localhost/api/users `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Pedro\",\"email\":\"juan@utalca.cl\"}"
```

### 2. Gestión de Tareas

```powershell
# Listar tareas
curl.exe -i http://localhost/api/tasks

# Crear nueva tarea
curl.exe -i -X POST http://localhost/api/tasks `
  -H "Content-Type: application/json" `
  -d "{\"title\":\"Tarea 1\",\"description\":\"Descripción\",\"user_id\":1}"

# Actualizar estado de tarea
curl.exe -i -X PUT http://localhost/api/tasks/1 `
  -H "Content-Type: application/json" `
  -d "{\"status\":\"in progress\"}"

# Filtrar tareas por usuario
curl.exe -i "http://localhost/api/tasks?user_id=1"
```

## 🔍 Pruebas y Validaciones

## 🔍 Pruebas y Validaciones

### Scripts de Prueba Automatizadas

```powershell
# 1. Validaciones de Usuario
# Campos faltantes
curl.exe -i -X POST http://localhost/api/users `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Sin Email\"}"

# Usuario inexistente
curl.exe -i http://localhost/api/users/999

# 2. Validaciones de Tareas
# Usuario inexistente para tarea
curl.exe -i -X POST http://localhost/api/tasks `
  -H "Content-Type: application/json" `
  -d "{\"title\":\"Tarea Error\",\"user_id\":999}"

# Estado inválido
curl.exe -i -X PUT http://localhost/api/tasks/1 `
  -H "Content-Type: application/json" `
  -d "{\"status\":\"invalid_status\"}"

# 3. Pruebas de Persistencia
# Reiniciar contenedores y verificar datos
docker-compose restart
curl.exe -i http://localhost/api/users      # Datos deben persistir
curl.exe -i http://localhost/api/tasks      # Datos deben persistir

# 4. Pruebas de Resilencia
# Simular fallo del user-service
docker stop user-service
curl.exe -i -X POST http://localhost/api/tasks `
  -H "Content-Type: application/json" `
  -d "{\"title\":\"Test Offline\",\"user_id\":1}"

# Restaurar servicio
docker start user-service
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js v24 + Express.js
- **Base de Datos**: SQLite con persistencia
- **Containerización**: Docker + Docker Compose
- **Gateway**: Nginx Proxy Manager
- **Arquitectura**: Microservicios RESTful

## 📊 Esquemas de Base de Datos

### Tabla Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla Tasks
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📈 Estados de Tareas Válidos

- `pending`: Tarea creada, pendiente de inicio
- `in progress`: Tarea en desarrollo
- `completed`: Tarea finalizada


## 🔧 Comandos de Administración

### Gestión de Contenedores

```powershell
# Ver estado de servicios
docker-compose ps

# Ver logs específicos
docker-compose logs user-service
docker-compose logs task-service
docker-compose logs nginx-proxy

# Reiniciar servicios
docker-compose restart

# Parar todos los servicios
docker-compose down

# Limpiar volúmenes (⚠️ ELIMINA TODOS LOS DATOS)
docker-compose down -v
```





**Desarrollado por**: Gustavo Torres  
**Fecha**: Junio 2025  
**Curso**: Administración de Sistemas - Unidades 2 y 3