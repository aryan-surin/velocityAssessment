# VectorShift Pipeline Builder

Visual node-based workflow builder with drag-and-drop interface.

## Setup & Installation

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- **Node Abstraction System** - Reusable BaseNode component for all node types
- **Dynamic Variables** - Type `{{ variable }}` in text nodes to create input handles
- **9 Node Types** - Input, Output, Text, LLM, Filter, Conditional, Transform, Validator, Aggregator
- **Visual Pipeline** - Connect nodes with drag-and-drop
- **Backend Integration** - DAG validation endpoint

## Project Structure

```
src/
├── components/
│   ├── nodes/          # Node implementations (BaseNode + 9 types)
│   ├── ui/             # Toolbar, SubmitButton
│   ├── common/         # DraggableNode
│   └── layout/         # PipelineUI (main canvas)
├── App.js
└── store.js            # Zustand state management
```

## Tech Stack

- React 18 + React Flow
- Tailwind CSS
- Zustand for state
- FastAPI backend (Python)

## Building for Production

```bash
npm run build
```

---

Built with Create React App
