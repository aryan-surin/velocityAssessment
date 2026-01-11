# Variable Builder Implementation Guide

## Overview
The Variable Builder feature transforms static text fields into dynamic data intakes by allowing users to reference outputs from other nodes using a two-step autocomplete system triggered by typing `{{`.

## Features Implemented

### 1. **Two-Step Variable Builder** ✅
- **Step 1**: Type `{{` to see available nodes
- **Step 2**: Select a node, then choose from its output fields
- Final insertion format: `{{nodeId.outputField}}`

### 2. **Smart Autocomplete** ✅
- Real-time filtering as you type
- Shows node ID and type for easy identification
- Displays available output fields with descriptions
- Empty state messaging when no nodes exist

### 3. **Dynamic Handle Creation** ✅
- Automatically creates target handles for each referenced variable
- Handles appear on the left side of the node
- Unique handles for each referenced node
- Visual differentiation with blue color

### 4. **Variable Validation** ✅
- Parses all `{{nodeId.field}}` patterns in text fields
- Validates that referenced nodes exist
- Verifies that referenced output fields are defined
- Color-coded feedback system (ready for UI enhancement)

### 5. **Keyboard & Mouse Support** ✅
- Press `Escape` to close dropdown
- Click outside to dismiss
- Smooth cursor repositioning after selection

## Usage Instructions

### For End Users

1. **Create Node References**:
   ```
   Type {{ → Select node → Select output field
   ```

2. **Example Workflow**:
   - Add an Input node (creates `input-1`)
   - Add a Text node
   - In Text field, type `{{`
   - Select `input-1` from dropdown
   - Select `text` from output fields
   - Result: `{{input-1.text}}`

3. **Multiple Variables**:
   ```
   "Process {{input-1.text}} and {{llm-2.response}}"
   ```

### For Developers

#### Adding Outputs to New Node Types

```javascript
import { createNodeConfig, createOutput } from './nodeConfig';

const myNodeConfig = createNodeConfig({
  title: 'My Node',
  // ... other config
  outputs: [
    createOutput('result', 'Result', 'string', 'The main output'),
    createOutput('metadata', 'Metadata', 'object', 'Additional info')
  ]
});
```

#### Output Field Types
- `string`: Text data
- `number`: Numeric data
- `array`: List/array data
- `object`: Complex objects
- `boolean`: True/false values
- `any`: Any data type

## Architecture

### Components Modified

1. **nodeConfig.js**
   - Added `createOutput()` helper
   - Added `normalizeOutput()` function
   - Extended `createNodeConfig()` to accept outputs

2. **BaseNode.js**
   - Added two-step autocomplete state management
   - Implemented variable parsing with regex
   - Created dynamic handle generation logic
   - Added validation system
   - Enhanced input handlers for trigger detection

3. **All Node Files**
   - Added outputs definitions for each node type
   - Imported `createOutput` helper

### Data Flow

```
User Types {{ 
  ↓
Trigger Detection
  ↓
Step 1: Show Available Nodes (filtered by query)
  ↓
User Selects Node
  ↓
Step 2: Show Node's Output Fields
  ↓
User Selects Field
  ↓
Insert {{nodeId.field}} into text
  ↓
Parse Variables → Validate → Create Dynamic Handles
```

## Node Output Definitions

### Input Node
- `text`: Text content from input
- `value`: Raw input value

### Text Node
- `text`: Processed text content
- `output`: Final output text

### LLM Node
- `response`: LLM generated response
- `text`: Response text content

### Output Node
- `result`: Final output result
- `value`: Output value

### Transform Node
- `output`: Transformed output
- `text`: Transformed text

### Filter Node
- `passed`: Data that passed filter
- `filtered`: Data that was filtered out

### Validator Node
- `valid`: Data that passed validation
- `invalid`: Data that failed validation
- `result`: Boolean validation result

### Conditional Node
- `true`: Data when condition is true
- `false`: Data when condition is false

### Aggregator Node
- `output`: Aggregated output
- `result`: Aggregation result

## Validation System

### Variable Pattern
```regex
/\{\{([^}]+)\}\}/g
```
Matches: `{{nodeId.field}}`

### Validation Rules
1. ✅ Node ID must exist in canvas
2. ✅ Output field must be defined in node's outputs
3. ❌ Invalid node ID → Red feedback
4. ❌ Invalid field → Red feedback
5. ✅ Valid reference → Green feedback

### Validation States
```javascript
{
  valid: boolean,
  message: string,
  color: 'green' | 'red' | 'orange'
}
```

## Dynamic Handles

### Handle Creation Logic
1. Parse all text/textarea fields
2. Extract unique node IDs from variables
3. Create one target handle per unique referenced node
4. Position handles vertically on left side
5. Style with blue background for visibility

### Handle Structure
```javascript
{
  type: 'target',
  id: 'dynamic-${nodeId}',
  position: Position.Left,
  style: { top: '${index * 20 + 30}%', background: '#3b82f6' }
}
```

## Best Practices

### For Node Configuration
1. Always define meaningful output fields
2. Use descriptive labels and types
3. Include helpful descriptions
4. Follow naming conventions (camelCase)

### For Variable References
1. Use descriptive node IDs
2. Reference only necessary output fields
3. Validate connections visually
4. Test edge cases (missing nodes, invalid fields)

### For UI/UX
1. Keep dropdown close to cursor
2. Show empty state messaging
3. Provide keyboard shortcuts
4. Maintain smooth transitions

## Testing Checklist

- [ ] Autocomplete triggers on `{{`
- [ ] Node list filters correctly
- [ ] Field list shows for selected node
- [ ] Variables inserted in correct format
- [ ] Dynamic handles created
- [ ] Multiple variables in same field work
- [ ] Validation catches invalid references
- [ ] Empty state shows when no nodes
- [ ] Escape key closes dropdown
- [ ] Click outside closes dropdown
- [ ] Cursor positioned correctly after insertion

## Future Enhancements

### Potential Improvements
1. **Visual Feedback**: Highlight variables in text with color coding
2. **Connection Validation**: Check if nodes are actually connected
3. **Smart Suggestions**: Prioritize recently used nodes
4. **Field Preview**: Show output field values in dropdown
5. **Bulk Operations**: Multi-select for multiple variables
6. **Keyboard Navigation**: Arrow keys to navigate dropdown
7. **Fuzzy Search**: Better filtering algorithm
8. **Variable Tooltips**: Hover to see node details
9. **Auto-connect**: Automatically create edges when variables added
10. **Inline Editing**: Edit variables inline without retyping

## Troubleshooting

### Dropdown not showing
- Check if nodes exist on canvas
- Verify `{{` trigger is detected
- Ensure React Flow `useNodes()` returns data

### Variables not validating
- Check node config has `outputs` array
- Verify output field names match
- Confirm validation logic is running

### Dynamic handles not appearing
- Check variable parsing regex
- Verify handle state updates
- Confirm unique node IDs extracted

### Performance issues
- Limit dropdown results (currently 10)
- Debounce input changes
- Memoize filtered results

## Code Examples

### Example 1: Adding Custom Output
```javascript
const customNodeConfig = createNodeConfig({
  title: 'Custom Node',
  outputs: [
    createOutput('data', 'Data Output', 'string', 'Main data stream'),
    createOutput('error', 'Error Output', 'string', 'Error messages')
  ]
});
```

### Example 2: Using Variables
```
Text field value:
"Send {{input-1.text}} to {{llm-2.response}} for processing"
```

### Example 3: Validation Check
```javascript
const variables = parseVariables(fieldValue);
// Returns: [
//   { nodeId: 'input-1', field: 'text', ... },
//   { nodeId: 'llm-2', field: 'response', ... }
// ]
```

## Support & Feedback

For issues or suggestions, please refer to the project's issue tracker or documentation.

---

**Implementation Status**: ✅ Complete  
**Version**: 1.0.0  
**Last Updated**: January 11, 2026
