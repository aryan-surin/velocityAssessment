// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { TransformNode } from './nodes/transformNode';
import { ValidatorNode } from './nodes/validatorNode';
import { AggregatorNode } from './nodes/aggregatorNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
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

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

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

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
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

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
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
        </>
    )
}
