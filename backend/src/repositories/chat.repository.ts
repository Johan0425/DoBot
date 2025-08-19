/**
 * Repository class for handling chat-related data operations including task summaries and user statistics.
 * Provides methods to retrieve task analytics, user workload data, and formats responses for chat interfaces.
 * 
 * @class ChatRepository
 * @implements {IChatRepository}
 * @param {PrismaClient} prisma - Prisma client instance for database operations
 * 
 * @method getTasksSummary - Retrieves comprehensive task analytics including total count, status breakdown, blocked tasks, and recently completed tasks
 * @returns {Promise<{total: number, byStatus: Record<string, number>, blocked: any[], recentlyCompleted: any[]}>}
 * 
 * @method getUserStats - Analyzes user workload statistics including total users, active tasks per user, and identifies the busiest user
 * @returns {Promise<{totalUsers: number, tasksPerUser: Record<string, number>, mostBusyUser: string | null}>}
 * 
 * @method mapToResponseDTO - Private method that transforms task entities into standardized response DTOs with user assignment details
 * @param {any} task - Task entity with assignments and user relations
 * @returns {object} Formatted task object with id, title, description, status, createdAt, and assignments array
 */
import { PrismaClient } from '@prisma/client';
import { IChatRepository } from './interfaces/chat.repository.interface';



export class ChatRepository implements IChatRepository {
  constructor(private prisma: PrismaClient) {}

  async getTasksSummary() {
    const tasks = await this.prisma.task.findMany({
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      }
    });

    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const blocked = tasks
      .filter(t => t.status === 'Blocked')
      .map(this.mapToResponseDTO);

    const recentlyCompleted = tasks
      .filter(t => t.status === 'Completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(this.mapToResponseDTO);

    return {
      total: tasks.length,
      byStatus,
      blocked,
      recentlyCompleted
    };
  }

  async getUserStats() {
    const users = await this.prisma.user.findMany({
      include: {
        assignments: {
          include: {
            task: true
          }
        }
      }
    });

    const tasksPerUser = users.reduce((acc, user) => {
      const activeTasks = user.assignments.filter(
        a => !['Completed', 'Cancelled'].includes(a.task.status)
      ).length;
      acc[user.name] = activeTasks;
      return acc;
    }, {} as Record<string, number>);

    const mostBusyUser = Object.entries(tasksPerUser)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    return {
      totalUsers: users.length,
      tasksPerUser,
      mostBusyUser
    };
  }

  private mapToResponseDTO(task: any) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      assignments: task.assignments?.map((assignment: any) => ({
        id: assignment.id,
        userId: assignment.userId,
        assignedAt: assignment.assignedAt,
        user: {
          id: assignment.user.id,
          name: assignment.user.name,
          email: assignment.user.email
        }
      })) || []
    };
  }
}