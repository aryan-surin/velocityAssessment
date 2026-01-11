# Component Structure Documentation

## 📁 Organized Component Architecture

The codebase has been reorganized into a clean, scalable component structure following React best practices.

## 🏗️ Directory Structure

```
src/
├── components/
│   ├── index.js                    # Central export point for all components
│   │
│   ├── ui/                         # UI-specific components
│   │   ├── index.js                # UI components export
│   │   ├── Toolbar.js              # Pipeline toolbar with draggable nodes
│   │   └── SubmitButton.js         # Pipeline submission button
│   │
│   ├── common/                     # Reusable/shared components
│   │   ├── index.js                # Common components export
│   │   └── DraggableNode.js        # Draggable node element
│   │
│   ├── layout/                     # Layout components
│   │   ├── index.js                # Layout components export
│   │   └── PipelineUI.js           # Main React Flow canvas
│   │
│   ├── nodes/                      # Node type components
│   │   ├── index.js                # Node components export
│   │   ├── BaseNode.js             # Core node abstraction
│   │   ├── nodeConfig.js           # Node configuration helpers
│   │   ├── inputNode.js            # Input node wrapper
│   │   ├── outputNode.js           # Output node wrapper
│   │   ├── llmNode.js              # LLM node wrapper
│   │   ├── textNode.js             # Text node with variables
│   │   ├── filterNode.js           # Filter node wrapper
│   │   ├── conditionalNode.js      # Conditional node wrapper
│   │   ├── transformNode.js        # Transform node wrapper
│   │   ├── validatorNode.js        # Validator node wrapper
│   │   ├── aggregatorNode.js       # Aggregator node wrapper
│   │   └── __tests__/              # Node tests
│   │
│   └── __tests__/                  # Component tests
│
├── hooks/                          # Custom React hooks
├── utils/                          # Utility functions
├── constants/                      # Application constants
├── store.js                        # Zustand state management
├── App.js                          # Root application component
└── index.js                        # Application entry point
```

---

## 📦 Component Categories

### 1. **UI Components** (`components/ui/`)

Components that are specific to the user interface and interaction.

#### **Toolbar.js**
- Displays the node library
- Contains draggable node elements
- Organized in a responsive grid

**Usage:**
```javascript
import { PipelineToolbar } from './components/ui';
// or
import { PipelineToolbar } from './components';

<PipelineToolbar />
```

#### **SubmitButton.js**
- Handles pipeline submission to backend
- Shows loading states
- Displays validation results
- Error handling with user-friendly messages

**Usage:**
```javascript
import { SubmitButton } from './components/ui';
// or
import { SubmitButton } from './components';

<SubmitButton />
```

---

### 2. **Common Components** (`components/common/`)

Reusable components that can be used across the application.

#### **DraggableNode.js**
- Renders individual draggable node elements
- Handles drag-and-drop operations
- Visual feedback for drag states
- Icon and label display

**Usage:**
```javascript
import { DraggableNode } from './components/common';
// or
import { DraggableNode } from './components';

<DraggableNode type="customInput" label="Input" />
```

**Props:**
- `type` (string): Node type identifier
- `label` (string): Display name for the node

---

### 3. **Layout Components** (`components/layout/`)

Components that define the structure and layout of the application.

#### **PipelineUI.js**
- Main React Flow canvas component
- Handles node drop operations
- Manages node connections
- Includes controls, background, and minimap

**Usage:**
```javascript
import { PipelineUI } from './components/layout';
// or
import { PipelineUI } from './components';

<PipelineUI />
```

**Features:**
- Drag-and-drop node creation
- Visual edge connections
- Background grid with snap-to-grid
- Minimap for navigation
- Zoom and pan controls

---

### 4. **Node Components** (`components/nodes/`)

Node type components and the node abstraction system.

#### **BaseNode.js**
- Core node abstraction component
- Configuration-driven rendering
- Supports all node types
- Dynamic field and handle generation

**Usage:**
```javascript
import { BaseNode } from './components/nodes';
// or
import { BaseNode } from './components';

<BaseNode id={id} data={data} config={nodeConfig} />
```

#### **nodeConfig.js**
- Helper functions for node configuration
- `createNodeConfig()` - Creates node configurations
- `createHandle()` - Defines connection handles
- `createField()` - Defines input fields
- `createOutput()` - Defines output specifications

**Usage:**
```javascript
import { 
  createNodeConfig, 
  createHandle, 
  createField, 
  createOutput 
} from './components/nodes';

const config = createNodeConfig({
  title: 'My Node',
  handles: [createHandle('source', 'output')],
  fields: [createField('value', 'Value', 'text')]
});
```

#### **Individual Node Components**
- **InputNode** - Data input node
- **OutputNode** - Data output node
- **LLMNode** - Large Language Model node
- **TextNode** - Text/template node with variable support
- **FilterNode** - Data filtering node
- **ConditionalNode** - Conditional routing node
- **TransformNode** - Data transformation node
- **ValidatorNode** - Data validation node
- **AggregatorNode** - Multi-input aggregation node

**Usage:**
```javascript
import { InputNode, LLMNode, OutputNode } from './components/nodes';
// or
import { InputNode, LLMNode, OutputNode } from './components';

// Used automatically by React Flow
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode
};
```

---

## 🎯 Import Patterns

### **Recommended: Barrel Exports**

Use the central index.js for clean imports:

```javascript
// Best - Import from main components barrel
import { PipelineToolbar, PipelineUI, SubmitButton, DraggableNode } from './components';
```

### **Category-Specific Imports**

Import from category index files:

```javascript
// Import UI components
import { PipelineToolbar, SubmitButton } from './components/ui';

// Import common components
import { DraggableNode } from './components/common';

// Import layout components
import { PipelineUI } from './components/layout';
```

### **Direct Imports**

Import directly from component files:

```javascript
import { PipelineToolbar } from './components/ui/Toolbar';
import { SubmitButton } from './components/ui/SubmitButton';
import { DraggableNode } from './components/common/DraggableNode';
import { PipelineUI } from './components/layout/PipelineUI';
```

---

## 🔄 Migration from Old Structure

### **Before (Old Structure):**
```javascript
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { DraggableNode } from './draggableNode';
```

### **After (New Structure):**
```javascript
// Option 1: Barrel import (recommended)
import { PipelineToolbar, PipelineUI, SubmitButton, DraggableNode } from './components';

// Option 2: Category imports
import { PipelineToolbar, SubmitButton } from './components/ui';
import { DraggableNode } from './components/common';
import { PipelineUI } from './components/layout';
```

---

## ✨ Benefits of This Structure

### **1. Scalability**
- Easy to add new components in appropriate categories
- Clear separation of concerns
- Predictable file locations

### **2. Maintainability**
- Components grouped by purpose
- Easier to locate and update components
- Reduced cognitive load

### **3. Reusability**
- Common components easily identified
- Clear distinction between specific and reusable code
- Encourages component reuse

### **4. Testing**
- Organized test structure mirrors component structure
- Easy to locate and write tests
- Clear test coverage visualization

### **5. Clean Imports**
- Barrel exports enable clean, short imports
- Consistent import patterns
- Easy refactoring

---

## 📝 Component Documentation Standards

Each component file includes:

### **JSDoc Comments**
```javascript
/**
 * ComponentName Component
 * 
 * Description of what the component does.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of prop
 * @returns {JSX.Element} Description of return
 * 
 * @example
 * <ComponentName propName="value" />
 */
```

### **Function Documentation**
```javascript
/**
 * Function description
 * 
 * @param {Type} paramName - Parameter description
 * @returns {ReturnType} Return description
 */
const functionName = (paramName) => {
  // Implementation
};
```

---

## 🧪 Testing Structure

Tests mirror the component structure:

```
components/
├── ui/
│   └── __tests__/
│       ├── Toolbar.test.js
│       └── SubmitButton.test.js
├── common/
│   └── __tests__/
│       └── DraggableNode.test.js
└── layout/
    └── __tests__/
        └── PipelineUI.test.js
```

---

## 🚀 Adding New Components

### **Step 1: Determine Category**
- **UI**: User interface elements specific to the app
- **Common**: Reusable across multiple parts
- **Layout**: Structural/container components

### **Step 2: Create Component File**
```javascript
// components/category/ComponentName.js
import React from 'react';

/**
 * ComponentName Component
 * 
 * Component description
 */
export const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### **Step 3: Add to Category Index**
```javascript
// components/category/index.js
export { ComponentName } from './ComponentName';
```

### **Step 4: Add to Main Index**
```javascript
// components/index.js
export { ComponentName } from './category/ComponentName';
```

### **Step 5: Create Tests**
```javascript
// components/category/__tests__/ComponentName.test.js
import { render } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

---

## 🔧 Configuration Files

### **Index Exports Structure**

Each category has an `index.js` that exports all components in that category:

```javascript
// components/ui/index.js
export { PipelineToolbar } from './Toolbar';
export { SubmitButton } from './SubmitButton';
```

Main components index aggregates all exports:

```javascript
// components/index.js
export { PipelineToolbar, SubmitButton } from './ui';
export { DraggableNode } from './common';
export { PipelineUI } from './layout';
```

---

## 📊 Component Dependencies

### **Dependency Flow**

```
App.js
  │
  ├─→ PipelineToolbar (ui)
  │     └─→ DraggableNode (common)
  │
  ├─→ PipelineUI (layout)
  │     └─→ Node Components (nodes/)
  │
  └─→ SubmitButton (ui)
        └─→ Zustand Store
```

### **State Management**

All components access Zustand store via:
```javascript
import { useStore } from '../store';

const nodes = useStore(state => state.nodes);
```

---

## 🎨 Styling Conventions

### **Tailwind CSS Classes**
- Used throughout all components
- Consistent spacing and sizing
- Responsive design utilities

### **Component-Specific Styles**
- Inline styles for dynamic values
- CSS modules for component-specific styles
- Global styles in `index.css`

---

## 🔍 File Naming Conventions

### **Component Files**
- PascalCase: `ComponentName.js`
- Descriptive names: `SubmitButton.js`, not `Button.js`

### **Index Files**
- Always `index.js`
- Barrel exports only

### **Test Files**
- Match component name: `ComponentName.test.js`
- Located in `__tests__/` directory

---

## 📚 Additional Resources

- [React Component Patterns](https://reactpatterns.com/)
- [Folder Structure Best Practices](https://reactjs.org/docs/faq-structure.html)
- [Barrel Export Pattern](https://basarat.gitbook.io/typescript/main-1/barrel)

---

## 🏆 Best Practices

### ✅ Do:
- Keep components focused and single-purpose
- Use barrel exports for clean imports
- Document all components with JSDoc
- Write tests for all components
- Follow naming conventions

### ❌ Don't:
- Mix business logic in UI components
- Create deep nesting (max 3 levels)
- Import from parent directories excessively
- Skip documentation
- Create overly generic component names

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0
