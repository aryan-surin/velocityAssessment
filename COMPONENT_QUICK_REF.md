# 📚 Component Structure - Quick Reference

## 📁 New Directory Structure

```
src/components/
├── ui/                      ← UI-specific components
│   ├── Toolbar.js
│   ├── SubmitButton.js
│   └── index.js
├── common/                  ← Reusable components
│   ├── DraggableNode.js
│   └── index.js
├── layout/                  ← Layout components
│   ├── PipelineUI.js
│   └── index.js
├── nodes/                   ← Node type components
│   ├── BaseNode.js
│   ├── nodeConfig.js
│   ├── inputNode.js
│   ├── llmNode.js
│   ├── outputNode.js
│   ├── textNode.js
│   ├── filterNode.js
│   ├── conditionalNode.js
│   ├── transformNode.js
│   ├── validatorNode.js
│   ├── aggregatorNode.js
│   └── index.js
└── index.js                 ← Main export point
```

---

## ⚡ Quick Import Guide

### **Import All (Recommended)**
```javascript
import { 
  PipelineToolbar, 
  SubmitButton, 
  DraggableNode, 
  PipelineUI,
  BaseNode,
  InputNode,
  LLMNode,
  OutputNode,
  TextNode
} from './components';
```

### **Import by Category**
```javascript
// UI components
import { PipelineToolbar, SubmitButton } from './components/ui';

// Common components
import { DraggableNode } from './components/common';

// Layout components
import { PipelineUI } from './components/layout';

// Node components
import { BaseNode, InputNode, LLMNode } from './components/nodes';
```

---

## 🔍 Component Locations

| Component | Old Location | New Location |
|-----------|-------------|--------------|
| PipelineToolbar | `./toolbar` | `./components/ui/Toolbar` |
| SubmitButton | `./submit` | `./components/ui/SubmitButton` |
| DraggableNode | `./draggableNode` | `./components/common/DraggableNode` |
| PipelineUI | `./ui` | `./components/layout/PipelineUI` |

---

## 📖 Documentation Files

1. **[COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)** - Complete guide
2. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual diagrams
3. **[COMPONENT_REFACTOR_SUMMARY.md](./COMPONENT_REFACTOR_SUMMARY.md)** - Implementation summary

---

## 🎯 Component Categories

### **UI Components** (`components/ui/`)
User interface elements specific to this app
- `Toolbar.js` - Node library toolbar
- `SubmitButton.js` - Pipeline submission button

### **Common Components** (`components/common/`)
Reusable across multiple features
- `DraggableNode.js` - Generic draggable node

### **Layout Components** (`components/layout/`)
Page structure and containers
- `PipelineUI.js` - Main canvas container

### **Node Components** (`components/nodes/`)
Node type definitions and abstraction
- `BaseNode.js` - Core node abstraction
- `nodeConfig.js` - Configuration helpers
- `inputNode.js`, `llmNode.js`, `outputNode.js`, etc. - Specific node types

---

## ✨ Quick Tips

✅ **Always use barrel imports** from `./components`  
✅ **Group by purpose**, not by type  
✅ **Keep components focused** on single responsibility  
✅ **Document with JSDoc** comments  
✅ **Export through index.js** for clean imports  

---

**Last Updated:** January 11, 2026
