import React, { useState, useContext } from 'react';
import { TaskContext } from '../App';

const TaskCard = ({ task, onEditTask, index }) => {
  const { removeTask } = useContext(TaskContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    // Agregar efecto visual al arrastrar
    e.target.style.opacity = '0.8';
    e.target.style.transform = 'rotate(3deg)';
  };

  const handleDragEnd = (e) => {
    // Restaurar apariencia normal
    e.target.style.opacity = '1';
    e.target.style.transform = 'rotate(0deg)';
  };

  const getFormattedDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeTask(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
    setTimeout(() => {
      handleDelete();
    }, 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Created': '#6b7280',
      'In Progress': '#3b82f6',
      'Blocked': '#ef4444',
      'Completed': '#10b981',
      'Cancelled': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityIcon = () => {
    // Simulamos prioridad basada en el ID para variedad visual
    const icons = ['🔥', '⭐', '📌', '💡', '🎯'];
    return icons[task.id % icons.length];
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        task-card relative p-5 rounded-xl transition-all duration-500 transform cursor-grab active:cursor-grabbing group
        ${isHovered ? 'task-card-hover' : ''}
        ${isDeleting ? 'scale-0 opacity-0' : ''}
        ${showDeleteConfirm ? 'animate-pulse' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(100, 116, 139, 0.5)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(6, 182, 212, 0.2), 0 10px 20px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'scale(1.03) translateY(-8px) rotateX(5deg)' : 'scale(1) translateY(0px)',
        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
        backdropFilter: 'blur(10px)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Efecto de brillo superior */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${getStatusColor(task.status)}, transparent)`
        }}
      />

      {/* Glow effect dinámico */}
      <div 
        className="absolute inset-0 rounded-xl transition-all duration-500 -z-10"
        style={{
          background: `linear-gradient(45deg, ${getStatusColor(task.status)}15, rgba(147, 51, 234, 0.1))`,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            {getPriorityIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 leading-tight pr-2 group-hover:text-cyan-300 transition-colors duration-300">
              {task.title}
            </h3>
            <div 
              className="inline-block px-2 py-1 rounded-md text-xs font-medium"
              style={{
                background: `${getStatusColor(task.status)}20`,
                color: getStatusColor(task.status),
                border: `1px solid ${getStatusColor(task.status)}40`
              }}
            >
              {task.status}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1 opacity-60 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEditTask && onEditTask(task)}
            className="edit-btn text-yellow-400 hover:text-yellow-300 transition-all duration-300 p-2 rounded-md hover:bg-yellow-400/10"
            style={{ 
              transform: 'scale(1)',
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.2) rotate(15deg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) rotate(0deg)';
            }}
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button 
            onClick={confirmDelete}
            className="delete-btn text-red-400 hover:text-red-300 transition-all duration-300 p-2 rounded-md hover:bg-red-400/10"
            style={{ 
              transform: 'scale(1)',
              filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.3))'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.2) rotate(-15deg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) rotate(0deg)';
            }}
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
        {task.description}
      </p>
      
      {/* Información del assignee con avatar mejorado */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 hover:scale-110"
                style={{ 
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                }}
              >
                {task.assignee.split(' ').map(n => n[0]).join('')}
              </div>
              {/* Indicador de estado online */}
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800"
                style={{ background: '#10b981' }}
              />
            </div>
            <div>
              <span className="text-slate-300 font-medium text-sm">{task.assignee}</span>
              <p className="text-slate-500 text-xs">Assigned</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-slate-500 text-xs">{getFormattedDate(task.created_at)}</div>
            <div className="flex items-center space-x-1 text-slate-600 text-xs mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created</span>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso visual */}
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              background: `linear-gradient(90deg, ${getStatusColor(task.status)}, ${getStatusColor(task.status)}80)`,
              width: task.status === 'Completed' ? '100%' : 
                     task.status === 'In Progress' ? '60%' : 
                     task.status === 'Blocked' ? '30%' : '10%',
              boxShadow: `0 0 10px ${getStatusColor(task.status)}40`
            }}
          />
        </div>
      </div>

      {/* Efecto de partículas en hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-white font-bold text-sm flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Deleting...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;