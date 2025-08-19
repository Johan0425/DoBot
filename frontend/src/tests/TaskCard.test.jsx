/**
 * @fileoverview Test suite for the TaskCard component.
 * 
 * This test file contains unit tests for the TaskCard component, which displays
 * task information including title, description, assignees, and provides edit/delete
 * functionality. The tests verify proper rendering of task data, interaction handling
 * for edit and delete operations, and correct integration with the TaskContext.
 * 
 * The test suite uses React Testing Library for rendering and user interaction
 * simulation, and includes a custom render function that wraps components with
 * the necessary TaskContext provider for testing.
 * 
 * @module TaskCard.test
 * @requires @testing-library/react
 * @requires ../context/TaskContext
 * @requires ../components/TaskCard
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';



const mockContextValue = {
  removeTask: jest.fn(),
  tasks: [],
  people: [],
  loading: false,
  error: null
};

const renderWithContext = (component) => {
  return render(
    <TaskContext.Provider value={mockContextValue}>
      {component}
    </TaskContext.Provider>
  );
};

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'Created',
    assignees: ['John Doe'],
    created_at: '2025-01-01T00:00:00.000Z'
  };

  it('renders task information correctly', () => {
    renderWithContext(
      <TaskCard task={mockTask} onEditTask={jest.fn()} index={0} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEditTask when edit button is clicked', () => {
    const mockEditTask = jest.fn();
    
    renderWithContext(
      <TaskCard task={mockTask} onEditTask={mockEditTask} index={0} />
    );

    fireEvent.click(screen.getByLabelText('Edit task'));
    expect(mockEditTask).toHaveBeenCalledWith(mockTask);
  });

  it('shows delete confirmation on delete button click', () => {
    renderWithContext(
      <TaskCard task={mockTask} onEditTask={jest.fn()} index={0} />
    );

    fireEvent.click(screen.getByLabelText('Delete task'));
    expect(screen.getByText('Delete Task?')).toBeInTheDocument();
  });
});