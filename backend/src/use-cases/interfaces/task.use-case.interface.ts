/**
 * Interface defining the contract for task-related use case operations.
 * Provides methods for CRUD operations on tasks including retrieval, creation,
 * updating, and deletion. All operations are asynchronous and return promises
 * with appropriate DTOs for type safety.
 */
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from '../../shared/dto/task.dto';



export interface ITaskUseCase {
  getAllTasks(): Promise<TaskResponseDTO[]>;
  getTaskById(id: number): Promise<TaskResponseDTO>;
  createTask(taskData: CreateTaskDTO): Promise<TaskResponseDTO>;
  updateTask(id: number, taskData: UpdateTaskDTO): Promise<TaskResponseDTO>;
  deleteTask(id: number): Promise<{ success: boolean; message: string }>;
}