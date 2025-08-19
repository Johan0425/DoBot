import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';

/**
 * TaskValidator - Validates task creation and update data
 * @param data - Input data to validate
 * @returns Validated DTO object
 * @throws Error if validation fails
 */

export class TaskValidator {
  static validateCreate(data: any): CreateTaskDTO {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }

    if (data.description && typeof data.description !== 'string') {
      throw new Error('Description must be a string');
    }

    const validStatuses = ['Created', 'InProgress', 'Blocked', 'Completed', 'Cancelled'];
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error('Invalid status');
    }

    if (data.userIds && !Array.isArray(data.userIds)) {
      throw new Error('userIds must be an array');
    }

    if (data.userIds && data.userIds.some((id: any) => typeof id !== 'number' || id <= 0)) {
      throw new Error('All userIds must be positive numbers');
    }

    return {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      status: data.status || 'Created',
      userIds: data.userIds || []
    };
  }

  /**
   * Validates and transforms data for updating a task.
   * 
   * @param data - The raw data object containing potential task update fields
   * @returns A validated UpdateTaskDTO object containing only the valid fields that were provided
   * 
   * @throws {Error} When title is not a non-empty string
   * @throws {Error} When description is provided but is not a string or null
   * @throws {Error} When status is not one of the valid status values: 'Created', 'InProgress', 'Blocked', 'Completed', 'Cancelled'
   * @throws {Error} When userIds is not an array
   * @throws {Error} When any userId is not a positive number
   * 
   * @remarks
   * - Only validates fields that are present in the input data (undefined fields are ignored)
   * - Trims whitespace from title and description fields
   * - Sets description to undefined if it's an empty string after trimming
   * - All validations are optional based on field presence in the input data
   */
  static validateUpdate(data: any): UpdateTaskDTO {
    const result: UpdateTaskDTO = {};

    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new Error('Title must be a non-empty string');
      }
      result.title = data.title.trim();
    }

    if (data.description !== undefined) {
      if (data.description !== null && typeof data.description !== 'string') {
        throw new Error('Description must be a string or null');
      }
      result.description = data.description?.trim() || undefined;
    }

    if (data.status !== undefined) {
      const validStatuses = ['Created', 'InProgress', 'Blocked', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(data.status)) {
        throw new Error('Invalid status');
      }
      result.status = data.status;
    }

    if (data.userIds !== undefined) {
      if (!Array.isArray(data.userIds)) {
        throw new Error('userIds must be an array');
      }
      if (data.userIds.some((id: any) => typeof id !== 'number' || id <= 0)) {
        throw new Error('All userIds must be positive numbers');
      }
      result.userIds = data.userIds;
    }

    return result;
  }
}