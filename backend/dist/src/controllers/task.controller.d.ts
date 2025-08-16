import { Request, Response } from 'express';
import { Pool } from 'pg';
export declare class TaskController {
    private service;
    constructor(pool: Pool);
    getTasks(req: Request, res: Response): Promise<void>;
    createTask(req: Request, res: Response): Promise<void>;
    updateTask(req: Request, res: Response): Promise<void>;
    deleteTask(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=task.controller.d.ts.map