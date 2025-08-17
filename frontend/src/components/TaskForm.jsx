import React, { useState, useContext } from 'react';
import { TaskContext } from '../App';

const TaskForm = ({ onClose, task }) => {
  const { addTask, editTask } = useContext(TaskContext);
  const [formState, setFormState] = useState(task || {
    title: '',
    description: '',
    status: 'Created',
    assignee: '',
  });

  const isEditing = !!task;
  const assignees = ['Juan Henao', 'Maria Perez', 'Carlos Gomez', 'Ana Lopez', 'Pepe Vargas'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await editTask(formState.id, formState);
      } else {
        await addTask(formState);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('There was an error saving the task. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-300">Assignee</label>
            <select
              name="assignee"
              value={formState.assignee}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an assignee</option>
              {assignees.map(resp => <option key={resp} value={resp}>{resp}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-300">Status</label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Created">Created</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 mt-6"
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;