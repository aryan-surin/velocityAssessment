# Component Architecture Diagram

## 📐 Visual Component Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                          App.js                                 │   │
│  │                   (Root Application Component)                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                    ┌─────────────┼─────────────┐                       │
│                    │             │             │                       │
└────────────────────┼─────────────┼─────────────┼───────────────────────┘
                     │             │             │
                     ▼             ▼             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LAYER                                   │
│                                                                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐    │
│  │  UI Components  │  │ Layout Components │  │ Common Components  │    │
│  │  ============   │  │  ===============  │  │  ===============   │    │
│  │                 │  │                   │  │                    │    │
│  │  - Toolbar      │  │  - PipelineUI     │  │  - DraggableNode   │    │
│  │  - SubmitButton │  │                   │  │                    │    │
│  │                 │  │                   │  │                    │    │
│  └────────┬────────┘  └──────────┬────────┘  └─────────┬──────────┘    │
│           │                      │                      │               │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            └──────────┬───────────┴──────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT                                  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Zustand Store (store.js)                    │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  • nodes: []        - Array of pipeline nodes                    │   │
│  │  • edges: []        - Array of pipeline edges                    │   │
│  │  • addNode()        - Add new node to canvas                     │   │
│  │  • updateNode()     - Update node properties                     │   │
│  │  • onConnect()      - Handle edge connections                    │   │
│  │  • getNodeID()      - Generate unique node IDs                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          NODE SYSTEM                                      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Node Configuration System                      │  │
│  │  ──────────────────────────────────────────────────────────────  │  │
│  │                                                                   │  │
│  │  ┌──────────────────┐      ┌─────────────────────────────────┐ │  │
│  │  │  nodeConfig.js   │─────▶│       BaseNode.js               │ │  │
│  │  │  (Definitions)   │      │  (Core Abstraction)             │ │  │
│  │  └──────────────────┘      └──────────────┬──────────────────┘ │  │
│  │                                            │                     │  │
│  │                         ┌──────────────────┼─────────────────┐  │  │
│  │                         │                  │                 │  │  │
│  │                         ▼                  ▼                 ▼  │  │
│  │              ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │              │ InputNode    │  │   LLMNode    │  │ OutputNode   │ │
│  │              │ FilterNode   │  │   TextNode   │  │ TransformNode│ │
│  │              │ Conditional  │  │  Validator   │  │  Aggregator  │ │
│  │              └──────────────┘  └──────────────┘  └──────────────┘ │
│  │                                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        BACKEND INTEGRATION                                │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                  SubmitButton Component                         │    │
│  │  ────────────────────────────────────────────────────────────  │    │
│  │                                                                 │    │
│  │  User Clicks Submit                                            │    │
│  │         │                                                       │    │
│  │         ▼                                                       │    │
│  │  Collect nodes & edges from store                             │    │
│  │         │                                                       │    │
│  │         ▼                                                       │    │
│  │  POST to http://localhost:8000/pipelines/parse                │    │
│  │         │                                                       │    │
│  │         ▼                                                       │    │
│  │  ┌──────────────────────────────────────────────────┐         │    │
│  │  │   Backend FastAPI (Python)                       │         │    │
│  │  │   ───────────────────────────                    │         │    │
│  │  │   • Parse nodes & edges                          │         │    │
│  │  │   • Count num_nodes, num_edges                   │         │    │
│  │  │   • Validate DAG (Kahn's Algorithm)              │         │    │
│  │  │   • Return: {num_nodes, num_edges, is_dag}       │         │    │
│  │  └──────────────────────────────────────────────────┘         │    │
│  │         │                                                       │    │
│  │         ▼                                                       │    │
│  │  Display alert with results                                    │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                              │
└───────────────────────────────────────────────────────────────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          ┌────────────┐   ┌────────────┐  ┌────────────┐
          │   Drag     │   │   Edit     │  │   Submit   │
          │   Node     │   │   Node     │  │  Pipeline  │
          └─────┬──────┘   └─────┬──────┘  └─────┬──────┘
                │                │               │
                ▼                ▼               ▼
          ┌─────────────────────────────────────────────┐
          │         Zustand Store Actions               │
          │  ─────────────────────────────────────────  │
          │  • addNode()                                │
          │  • updateNodeField()                        │
          │  • onConnect()                              │
          │  • onNodesChange()                          │
          │  • onEdgesChange()                          │
          └──────────────────┬──────────────────────────┘
                             │
                             ▼
          ┌─────────────────────────────────────────────┐
          │         Zustand Store State                 │
          │  ─────────────────────────────────────────  │
          │  {                                          │
          │    nodes: [...],                            │
          │    edges: [...],                            │
          │    nodeIDs: {...}                           │
          │  }                                          │
          └──────────────────┬──────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
          ┌──────────┐ ┌──────────┐ ┌──────────┐
          │ Toolbar  │ │ Canvas   │ │  Submit  │
          │ Re-render│ │ Re-render│ │ Re-render│
          └──────────┘ └──────────┘ └──────────┘
                             │
                             ▼
          ┌─────────────────────────────────────────────┐
          │       React Flow Visualization              │
          │  ─────────────────────────────────────────  │
          │  • Nodes rendered at positions              │
          │  • Edges drawn between nodes                │
          │  • Handles visible for connections          │
          └─────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App
├── Header
│   ├── Logo (BiNetworkChart)
│   └── Title
│
├── PipelineToolbar (UI Component)
│   └── DraggableNode (Common) × 9
│       ├── Input
│       ├── LLM
│       ├── Output
│       ├── Text
│       ├── Filter
│       ├── Conditional
│       ├── Transform
│       ├── Validator
│       └── Aggregator
│
├── PipelineUI (Layout Component)
│   ├── ReactFlow
│   │   ├── Background
│   │   ├── Controls
│   │   ├── MiniMap
│   │   └── Nodes (dynamically rendered)
│   │       ├── InputNode (wraps BaseNode)
│   │       ├── LLMNode (wraps BaseNode)
│   │       ├── OutputNode (wraps BaseNode)
│   │       ├── TextNode (custom logic)
│   │       ├── FilterNode (wraps BaseNode)
│   │       ├── ConditionalNode (wraps BaseNode)
│   │       ├── TransformNode (wraps BaseNode)
│   │       ├── ValidatorNode (wraps BaseNode)
│   │       └── AggregatorNode (wraps BaseNode)
│   │
│   └── Edges (dynamically rendered)
│
└── SubmitButton (UI Component)
    └── API Integration Logic
```

---

## 🔌 Node Abstraction Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NODE CONFIGURATION                              │
│                                                                      │
│  nodeConfig.js                                                      │
│  ═════════════════════════════════════════════════════════════════ │
│                                                                      │
│  const NODE_CONFIGS = {                                             │
│    input: {                                                         │
│      label: 'Input',                                                │
│      icon: BiImport,                                                │
│      color: 'emerald',                                              │
│      fields: [...],      ◄─── Field definitions                    │
│      handles: {...}      ◄─── Handle configuration                 │
│    },                                                               │
│    // ... more node types                                           │
│  }                                                                   │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BASE NODE COMPONENT                            │
│                                                                      │
│  BaseNode.js                                                        │
│  ═════════════════════════════════════════════════════════════════ │
│                                                                      │
│  export const BaseNode = ({ id, data, nodeType }) => {             │
│    const config = NODE_CONFIGS[nodeType];  ◄─── Get configuration  │
│                                                                      │
│    return (                                                         │
│      <div>                                                          │
│        {/* Render header */}                                        │
│        {config.fields.map(field => renderField(field))}            │
│        {config.handles.inputs.map(handle => <Handle />)}           │
│        {config.handles.outputs.map(handle => <Handle />)}          │
│      </div>                                                         │
│    );                                                               │
│  };                                                                 │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SPECIFIC NODE WRAPPERS                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  inputNode.js                                               │   │
│  │  export const InputNode = (props) =>                        │   │
│  │    <BaseNode {...props} nodeType="input" />;               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  llmNode.js                                                 │   │
│  │  export const LLMNode = (props) =>                          │   │
│  │    <BaseNode {...props} nodeType="llm" />;                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ... (8 more node types)                                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Backend Integration Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  SubmitButton Component                                     │    │
│  │                                                             │    │
│  │  1. User clicks "Submit Pipeline"                          │    │
│  │  2. Validation: Check if nodes exist                       │    │
│  │  3. Prepare payload: { nodes: [...], edges: [...] }        │    │
│  │  4. Set loading state                                       │    │
│  │  5. Send HTTP POST request                                  │    │
│  └─────────────────────┬───────────────────────────────────────┘    │
│                        │                                             │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         │  POST /pipelines/parse
                         │  Content-Type: application/json
                         │  {
                         │    "nodes": [...],
                         │    "edges": [...]
                         │  }
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       BACKEND (FastAPI)                               │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  /pipelines/parse Endpoint                                  │    │
│  │                                                             │    │
│  │  1. Receive and validate request (Pydantic)                │    │
│  │  2. Count nodes: num_nodes = len(pipeline.nodes)           │    │
│  │  3. Count edges: num_edges = len(pipeline.edges)           │    │
│  │  4. Check DAG: is_dag = check_is_dag(nodes, edges)         │    │
│  │                                                             │    │
│  │     ┌─────────────────────────────────────────┐           │    │
│  │     │  Kahn's Algorithm (DAG Detection)       │           │    │
│  │     │  ────────────────────────────────────   │           │    │
│  │     │  • Build adjacency list                 │           │    │
│  │     │  • Calculate in-degrees                 │           │    │
│  │     │  • Topological sort                     │           │    │
│  │     │  • Return true if all nodes processed   │           │    │
│  │     └─────────────────────────────────────────┘           │    │
│  │                                                             │    │
│  │  5. Return JSON response                                   │    │
│  └─────────────────────┬───────────────────────────────────────┘    │
│                        │                                             │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         │  Response:
                         │  {
                         │    "num_nodes": 5,
                         │    "num_edges": 4,
                         │    "is_dag": true
                         │  }
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  SubmitButton Component                                     │    │
│  │                                                             │    │
│  │  1. Receive response                                        │    │
│  │  2. Parse JSON data                                         │    │
│  │  3. Clear loading state                                     │    │
│  │  4. Format user-friendly message:                           │    │
│  │     "🎉 Pipeline Analysis Complete!                        │    │
│  │      • Number of Nodes: 5                                   │    │
│  │      • Number of Edges: 4                                   │    │
│  │      • Is Valid DAG: ✅ Yes"                                │    │
│  │  5. Display alert to user                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Import/Export Flow

```
Components Entry Point
      │
      ▼
components/index.js
      │
      ├─→ export from ui/index.js
      │         │
      │         ├─→ Toolbar.js
      │         └─→ SubmitButton.js
      │
      ├─→ export from common/index.js
      │         │
      │         └─→ DraggableNode.js
      │
      └─→ export from layout/index.js
                │
                └─→ PipelineUI.js
                      │
                      └─→ uses nodes/ components
```

---

**Last Updated:** January 11, 2026  
**Diagram Version:** 1.0.0
