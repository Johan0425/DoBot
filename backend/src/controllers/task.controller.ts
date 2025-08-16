// src/controllers/task.controller.ts
import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { Pool } from 'pg';

export class TaskController {
  private service: TaskService;

  constructor(pool: Pool) {
    this.service = new TaskService(pool);
  }

  public async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.service.getTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.service.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.service.updateTask(id, req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.deleteTask(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
}
