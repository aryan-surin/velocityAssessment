// Filter node for data filtering
import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

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
  outputs: [
    createOutput('passed', 'Passed Filter', 'any', 'Data that passed filter'),
    createOutput('filtered', 'Filtered Out', 'any', 'Data that was filtered out')
  ],
  style: {
    backgroundColor: '#fce4ec',
    minHeight: 120
  }
});

export const FilterNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: filterNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={filterNodeConfig} />;
};

export default FilterNode;
