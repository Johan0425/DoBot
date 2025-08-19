import { PrismaClient } from '@prisma/client';
import { ITaskRepository } from './interfaces/task.repository.interface';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from '../shared/dto/task.dto';

export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Retrieves all tasks from the database with their associated assignments and users.
   * 
   * @returns {Promise<TaskResponseDTO[]>} A promise that resolves to an array of task response DTOs,
   * ordered by creation date in descending order (newest first). Each task includes its assignments
   * and the users assigned to those assignments.
   * 
   * @throws {Error} Throws an error if the database query fails or if there's an issue with data mapping.
   */
  async findAll(): Promise<TaskResponseDTO[]> {
    const tasks = await this.prisma.task.findMany({
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return tasks.map(this.mapToResponseDTO);
  }

  /**
   * Finds a task by its unique identifier.
   * 
   * @param id - The unique identifier of the task to retrieve
   * @returns A Promise that resolves to a TaskResponseDTO if the task is found, or null if not found
   * @throws May throw database-related errors if the query fails
   */
  async findById(id: number): Promise<TaskResponseDTO | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    return task ? this.mapToResponseDTO(task) : null;
  }

  /**
   * Creates a new task with the provided data and optional user assignments.
   * 
   * @param taskData - The data for creating the task, including title, description, status, and user IDs
   * @returns A Promise that resolves to a TaskResponseDTO containing the created task with its assignments and user details
   * @throws Will throw an error if the database operation fails
   */
  async create(taskData: CreateTaskDTO): Promise<TaskResponseDTO> {
    const task = await this.prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status || 'Created',
        assignments: taskData.userIds && taskData.userIds.length > 0 ? {
          create: taskData.userIds.map(userId => ({
            userId
          }))
        } : undefined
      },
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    return this.mapToResponseDTO(task);
  }

  /**
   * Updates an existing task with the provided data.
   * 
   * If userIds are provided, this method will:
   * 1. Delete all existing task assignments for the task
   * 2. Create new assignments based on the provided user IDs
   * 
   * @param id - The unique identifier of the task to update
   * @param taskData - The data to update the task with, including optional title, description, status, and user assignments
   * @returns A Promise that resolves to the updated task as a TaskResponseDTO, or null if the task doesn't exist
   * @throws Will throw an error if the database operation fails
   */
  async update(id: number, taskData: UpdateTaskDTO): Promise<TaskResponseDTO | null> {
    if (taskData.userIds !== undefined) {
      await this.prisma.taskAssignment.deleteMany({
        where: { taskId: id }
      });
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(taskData.title && { title: taskData.title }),
        ...(taskData.description !== undefined && { description: taskData.description }),
        ...(taskData.status && { status: taskData.status }),
        ...(taskData.userIds !== undefined && {
          assignments: taskData.userIds.length > 0 ? {
            create: taskData.userIds.map(userId => ({
              userId
            }))
          } : undefined
        })
      },
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    return this.mapToResponseDTO(task);
  }

  /**
   * Deletes a task from the database by its ID.
   * 
   * @param id - The unique identifier of the task to delete
   * @returns A promise that resolves to true if the task was successfully deleted, false otherwise
   * 
   * @example
   * ```typescript
   * const wasDeleted = await taskRepository.delete(123);
   * if (wasDeleted) {
   *   console.log('Task deleted successfully');
   * } else {
   *   console.log('Failed to delete task');
   * }
   * ```
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.task.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Maps a raw task object to a TaskResponseDTO format.
   * 
   * @param task - The raw task object containing task data and nested assignments with user information
   * @returns A formatted TaskResponseDTO object with structured task information including assignments and user details
   * 
   * @remarks
   * This method transforms the raw task data structure into a standardized response format,
   * ensuring that nested assignment and user data is properly structured for API responses.
   */
  private mapToResponseDTO(task: any): TaskResponseDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      assignments: task.assignments.map((assignment: any) => ({
        id: assignment.id,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt,
        user: {
          id: assignment.user.id,
          name: assignment.user.name,
          email: assignment.user.email
        }
      }))
    };
  }
}