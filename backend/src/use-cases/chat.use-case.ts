/**
 * Use case class responsible for processing chat messages and handling various task management operations.
 * 
 * This class serves as the main orchestrator for chat-based interactions, providing intelligent
 * message processing and routing to appropriate handlers based on message content analysis.
 * It supports multiple languages (Spanish and English) and provides contextual responses
 * with actionable suggestions.
 * 
 * @example
 * ```typescript
 * const chatUseCase = new ChatUseCase(chatRepository, taskRepository);
 * const response = await chatUseCase.processMessage({
 *   message: "Crear tarea 'Revisar código'"
 * });
 * ```
 * 
 * Supported Operations:
 * - Task creation through natural language commands
 * - Task status queries and summaries
 * - Blocked tasks identification and reporting
 * - User workload analysis and statistics
 * - General assistance and guidance
 * 
 * @author AI Assistant
 * @version 1.0.0
 */
import { IChatRepository } from '../repositories/interfaces/chat.repository.interface';
import { ITaskRepository } from '../repositories/interfaces/task.repository.interface';
import { ChatMessageDTO, ChatResponseDTO } from '../shared/dto/chat.dto';



export class ChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private taskRepository: ITaskRepository
  ) {}

  async processMessage(messageData: ChatMessageDTO): Promise<ChatResponseDTO> {
    const message = messageData.message.toLowerCase();
    const timestamp = new Date();

    if (this.isTaskCreationRequest(message)) {
      return await this.handleTaskCreation(message, timestamp);
    }
    
    if (this.isStatusQuery(message)) {
      return await this.handleStatusQuery(timestamp);
    }
    
    if (this.isBlockedTasksQuery(message)) {
      return await this.handleBlockedTasksQuery(timestamp);
    }
    
    if (this.isBusyUserQuery(message)) {
      return await this.handleBusyUserQuery(timestamp);
    }
    
    return this.handleGeneralQuery(message, timestamp);
  }

  private isTaskCreationRequest(message: string): boolean {
    const keywords = ['crear', 'create', 'nueva tarea', 'new task', 'agregar', 'add'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isStatusQuery(message: string): boolean {
    const keywords = ['estado', 'status', 'progreso', 'progress', 'cuántas', 'how many', 'resumen'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isBlockedTasksQuery(message: string): boolean {
    const keywords = ['bloqueadas', 'blocked', 'bloqueada', 'impedidas'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isBusyUserQuery(message: string): boolean {
    const keywords = ['más tareas', 'most tasks', 'ocupado', 'busy', 'carga', 'usuario'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private async handleTaskCreation(message: string, timestamp: Date): Promise<ChatResponseDTO> {
    const titleMatch = message.match(/crear(?:.*?)["']([^"']+)["']/) || 
                      message.match(/create(?:.*?)["']([^"']+)["']/) ||
                      message.match(/nueva tarea:?\s*(.+)$/i) ||
                      message.match(/new task:?\s*(.+)$/i) ||
                      message.match(/agregar(?:.*?)["']([^"']+)["']/) ||
                      message.match(/add(?:.*?)["']([^"']+)["']/);
    
    if (titleMatch) {
      const title = titleMatch[1].trim();
      try {
        const task = await this.taskRepository.create({
          title,
          description: `Tarea creada por el asistente IA`,
          status: 'Created'
        });

        return {
          response: `✅ He creado la tarea "${title}" exitosamente. La tarea tiene el ID ${task.id} y está en estado "Created".`,
          actionTaken: {
            type: 'task_created',
            data: task
          },
          suggestions: [
            'Asignar usuarios a esta tarea',
            'Cambiar el estado a "In Progress"',
            'Agregar más detalles a la descripción'
          ],
          timestamp
        };
      } catch (error) {
        return {
          response: `❌ No pude crear la tarea "${title}". Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          timestamp
        };
      }
    }

    return {
      response: `🤔 Entiendo que quieres crear una tarea, pero no pude identificar el título. Puedes decir algo como: "Crear tarea 'Revisar código'" o "Nueva tarea: Actualizar documentación"`,
      suggestions: [
        'Crear tarea "Ejemplo de tarea"',
        'Nueva tarea: Revisar documentación',
        'Agregar tarea "Testing de la aplicación"'
      ],
      timestamp
    };
  }

  private async handleStatusQuery(timestamp: Date): Promise<ChatResponseDTO> {
    try {
      const summary = await this.chatRepository.getTasksSummary();
      
      let response = `📊 **Resumen de Tareas:**\n\n`;
      response += `• Total: ${summary.total} tareas\n`;
      
      Object.entries(summary.byStatus).forEach(([status, count]) => {
        const emoji = this.getStatusEmoji(status);
        response += `• ${emoji} ${status}: ${count} tareas\n`;
      });

      const completionRate = summary.total > 0 
        ? Math.round(((summary.byStatus['Completed'] || 0) / summary.total) * 100)
        : 0;

      response += `\n🎯 Tasa de completación: ${completionRate}%`;

      return {
        response,
        actionTaken: {
          type: 'query_executed',
          data: summary
        },
        suggestions: [
          '¿Qué tareas están bloqueadas?',
          '¿Quién tiene más tareas pendientes?',
          'Crear una nueva tarea'
        ],
        timestamp
      };
    } catch (error) {
      return {
        response: `❌ Error al obtener el resumen de tareas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp
      };
    }
  }

  private async handleBlockedTasksQuery(timestamp: Date): Promise<ChatResponseDTO> {
    try {
      const summary = await this.chatRepository.getTasksSummary();
      
      if (summary.blocked.length === 0) {
        return {
          response: `🎉 ¡Excelente! No hay tareas bloqueadas en este momento. Todas las tareas están fluyendo correctamente.`,
          suggestions: [
            'Ver resumen general de tareas',
            'Crear una nueva tarea',
            '¿Quién tiene más tareas pendientes?'
          ],
          timestamp
        };
      }

      let response = `🚫 **Tareas Bloqueadas (${summary.blocked.length}):**\n\n`;
      
      summary.blocked.forEach((task, index) => {
        response += `${index + 1}. **${task.title}**\n`;
        if (task.description) {
          response += `   📝 ${task.description}\n`;
        }
        if (task.assignments && task.assignments.length > 0) {
          const assignees = task.assignments.map(a => a.user.name).join(', ');
          response += `   👥 Asignado a: ${assignees}\n`;
        }
        response += `   📅 Creada: ${new Date(task.createdAt).toLocaleDateString()}\n\n`;
      });

      return {
        response,
        actionTaken: {
          type: 'query_executed',
          data: { blockedTasks: summary.blocked }
        },
        suggestions: [
          'Cambiar estado de tarea bloqueada',
          'Ver resumen general',
          'Crear nueva tarea'
        ],
        timestamp
      };
    } catch (error) {
      return {
        response: `❌ Error al consultar tareas bloqueadas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp
      };
    }
  }

  private async handleBusyUserQuery(timestamp: Date): Promise<ChatResponseDTO> {
    try {
      const userStats = await this.chatRepository.getUserStats();
      
      if (!userStats.mostBusyUser) {
        return {
          response: `📋 No hay usuarios con tareas asignadas en este momento.`,
          suggestions: [
            'Ver resumen de tareas',
            'Crear nueva tarea',
            'Ver tareas bloqueadas'
          ],
          timestamp
        };
      }

      let response = `👥 **Estadísticas de Usuarios:**\n\n`;
      response += `🏆 Usuario más ocupado: **${userStats.mostBusyUser}** (${userStats.tasksPerUser[userStats.mostBusyUser]} tareas activas)\n\n`;
      
      response += `📊 **Distribución de tareas:**\n`;
      Object.entries(userStats.tasksPerUser)
        .sort(([,a], [,b]) => b - a)
        .forEach(([user, count]) => {
          const emoji = count > 3 ? '🔥' : count > 1 ? '📋' : '✅';
          response += `• ${emoji} ${user}: ${count} tareas\n`;
        });

      return {
        response,
        actionTaken: {
          type: 'query_executed',
          data: userStats
        },
        suggestions: [
          'Ver tareas bloqueadas',
          'Crear nueva tarea',
          'Ver resumen general'
        ],
        timestamp
      };
    } catch (error) {
      return {
        response: `❌ Error al consultar estadísticas de usuarios: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp
      };
    }
  }

  private handleGeneralQuery(message: string, timestamp: Date): ChatResponseDTO {
    const responses = [
      '🤖 Soy tu asistente para gestión de tareas. Puedo ayudarte a crear tareas, consultar estados y más.',
      '💡 Pregúntame sobre tareas bloqueadas, usuarios ocupados o crea nuevas tareas.',
      '🎯 Estoy aquí para hacer tu gestión de proyectos más eficiente.'
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      suggestions: [
        'Crear tarea "Mi nueva tarea"',
        '¿Qué tareas están bloqueadas?',
        '¿Quién tiene más tareas pendientes?',
        'Ver resumen de tareas'
      ],
      timestamp
    };
  }

  private getStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      'Created': '📝',
      'InProgress': '⚡',
      'Blocked': '🚫',
      'Completed': '✅',
      'Cancelled': '❌'
    };
    return emojis[status] || '📋';
  }
}