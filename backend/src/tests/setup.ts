import { PrismaClient } from '@prisma/client';

/**
 * Prisma client instance configured for testing environment with a dedicated test database.
 * Uses a separate PostgreSQL database running on port 5433 to isolate test data from production.
 */

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://test:test@localhost:5433/test_db'
    }
  }
});

beforeEach(async () => {
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };