/**
 * Filter Node
 * 
 * Filters input data based on specified conditions.
 * Demonstrates the flexibility of the BaseNode abstraction
 * with multiple field types and configuration options.
 * 
 * Use Cases:
 * - Filter data by keyword
 * - Apply conditional logic
 * - Remove unwanted values
 */

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

/**
 * Filter Node Configuration
 */
const filterNodeConfig = createNodeConfig({
  title: 'Filter',
  description: 'Filter data by condition',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'passed'),
    createHandle('source', 'filtered', {
      style: { top: '75%' }
    })
  ],
  fields: [
    createField('filterType', 'Filter Type', 'select', {
      defaultValue: 'contains',
      options: [
        { value: 'contains', label: 'Contains' },
        { value: 'equals', label: 'Equals' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
        { value: 'regex', label: 'Regex Match' }
      ]
    }),
    createField('filterValue', 'Filter Value', 'text', {
      defaultValue: '',
      placeholder: 'Enter filter value'
    }),
    createField('caseSensitive', 'Case Sensitive', 'checkbox', {
      defaultValue: false
    })
  ],
  style: {
    backgroundColor: '#fce4ec',
    minHeight: 120
  }
});

/**
 * FilterNode component
 */
export const FilterNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={filterNodeConfig} />;
};

export default FilterNode;
