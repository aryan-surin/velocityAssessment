# Node Abstraction - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What is This?

A **node abstraction system** that eliminates code duplication and makes creating new nodes incredibly fast and easy. Instead of writing 50+ lines of boilerplate code, you write 10-15 lines of simple configuration.

### Why Use It?

- ✅ **70% less code** for new nodes
- ✅ **5 minutes** to create a new node (vs 20+ minutes before)
- ✅ **Zero boilerplate** - just configuration
- ✅ **Consistent behavior** across all nodes
- ✅ **Easy maintenance** - fix bugs once, applies everywhere

---

## 📦 What's Included

### Core Files (Don't modify unless extending)
- `BaseNode.js` - The magic component that powers everything
- `nodeConfig.js` - Helper functions for configuration

### Example Nodes (Use as templates)
- **Existing Nodes** (refactored): Input, Output, LLM, Text
- **New Nodes** (demonstrations): Filter, Conditional, Transform, Validator, Aggregator

### Documentation
- `NODE_ABSTRACTION_README.md` - Complete guide (400+ lines)
- `ARCHITECTURE.md` - System architecture and diagrams
- `IMPLEMENTATION_SUMMARY.md` - What was built and why
- `QUICK_REFERENCE.txt` - Copy-paste templates
- `__tests__/NodeAbstraction.test.js` - Test examples

---

## 🎯 Create Your First Node (3 Steps)

### Step 1: Create the file

Create `src/nodes/myNode.js`:

```javascript
import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

const myNodeConfig = createNodeConfig({
  title: 'My Node',                          // Node title
  description: 'What this node does',        // Optional subtitle
  
  handles: [
    createHandle('target', 'input'),         // Input connection
    createHandle('source', 'output')         // Output connection
  ],
  
  fields: [
    createField('value', 'Value', 'text', {  // A text input field
      defaultValue: 'Hello',
      placeholder: 'Enter value'
    })
  ],
  
  style: {
    backgroundColor: '#e3f2fd'               // Custom color
  }
});

export const MyNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={myNodeConfig} />;
};
```

### Step 2: Register in ui.js

Add two lines in `src/ui.js`:

```javascript
// Import your node
import { MyNode } from './nodes/myNode';

// Add to nodeTypes object
const nodeTypes = {
  // ... existing nodes
  myNode: MyNode,  // <-- Add this line
};
```

### Step 3: Add to toolbar

Add one line in `src/toolbar.js`:

```javascript
<DraggableNode type='myNode' label='My Node' />
```

**Done!** 🎉 Your node is now available in the toolbar.

---

## 🔧 Field Types Cheat Sheet

### Text Input
```javascript
createField('name', 'Name', 'text', {
  defaultValue: 'Default text',
  placeholder: 'Enter name'
})
```

### Textarea (Multi-line)
```javascript
createField('description', 'Description', 'textarea', {
  defaultValue: 'Multi-line\ntext here',
  placeholder: 'Enter description',
  rows: 4
})
```

### Select Dropdown
```javascript
createField('type', 'Type', 'select', {
  defaultValue: 'option1',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]
})
```

### Number Input
```javascript
createField('count', 'Count', 'number', {
  defaultValue: 10,
  min: 0,
  max: 100,
  step: 5
})
```

### Checkbox
```javascript
createField('enabled', 'Enabled', 'checkbox', {
  defaultValue: true
})
```

---

## 🔌 Handle Patterns

### Single Input → Single Output (Most Common)
```javascript
handles: [
  createHandle('target', 'input'),
  createHandle('source', 'output')
]
```

### Multiple Inputs → Single Output
```javascript
handles: [
  createHandle('target', 'input1', { style: { top: '30%' } }),
  createHandle('target', 'input2', { style: { top: '50%' } }),
  createHandle('target', 'input3', { style: { top: '70%' } }),
  createHandle('source', 'output')
]
```

### Single Input → Multiple Outputs
```javascript
handles: [
  createHandle('target', 'input'),
  createHandle('source', 'output1', { style: { top: '40%' } }),
  createHandle('source', 'output2', { style: { top: '70%' } })
]
```

### Data Source (No Inputs)
```javascript
handles: [
  createHandle('source', 'output')
]
```

### Data Sink (No Outputs)
```javascript
handles: [
  createHandle('target', 'input')
]
```

---

## 🎨 Styling Quick Reference

### Color Schemes (Choose by category)
```javascript
style: { backgroundColor: '#e3f2fd' }  // Blue - Input nodes
style: { backgroundColor: '#fff3e0' }  // Orange - Output nodes
style: { backgroundColor: '#f3e5f5' }  // Purple - AI/LLM nodes
style: { backgroundColor: '#e8f5e9' }  // Green - Text/Data nodes
style: { backgroundColor: '#fce4ec' }  // Pink - Filter/Transform
style: { backgroundColor: '#fff9c4' }  // Yellow - Logic/Conditional
style: { backgroundColor: '#e8eaf6' }  // Indigo - Validation
style: { backgroundColor: '#f1f8e9' }  // Light Green - Aggregation
```

### Custom Dimensions
```javascript
style: {
  width: 250,
  minHeight: 120
}
```

### Custom Borders
```javascript
style: {
  border: '2px solid #1976d2',
  borderRadius: '8px'
}
```

---

## 📚 Real Examples

### Example 1: Simple Filter Node
```javascript
const filterConfig = createNodeConfig({
  title: 'Filter',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'output')
  ],
  fields: [
    createField('keyword', 'Keyword', 'text', {
      placeholder: 'Enter filter keyword'
    })
  ],
  style: { backgroundColor: '#fce4ec' }
});
```

### Example 2: Conditional Logic Node
```javascript
const conditionalConfig = createNodeConfig({
  title: 'If/Else',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'true', { style: { top: '40%' } }),
    createHandle('source', 'false', { style: { top: '70%' } })
  ],
  fields: [
    createField('condition', 'Condition', 'select', {
      options: [
        { value: 'isEmpty', label: 'Is Empty' },
        { value: 'contains', label: 'Contains' }
      ]
    })
  ],
  style: { backgroundColor: '#fff9c4' }
});
```

### Example 3: Multi-Input Aggregator
```javascript
const aggregatorConfig = createNodeConfig({
  title: 'Combine',
  handles: [
    createHandle('target', 'input1', { style: { top: '25%' } }),
    createHandle('target', 'input2', { style: { top: '50%' } }),
    createHandle('target', 'input3', { style: { top: '75%' } }),
    createHandle('source', 'output')
  ],
  fields: [
    createField('separator', 'Separator', 'text', {
      defaultValue: ', '
    })
  ],
  style: { backgroundColor: '#f1f8e9' }
});
```

---

## ❓ Common Questions

### Q: How do I add a new field type?
**A:** Extend the `renderField` function in `BaseNode.js`. Example:
```javascript
case 'color':
  return <input type="color" value={value} onChange={...} />;
```

### Q: Can I have dynamic default values?
**A:** Yes! Handle in your node component:
```javascript
export const MyNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    name: data?.name || `node-${id}`  // Dynamic default
  };
  return <BaseNode id={id} data={enrichedData} config={myConfig} />;
};
```

### Q: How do I make a field optional?
**A:** Fields are optional by default. Just don't set `defaultValue`:
```javascript
createField('optionalField', 'Optional', 'text')  // Starts empty
```

### Q: Can I hide/show fields dynamically?
**A:** Not built-in yet, but you can implement by:
1. Adding conditional logic in `renderField`
2. Or creating multiple node variants

### Q: How do I validate field values?
**A:** Currently manual in node logic. Future: add `validate` property to fields.

---

## 🐛 Troubleshooting

### Node doesn't appear in toolbar
✓ Check you added it to `toolbar.js`  
✓ Verify the type matches in both `ui.js` and `toolbar.js`

### Fields not showing
✓ Ensure `fields` array is defined in config  
✓ Check field configurations are valid  
✓ Verify no typos in field type

### State not persisting
✓ Field `name` must match between config and data  
✓ Ensure you're passing `data` prop correctly

### Handles not appearing
✓ Verify handle `type` is 'source' or 'target'  
✓ Check you have `handles` array in config  
✓ Ensure handle IDs are unique within node

### Styling not working
✓ Style must be an object, not string  
✓ CSS property names are camelCase (backgroundColor, not background-color)  
✓ Ensure you're not overriding with inline styles elsewhere

---

## 🎓 Learning Path

1. **Read this Quick Start** (5 min) ✅ You are here!
2. **Look at example nodes** in `src/nodes/` (10 min)
3. **Create a simple node** following Step-by-Step (10 min)
4. **Read `NODE_ABSTRACTION_README.md`** for deep dive (20 min)
5. **Check `ARCHITECTURE.md`** for system design (15 min)
6. **Use `QUICK_REFERENCE.txt`** as ongoing reference

**Total learning time: ~60 minutes to full proficiency**

---

## 📖 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **This File** | Quick start | Start here! |
| `NODE_ABSTRACTION_README.md` | Complete guide | After first node |
| `ARCHITECTURE.md` | System design | Understanding internals |
| `IMPLEMENTATION_SUMMARY.md` | What was built | Project overview |
| `QUICK_REFERENCE.txt` | Copy-paste templates | During development |
| `__tests__/NodeAbstraction.test.js` | Test examples | Writing tests |

---

## 🚦 Quick Checklist for New Nodes

```
□ Create node file in src/nodes/
□ Import BaseNode and helpers
□ Define config with createNodeConfig()
□ Add handles (inputs/outputs)
□ Add fields (form controls)
□ Set custom style
□ Export component using BaseNode
□ Import in ui.js
□ Add to nodeTypes in ui.js
□ Add to toolbar.js
□ Test in browser
□ Verify all fields work
□ Check handle connections
□ Confirm styling
```

---

## 💡 Tips & Best Practices

1. **Use descriptive field names**: `maxLength` not `val`
2. **Provide sensible defaults**: Users shouldn't have to configure everything
3. **Color code by category**: Makes nodes easier to identify
4. **Keep descriptions short**: One line max
5. **Group related handles**: Use style positioning
6. **Test all field types**: Before using in production
7. **Check handle connections**: Verify they work as expected
8. **Document your nodes**: Add comments explaining purpose

---

## 🎉 You're Ready!

You now know everything you need to create powerful, flexible nodes in minutes instead of hours.

**Next Steps:**
1. Create your first node
2. Test it in the browser
3. Show it to your team
4. Celebrate! 🎊

**Questions?** Check the full documentation or look at existing node examples.

**Happy coding!** 🚀
