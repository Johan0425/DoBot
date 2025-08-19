/**
 * Data Transfer Object for creating a new task.
 * 
 * @interface CreateTaskDTO
 * @property {string} title - The title of the task (required)
 * @property {string} [description] - Optional description providing additional details about the task
 * @property {'Created' | 'InProgress' | 'Blocked' | 'Completed' | 'Cancelled'} [status] - Optional status of the task, defaults to appropriate initial status if not provided
 * @property {number[]} [userIds] - Optional array of user IDs to assign to this task
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'Created' | 'InProgress' | 'Blocked' | 'Completed' | 'Cancelled';
  userIds?: number[];
}

/**
 * Data Transfer Object for updating an existing task.
 * All properties are optional to allow partial updates.
 * 
 * @interface UpdateTaskDTO
 * @property {string} [title] - The updated title of the task
 * @property {string} [description] - The updated description of the task
 * @property {'Created' | 'InProgress' | 'Blocked' | 'Completed' | 'Cancelled'} [status] - The updated status of the task
 * @property {number[]} [userIds] - Array of user IDs to assign to the task
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'Created' | 'InProgress' | 'Blocked' | 'Completed' | 'Cancelled';
  userIds?: number[];
}

/**
 * Data Transfer Object representing a task response with its assignments and user details.
 * 
 * @interface TaskResponseDTO
 * @property {number} id - Unique identifier for the task
 * @property {string} title - The title of the task
 * @property {string | null} description - Optional description of the task
 * @property {string} status - Current status of the task
 * @property {Date} createdAt - Timestamp when the task was created
 * @property {Array<Object>} assignments - Array of task assignments
 * @property {number} assignments[].id - Unique identifier for the assignment
 * @property {number} assignments[].userId - ID of the assigned user
 * @property {Date} assignments[].assignedAt - Timestamp when the assignment was made
 * @property {Object} assignments[].user - User details for the assignment
 * @property {number} assignments[].user.id - Unique identifier for the user
 * @property {string} assignments[].user.name - Name of the assigned user
 * @property {string | null} assignments[].user.email - Optional email address of the user
 */
export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  assignments: Array<{
    id: number;
    userId: number;
    assignedAt: Date;
    user: {
      id: number;
      name: string;
      email: string | null;
    };
  }>;
}