// components/ui/Toolbar.js

import { DraggableNode } from '../common/DraggableNode';

/**
 * PipelineToolbar Component
 * 
 * Displays a toolbar with draggable node types that users can drag onto the canvas.
 * Organized in a responsive grid layout with all available node types.
 * 
 * @component
 * @returns {JSX.Element} Toolbar with draggable node elements
 */
export const PipelineToolbar = () => {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Node Library</h2>
                <div className="flex flex-wrap gap-3">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='conditional' label='Conditional' />
                    <DraggableNode type='transform' label='Transform' />
                    <DraggableNode type='validator' label='Validator' />
                    <DraggableNode type='aggregator' label='Aggregator' />
                </div>
            </div>
        </div>
    );
};
