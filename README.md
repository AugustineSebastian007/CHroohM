# Organic Mind - Task Management App

Organic Mind is a minimal, beautifully designed task management application built with React. It provides a clean and distraction-free interface for managing tasks, organized by categories with visual cues.

## Features

- **Modern UI Design**: Clean, minimal interface based on the Organic Mind design system
- **Task Management**: Create, read, update and delete tasks
- **Task Organization**: Organize tasks by lists (Personal, Work, etc.)
- **Multiple Views**: Today, Upcoming, Calendar, and Sticky Wall views
- **Persistent Storage**: Tasks are stored in localStorage and synced with a backend API
- **Responsive Design**: Works seamlessly across devices of all sizes

## Tech Stack

- **React**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Zustand**: Lightweight state management
- **React Router**: Routing and navigation
- **date-fns**: Date manipulation library
- **Vite**: Build tool and development environment

## API Integration

The app integrates with the [DummyJSON API](https://dummyjson.com/docs/todos) for demonstration purposes, with the following endpoints:

- `GET /todos` - Fetch all to-dos
- `GET /todos/:id` - Fetch a single to-do
- `POST /todos/add` - Add a new to-do
- `PUT /todos/:id` - Update a to-do
- `DELETE /todos/:id` - Delete a to-do

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/augustinesebastian007/organic-mind.git
cd organic-mind
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── assets/          # Static assets like images
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Sidebar, Layout)
│   └── ui/          # UI components (TaskItem, TaskList, etc.)
├── hooks/           # Custom React hooks
├── pages/           # Page components 
├── store/           # State management (Zustand store)
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## Deployment

You can deploy this app using Vercel, Netlify, or any other hosting service that supports React applications.

### Building for Production

```
npm run build
```

This will create a `dist` folder with optimized production build.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by Organic Mind design system
- Task management concepts from popular task apps like Todoist and Microsoft To Do

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build
```

## Deployment on Vercel

This project is configured for deployment on Vercel:

1. The `tailwind.config.cjs` file uses CommonJS syntax for compatibility
2. The `postcss.config.cjs` file explicitly loads the Tailwind configuration
3. The `vercel.json` file contains the necessary build configuration
4. CSS is correctly processed with `cssCodeSplit: false` in the Vite config

To deploy a new version, simply push to the main branch or use the Vercel CLI.
