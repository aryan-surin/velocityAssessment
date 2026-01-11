/**
 * Transform Node
 * 
 * Transforms input data using various operations.
 * Demonstrates textarea field type and data manipulation.
 * 
 * Use Cases:
 * - String manipulation
 * - Data formatting
 * - Value transformation
 */

import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

/**
 * Transform Node Configuration
 */
const transformNodeConfig = createNodeConfig({
  title: 'Transform',
  description: 'Transform data',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'output')
  ],
  fields: [
    createField('operation', 'Operation', 'select', {
      defaultValue: 'uppercase',
      options: [
        { value: 'uppercase', label: 'Uppercase' },
        { value: 'lowercase', label: 'Lowercase' },
        { value: 'trim', label: 'Trim Whitespace' },
        { value: 'replace', label: 'Find & Replace' },
        { value: 'template', label: 'Apply Template' }
      ]
    }),
    createField('template', 'Template/Pattern', 'textarea', {
      defaultValue: 'Result: ',
      placeholder: 'Enter template or pattern',
      rows: 3
    })
  ],
  outputs: [
    createOutput('output', 'Transformed Output', 'string', 'Transformed data result'),
    createOutput('text', 'Text Result', 'string', 'Transformed text')
  ],
  style: {
    backgroundColor: '#e1f5fe',
    minHeight: 140
  }
});

/**
 * TransformNode component
 */
export const TransformNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: transformNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={transformNodeConfig} />;
};

export default TransformNode;
