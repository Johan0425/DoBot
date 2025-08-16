import { Task } from '../repositories/task.repository';
import { Pool } from 'pg';
export interface TaskData {
    title: string;
    description: string;
    status: 'Created' | 'In Progress' | 'Blocked' | 'Completed' | 'Cancelled';
    assignee: string;
}
export declare class TaskService {
    private repository;
    constructor(pool: Pool);
    getTasks(): Promise<Task[]>;
    createTask(taskData: TaskData): Promise<Task>;
    updateTask(id: string, taskData: Partial<TaskData>): Promise<Task | null>;
    deleteTask(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=task.service.d.ts.map