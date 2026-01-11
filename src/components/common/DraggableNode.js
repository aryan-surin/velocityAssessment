// components/common/DraggableNode.js

import { 
  BiData, 
  BiCodeAlt, 
  BiExport, 
  BiText, 
  BiFilter, 
  BiGitBranch, 
  BiRefresh, 
  BiCheckCircle, 
  BiNetworkChart 
} from 'react-icons/bi';

/**
 * Icon mapping for different node types
 * Maps node type identifiers to their corresponding React Icon components
 */
const iconMap = {
  'customInput': BiData,
  'llm': BiCodeAlt,
  'customOutput': BiExport,
  'text': BiText,
  'filter': BiFilter,
  'conditional': BiGitBranch,
  'transform': BiRefresh,
  'validator': BiCheckCircle,
  'aggregator': BiNetworkChart
};

/**
 * DraggableNode Component
 * 
 * Renders a draggable node element that can be dragged onto the React Flow canvas.
 * Includes visual feedback for drag operations and displays an icon with label.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.type - The type of node (matches keys in iconMap)
 * @param {string} props.label - The display label for the node
 * @returns {JSX.Element} Draggable node element
 * 
 * @example
 * <DraggableNode type="customInput" label="Input" />
 */
export const DraggableNode = ({ type, label }) => {
    /**
     * Handles the drag start event
     * Sets up the data transfer and cursor styling
     * 
     * @param {DragEvent} event - The drag event
     * @param {string} nodeType - The type of node being dragged
     */
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    /**
     * Handles the drag end event
     * Resets the cursor styling
     * 
     * @param {DragEvent} event - The drag event
     */
    const onDragEnd = (event) => {
      event.target.style.cursor = 'grab';
    };

    // Get the appropriate icon or default to code icon
    const Icon = iconMap[type] || BiCodeAlt;
  
    return (
      <div
        className="group"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        draggable
      >
        <div className="cursor-grab active:cursor-grabbing min-w-[90px] h-16 flex items-center justify-center flex-col rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 border border-slate-600">
          <Icon className="text-white text-xl mb-1" />
          <span className="text-white text-xs font-medium">{label}</span>
        </div>
      </div>
    );
  };
