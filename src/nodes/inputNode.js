// inputNode.js

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from './nodeConfig';

/**
 * Input Node Configuration
 * Defines an input node with name and type selection
 */
const inputNodeConfig = createNodeConfig({
  title: 'Input',
  description: 'Data input node',
  handles: [
    createHandle('source', 'value')
  ],
  fields: [
    createField('inputName', 'Name', 'text', {
      defaultValue: (data, id) => data?.inputName || id.replace('customInput-', 'input_'),
      placeholder: 'Enter input name'
    }),
    createField('inputType', 'Type', 'select', {
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' }
      ]
    })
  ],
  outputs: [
    createOutput('text', 'Text Output', 'string', 'Text content from input'),
    createOutput('value', 'Value', 'any', 'Raw input value')
  ],
  style: {
    backgroundColor: '#e3f2fd'
  }
});

/**
 * InputNode component using BaseNode abstraction
 */
export const InputNode = ({ id, data }) => {
  // Handle dynamic default value for inputName
  const enrichedData = {
    ...data,
    inputName: data?.inputName || id.replace('customInput-', 'input_'),
    config: inputNodeConfig  // Pass config to data for access by other nodes
  };

  return <BaseNode id={id} data={enrichedData} config={inputNodeConfig} />;
}
