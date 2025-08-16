// src/components/TaskCard.jsx
import React, { useContext } from 'react';
import { TaskContext } from '../App';

const TaskCard = ({ task, onEditTask }) => {
  const { removeTask } = useContext(TaskContext);
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const getFormattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-grab active:cursor-grabbing border border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-200 mb-1">{task.title}</h3>
      <p className="text-gray-400 text-sm mb-2">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 border-t border-gray-700 pt-2">
        <span>Assigned to: <span className="font-semibold text-gray-300">{task.assignee}</span></span>
        <span>Created: <span className="font-semibold text-gray-300">{getFormattedDate(task.created_at)}</span></span>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEditTask(task)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => removeTask(task.id)}
          className="text-red-500 hover:text-red-400 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
