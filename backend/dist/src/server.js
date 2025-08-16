"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const task_controller_1 = require("./controllers/task.controller"); // Ensure this file exists at the correct path
// Database Connection
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'dobot',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'dobot',
    password: process.env.DB_PASSWORD || 'dobotpassword',
    port: 5432,
});
// Create tasks table if it doesn't exist
const createTable = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        assignee VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Tasks table checked/created successfully.');
    }
    catch (err) {
        console.error('Error creating tasks table:', err);
    }
    finally {
        client.release();
    }
};
// Server Initialization
const app = (0, express_1.default)();
const PORT = 3000;
const taskController = new task_controller_1.TaskController(pool);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/api/tasks', (req, res) => taskController.getTasks(req, res));
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.put('/api/tasks/:id', (req, res) => taskController.updateTask(req, res));
app.delete('/api/tasks/:id', (req, res) => taskController.deleteTask(req, res));
// Start the server and connect to the database
const startServer = async () => {
    await createTable();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map