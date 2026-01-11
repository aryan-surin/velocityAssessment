# Nodes Folder Structure

## Overview
This folder contains all node components used in the pipeline builder. Each node type is organized in its own folder for better maintainability and scalability.

## Folder Structure

```
nodes/
├── BaseNode.js              ← Parent component (shared by all nodes)
├── nodeConfig.js            ← Configuration helpers (shared utilities)
├── index.js                 ← Barrel export (central export point)
│
├── InputNode/               ← Input node implementation
│   └── index.js
├── OutputNode/              ← Output node implementation
│   └── index.js
├── TextNode/                ← Text node implementation
│   └── index.js
├── LlmNode/                 ← LLM node implementation
│   └── index.js
├── FilterNode/              ← Filter node implementation
│   └── index.js
├── ConditionalNode/         ← Conditional node implementation
│   └── index.js
├── TransformNode/           ← Transform node implementation
│   └── index.js
├── ValidatorNode/           ← Validator node implementation
│   └── index.js
└── AggregatorNode/          ← Aggregator node implementation
    └── index.js
```

## Core Components (Shared/Parent)

### BaseNode.js
- **Purpose**: Parent component providing reusable node abstraction
- **Used by**: All node types
- **Key Features**:
  - Configurable handles (input/output connections)
  - Dynamic field rendering (text, select, textarea, number, checkbox)
  - Automatic state management
  - Variable builder with `{{` trigger
  - Dynamic handle creation
  - Auto-expanding fields

### nodeConfig.js
- **Purpose**: Configuration helpers and utilities
- **Exports**:
  - `createNodeConfig()` - Create node configuration object
  - `createHandle()` - Define connection handles
  - `createField()` - Define input fields
  - `createOutput()` - Define output specifications

## Node Types

### InputNode/
**Purpose**: Data input node for the pipeline  
**Handles**: 1 source (output)  
**Fields**: Name (text), Type (select: Text/File)  
**Use Cases**: Accept user input, file uploads, external data sources

### OutputNode/
**Purpose**: Data output node for the pipeline  
**Handles**: 1 target (input)  
**Fields**: Name (text), Type (select: Text/Image)  
**Use Cases**: Display results, export data, save to file/database

### TextNode/
**Purpose**: Static text or template node  
**Handles**: 1 source (output)  
**Fields**: Text (auto-expanding textarea)  
**Use Cases**: Static content, templates with variables, documentation

### LlmNode/
**Purpose**: Large Language Model integration  
**Handles**: 2 targets (system, prompt), 1 source (response)  
**Fields**: None (configured via inputs)  
**Use Cases**: AI text generation, NLP, conversational interfaces

### FilterNode/
**Purpose**: Filter data by conditions  
**Handles**: 1 target (input), 2 sources (passed, filtered)  
**Fields**: Filter Type (select), Filter Value (text), Case Sensitive (checkbox)  
**Use Cases**: Filter by keyword, conditional logic, remove unwanted values

### ConditionalNode/
**Purpose**: Route data based on conditions  
**Handles**: 1 target (input), 2 sources (true, false)  
**Fields**: Condition (select), Compare Value (text)  
**Use Cases**: If/else logic, decision trees, workflow branching

### TransformNode/
**Purpose**: Transform input data  
**Handles**: 1 target (input), 1 source (output)  
**Fields**: Operation (select), Template/Pattern (textarea)  
**Use Cases**: String manipulation, data formatting, value transformation

### ValidatorNode/
**Purpose**: Validate data against rules  
**Handles**: 1 target (input), 2 sources (valid, invalid)  
**Fields**: Validation Type (select), Min Value (number), Max Value (number)  
**Use Cases**: Data validation, quality checks, schema validation

### AggregatorNode/
**Purpose**: Combine multiple inputs  
**Handles**: 3 targets (input1, input2, input3), 1 source (output)  
**Fields**: Aggregation Type (select), Separator (text), Ignore Empty (checkbox)  
**Use Cases**: Combine data sources, merge results, join operations

## Import Patterns

### Importing Individual Nodes
```javascript
import { FilterNode } from './nodes/FilterNode';
import { InputNode } from './nodes/InputNode';
```

### Importing from Barrel Export
```javascript
import { 
  InputNode, 
  OutputNode, 
  TextNode, 
  BaseNode,
  createNodeConfig 
} from './nodes';
```

### Importing Core Components
```javascript
import { BaseNode } from './nodes/BaseNode';
import { createNodeConfig, createHandle } from './nodes/nodeConfig';
```

## Adding New Node Types

To add a new node type:

1. **Create folder**: `nodes/MyNewNode/`
2. **Create index.js** with this structure:
   ```javascript
   import { BaseNode } from '../BaseNode';
   import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

   const myNewNodeConfig = createNodeConfig({
     title: 'My New Node',
     description: 'Description here',
     handles: [
       createHandle('target', 'input'),
       createHandle('source', 'output')
     ],
     fields: [
       createField('myField', 'My Field', 'text', {
         defaultValue: '',
         placeholder: 'Enter value'
       })
     ],
     outputs: [
       createOutput('output', 'Output', 'any', 'Output description')
     ],
     style: { backgroundColor: '#ffffff' }
   });

   export const MyNewNode = ({ id, data }) => {
     const enrichedData = {
       ...data,
       config: myNewNodeConfig
     };
     return <BaseNode id={id} data={enrichedData} config={myNewNodeConfig} />;
   };

   export default MyNewNode;
   ```

3. **Add export** to `nodes/index.js`:
   ```javascript
   export { MyNewNode } from './MyNewNode';
   ```

4. **Register** in `PipelineUI.js`:
   ```javascript
   import { MyNewNode } from '../nodes/MyNewNode';
   
   const nodeTypes = {
     myNewNode: MyNewNode,
     // ... other nodes
   };
   ```

## Benefits of This Structure

✅ **Separation of Concerns**: Each node type has its own dedicated folder  
✅ **Easy Navigation**: Developers can quickly locate specific node implementations  
✅ **Scalability**: Easy to add new node types without cluttering the parent folder  
✅ **Maintainability**: Changes to one node don't affect others  
✅ **Clear Hierarchy**: BaseNode and nodeConfig are clearly parent/shared components  
✅ **Consistent Pattern**: All nodes follow the same folder/file structure  
✅ **Import Flexibility**: Support both individual and barrel exports  

## File Naming Conventions

- **Folders**: PascalCase (e.g., `FilterNode/`, `InputNode/`)
- **Parent Files**: camelCase (e.g., `nodeConfig.js`)
- **Core Files**: PascalCase (e.g., `BaseNode.js`)
- **Index Files**: Always `index.js` (lowercase)
- **Exports**: Named exports matching the folder name (e.g., `export { FilterNode }`)

## Testing

Tests are located in `__tests__/` folder at the same level as node folders.

---

**Last Updated**: January 2025  
**Maintained by**: Development Team
