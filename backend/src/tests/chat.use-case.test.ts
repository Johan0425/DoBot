/**
 * Test suite for ChatUseCase class functionality.
 * Tests the processMessage method with various message types including task creation requests,
 * status queries, and general queries to ensure proper response handling and action execution.
 */
import { ChatUseCase } from '../use-cases/chat.use-case';
import { ChatRepository } from '../repositories/chat.repository';
import { TaskRepository } from '../repositories/task.repository';
import { prisma } from './setup';



describe('ChatUseCase', () => {
  let chatUseCase: ChatUseCase;
  let chatRepository: ChatRepository;
  let taskRepository: TaskRepository;

  beforeEach(() => {
    chatRepository = new ChatRepository(prisma);
    taskRepository = new TaskRepository(prisma);
    chatUseCase = new ChatUseCase(chatRepository, taskRepository);
  });

  describe('processMessage', () => {
    it('should handle task creation request', async () => {
      const result = await chatUseCase.processMessage({
        message: 'Crear tarea "Test Task"'
      });

      expect(result.response).toContain('He creado la tarea');
      expect(result.actionTaken?.type).toBe('task_created');
    });

    it('should handle status query', async () => {
      const result = await chatUseCase.processMessage({
        message: '¿Cuál es el estado del proyecto?'
      });

      expect(result.response).toContain('Resumen de Tareas');
      expect(result.actionTaken?.type).toBe('query_executed');
    });

    it('should handle general query', async () => {
      const result = await chatUseCase.processMessage({
        message: 'Hola'
      });

      expect(result.response).toContain('asistente');
      expect(result.suggestions).toBeDefined();
    });
  });
});