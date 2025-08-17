import React, { useState, useEffect } from 'react';

// Mock data para demostración
const mockTasks = [
  {
    id: 1,
    title: "Desarrollar Dashboard Analytics",
    description: "Crear visualizaciones interactivas con gráficos en tiempo real",
    status: "In Progress",
    assignee: "Juan Henao",
    created_at: "2025-08-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Optimizar API Performance",
    description: "Mejorar tiempo de respuesta y cacheo de endpoints críticos",
    status: "Created",
    assignee: "Maria Perez",
    created_at: "2025-08-16T14:30:00Z"
  },
  {
    id: 3,
    title: "Testing Automatizado E2E",
    description: "Implementar suite completa de pruebas con Cypress",
    status: "Blocked",
    assignee: "Carlos Gomez",
    created_at: "2025-08-14T09:15:00Z"
  }
];

const TaskCard = ({ task, onEditTask, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        task-card relative p-4 rounded-xl transition-all duration-500 transform cursor-grab active:cursor-grabbing 
        ${isHovered ? 'task-card-hover' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(100, 116, 139, 0.5)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(6, 182, 212, 0.2), 0 10px 20px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0px)',
        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl transition-opacity duration-300 -z-10"
        style={{
          background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(147, 51, 234, 0.1))',
          opacity: isHovered ? 1 : 0
        }}
      />
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white mb-1 leading-tight pr-2">{task.title}</h3>
        <div className="flex space-x-1 opacity-60 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEditTask && onEditTask(task)}
            className="edit-btn text-yellow-400 hover:text-yellow-300 transition-colors p-1 rounded-md"
            style={{ backgroundColor: isHovered ? 'rgba(251, 191, 36, 0.1)' : 'transparent' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="delete-btn text-red-400 hover:text-red-300 transition-colors p-1 rounded-md"
            style={{ backgroundColor: isHovered ? 'rgba(248, 113, 113, 0.1)' : 'transparent' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
            >
              {task.assignee.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-slate-400">{task.assignee}</span>
          </div>
          <span className="text-slate-500">{getFormattedDate(task.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ status, tasks, onDragOver, onDrop, onEditTask }) => {
  const columnConfig = {
    'Created': { 
      gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)', 
      accent: '#94a3b8',
      icon: '📝',
      shadow: 'rgba(71, 85, 105, 0.3)'
    },
    'In Progress': { 
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
      accent: '#60a5fa',
      icon: '⚡',
      shadow: 'rgba(37, 99, 235, 0.3)'
    },
    'Blocked': { 
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
      accent: '#f87171',
      icon: '🚫',
      shadow: 'rgba(220, 38, 38, 0.3)'
    },
    'Completed': { 
      gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', 
      accent: '#4ade80',
      icon: '✅',
      shadow: 'rgba(22, 163, 74, 0.3)'
    },
    'Cancelled': { 
      gradient: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', 
      accent: '#a78bfa',
      icon: '❌',
      shadow: 'rgba(147, 51, 234, 0.3)'
    }
  };

  const config = columnConfig[status] || columnConfig['Created'];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, status)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="column-container relative p-5 rounded-2xl transition-all duration-500 min-h-[500px]"
      style={{
        background: config.gradient,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered 
          ? `0 20px 40px ${config.shadow}, 0 10px 20px rgba(0, 0, 0, 0.2)`
          : '0 8px 25px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header con efecto glassmorphism */}
      <div 
        className="flex items-center space-x-3 mb-6 p-3 rounded-xl border"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <span className="text-2xl">{config.icon}</span>
        <h2 className="text-xl font-bold text-white">{status}</h2>
        <div 
          className="ml-auto rounded-full px-2 py-1 text-xs font-semibold text-white"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        >
          {tasks.length}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} onEditTask={onEditTask} index={index} />
        ))}
        
        {tasks.length === 0 && (
          <div className="relative group">
            <div 
              className="text-center p-8 rounded-xl border-2 border-dashed transition-all duration-300"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-white/60 group-hover:text-white/80 transition-colors">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-medium">No tasks here yet</p>
                <p className="text-sm opacity-60 mt-1">Drag tasks here or create new ones</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="floating-particle absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'rgba(6, 182, 212, 0.3)',
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const StatsCard = ({ icon, title, value, gradient, shadow }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="stats-card p-4 rounded-xl transition-transform duration-300 cursor-pointer border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: gradient,
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered ? `0 15px 35px ${shadow}` : '0 5px 15px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function ModernKanbanBoard() {
  const [tasks] = useState(mockTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const statuses = ['Created', 'In Progress', 'Blocked', 'Completed', 'Cancelled'];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    console.log(`Moving task ${taskId} to ${newStatus}`);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    blocked: tasks.filter(t => t.status === 'Blocked').length
  };

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
      }}
    >
      <FloatingParticles />
      
      {/* Animated background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 
              className="text-5xl font-bold"
              style={{
                background: 'linear-gradient(45deg, #06b6d4, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Dobot Kanban Pro
            </h1>
            <p className="text-slate-400 text-lg">Manage your tasks with style and efficiency</p>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="create-task-btn group relative px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(45deg, #06b6d4, #a855f7)',
              boxShadow: '0 10px 25px rgba(6, 182, 212, 0.3)'
            }}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Task</span>
            </div>
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon="🎯" 
            title="Total Tasks" 
            value={stats.total} 
            gradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
            shadow="rgba(37, 99, 235, 0.3)"
          />
          <StatsCard 
            icon="⚡" 
            title="In Progress" 
            value={stats.inProgress} 
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            shadow="rgba(245, 158, 11, 0.3)"
          />
          <StatsCard 
            icon="📈" 
            title="Completed" 
            value={stats.completed} 
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            shadow="rgba(16, 185, 129, 0.3)"
          />
          <StatsCard 
            icon="👥" 
            title="Blocked" 
            value={stats.blocked} 
            gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            shadow="rgba(239, 68, 68, 0.3)"
          />
        </div>

        {/* Kanban Board */}
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

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .floating-particle {
          filter: blur(1px);
        }

        .task-card:hover .edit-btn,
        .task-card:hover .delete-btn {
          transform: scale(1.1);
        }

        .create-task-btn:hover {
          box-shadow: 0 15px 35px rgba(6, 182, 212, 0.4), 0 5px 15px rgba(168, 85, 247, 0.3);
        }

        .stats-card:hover {
          transform: scale(1.05) translateY(-2px);
        }
      `}</style>
    </div>
  );
}