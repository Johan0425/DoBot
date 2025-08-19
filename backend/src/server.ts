/**
 * Express server application for DoBot backend API.
 * 
 * This server provides a RESTful API for task management and chat functionality.
 * It uses Prisma as the ORM for database operations and follows a clean architecture
 * pattern with repositories, use cases, and controllers.
 * 
 * @remarks
 * The server includes:
 * - Task CRUD operations (GET, POST, PUT, DELETE)
 * - Chat message processing endpoint
 * - Health check endpoint
 * - Graceful shutdown handling for SIGINT and SIGTERM signals
 * - CORS and JSON middleware configuration
 * 
 * @example
 * ```bash
 * # Start the server
 * npm start
 * 
 * # Server will be available at http://localhost:3000
 * ```
 * 
 * @see {@link TaskController} - Handles task-related HTTP requests
 * @see {@link ChatController} - Handles chat message processing
 * @see {@link PrismaClient} - Database client for data persistence
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { TaskRepository } from './repositories/task.repository';
import { TaskUseCase } from './use-cases/task.use-case';
import { TaskController } from './controllers/task.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatUseCase } from './use-cases/chat.use-case';
import { ChatController } from './controllers/chat.controller';



dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const taskRepository = new TaskRepository(prisma);
const taskUseCase = new TaskUseCase(taskRepository);
const taskController = new TaskController(taskUseCase);
const chatRepository = new ChatRepository(prisma);
const chatUseCase = new ChatUseCase(chatRepository, taskRepository);
const chatController = new ChatController(chatUseCase);


app.get('/api/tasks', (req, res) => taskController.getTasks(req, res));
app.get('/api/tasks/:id', (req, res) => taskController.getTaskById(req, res));
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.put('/api/tasks/:id', (req, res) => taskController.updateTask(req, res));
app.delete('/api/tasks/:id', (req, res) => taskController.deleteTask(req, res));
app.post('/api/chat', (req, res) => chatController.processMessage(req, res));

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});