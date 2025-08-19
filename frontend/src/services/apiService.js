

/**
 * API Service module for DoBot frontend application.
 * Provides functions to interact with both direct API endpoints and N8N webhook endpoints.
 * Handles task management operations including CRUD operations, AI chat functionality,
 * and webhook-based task creation. Automatically resolves host configuration based on
 * environment variables or defaults to localhost with configurable ports.
 * 
 * @module apiService
 * @requires fetch - For making HTTP requests
 * @requires window - Browser window object for hostname resolution
 * 
 * Environment Variables:
 * - VITE_API_BASE: Base URL for the API (default: http://HOST:3000/api/tasks)
 * - VITE_API_PORT: Port for the API server (default: 3000)
 * - VITE_N8N_BASE: Base URL for N8N webhooks (default: http://HOST:5678/webhook)
 * - VITE_N8N_PORT: Port for N8N server (default: 5678)
 * 
 * @example
 * import { getTasks, createTask, chatWithAI } from './services/apiService.js';
 * 
 * // Get all tasks
 * const tasks = await getTasks();
 * 
 * // Create a new task
 * const newTask = await createTask({ title: 'New Task', description: 'Task description' });
 * 
 * // Chat with AI
 * const response = await chatWithAI('Hello AI');
 */

const resolveHost = () =>
  (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

const HOST = resolveHost();
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `http://${HOST}:${import.meta.env.VITE_API_PORT || 3000}/api/tasks`;
const N8N_BASE =
  import.meta.env.VITE_N8N_BASE ||
  `http://${HOST}:${import.meta.env.VITE_N8N_PORT || 5678}/webhook`;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const handle = async (promise) => {
  const res = await promise;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const chatWithAI = (message) =>
  handle(fetch('http://localhost:5678/webhook/dobot-ai', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ message })
  }));

export const createTaskViaN8N = (message) =>
  handle(fetch('http://localhost:5678/webhook/tasks-webhook', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ message })
  }));

export const getTasks = () => handle(fetch(API_BASE));

export const createTask = (data) =>
  handle(fetch(API_BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data)
  }));

export const updateTask = (id, data) =>
  handle(fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(data)
  }));

export const deleteTask = (id) =>
  handle(fetch(`${API_BASE}/${id}`, { method: 'DELETE' }));

export const createTaskViaWebhook = (data) =>
  handle(fetch(`${N8N_BASE}/create-task`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data)
  }));

export const getTasksViaWebhook = () =>
  handle(fetch(`${N8N_BASE}/list-tasks`));

export const apiInfo = () => ({ API_BASE, N8N_BASE });