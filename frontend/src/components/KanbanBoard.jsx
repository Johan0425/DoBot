// src/components/KanbanBoard.jsx
import React, { useState, useContext } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import { TaskContext } from '../App';

const KanbanBoard = () => {
  const { tasks, loading, error, updateTaskStatus } = useContext(TaskContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const statuses = ['Created', 'In Progress', 'Blocked', 'Completed', 'Cancelled'];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskStatus(taskId, newStatus);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };
  
  if (loading) return <div className="text-center text-gray-400">Loading tasks...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen font-sans text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Dobot Kanban Board</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
        >
          Create Task
        </button>
      </div>
      
      {isFormOpen && <TaskForm onClose={handleCloseForm} task={taskToEdit} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEditTask={handleEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
