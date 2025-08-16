import { Pool } from 'pg';
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Created' | 'In Progress' | 'Blocked' | 'Completed' | 'Cancelled';
    assignee: string;
    createdAt: Date;
}
export declare class TaskRepository {
    private pool;
    constructor(pool: Pool);
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    create(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
    update(id: string, taskData: Partial<Task>): Promise<Task | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=task.repository.d.ts.map