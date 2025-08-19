/**
 * Test setup configuration file for Jest testing environment.
 * Sets up global mocks and polyfills required for testing React components.
 * 
 * Includes:
 * - Jest DOM testing utilities
 * - DataTransfer API mock for drag-and-drop testing
 * - localStorage mock with Jest spy functions
 * - fetch API mock for HTTP request testing
 * - window.location mock with localhost configuration
 * - import.meta.env mock for Vite environment variables (API endpoints)
 */
import '@testing-library/jest-dom';



global.DataTransfer = class DataTransfer {
  constructor() {
    this.data = {};
  }
  setData(type, value) {
    this.data[type] = value;
  }
  getData(type) {
    return this.data[type] || '';
  }
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

global.fetch = jest.fn();

delete window.location;
window.location = {
  hostname: 'localhost',
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000'
};

global.import = {
  meta: {
    env: {
      VITE_API_BASE: 'http://localhost:3000/api/tasks',
      VITE_N8N_BASE: 'http://localhost:5678/webhook'
    }
  }
};