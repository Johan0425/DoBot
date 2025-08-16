"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
// src/services/task.service.ts
const task_repository_1 = require("../repositories/task.repository");
class TaskService {
    constructor(pool) {
        this.repository = new task_repository_1.TaskRepository(pool);
    }
    async getTasks() {
        return this.repository.findAll();
    }
    async createTask(taskData) {
        // Business logic can go here, for example, validation
        const { title, description, status, assignee } = taskData;
        if (!title || !description || !status || !assignee) {
            throw new Error('All fields are required.');
        }
        return this.repository.create({ title, description, status, assignee });
    }
    async updateTask(id, taskData) {
        const task = await this.repository.findById(id);
        if (!task) {
            throw new Error('Task not found.');
        }
        return this.repository.update(id, taskData);
    }
    async deleteTask(id) {
        const success = await this.repository.delete(id);
        if (!success) {
            throw new Error('Task not found.');
        }
        return { message: 'Task deleted successfully.' };
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map