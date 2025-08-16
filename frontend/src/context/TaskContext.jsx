// src/context/TaskContext.jsx
import React, { createContext, useReducer, useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/apiService';

// Task Context for global state management
export const TaskContext = createContext();

// Reducer function to handle state updates immutably
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'UPDATE_TASK':
      return state.map(task =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the API on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (err) {
      setError('Could not load tasks. Please check the backend service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const editTask = async (taskId, taskData) => {
    try {
      const updatedTask = await updateTask(taskId, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (err) {
      console.error('Failed to edit task:', err);
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, updateTaskStatus, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
