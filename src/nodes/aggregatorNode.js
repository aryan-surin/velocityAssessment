/**
 * Aggregator Node
 * 
 * Aggregates multiple inputs into a single output.
 * Demonstrates multiple input handles and aggregation logic.
 * 
 * Use Cases:
 * - Combine multiple data sources
 * - Merge results
 * - Join operations
 */

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from './nodeConfig';

/**
 * Aggregator Node Configuration
 */
const aggregatorNodeConfig = createNodeConfig({
  title: 'Aggregator',
  description: 'Combine multiple inputs',
  handles: [
    createHandle('target', 'input1', {
      style: { top: '25%' }
    }),
    createHandle('target', 'input2', {
      style: { top: '50%' }
    }),
    createHandle('target', 'input3', {
      style: { top: '75%' }
    }),
    createHandle('source', 'output')
  ],
  fields: [
    createField('aggregationType', 'Aggregation', 'select', {
      defaultValue: 'concat',
      options: [
        { value: 'concat', label: 'Concatenate' },
        { value: 'merge', label: 'Merge' },
        { value: 'sum', label: 'Sum' },
        { value: 'average', label: 'Average' },
        { value: 'first', label: 'First Non-Empty' },
        { value: 'last', label: 'Last Non-Empty' }
      ]
    }),
    createField('separator', 'Separator', 'text', {
      defaultValue: ', ',
      placeholder: 'Separator for concat'
    }),
    createField('ignoreEmpty', 'Ignore Empty', 'checkbox', {
      defaultValue: true
    })
  ],
  outputs: [
    createOutput('output', 'Aggregated Output', 'any', 'Combined result from all inputs'),
    createOutput('result', 'Result', 'any', 'Aggregation result')
  ],
  style: {
    backgroundColor: '#f1f8e9',
    minHeight: 140
  }
});

/**
 * AggregatorNode component
 */
export const AggregatorNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: aggregatorNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={aggregatorNodeConfig} />;
};

export default AggregatorNode;
