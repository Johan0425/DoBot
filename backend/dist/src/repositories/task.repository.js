"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const uuid_1 = require("uuid");
class TaskRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const result = await this.pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        return result.rows.map(row => ({
            ...row,
            createdAt: new Date(row.created_at) // Convert to Date object
        }));
    }
    async findById(id) {
        const result = await this.pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        const row = result.rows[0];
        if (!row)
            return null;
        return { ...row, createdAt: new Date(row.created_at) };
    }
    async create(taskData) {
        const newId = (0, uuid_1.v4)();
        const query = 'INSERT INTO tasks (id, title, description, status, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        const values = [newId, taskData.title, taskData.description, taskData.status, taskData.assignee];
        const result = await this.pool.query(query, values);
        const row = result.rows[0];
        return { ...row, createdAt: new Date(row.created_at) };
    }
    async update(id, taskData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (taskData.title !== undefined) {
            fields.push(`title = $${paramIndex++}`);
            values.push(taskData.title);
        }
        if (taskData.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(taskData.description);
        }
        if (taskData.status !== undefined) {
            fields.push(`status = $${paramIndex++}`);
            values.push(taskData.status);
        }
        if (taskData.assignee !== undefined) {
            fields.push(`assignee = $${paramIndex++}`);
            values.push(taskData.assignee);
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *;`;
        const result = await this.pool.query(query, values);
        const row = result.rows[0];
        if (!row)
            return null;
        return { ...row, createdAt: new Date(row.created_at) };
    }
    async delete(id) {
        const result = await this.pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *;', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map