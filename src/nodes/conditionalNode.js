/**
 * Conditional Node
 * 
 * Routes data based on conditional logic.
 * Demonstrates multi-output configuration and branching logic.
 * 
 * Use Cases:
 * - If/else logic
 * - Decision trees
 * - Workflow branching
 */

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

/**
 * Conditional Node Configuration
 */
const conditionalNodeConfig = createNodeConfig({
  title: 'Conditional',
  description: 'Route data based on condition',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'true', {
      style: { top: '40%' }
    }),
    createHandle('source', 'false', {
      style: { top: '70%' }
    })
  ],
  fields: [
    createField('condition', 'Condition', 'select', {
      defaultValue: 'isEmpty',
      options: [
        { value: 'isEmpty', label: 'Is Empty' },
        { value: 'isNotEmpty', label: 'Is Not Empty' },
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'lessThan', label: 'Less Than' },
        { value: 'equals', label: 'Equals' }
      ]
    }),
    createField('compareValue', 'Compare Value', 'text', {
      defaultValue: '',
      placeholder: 'Value to compare'
    })
  ],
  style: {
    backgroundColor: '#fff9c4',
    minHeight: 110
  }
});

/**
 * ConditionalNode component
 */
export const ConditionalNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={conditionalNodeConfig} />;
};

export default ConditionalNode;
