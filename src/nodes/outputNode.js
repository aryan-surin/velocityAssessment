// outputNode.js

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

/**
 * Output Node Configuration
 * Defines an output node with name and type selection
 */
const outputNodeConfig = createNodeConfig({
  title: 'Output',
  description: 'Data output node',
  handles: [
    createHandle('target', 'value')
  ],
  fields: [
    createField('outputName', 'Name', 'text', {
      defaultValue: (data, id) => data?.outputName || id.replace('customOutput-', 'output_'),
      placeholder: 'Enter output name'
    }),
    createField('outputType', 'Type', 'select', {
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' }
      ]
    })
  ],
  style: {
    backgroundColor: '#fff3e0'
  }
});

/**
 * OutputNode component using BaseNode abstraction
 */
export const OutputNode = ({ id, data }) => {
  // Handle dynamic default value for outputName
  const enrichedData = {
    ...data,
    outputName: data?.outputName || id.replace('customOutput-', 'output_')
  };

  return <BaseNode id={id} data={enrichedData} config={outputNodeConfig} />;
}
