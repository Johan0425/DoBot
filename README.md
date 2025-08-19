# DoBot 🤖

DoBot - Your AI-powered task commander. A smart Kanban-style manager that organizes, prioritizes and automates your workflow with conversational AI assistance. Track tasks across stages (Created/In Progress/Blocked), assign teammates, and let intelligent automation handle the rest - all through an intuitive drag-and-drop interface.

## 🌟 Features

- **AI-Powered Task Management**: Intelligent task creation, prioritization, and automation
- **Conversational AI Assistant**: Natural language interaction for seamless workflow management
- **Smart Kanban Board**: Drag-and-drop interface with automated stage transitions
- **Team Collaboration**: Assign tasks to teammates and track progress
- **Intelligent Automation**: Auto-categorization, priority scoring, and workflow optimization
- **Real-time Updates**: Live synchronization across all team members

## 🚀 Quick Start

### Prerequisites

Before running DoBot, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/DoBot.git
    cd DoBot
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Environment Configuration**
    
    Create a `.env` file in the root directory:
    ```bash
    cp .env.example .env
    ```
    
    Configure the following environment variables:
    ```env
    # AI Service Configuration
    OPENAI_API_KEY=your_openai_api_key_here
    AI_MODEL=gpt-4
    
    # Database Configuration
    DATABASE_URL=your_database_connection_string
    
    # Authentication
    JWT_SECRET=your_jwt_secret_key
    
    # Application Settings
    PORT=3000
    NODE_ENV=development
    ```

4. **Database Setup**
    ```bash
    npm run db:migrate
    npm run db:seed
    ```

5. **Start the application**
    ```bash
    # Development mode
    npm run dev
    
    # Production mode
    npm run build
    npm start
    ```

6. **Access the application**
    
    Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React DnD** - Drag and drop functionality for Kanban board
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management and caching

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type safety for backend development
- **Prisma ORM** - Next-generation database toolkit
- **Socket.io** - Real-time bidirectional communication

### Database
- **PostgreSQL** - Robust relational database
- **Redis** - In-memory cache for session management

### AI Integration
- **OpenAI GPT-4** - Advanced language model for task analysis
- **LangChain** - Framework for building AI applications
- **Vector Database** - Semantic search and context understanding

## 🤖 AI Agent Architecture

### Core AI Capabilities

#### 1. **Intelligent Task Analysis**
The AI agent analyzes task descriptions using natural language processing to:
- Extract key requirements and dependencies
- Identify task complexity and estimated effort
- Suggest optimal team member assignments
- Predict potential blockers and risks

#### 2. **Automated Prioritization**
Smart priority scoring based on:
```typescript
interface PriorityFactors {
  urgency: number;        // 1-10 scale
  importance: number;     // Business impact
  dependencies: string[]; // Blocking relationships
  effort: number;         // Estimated hours
  deadline: Date;         // Due date proximity
}
```

#### 3. **Conversational Interface**
Natural language commands for task management:
```
"Create a high-priority task for implementing user authentication"
"Move all UI tasks to in-progress and assign to Sarah"
"What tasks are blocking the frontend deployment?"
"Generate a sprint report for the past week"
```

#### 4. **Workflow Automation**
- **Auto-progression**: Tasks automatically move through stages based on completion criteria
- **Smart notifications**: Context-aware alerts and reminders
- **Dependency management**: Automatic task unblocking when dependencies are resolved
- **Performance insights**: AI-generated team productivity analytics

### AI Agent Implementation

The AI agent is built using a modular architecture:

```typescript
class DoBot {
  private llm: OpenAI;
  private vectorStore: VectorStore;
  private taskAnalyzer: TaskAnalyzer;
  private workflowEngine: WorkflowEngine;

  async processCommand(input: string): Promise<ActionResult> {
     const intent = await this.classifyIntent(input);
     const context = await this.gatherContext(intent);
     const action = await this.generateAction(intent, context);
     return this.executeAction(action);
  }
}
```

## 📁 Project Structure

```
DoBot/
├── 📁 client/                 # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 pages/          # Route-based page components
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   ├── 📁 services/       # API communication layer
│   │   ├── 📁 store/          # State management (Redux/Zustand)
│   │   ├── 📁 types/          # TypeScript type definitions
│   │   └── 📁 utils/          # Helper functions and utilities
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
│
├── 📁 server/                 # Backend Node.js application
│   ├── 📁 src/
│   │   ├── 📁 controllers/    # Request handlers
│   │   ├── 📁 services/       # Business logic layer
│   │   ├── 📁 models/         # Database models (Prisma)
│   │   ├── 📁 middleware/     # Express middleware
│   │   ├── 📁 routes/         # API route definitions
│   │   ├── 📁 ai/             # AI agent implementation
│   │   │   ├── 📄 agent.ts    # Main AI agent class
│   │   │   ├── 📄 prompts.ts  # LLM prompt templates
│   │   │   └── 📄 tools.ts    # AI tool definitions
│   │   └── 📁 utils/          # Server utilities
│   ├── 📄 package.json
│   └── 📄 prisma/
│       ├── 📄 schema.prisma   # Database schema
│       └── 📁 migrations/     # Database migrations
│
├── 📁 shared/                 # Shared types and utilities
│   ├── 📁 types/              # Common TypeScript interfaces
│   └── 📁 constants/          # Shared constants
│
├── 📁 docs/                   # Documentation
│   ├── 📄 API.md              # API documentation
│   ├── 📄 DEPLOYMENT.md       # Deployment guide
│   └── 📄 CONTRIBUTING.md     # Contribution guidelines
│
├── 📄 .env.example            # Environment variables template
├── 📄 docker-compose.yml      # Docker configuration
├── 📄 package.json            # Root package configuration
└── 📄 README.md               # This file
```

## 🔧 Development Workflow

### Running in Development Mode

1. **Start the backend server**
    ```bash
    cd server
    npm run dev
    ```

2. **Start the frontend client** (in a new terminal)
    ```bash
    cd client
    npm run dev
    ```

3. **Start the database** (if using Docker)
    ```bash
    docker-compose up -d postgres redis
    ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (both client and server) |
| `npm run build` | Build production bundles |
| `npm run test` | Run test suites |
| `npm run lint` | Run ESLint and code formatting |
| `npm run type-check` | TypeScript type checking |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and start all services**
    ```bash
    docker-compose up --build
    ```

2. **Access the application**
    ```
    http://localhost:3000
    ```

### Individual Docker Commands

```bash
# Build the application image
docker build -t dobot:latest .

# Run the container
docker run -p 3000:3000 --env-file .env dobot:latest
```

## 📊 Database Schema

### Core Entities

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'created',
  priority INTEGER DEFAULT 5,
  assignee_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  ai_analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication & Security

### JWT Implementation
- Secure token-based authentication
- Refresh token rotation
- Role-based access control (RBAC)

### API Security
- Rate limiting per endpoint
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit tests with Jest and React Testing Library
npm run test:client

# E2E tests with Cypress
npm run test:e2e
```

### Backend Testing
```bash
# API integration tests
npm run test:server

# Database tests
npm run test:db
```

## 📈 Performance Optimization

### Frontend Optimizations
- Code splitting with React.lazy()
- Bundle analysis and optimization
- Image optimization and lazy loading
- Service worker for offline functionality

### Backend Optimizations
- Database query optimization
- Redis caching layer
- API response compression
- Connection pooling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: joanpe25@hotmail.com

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI insights and analytics
- [ ] Custom workflow templates
- [ ] Multi-language support
- [ ] Advanced reporting and dashboards

---

Built with ❤️ by the tekaii team
