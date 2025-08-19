/**
 * Test suite for TaskRepository class that validates CRUD operations and task management functionality.
 * 
 * Tests cover:
 * - Task creation with and without user assignments
 * - Retrieving all tasks including empty collections
 * - Updating task properties like status
 * - Proper handling of task-user relationships through assignments
 * 
 * Uses Prisma ORM for database operations and includes setup/teardown for test isolation.
 * Each test method validates expected behavior including proper data persistence,
 * relationship handling, and return value validation.
 */
import { TaskRepository } from '../repositories/task.repository';
import { prisma } from './setup';



describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository(prisma);
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'Created' as const
      };

      const result = await taskRepository.create(taskData);

      expect(result).toBeDefined();
      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe(taskData.description);
      expect(result.status).toBe(taskData.status);
    });

    it('should create task with assignments', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com' }
      });

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'Created' as const,
        userIds: [user.id]
      };

      const result = await taskRepository.create(taskData);

      expect(result.assignments).toHaveLength(1);
      expect(result.assignments[0].user.name).toBe('Test User');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no tasks', async () => {
      const result = await taskRepository.findAll();
      expect(result).toEqual([]);
    });

    it('should return all tasks with assignments', async () => {
      await prisma.task.create({
        data: {
          title: 'Task 1',
          description: 'Description 1',
          status: 'Created'
        }
      });

      const result = await taskRepository.findAll();
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 1');
    });
  });

  describe('update', () => {
    it('should update task status', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          status: 'Created'
        }
      });

      const result = await taskRepository.update(task.id, {
        status: 'InProgress'
      });

      expect(result?.status).toBe('InProgress');
    });
  });
});