import { Request, Response } from 'express';
import { ITaskUseCase } from '../use-cases/interfaces/task.use-case.interface';
import { TaskValidator } from '../shared/validators/task.validator';

export class TaskController {
  constructor(private taskUseCase: ITaskUseCase) {}

  /**
   * Retrieves all tasks from the system.
   * 
   * @param _req - The HTTP request object (unused)
   * @param res - The HTTP response object used to send the task data or error response
   * @returns A Promise that resolves to void
   * 
   * @remarks
   * This method fetches all tasks using the task use case and returns them as JSON.
   * If an error occurs during the operation, it responds with a 500 status code
   * and an error message.
   * 
   * @example
   * ```typescript
   * // GET /tasks
   * // Response: 200 OK with array of tasks
   * // or 500 Internal Server Error with error details
   * ```
   */
  async getTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskUseCase.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Retrieves a task by its ID.
   * 
   * @param req - Express request object containing the task ID in params
   * @param res - Express response object used to send the HTTP response
   * @returns Promise<void> - Resolves when the response has been sent
   * 
   * @throws {400} When the provided ID is invalid (not a number or <= 0)
   * @throws {404} When the task with the specified ID is not found
   * @throws {500} When an internal server error occurs
   * 
   * @example
   * ```
   * GET /tasks/123
   * Response: { id: 123, title: "Task Title", ... }
   * ```
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const task = await this.taskUseCase.getTaskById(id);
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Creates a new task with validated data.
   * 
   * @param req - Express request object containing task data in the body
   * @param res - Express response object used to send the created task or error response
   * @returns Promise<void> - Resolves when the response has been sent
   * 
   * @throws Will return a 400 status with validation error if the request body is invalid
   * @throws Will return a 400 status with error message if task creation fails
   * 
   * @example
   * ```typescript
   * // POST /tasks
   * // Request body: { title: "New Task", description: "Task description" }
   * // Response: 201 with created task object
   * ```
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = TaskValidator.validateCreate(req.body);
      const task = await this.taskUseCase.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ 
        error: 'Validation error',
        message: error instanceof Error ? error.message : 'Invalid data'
      });
    }
  }

    /**
   * Updates an existing task with the provided data.
   * 
   * @param req - Express request object containing the task ID in params and update data in body
   * @param res - Express response object used to send the updated task or error response
   * @returns Promise<void> - Resolves when the response has been sent
   * 
   * @throws {400} When task ID is invalid (NaN or <= 0)
   * @throws {400} When validation fails or invalid data is provided
   * @throws {404} When the task with the specified ID is not found
   * 
   * @example
   * ```
   * PUT /tasks/123
   * Body: { title: "Updated Task Title", description: "New description" }
   * ```
   */

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const validatedData = TaskValidator.validateUpdate(req.body);
      const task = await this.taskUseCase.updateTask(id, validatedData);
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ 
          error: 'Validation error',
          message: error instanceof Error ? error.message : 'Invalid data'
        });
      }
    }
  }

  /**
   * Deletes a task by its ID.
   * 
   * @param req - Express request object containing the task ID in params
   * @param res - Express response object used to send the HTTP response
   * @returns Promise<void> - Returns nothing, but sends JSON response with deletion result
   * 
   * @throws {400} When the provided task ID is invalid (not a number or <= 0)
   * @throws {404} When the task with the specified ID is not found
   * @throws {500} When an internal server error occurs during deletion
   * 
   * @example
   * ```
   * DELETE /tasks/123
   * Response: { success: true, message: "Task deleted successfully" }
   * ```
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const result = await this.taskUseCase.deleteTask(id);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }
}