/**
 * Test suite for the KanbanBoard component
 * 
 * This test file contains comprehensive tests for the KanbanBoard component functionality including:
 * - Rendering of all kanban columns (Created, In Progress, Blocked, Completed, Cancelled)
 * - Display of correct task statistics and counts
 * - Proper task placement in their respective status columns
 * - Task form opening when create button is clicked
 * - Drag and drop functionality for moving tasks between columns
 * - Error handling and notification display when task updates fail
 * - Task filtering by status to ensure correct column organization
 * 
 * Uses a mock TaskContext with sample tasks in different statuses and mock functions
 * for testing component interactions without making actual API calls.
 * 
 * @module KanbanBoard.test
 * @requires @testing-library/react
 * @requires TaskContext
 * @requires KanbanBoard
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskContext } from '../context/TaskContext';
import KanbanBoard from '../components/KanbanBoard';



const mockContextValue = {
  tasks: [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'Created',
      assignees: ['John'],
      created_at: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      status: 'InProgress',
      assignees: ['Jane'],
      created_at: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      status: 'Completed',
      assignees: [],
      created_at: '2025-01-03T00:00:00.000Z'
    }
  ],
  people: ['John', 'Jane'],
  loading: false,
  error: null,
  updateTaskStatus: jest.fn(),
  addTask: jest.fn(),
  editTask: jest.fn(),
  removeTask: jest.fn(),
  addPerson: jest.fn(),
  fetchAll: jest.fn()
};

const renderWithContext = (component) => {
  return render(
    <TaskContext.Provider value={mockContextValue}>
      {component}
    </TaskContext.Provider>
  );
};

describe('KanbanBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all kanban columns correctly', () => {
    renderWithContext(<KanbanBoard />);

    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays correct task statistics', () => {
    renderWithContext(<KanbanBoard />);

    expect(screen.getByText('3')).toBeInTheDocument(); 
    expect(screen.getByText('1')).toBeInTheDocument(); 
    expect(screen.getByText('1')).toBeInTheDocument(); 
  });

  it('shows tasks in correct columns', () => {
    renderWithContext(<KanbanBoard />);

    expect(screen.getByText('Task 1')).toBeInTheDocument(); 
    expect(screen.getByText('Task 2')).toBeInTheDocument(); 
    expect(screen.getByText('Task 3')).toBeInTheDocument(); 
  });

  it('opens task form when create button is clicked', async () => {
    renderWithContext(<KanbanBoard />);

    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    });
  });

  it('handles drag and drop correctly', async () => {
    const mockUpdateTaskStatus = jest.fn().mockResolvedValue();
    const contextWithMock = {
      ...mockContextValue,
      updateTaskStatus: mockUpdateTaskStatus
    };

    render(
      <TaskContext.Provider value={contextWithMock}>
        <KanbanBoard />
      </TaskContext.Provider>
    );

    const taskElement = screen.getByText('Task 1');
    const inProgressColumn = screen.getByText('In Progress').closest('.kanban-column');

    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        getData: jest.fn().mockReturnValue('1')
      }
    });

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        getData: jest.fn().mockReturnValue('1')
      }
    });

    fireEvent(taskElement, dragStartEvent);
    fireEvent(inProgressColumn, dropEvent);

    await waitFor(() => {
      expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', 'InProgress');
    });
  });

  it('displays error notification when task update fails', async () => {
    const mockUpdateTaskStatus = jest.fn().mockRejectedValue(new Error('Update failed'));
    const contextWithError = {
      ...mockContextValue,
      updateTaskStatus: mockUpdateTaskStatus
    };

    render(
      <TaskContext.Provider value={contextWithError}>
        <KanbanBoard />
      </TaskContext.Provider>
    );

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { getData: jest.fn().mockReturnValue('1') }
    });

    const inProgressColumn = screen.getByText('In Progress').closest('.kanban-column');
    fireEvent(inProgressColumn, dropEvent);

    await waitFor(() => {
      expect(screen.getByText('Failed to update task status')).toBeInTheDocument();
    });
  });

  it('filters tasks correctly by status', () => {
    renderWithContext(<KanbanBoard />);

    const createdSection = screen.getByText('Created').closest('.kanban-column');
    const inProgressSection = screen.getByText('In Progress').closest('.kanban-column');
    const completedSection = screen.getByText('Completed').closest('.kanban-column');

    expect(createdSection).toHaveTextContent('Task 1');
    expect(createdSection).not.toHaveTextContent('Task 2');
    
    expect(inProgressSection).toHaveTextContent('Task 2');
    expect(inProgressSection).not.toHaveTextContent('Task 1');
    
    expect(completedSection).toHaveTextContent('Task 3');
    expect(completedSection).not.toHaveTextContent('Task 1');
  });
});