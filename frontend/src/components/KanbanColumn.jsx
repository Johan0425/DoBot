// src/components/KanbanColumn.jsx
import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, onDragOver, onDrop, onEditTask }) => {
  const columnBg = {
    'Created': 'bg-gray-700',
    'In Progress': 'bg-blue-700',
    'Blocked': 'bg-red-700',
    'Completed': 'bg-green-700',
    'Cancelled': 'bg-pink-700',
  }[status];

  return (
    <div
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, status)}
      className={`p-4 rounded-lg shadow-lg ${columnBg} transition-all duration-300 min-h-[400px]`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">{status}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEditTask={onEditTask} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 p-4 rounded-md border-2 border-dashed border-gray-600">
            No tasks in this column.
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
