# Contributing to DoBot 🤝

Thank you for your interest in contributing to DoBot! We're excited to have you join our community of developers building the future of AI-powered task management.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new functionality or improvements
- 📝 **Documentation**: Improve our guides, API docs, or README
- 🔧 **Code Contributions**: Submit bug fixes, features, or optimizations
- 🧪 **Testing**: Help us improve test coverage and quality
- 🎨 **Design**: Contribute to UI/UX improvements

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **Git** for version control
- **Docker** (optional, for database setup)
- **TypeScript** knowledge (for code contributions)
- **React** experience (for frontend contributions)

### Development Setup

1. **Fork the repository**
    ```bash
    # Fork on GitHub, then clone your fork
    git clone https://github.com/yourusername/DoBot.git
    cd DoBot
    ```

2. **Add upstream remote**
    ```bash
    git remote add upstream https://github.com/originalowner/DoBot.git
    ```

3. **Install dependencies**
    ```bash
    npm install
    ```

4. **Set up environment**
    ```bash
    cp .env.example .env
    # Configure your environment variables
    ```

5. **Start development servers**
    ```bash
    npm run dev
    ```

## 🔄 Development Workflow

### Branch Strategy

We use GitFlow for our branching strategy:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
# Update your fork
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Push to your fork
git push -u origin feature/your-feature-name
```

### Making Changes

1. **Code Style**: Follow our established patterns
    ```bash
    # Run linter
    npm run lint
    
    # Fix auto-fixable issues
    npm run lint:fix
    
    # Type checking
    npm run type-check
    ```

2. **Testing**: Ensure all tests pass
    ```bash
    # Run all tests
    npm run test
    
    # Run specific test suites
    npm run test:client
    npm run test:server
    ```

3. **Commit Messages**: Use conventional commits
    ```bash
    # Format: type(scope): description
    feat(ai): add task priority prediction
    fix(ui): resolve drag-and-drop issue on mobile
    docs(readme): update installation instructions
    test(api): add integration tests for task creation
    ```

### Submitting a Pull Request

1. **Update your branch**
    ```bash
    git checkout develop
    git pull upstream develop
    git checkout feature/your-feature-name
    git rebase develop
    ```

2. **Push changes**
    ```bash
    git push origin feature/your-feature-name
    ```

3. **Create Pull Request**
    - Use our PR template
    - Provide clear description
    - Link related issues
    - Add screenshots for UI changes
    - Request appropriate reviewers

## 📋 Pull Request Guidelines

### PR Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one maintainer reviews the code
3. **Testing**: Reviewers test functionality
4. **Approval**: Two approvals required for main branch
5. **Merge**: Squash and merge strategy used

## 🏗️ Code Architecture Guidelines

### Frontend (React/TypeScript)

```typescript
// Component structure
interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState<StateType>();
  
  // Effects
  useEffect(() => {
     // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = useCallback(() => {
     // Handler logic
  }, [dependencies]);
  
  return (
     // JSX
  );
};
```

### Backend (Node.js/Express)

```typescript
// Controller structure
export class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
     try {
        const taskData = TaskSchema.parse(req.body);
        const task = await this.taskService.create(taskData);
        res.status(201).json({ success: true, data: task });
     } catch (error) {
        this.handleError(error, res);
     }
  }
}

// Service structure
export class TaskService {
  constructor(
     private taskRepository: TaskRepository,
     private aiService: AIService
  ) {}
  
  async create(taskData: CreateTaskInput): Promise<Task> {
     // Business logic
     const analysis = await this.aiService.analyzeTask(taskData);
     return this.taskRepository.create({ ...taskData, analysis });
  }
}
```

### AI Agent Development

```typescript
// AI Tool structure
interface AITool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  execute: (input: any) => Promise<any>;
}

// Agent prompt templates
export const TASK_ANALYSIS_PROMPT = `
Analyze the following task and provide:
1. Priority score (1-10)
2. Estimated effort (hours)
3. Suggested assignee
4. Potential blockers

Task: {task_description}
Context: {project_context}
`;
```

## 🧪 Testing Guidelines

### Frontend Testing

```typescript
// Component tests
describe('TaskCard', () => {
  it('should render task information correctly', () => {
     const mockTask = createMockTask();
     render(<TaskCard task={mockTask} />);
     
     expect(screen.getByText(mockTask.title)).toBeInTheDocument();
     expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });
  
  it('should handle drag events', async () => {
     const onDrag = jest.fn();
     const mockTask = createMockTask();
     
     render(<TaskCard task={mockTask} onDrag={onDrag} />);
     
     // Test drag behavior
     const taskElement = screen.getByTestId('task-card');
     fireEvent.dragStart(taskElement);
     
     expect(onDrag).toHaveBeenCalledWith(mockTask);
  });
});
```

### Backend Testing

```typescript
// API integration tests
describe('Task API', () => {
  beforeEach(async () => {
     await setupTestDatabase();
  });
  
  afterEach(async () => {
     await cleanupTestDatabase();
  });
  
  it('should create a new task', async () => {
     const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: 'project-123'
     };
     
     const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);
     
     expect(response.body.data.title).toBe(taskData.title);
  });
});
```

## 📝 Documentation Standards

### Code Documentation

```typescript
/**
 * Analyzes a task using AI to extract insights and suggestions
 * 
 * @param task - The task object to analyze
 * @param context - Additional context for analysis
 * @returns Promise resolving to AI analysis results
 * 
 * @example
 * ```typescript
 * const analysis = await analyzeTask(task, { projectType: 'web-app' });
 * console.log(analysis.priorityScore); // 8
 * ```
 */
async function analyzeTask(
  task: Task, 
  context: AnalysisContext
): Promise<AIAnalysis> {
  // Implementation
}
```

### API Documentation

- Use OpenAPI/Swagger specifications
- Include request/response examples
- Document error codes and responses
- Provide authentication details

## 🔒 Security Guidelines

### Code Security

- Validate all inputs using schema validation
- Sanitize user data before database operations
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Follow OWASP security guidelines

### Environment Variables

```bash
# Never commit sensitive data
# Use .env.example for templates
OPENAI_API_KEY=your_api_key_here  # ❌ Don't commit real keys
OPENAI_API_KEY=sk-...             # ✅ Use in actual .env (gitignored)
```

## 🎯 Issue Guidelines

### Bug Reports

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]
```

### Feature Requests

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like it to work?

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

## 🏆 Recognition

Contributors are recognized in several ways:

- **Hall of Fame**: Top contributors featured in README
- **Release Notes**: Contributions highlighted in release notes
- **Discord Role**: Special contributor role in our Discord
- **Swag**: DoBot merchandise for significant contributions

## 📞 Getting Help

- 📧 **Email**: joanpe25@hotmail.com
- 🐛 **Issues**: Use GitHub Issues for bugs and features

### Our Pledge

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## 🔄 Release Process

1. **Feature Development**: Develop on feature branches
2. **Integration**: Merge to develop branch
3. **Testing**: Comprehensive testing on develop
4. **Release Candidate**: Create RC from develop
5. **Production**: Merge to main after final testing

### Semantic Versioning

We follow [SemVer](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

---

Thank you for contributing to DoBot! Together, we're building the future of AI-powered productivity tools. 🚀

*Happy coding!* ❤️