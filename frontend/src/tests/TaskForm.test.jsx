/**
 * @fileoverview Test suite for TaskForm component
 * 
 * This test file contains comprehensive tests for the TaskForm component, covering:
 * - Creating new tasks with form validation and submission
 * - Editing existing tasks with pre-populated data
 * - People management functionality (selection, addition)
 * - Form interactions (cancellation, outside clicks)
 * - UI state management and button enabling/disabling
 * 
 * Uses React Testing Library for rendering and user interactions,
 * with mocked TaskContext for isolated component testing.
 * 
 * @module TaskFormTest
 * @requires @testing-library/react
 * @requires @testing-library/user-event
 * @requires ../context/TaskContext
 * @requires ../components/TaskForm
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskContext } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';



const mockContextValue = {
  addTask: jest.fn(),
  editTask: jest.fn(),
  people: ['John Doe', 'Jane Smith'],
  addPerson: jest.fn(),
  tasks: [],
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

describe('TaskForm', () => {
  const mockOnClose = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creating new task', () => {
    it('renders form with correct title for new task', () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);
      
      expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
      expect(screen.getByText('Crear')).toBeInTheDocument();
    });

    it('creates task with correct data when form is submitted', async () => {
      const mockAddTask = jest.fn().mockResolvedValue();
      const contextWithMock = {
        ...mockContextValue,
        addTask: mockAddTask
      };

      render(
        <TaskContext.Provider value={contextWithMock}>
          <TaskForm onClose={mockOnClose} />
        </TaskContext.Provider>
      );

      await user.type(screen.getByLabelText('Título'), 'New Task Title');
      await user.type(screen.getByLabelText('Descripción'), 'Task description');
      await user.selectOptions(screen.getByLabelText('Estado'), 'InProgress');

      await user.click(screen.getByText('John Doe'));

      await user.click(screen.getByText('Crear'));

      await waitFor(() => {
        expect(mockAddTask).toHaveBeenCalledWith({
          title: 'New Task Title',
          description: 'Task description',
          status: 'InProgress',
          assignees: ['John Doe']
        });
      });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('validates required fields', async () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      const createButton = screen.getByText('Crear');
      expect(createButton).toBeDisabled();

      await user.type(screen.getByLabelText('Título'), 'Test Title');
      expect(createButton).toBeDisabled();

      await user.type(screen.getByLabelText('Descripción'), 'Test Description');
      expect(createButton).toBeEnabled();
    });
  });

  describe('Editing existing task', () => {
    const existingTask = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      status: 'Blocked',
      assignees: ['Jane Smith']
    };

    it('renders form with correct title for editing', () => {
      renderWithContext(<TaskForm onClose={mockOnClose} task={existingTask} />);
      
      expect(screen.getByText('Editar Tarea')).toBeInTheDocument();
      expect(screen.getByText('Guardar')).toBeInTheDocument();
    });

    it('populates form with existing task data', () => {
      renderWithContext(<TaskForm onClose={mockOnClose} task={existingTask} />);

      expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Blocked')).toBeInTheDocument();
      
      const janeButton = screen.getByText('✓ Jane Smith');
      expect(janeButton).toHaveClass('bg-cyan-600');
    });

    it('updates task when form is submitted', async () => {
      const mockEditTask = jest.fn().mockResolvedValue();
      const contextWithMock = {
        ...mockContextValue,
        editTask: mockEditTask
      };

      render(
        <TaskContext.Provider value={contextWithMock}>
          <TaskForm onClose={mockOnClose} task={existingTask} />
        </TaskContext.Provider>
      );

      const titleInput = screen.getByDisplayValue('Existing Task');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');

      await user.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith(1, {
          id: 1,
          title: 'Updated Task',
          description: 'Existing Description',
          status: 'Blocked',
          assignees: ['Jane Smith']
        });
      });

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('People management', () => {
    it('displays existing people as selectable buttons', () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('toggles person selection when clicked', async () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      const johnButton = screen.getByText('John Doe');
      
      expect(johnButton).not.toHaveTextContent('✓');
      
      await user.click(johnButton);
      expect(johnButton).toHaveTextContent('✓ John Doe');
      
      await user.click(johnButton);
      expect(johnButton).not.toHaveTextContent('✓');
    });

    it('adds new person when Enter is pressed', async () => {
      const mockAddPerson = jest.fn();
      const contextWithMock = {
        ...mockContextValue,
        addPerson: mockAddPerson
      };

      render(
        <TaskContext.Provider value={contextWithMock}>
          <TaskForm onClose={mockOnClose} />
        </TaskContext.Provider>
      );

      const newPersonInput = screen.getByPlaceholderText('Nueva persona');
      
      await user.type(newPersonInput, 'New Person');
      await user.keyboard('{Enter}');

      expect(mockAddPerson).toHaveBeenCalledWith('New Person');
      expect(newPersonInput).toHaveValue('');
    });

    it('adds new person when Añadir button is clicked', async () => {
      const mockAddPerson = jest.fn();
      const contextWithMock = {
        ...mockContextValue,
        addPerson: mockAddPerson
      };

      render(
        <TaskContext.Provider value={contextWithMock}>
          <TaskForm onClose={mockOnClose} />
        </TaskContext.Provider>
      );

      const newPersonInput = screen.getByPlaceholderText('Nueva persona');
      const addButton = screen.getByText('Añadir');

      await user.type(newPersonInput, 'Another Person');
      await user.click(addButton);

      expect(mockAddPerson).toHaveBeenCalledWith('Another Person');
      expect(newPersonInput).toHaveValue('');
    });

    it('disables Añadir button when input is empty', () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      const addButton = screen.getByText('Añadir');
      expect(addButton).toBeDisabled();
    });
  });

  describe('Form interactions', () => {
    it('closes form when Cancel button is clicked', async () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      await user.click(screen.getByText('Cancelar'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes form when clicking outside', async () => {
      renderWithContext(<TaskForm onClose={mockOnClose} />);

      const overlay = screen.getByRole('dialog').parentElement;
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});