"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
class TaskController {
    constructor(pool) {
        this.service = new task_service_1.TaskService(pool);
    }
    async getTasks(req, res) {
        try {
            const tasks = await this.service.getTasks();
            res.status(200).json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
    async createTask(req, res) {
        try {
            const task = await this.service.createTask(req.body);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const task = await this.service.updateTask(id, req.body);
            res.status(200).json(task);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const result = await this.service.deleteTask(id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map