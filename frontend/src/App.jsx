import React, { useState, useEffect, createContext, useReducer } from 'react';
import KanbanBoard from './components/KanbanBoard';
import './index.css';

export const TaskContext = createContext();

// Reducer para manejar el estado de las tareas
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...state, { 
        ...action.payload, 
        id: Date.now(), 
        created_at: new Date().toISOString() 
      }];
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

// Mock data inicial más rico
const initialTasks = [
  {
    id: 1,
    title: "Desarrollar Dashboard Analytics",
    description: "Crear visualizaciones interactivas con gráficos en tiempo real para mejorar la toma de decisiones",
    status: "In Progress",
    assignee: "Juan Henao",
    created_at: "2025-08-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Optimizar API Performance",
    description: "Mejorar tiempo de respuesta y cacheo de endpoints críticos del sistema",
    status: "Created",
    assignee: "Maria Perez",
    created_at: "2025-08-16T14:30:00Z"
  },
  {
    id: 3,
    title: "Testing Automatizado E2E",
    description: "Implementar suite completa de pruebas end-to-end con Cypress para garantizar calidad",
    status: "Blocked",
    assignee: "Carlos Gomez",
    created_at: "2025-08-14T09:15:00Z"
  },
  {
    id: 4,
    title: "Diseño UI/UX Mobile",
    description: "Crear interfaces responsivas y amigables para dispositivos móviles",
    status: "Completed",
    assignee: "Ana Lopez",
    created_at: "2025-08-10T16:20:00Z"
  }
];

// Provider de contexto para las tareas
const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulamos carga inicial
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ 
        type: 'ADD_TASK', 
        payload: taskData
      });
      
      setLoading(false);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to add task');
      setLoading(false);
      return Promise.reject(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setLoading(true);
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch({ 
        type: 'UPDATE_TASK', 
        payload: { id: parseInt(taskId), status: newStatus }
      });
      
      setLoading(false);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to update task status');
      setLoading(false);
      return Promise.reject(err);
    }
  };

  const editTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ 
        type: 'UPDATE_TASK', 
        payload: { ...taskData, id: taskId }
      });
      
      setLoading(false);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to edit task');
      setLoading(false);
      return Promise.reject(err);
    }
  };

  const removeTask = async (taskId) => {
    try {
      setLoading(true);
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch({ 
        type: 'DELETE_TASK', 
        payload: taskId 
      });
      
      setLoading(false);
      return Promise.resolve();
    } catch (err) {
      setError('Failed to delete task');
      setLoading(false);
      return Promise.reject(err);
    }
  };

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      addTask,
      updateTaskStatus,
      editTask,
      removeTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

// Componente principal de la aplicación
export default function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <KanbanBoard />
      </div>
    </TaskProvider>
  );
}