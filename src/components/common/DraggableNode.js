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

// Icon mapping for node types
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

// Draggable node component for toolbar
export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnd = (event) => {
      event.target.style.cursor = 'grab';
    };

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
