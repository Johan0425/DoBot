// src/services/task.service.ts
import { TaskRepository } from '../repositories/task.repository';
import { Pool } from 'pg';

// Type Definitions
interface TaskData {
  title: string;
  description: string;
  status: 'Created' | 'In Progress' | 'Blocked' | 'Completed' | 'Cancelled';
  assignee: string;
}

export class TaskService {
  private repository: TaskRepository;

  constructor(pool: Pool) {
    this.repository = new TaskRepository(pool);
  }

  public async getTasks() {
    return this.repository.findAll();
  }

  public async createTask(taskData: TaskData) {
    // Business logic can go here, for example, validation
    const { title, description, status, assignee } = taskData;
    if (!title || !description || !status || !assignee) {
      throw new Error('All fields are required.');
    }
    return this.repository.create({ title, description, status, assignee });
  }

  public async updateTask(id: string, taskData: Partial<TaskData>) {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new Error('Task not found.');
    }
    return this.repository.update(id, taskData);
  }

  public async deleteTask(id: string) {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new Error('Task not found.');
    }
    return { message: 'Task deleted successfully.' };
  }
}
