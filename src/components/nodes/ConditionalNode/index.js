// Conditional node for branching logic
import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

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
  outputs: [
    createOutput('true', 'True Branch', 'any', 'Data when condition is true'),
    createOutput('false', 'False Branch', 'any', 'Data when condition is false')
  ],
  style: {
    backgroundColor: '#fff9c4',
    minHeight: 110
  }
});

export const ConditionalNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: conditionalNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={conditionalNodeConfig} />;
};

export default ConditionalNode;
