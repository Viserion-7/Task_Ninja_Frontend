# TaskNinja Frontend

React-based frontend for TaskNinja, an AI-powered task management application.

## Features

- Modern, responsive UI
- Real-time task management
- User authentication and profile management
- Task organization with categories and tags
- Due date management with reminders
- Search and filter functionality
- Email notifications

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# Create .env file
cp .env.example .env

# Edit with your backend URL
REACT_APP_API_URL=http://localhost:8000/api
```

3. Run development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/             # React components
│   ├── Dashboard/         # Dashboard components
│   ├── LoginSignup/       # Authentication components
│   ├── Profile/           # User profile components
│   └── ToDo/             # Task management components
├── context/               # React context providers
├── services/             # API services
└── utils/                # Utility functions
```

## Components

### Dashboard
- `Dashboard.jsx`: Main dashboard view
- `AddTask.jsx`: Task creation form
- `Sidebar.jsx`: Navigation sidebar

### Task Management
- `todo.jsx`: Task list and management
- `SubtaskDialog.jsx`: Subtask creation interface

### User Interface
- `LoginSignup.jsx`: Authentication forms
- `Profile.jsx`: User profile management
- `Navbar.jsx`: Navigation header

## Services

### API Services
- `api.js`: Base API configuration
- `taskService.js`: Task-related API calls
- `userService.js`: User-related API calls

## Authentication

Uses Basic Authentication with the following flow:
1. User logs in/registers
2. Credentials stored securely
3. API calls include auth headers
4. Auto-logout on unauthorized responses

## Available Scripts

```bash
# Development
npm start

# Testing
npm test

# Production build
npm run build

# Code linting
npm run lint
```

## Development Guidelines

1. Component Structure:
   - Use functional components
   - Implement proper prop validation
   - Follow React hooks best practices

2. State Management:
   - Use React Context for global state
   - Local state for component-specific data
   - Proper error handling

3. Styling:
   - CSS modules for component styles
   - Responsive design patterns
   - Consistent color scheme

## Error Handling

- Form validation with error messages
- API error handling and display
- Loading states for async operations
- Fallback UI for errors

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test src/components/Dashboard/__tests__/Dashboard.test.js

# Coverage report
npm test -- --coverage
```

## Building for Production

1. Update environment variables
2. Build the application:
```bash
npm run build
```

3. Deploy build folder to web server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
