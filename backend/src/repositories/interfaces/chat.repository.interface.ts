import { ChatMessageDTO, ChatResponseDTO } from '../../shared/dto/chat.dto';
import { TaskResponseDTO } from '../../shared/dto/task.dto';

/**
 * Interface defining the contract for chat repository operations.
 * Provides methods for retrieving task summaries and user statistics.
 */
export interface IChatRepository {
    /**
     * Retrieves a comprehensive summary of tasks including totals, status breakdown,
     * blocked tasks, and recently completed tasks.
     * 
     * @returns Promise resolving to an object containing:
     *   - total: Total number of tasks
     *   - byStatus: Record mapping status strings to their counts
     *   - blocked: Array of blocked tasks as TaskResponseDTO
     *   - recentlyCompleted: Array of recently completed tasks as TaskResponseDTO
     */
    getTasksSummary(): Promise<{
        total: number;
        byStatus: Record<string, number>;
        blocked: TaskResponseDTO[];
        recentlyCompleted: TaskResponseDTO[];
    }>;
    
    /**
     * Retrieves statistics about users and their task assignments.
     * 
     * @returns Promise resolving to an object containing:
     *   - totalUsers: Total number of users in the system
     *   - tasksPerUser: Record mapping user identifiers to their task counts
     *   - mostBusyUser: Identifier of the user with the most tasks, or null if no users exist
     */
    getUserStats(): Promise<{
        totalUsers: number;
        tasksPerUser: Record<string, number>;
        mostBusyUser: string | null;
    }>;
    /**
     * Retrieves a summary of tasks, including total counts, status breakdown,
     * blocked tasks, and recently completed tasks.
     * 
     * @returns Promise resolving to an object containing:
     *   - total: Total number of tasks
     *   - byStatus: Record mapping status strings to their counts
     *   - blocked: Array of blocked tasks as TaskResponseDTO
     *   - recentlyCompleted: Array of recently completed tasks as TaskResponseDTO
     */
  getTasksSummary(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    blocked: TaskResponseDTO[];
    recentlyCompleted: TaskResponseDTO[];
  }>;
  
  /**
   * Retrieves statistics about users and their task assignments.
   * 
   * @returns Promise resolving to an object containing:
   *   - totalUsers: Total number of users in the system
   *   - tasksPerUser: Record mapping user identifiers to their task counts
   *   - mostBusyUser: Identifier of the user with the most tasks, or null if no users exist
   */
  getUserStats(): Promise<{
    totalUsers: number;
    tasksPerUser: Record<string, number>;
    mostBusyUser: string | null;
  }>;
}

function getTasksSummary() {
    throw new Error('Function not implemented.');
}
