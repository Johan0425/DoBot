/**
 * TaskContext - React Context for managing task state and operations
 * 
 * This context provides a centralized state management solution for tasks in the application.
 * It handles CRUD operations for tasks, manages people/assignees, and provides loading/error states.
 * 
 * @module TaskContext
 * 
 * State Management:
 * - tasks: Array of normalized task objects
 * - people: Array of unique assignee names
 * - loading: Boolean indicating if an operation is in progress
 * - error: String containing error message or null
 * 
 * Task Operations:
 * - addTask: Creates a new task with title, description, and status
 * - updateTaskStatus: Updates only the status of an existing task
 * - editTask: Updates title, description, and status of an existing task
 * - removeTask: Deletes a task by ID
 * - fetchAll: Loads all tasks from the API and extracts unique assignees
 * 
 * Utility Functions:
 * - addPerson: Adds a new person to the people list if not already present
 * - normalize: Transforms raw API response into consistent task objects
 * - reducer: Handles state updates for SET, ADD, UPDATE, and DELETE actions
 * 
 * Features:
 * - Automatic error clearing after 5 seconds
 * - Normalized data structure for consistent task representation
 * - Automatic extraction of unique assignees from task assignments
 * - Loading state management for all async operations
 * 
 * @example
 * // Usage in component
 * const { tasks, addTask, loading, error } = useContext(TaskContext);
 * 
 * // Adding a new task
 * await addTask({
 *   title: "New Task",
 *   description: "Task description",
 *   status: "Created"
 * });
 */
import React, { createContext, useReducer, useState, useCallback, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/apiService';



export const TaskContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': 
      return action.payload;
    case 'ADD': 
      return [...state, action.payload];
    case 'UPDATE': 
      return state.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
    case 'DELETE': 
      return state.filter(t => t.id !== action.payload);
    default: 
      return state;
  }
};

const normalize = rows => rows.map(r => ({
  id: r.id,
  title: r.title,
  description: r.description || '',
  status: r.status, 
  assignees: r.assignments ? r.assignments.map(a => a.user.name) : [],
  created_at: r.createdAt
}));

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(reducer, []);
  const [people, setPeople] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      const norm = normalize(data);
      dispatch({ type: 'SET', payload: norm });
      
      const unique = Array.from(new Set(norm.flatMap(t => t.assignees)));
      setPeople(unique);
    } catch (err) {
      setError('Error cargando tareas');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchAll(); 
  }, [fetchAll]);

  const addPerson = (name) => {
    setPeople(prev => prev.includes(name) ? prev : [...prev, name]);
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'Created',

      };

      const newTask = await createTask(payload);
      const normalized = normalize([newTask])[0];
      dispatch({ type: 'ADD', payload: normalized });
      
      return normalized;
    } catch (err) {
      setError('Error creando tarea');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTask = await updateTask(id, { status: newStatus });
      const normalized = normalize([updatedTask])[0];
      dispatch({ type: 'UPDATE', payload: normalized });
      
      return normalized;
    } catch (err) {
      setError('Error actualizando tarea');
      console.error('Error updating task status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status
      };

      const updatedTask = await updateTask(id, payload);
      const normalized = normalize([updatedTask])[0];
      dispatch({ type: 'UPDATE', payload: normalized });
      
      return normalized;
    } catch (err) {
      setError('Error editando tarea');
      console.error('Error editing task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteTask(id);
      dispatch({ type: 'DELETE', payload: id });
    } catch (err) {
      setError('Error eliminando tarea');
      console.error('Error removing task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <TaskContext.Provider value={{
      tasks, 
      people, 
      loading, 
      error,
      addTask, 
      updateTaskStatus, 
      editTask, 
      removeTask,
      addPerson, 
      fetchAll
    }}>
      {children}
    </TaskContext.Provider>
  );
};