/**
 * Test suite for TaskUseCase class functionality.
 * 
 * This test suite validates the core operations of the TaskUseCase class including:
 * - Task creation with proper data validation and ID assignment
 * - Task retrieval by ID with proper error handling for non-existent tasks
 * - Integration with TaskRepository for database operations
 * 
 * The tests use Prisma as the database client and follow AAA (Arrange, Act, Assert) pattern.
 * Each test case is isolated with fresh instances created in beforeEach hook.
 * 
 * @example
 * ```typescript
 * // Test validates successful task creation
 * const taskData = { title: 'New Task', description: 'Task description', status: 'Created' };
 * const result = await taskUseCase.createTask(taskData);
 * ```
 */
import { TaskUseCase } from '../use-cases/task.use-case';
import { TaskRepository } from '../repositories/task.repository';
import { prisma } from './setup';



describe('TaskUseCase', () => {
  let taskUseCase: TaskUseCase;
  let taskRepository: TaskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository(prisma);
    taskUseCase = new TaskUseCase(taskRepository);
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'Created' as const
      };

      const result = await taskUseCase.createTask(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.id).toBeDefined();
    });
  });

  describe('getTaskById', () => {
    it('should throw error when task not found', async () => {
      await expect(taskUseCase.getTaskById(999))
        .rejects
        .toThrow('Task with id 999 not found');
    });

    it('should return task when found', async () => {
      const task = await taskRepository.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'Created'
      });

      const result = await taskUseCase.getTaskById(task.id);
      
      expect(result.id).toBe(task.id);
      expect(result.title).toBe('Test Task');
    });
  });
});