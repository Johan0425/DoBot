/**
 * KanbanBoard Component - A comprehensive task management board with drag-and-drop functionality
 * 
 * This component provides a complete Kanban board interface with the following features:
 * - Interactive drag-and-drop task management across different status columns
 * - Real-time statistics dashboard with animated progress indicators
 * - Floating particle background effects and gradient animations
 * - Modal-based task creation and editing forms
 * - Toast notification system for user feedback
 * - Responsive design with hover effects and 3D transformations
 * - Loading states with custom animated spinners
 * 
 * The board supports five task statuses: Created, InProgress, Blocked, Completed, and Cancelled
 * 
 * @component
 * @returns {JSX.Element} The complete Kanban board interface
 * 
 * @requires TaskContext - Context providing task data and CRUD operations
 * @requires KanbanColumn - Individual column component for each status
 * @requires TaskForm - Modal form component for task creation/editing
 * 
 * @example
 * // Basic usage within a TaskContext provider
 * <TaskProvider>
 *   <KanbanBoard />
 * </TaskProvider>
 * 
 * @features
 * - Drag and drop task management
 * - Real-time statistics with completion rates
 * - Animated UI components with glassmorphism effects
 * - Responsive grid layout (1-5 columns based on screen size)
 * - Auto-dismissing notification system
 * - Loading states and error handling
 * - 3D hover effects and gradient animations
 */
import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext'; 
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';



const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="floating-particle absolute rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(168, 85, 247, 0.4) 100%)`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

const StatsCard = ({ icon, title, value, gradient, shadow, description, trend }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="stats-card relative p-6 rounded-2xl transition-all duration-300 cursor-pointer border overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: gradient,
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered 
          ? `0 20px 40px ${shadow}, 0 0 60px rgba(255, 255, 255, 0.1)` 
          : '0 8px 20px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'scale(1.05) translateY(-10px) rotateY(10deg)' : 'scale(1) translateY(0) rotateY(0deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Efecto de brillo animado */}
      <div 
        className="absolute top-0 left-0 w-full h-1 transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${isHovered ? '#ffffff80' : 'transparent'}, transparent)`,
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)'
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="text-4xl transition-transform duration-300 p-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)'
              }}
            >
              {icon}
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-white/60 text-xs">{description}</p>
            </div>
          </div>
          
          {trend && (
            <div 
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                trend.type === 'up' ? 'bg-green-500/20 text-green-400' : 
                trend.type === 'down' ? 'bg-red-500/20 text-red-400' : 
                'bg-blue-500/20 text-blue-400'
              }`}
            >
              <span>{trend.type === 'up' ? '↗' : trend.type === 'down' ? '↘' : '→'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Efecto de ondas en hover */}
      <div 
        className="absolute bottom-0 left-0 w-full h-full opacity-20 transition-transform duration-700"
        style={{
          background: 'radial-gradient(circle at bottom center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
          transform: isHovered ? 'scale(1.5)' : 'scale(1)'
        }}
      />
    </div>
  );
};

const KanbanBoard = () => {
  const { tasks, loading, error, updateTaskStatus } = useContext(TaskContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const statuses = ['Created', 'InProgress', 'Blocked', 'Completed', 'Cancelled'];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error,
        timeout: 5000
      });
    }
  }, [error]);

  useEffect(() => {
    if (notification && notification.timeout) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, notification.timeout);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id == taskId);
    
    if (task && task.status !== newStatus) {
      try {
        await updateTaskStatus(taskId, newStatus);
        setNotification({
          type: 'success',
          message: `Task "${task.title}" moved to ${newStatus}!`,
          timeout: 3000
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to update task status',
          timeout: 5000
        });
      }
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  const handleCreateTask = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'InProgress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    blocked: tasks.filter(t => t.status === 'Blocked').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
        }}
      >
        <div className="text-center space-y-6">
          <div className="relative">
            <div 
              className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            />
            <div 
              className="absolute top-2 left-2 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin"
              style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Loading Dobot Kanban</h2>
            <p className="text-slate-400">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
      }}
    >
      <FloatingParticles />
      
      {/* Patrón de fondo animado */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm20 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'backgroundMove 20s linear infinite'
        }}
      />

      <div className="relative z-10 p-8">
        {/* Header Section Mejorado */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🤖</div>
              <div>
                <h1 
                  className="text-6xl font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(45deg, #06b6d4, #a855f7, #ec4899, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '300% 300%',
                    animation: 'gradientShift 4s ease infinite'
                  }}
                >
                  Dobot Kanban Pro
                </h1>
                <p className="text-slate-400 text-xl">
                  Manage your tasks with style and efficiency • 
                  <span className="text-cyan-400 font-semibold"> {stats.completionRate}% Complete</span>
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreateTask}
            disabled={loading}
            className="create-task-btn group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            style={{
              background: loading 
                ? 'linear-gradient(45deg, #6b7280, #9ca3af)' 
                : 'linear-gradient(45deg, #06b6d4, #a855f7, #ec4899)',
              boxShadow: '0 15px 35px rgba(6, 182, 212, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{loading ? '⏳' : '✨'}</div>
              <div>
                <div className="text-lg">{loading ? 'Processing...' : 'Create Task'}</div>
                <div className="text-xs opacity-80">Add new task to board</div>
              </div>
            </div>
            
            {/* Efecto de resplandor */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              style={{
                background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(168, 85, 247, 0.3))',
                filter: 'blur(20px)',
                transform: 'scale(1.2)'
              }}
            />
          </button>
        </div>

        {/* Dashboard de Estadísticas Mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon="🎯" 
            title="Total Tasks" 
            value={stats.total}
            description="All tasks in workspace"
            gradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
            shadow="rgba(37, 99, 235, 0.4)"
            trend={{ type: 'up', value: '+12%' }}
          />
          <StatsCard 
            icon="⚡" 
            title="InProgress" 
            value={stats.inProgress}
            description="Active development"
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            shadow="rgba(245, 158, 11, 0.4)"
            trend={{ type: 'up', value: '+8%' }}
          />
          <StatsCard 
            icon="✅" 
            title="Completed" 
            value={stats.completed}
            description="Successfully finished"
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            shadow="rgba(16, 185, 129, 0.4)"
            trend={{ type: 'up', value: '+25%' }}
          />
          <StatsCard 
            icon="🚫" 
            title="Blocked" 
            value={stats.blocked}
            description="Waiting for resolution"
            gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            shadow="rgba(239, 68, 68, 0.4)"
            trend={{ type: 'down', value: '-5%' }}
          />
        </div>

        {/* Barra de progreso global */}
        <div className="mb-8 p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            <span className="text-2xl font-bold text-cyan-400">{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #a855f7, #ec4899)',
                width: `${stats.completionRate}%`,
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
              }}
            >
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-fr">
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

      {/* Modal del formulario */}
      {isFormOpen && (
        <TaskForm 
          onClose={handleCloseForm}
          task={taskToEdit}
        />
      )}

      {/* Sistema de notificaciones */}
      {notification && (
        <div 
          className="fixed top-8 right-8 z-50 p-4 rounded-xl border backdrop-blur-md transition-all duration-300"
          style={{
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
            borderColor: notification.type === 'success' ? '#10b981' : '#ef4444',
            boxShadow: `0 10px 30px ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {notification.type === 'success' ? '✅' : '❌'}
            </div>
            <div>
              <p className="text-white font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-white hover:text-gray-200 transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(1deg);
          }
          50% {
            transform: translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes backgroundMove {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(-60px) translateY(-60px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .create-task-btn:hover {
          box-shadow: 0 20px 45px rgba(6, 182, 212, 0.5), 0 10px 25px rgba(168, 85, 247, 0.3), 0 5px 15px rgba(236, 72, 153, 0.2);
        }

        .floating-particle {
          filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.8));
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;