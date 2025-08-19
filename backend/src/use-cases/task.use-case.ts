/**
 * TaskUseCase implements the business logic for task operations.
 * 
 * This class serves as an intermediary between the presentation layer and the data access layer,
 * providing a clean interface for task-related operations including CRUD functionality.
 * It handles validation, error handling, and coordinates with the task repository to perform
 * data operations while maintaining separation of concerns.
 * 
 * @implements {ITaskUseCase}
 * 
 * @example
 * ```typescript
 * const taskRepository = new TaskRepository();
 * const taskUseCase = new TaskUseCase(taskRepository);
 * 
 * // Get all tasks
 * const tasks = await taskUseCase.getAllTasks();
 * 
 * // Create a new task
 * const newTask = await taskUseCase.createTask({
 *   title: "New Task",
 *   description: "Task description"
 * });
 * ```
 */
import { ITaskUseCase } from './interfaces/task.use-case.interface';
import { ITaskRepository } from '../repositories/interfaces/task.repository.interface';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from '../shared/dto/task.dto';



export class TaskUseCase implements ITaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async getAllTasks(): Promise<TaskResponseDTO[]> {
    return await this.taskRepository.findAll();
  }

  async getTaskById(id: number): Promise<TaskResponseDTO> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  async createTask(taskData: CreateTaskDTO): Promise<TaskResponseDTO> {
    return await this.taskRepository.create(taskData);
  }

  async updateTask(id: number, taskData: UpdateTaskDTO): Promise<TaskResponseDTO> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = await this.taskRepository.update(id, taskData);
    if (!updatedTask) {
      throw new Error(`Failed to update task with id ${id}`);
    }

    return updatedTask;
  }

  async deleteTask(id: number): Promise<{ success: boolean; message: string }> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    const deleted = await this.taskRepository.delete(id);
    return {
      success: deleted,
      message: deleted ? 'Task deleted successfully' : 'Failed to delete task'
    };
  }
}