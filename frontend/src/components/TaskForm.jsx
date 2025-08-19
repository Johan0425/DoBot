/**
 * TaskForm component for creating and editing tasks with assignee management.
 * 
 * This component renders a modal form that allows users to create new tasks or edit existing ones.
 * It includes functionality for managing task assignees by selecting from existing people or
 * adding new people to the system. The form includes validation and handles both creation
 * and editing workflows.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Function} props.onClose - Callback function to close the modal form
 * @param {Object} [props.task] - Optional task object for editing mode. If provided, the form
 *                                will be in edit mode and pre-populated with task data
 * @param {string} props.task.id - Unique identifier for the task (required for editing)
 * @param {string} props.task.title - Task title
 * @param {string} props.task.description - Task description
 * @param {string} props.task.status - Task status (Created, InProgress, Blocked, Completed, Cancelled)
 * @param {string[]} [props.task.assignees] - Array of assignee names
 * 
 * @requires TaskContext - Uses TaskContext for addTask, editTask, people, and addPerson functions
 * 
 * @example
 * // Create new task
 * <TaskForm onClose={() => setShowForm(false)} />
 * 
 * @example
 * // Edit existing task
 * <TaskForm 
 *   onClose={() => setShowForm(false)} 
 *   task={{ id: 1, title: "Sample Task", description: "Task desc", status: "Created", assignees: ["John"] }}
 * />
 */
import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';



const TaskForm = ({ onClose, task }) => {
  const { addTask, editTask, people, addPerson } = useContext(TaskContext);
  const [newPerson, setNewPerson] = useState('');
  const [formState, setFormState] = useState(task ? {
    ...task,
    assignees: task.assignees || []
  } : {
    title: '',
    description: '',
    status: 'Created',
    assignees: []
  });

  const isEditing = !!task;

  const toggleAssignee = (name) => {
    setFormState(prev => ({
      ...prev,
      assignees: prev.assignees.includes(name)
        ? prev.assignees.filter(a => a !== name)
        : [...prev.assignees, name]
    }));
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const name = newPerson.trim();
    if (!name) return;
    
    addPerson(name);
    toggleAssignee(name);
    setNewPerson('');
  };

  const handlePersonKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPerson(e);
    }
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur rounded-2xl border border-slate-600 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Task' : 'New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full rounded-md bg-slate-700 border border-slate-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={formState.title}
              onChange={e => setFormState(s => ({ ...s, title: e.target.value }))}
              required
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-md bg-slate-700 border border-slate-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              value={formState.description}
              onChange={e => setFormState(s => ({ ...s, description: e.target.value }))}
              required
              placeholder="Describe the task..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded-md bg-slate-700 border border-slate-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={formState.status}
              onChange={e => setFormState(s => ({ ...s, status: e.target.value }))}
            >
              <option value="Created">Created</option>
              <option value="InProgress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assignees</label>
            
            {/* List of existing people */}
            <div className="flex flex-wrap gap-2 mb-3">
              {people.map(p => {
                const active = formState.assignees.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleAssignee(p)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 ${
                      active
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {active && '✓ '}{p}
                  </button>
                );
              })}
              {people.length === 0 && (
                <span className="text-xs text-slate-400 italic">No people yet</span>
              )}
            </div>

            {/* Section to add new person */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New person"
                value={newPerson}
                onChange={e => setNewPerson(e.target.value)}
                onKeyPress={handlePersonKeyPress} 
                className="flex-1 rounded-md bg-slate-700 border border-slate-600 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="button" 
                onClick={handleAddPerson}
                disabled={!newPerson.trim()}
                className="px-3 py-2 rounded-md bg-slate-600 text-xs font-medium hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Main form buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formState.title.trim() || !formState.description.trim()}
              className="flex-1 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isEditing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;