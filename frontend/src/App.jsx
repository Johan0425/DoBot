/**
 * Main application component that serves as the root of the DoBot frontend.
 * Provides task management functionality through a Kanban board interface
 * and AI chat capabilities.
 * 
 * @component
 * @returns {JSX.Element} The main application layout with TaskProvider context,
 *                        KanbanBoard component, and AIChat component wrapped
 *                        in a dark-themed container
 */
import React from 'react';
import { TaskProvider } from './context/TaskContext';
import KanbanBoard from './components/KanbanBoard';
import AIChat from './components/AIchat';
import './index.css';



export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <KanbanBoard />
        <AIChat />
      </div>
    </TaskProvider>
  );
}