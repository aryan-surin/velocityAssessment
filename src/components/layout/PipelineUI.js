// components/layout/PipelineUI.js

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../../store';
import { shallow } from 'zustand/shallow';
import { 
  InputNode, 
  LLMNode, 
  OutputNode, 
  TextNode, 
  FilterNode, 
  ConditionalNode, 
  TransformNode, 
  ValidatorNode, 
  AggregatorNode,
  createNodeConfig, 
  createHandle, 
  createField, 
  createOutput 
} from '../nodes';

import 'reactflow/dist/style.css';

/**
 * Node configurations for initial data
 * Contains default configuration for all node types
 */
const nodeConfigs = {
  customInput: createNodeConfig({
    title: 'Input',
    description: 'Data input node',
    handles: [createHandle('source', 'value')],
    fields: [
      createField('inputName', 'Name', 'text', { placeholder: 'Enter input name' }),
      createField('inputType', 'Type', 'select', {
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' }
        ]
      })
    ],
    outputs: [
      createOutput('text', 'Text Output', 'string', 'Text content from input'),
      createOutput('value', 'Value', 'any', 'Raw input value')
    ],
    style: { backgroundColor: '#e3f2fd' }
  }),
  llm: createNodeConfig({
    title: 'LLM',
    description: 'Large Language Model',
    handles: [
      createHandle('target', 'system', { style: { top: `${100/3}%` } }),
      createHandle('target', 'prompt', { style: { top: `${200/3}%` } }),
      createHandle('source', 'response')
    ],
    fields: [],
    outputs: [
      createOutput('response', 'Response', 'string', 'LLM generated response'),
      createOutput('text', 'Text Output', 'string', 'Response text content')
    ],
    style: { backgroundColor: '#f3e5f5', minHeight: 100 }
  }),
  customOutput: createNodeConfig({
    title: 'Output',
    description: 'Data output node',
    handles: [createHandle('target', 'value')],
    fields: [
      createField('outputName', 'Name', 'text', { placeholder: 'Enter output name' }),
      createField('outputType', 'Type', 'select', {
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' }
        ]
      })
    ],
    outputs: [
      createOutput('result', 'Result', 'any', 'Final output result'),
      createOutput('value', 'Value', 'any', 'Output value')
    ],
    style: { backgroundColor: '#fff3e0' }
  }),
  text: createNodeConfig({
    title: 'Text',
    description: 'Static text or template',
    handles: [createHandle('source', 'output')],
    fields: [
      createField('text', 'Text', 'text', {
        defaultValue: '',
        placeholder: 'Enter text or template',
        autoExpand: true
      })
    ],
    outputs: [
      createOutput('text', 'Text Output', 'string', 'Processed text content'),
      createOutput('output', 'Output', 'string', 'Final output text')
    ],
    style: { backgroundColor: '#e8f5e9' }
  }),
  filter: createNodeConfig({
    title: 'Filter',
    description: 'Filter data by condition',
    handles: [
      createHandle('target', 'input'),
      createHandle('source', 'passed'),
      createHandle('source', 'filtered', { style: { top: '75%' } })
    ],
    fields: [],
    outputs: [
      createOutput('passed', 'Passed Filter', 'any', 'Data that passed filter'),
      createOutput('filtered', 'Filtered Out', 'any', 'Data that was filtered out')
    ],
    style: { backgroundColor: '#fce4ec' }
  }),
  conditional: createNodeConfig({
    title: 'Conditional',
    description: 'Route data based on condition',
    handles: [
      createHandle('target', 'input'),
      createHandle('source', 'true', { style: { top: '40%' } }),
      createHandle('source', 'false', { style: { top: '70%' } })
    ],
    fields: [],
    outputs: [
      createOutput('true', 'True Branch', 'any', 'Data when condition is true'),
      createOutput('false', 'False Branch', 'any', 'Data when condition is false')
    ],
    style: { backgroundColor: '#fff9c4' }
  }),
  transform: createNodeConfig({
    title: 'Transform',
    description: 'Transform data',
    handles: [
      createHandle('target', 'input'),
      createHandle('source', 'output')
    ],
    fields: [],
    outputs: [
      createOutput('output', 'Transformed Output', 'string', 'Transformed data result'),
      createOutput('text', 'Text Result', 'string', 'Transformed text')
    ],
    style: { backgroundColor: '#e1f5fe' }
  }),
  validator: createNodeConfig({
    title: 'Validator',
    description: 'Validate input data',
    handles: [
      createHandle('target', 'input'),
      createHandle('source', 'valid', { style: { top: '40%' } }),
      createHandle('source', 'invalid', { style: { top: '70%' } })
    ],
    fields: [],
    outputs: [
      createOutput('valid', 'Valid Data', 'any', 'Data that passed validation'),
      createOutput('invalid', 'Invalid Data', 'any', 'Data that failed validation'),
      createOutput('result', 'Validation Result', 'boolean', 'Boolean validation result')
    ],
    style: { backgroundColor: '#e8eaf6' }
  }),
  aggregator: createNodeConfig({
    title: 'Aggregator',
    description: 'Combine multiple inputs',
    handles: [
      createHandle('target', 'input1', { style: { top: '25%' } }),
      createHandle('target', 'input2', { style: { top: '50%' } }),
      createHandle('target', 'input3', { style: { top: '75%' } }),
      createHandle('source', 'output')
    ],
    fields: [],
    outputs: [
      createOutput('output', 'Aggregated Output', 'any', 'Combined result from all inputs'),
      createOutput('result', 'Result', 'any', 'Aggregation result')
    ],
    style: { backgroundColor: '#f1f8e9' }
  })
};

// React Flow configuration
const gridSize = 20;
const proOptions = { hideAttribution: true };

/**
 * Node type mapping for React Flow
 * Maps node type strings to their corresponding React components
 */
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  conditional: ConditionalNode,
  transform: TransformNode,
  validator: ValidatorNode,
  aggregator: AggregatorNode,
};

/**
 * Zustand store selector
 * Optimized selector to prevent unnecessary re-renders
 */
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

/**
 * PipelineUI Component
 * 
 * Main canvas component for the pipeline builder.
 * Handles drag-and-drop operations, node creation, and connection management.
 * 
 * Features:
 * - Drag-and-drop node creation
 * - Visual edge connections
 * - Background grid with snap
 * - Minimap for navigation
 * - Zoom and pan controls
 * 
 * @component
 * @returns {JSX.Element} React Flow canvas with pipeline functionality
 */
export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    /**
     * Generates initial node data based on node type
     * 
     * @param {string} nodeID - Unique identifier for the node
     * @param {string} type - Node type identifier
     * @returns {Object} Initial node data object
     */
    const getInitNodeData = (nodeID, type) => {
      let nodeData = { 
        id: nodeID, 
        nodeType: `${type}`,
        config: nodeConfigs[type] || {}
      };
      return nodeData;
    };

    /**
     * Handles drop event when dragging nodes onto canvas
     * Creates a new node at the drop position
     * 
     * @param {DragEvent} event - Drop event
     */
    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // Check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            // Calculate position relative to canvas
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    /**
     * Handles drag over event
     * Enables drop functionality on the canvas
     * 
     * @param {DragEvent} event - Drag over event
     */
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#3b82f6', strokeWidth: 2 }
                }}
                className="bg-gray-50"
            >
                <Background 
                  color="#cbd5e1" 
                  gap={gridSize} 
                  variant="dots"
                  className="bg-gradient-to-br from-blue-50 to-indigo-50"
                />
                <Controls 
                  className="bg-white shadow-lg rounded-lg border border-gray-200"
                />
                <MiniMap 
                  className="bg-white shadow-lg rounded-lg border border-gray-200"
                  nodeColor={(node) => {
                    const colorMap = {
                      'customInput': '#dbeafe',
                      'llm': '#fae8ff',
                      'customOutput': '#ffedd5',
                      'text': '#dcfce7',
                      'filter': '#fce7f3',
                      'conditional': '#fef9c3',
                      'transform': '#ccfbf1',
                      'validator': '#ede9fe',
                      'aggregator': '#ecfccb'
                    };
                    return colorMap[node.type] || '#ffffff';
                  }}
                />
            </ReactFlow>
        </div>
    );
};
