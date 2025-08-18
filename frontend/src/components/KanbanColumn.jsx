import React, { useState } from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, onDragOver, onDrop, onEditTask }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const columnConfig = {
    'Created': { 
      gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)', 
      accent: '#94a3b8',
      icon: '📝',
      shadow: 'rgba(71, 85, 105, 0.3)',
      description: 'New tasks ready to start'
    },
    'In Progress': { 
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
      accent: '#60a5fa',
      icon: '⚡',
      shadow: 'rgba(37, 99, 235, 0.3)',
      description: 'Active tasks in development'
    },
    'Blocked': { 
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
      accent: '#f87171',
      icon: '🚫',
      shadow: 'rgba(220, 38, 38, 0.3)',
      description: 'Tasks waiting for resolution'
    },
    'Completed': { 
      gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', 
      accent: '#4ade80',
      icon: '✅',
      shadow: 'rgba(22, 163, 74, 0.3)',
      description: 'Successfully finished tasks'
    },
    'Cancelled': { 
      gradient: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', 
      accent: '#a78bfa',
      icon: '❌',
      shadow: 'rgba(147, 51, 234, 0.3)',
      description: 'Cancelled or discontinued tasks'
    }
  };

  const config = columnConfig[status] || columnConfig['Created'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = (e) => {
    // Solo cambiar el estado si realmente salimos del componente
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, status);
    
    // Añadir efecto visual de confirmación
    const dropEffect = document.createElement('div');
    dropEffect.className = 'drop-effect';
    dropEffect.textContent = '✨ Task moved!';
    dropEffect.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(6, 182, 212, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      animation: dropFeedback 1.5s ease-out forwards;
      pointer-events: none;
    `;
    
    e.currentTarget.style.position = 'relative';
    e.currentTarget.appendChild(dropEffect);
    
    setTimeout(() => {
      if (dropEffect.parentNode) {
        dropEffect.parentNode.removeChild(dropEffect);
      }
    }, 1500);
  };

  const getColumnStats = () => {
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return { completedTasks, totalTasks, progressPercentage };
  };

  const stats = getColumnStats();

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="column-container relative p-6 rounded-3xl transition-all duration-500 min-h-[500px] group"
      style={{
        background: config.gradient,
        border: isDragOver 
          ? '2px solid #06b6d4' 
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isDragOver 
          ? `0 25px 50px rgba(6, 182, 212, 0.4), 0 15px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(6, 182, 212, 0.1)`
          : isHovered 
            ? `0 20px 40px ${config.shadow}, 0 10px 20px rgba(0, 0, 0, 0.2)`
            : '0 8px 25px rgba(0, 0, 0, 0.2)',
        transform: isDragOver 
          ? 'scale(1.05) translateY(-5px)' 
          : isHovered 
            ? 'scale(1.02) translateY(-2px)' 
            : 'scale(1) translateY(0)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Efecto de ondas en los bordes */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${config.accent}40 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, ${config.accent}30 0%, transparent 50%)`,
          opacity: isDragOver ? 0.6 : isHovered ? 0.3 : 0
        }}
      />

      {/* Header con glassmorphism mejorado */}
      <div 
        className="flex flex-col space-y-3 mb-6 p-4 rounded-2xl border transition-all duration-300"
        style={{
          background: isDragOver 
            ? 'rgba(6, 182, 212, 0.2)' 
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderColor: isDragOver 
            ? 'rgba(6, 182, 212, 0.5)' 
            : 'rgba(255, 255, 255, 0.2)',
          transform: isDragOver ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl transform transition-transform duration-300 group-hover:scale-110">
              {config.icon}
            </span>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                {status}
              </h2>
              <p className="text-white/60 text-sm">{config.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div 
              className="rounded-full px-3 py-1 text-sm font-semibold text-white transition-all duration-300 border"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transform: isDragOver ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
                boxShadow: isDragOver ? `0 0 20px ${config.accent}60` : 'none'
              }}
            >
              {tasks.length}
            </div>
          </div>
        </div>

        {/* Barra de progreso de la columna */}
        {status === 'Completed' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/80">
              <span>Progress</span>
              <span>{Math.round(stats.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  background: `linear-gradient(90deg, ${config.accent}, white)`,
                  width: `${stats.progressPercentage}%`,
                  boxShadow: `0 0 10px ${config.accent}60`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenedor de tareas con scroll personalizado */}
      <div 
        className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${config.accent}60 transparent`
        }}
      >
        {tasks.map((task, index) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEditTask={onEditTask} 
            index={index} 
          />
        ))}
        
        {/* Estado vacío mejorado */}
        {tasks.length === 0 && (
          <div className="relative group/empty">
            <div 
              className="text-center p-8 rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer hover:bg-white/5"
              style={{
                borderColor: isDragOver 
                  ? 'rgba(6, 182, 212, 0.8)' 
                  : 'rgba(255, 255, 255, 0.3)',
                background: isDragOver 
                  ? 'rgba(6, 182, 212, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                transform: isDragOver ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div className="text-white/60 group-hover/empty:text-white/80 transition-colors duration-300">
                <div className="text-6xl mb-4 transition-all duration-500">
                  {isDragOver ? '🎯' : '📋'}
                </div>
                <p className="font-medium text-lg mb-2">
                  {isDragOver ? 'Drop your task here!' : 'No tasks here yet'}
                </p>
                <p className="text-sm opacity-60">
                  {isDragOver 
                    ? 'Release to add the task to this column' 
                    : 'Drag tasks here or create new ones to get started'
                  }
                </p>
                
                {/* Indicador de drop zone */}
                {isDragOver && (
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ 
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Efecto de resplandor al hacer hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500 -z-10"
              style={{
                background: `radial-gradient(circle at center, ${config.accent}20 0%, transparent 70%)`,
                filter: 'blur(20px)'
              }}
            />
          </div>
        )}
      </div>

      {/* Indicador de conteo flotante */}
      {tasks.length > 0 && (
        <div 
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 border-2 border-white/20"
          style={{
            background: config.gradient,
            boxShadow: `0 4px 12px ${config.shadow}`,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {tasks.length}
        </div>
      )}

      {/* Efecto de partículas en drag over */}
      {isDragOver && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes dropFeedback {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1) translateY(-20px);
          }
        }

        /* Scrollbar personalizado */
        .space-y-4::-webkit-scrollbar {
          width: 6px;
        }

        .space-y-4::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .space-y-4::-webkit-scrollbar-thumb {
          background: ${config.accent}60;
          border-radius: 3px;
        }

        .space-y-4::-webkit-scrollbar-thumb:hover {
          background: ${config.accent}80;
        }
      `}</style>
    </div>
  );
};

export default KanbanColumn;