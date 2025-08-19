/**
 * Interface for task repository operations providing CRUD functionality for tasks.
 * @interface ITaskRepository
 * @method findAll - Retrieves all tasks from the repository
 * @method findById - Finds a specific task by its ID, returns null if not found
 * @method create - Creates a new task with the provided data and returns the created task
 * @method update - Updates an existing task by ID with new data, returns null if task not found
 * @method delete - Removes a task by ID and returns true if successful, false otherwise
 */
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from '../../shared/dto/task.dto';

export interface ITaskRepository {
  findAll(): Promise<TaskResponseDTO[]>;
  findById(id: number): Promise<TaskResponseDTO | null>;
  create(taskData: CreateTaskDTO): Promise<TaskResponseDTO>;
  update(id: number, taskData: UpdateTaskDTO): Promise<TaskResponseDTO | null>;
  delete(id: number): Promise<boolean>;
}

