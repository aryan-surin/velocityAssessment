// Output node for pipeline results
import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

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
  outputs: [
    createOutput('result', 'Result', 'any', 'Final output result'),
    createOutput('value', 'Value', 'any', 'Output value')
  ],
  style: {
    backgroundColor: '#fff3e0'
  }
});


export const OutputNode = ({ id, data }) => {
  // Handle dynamic default value for outputName
  const enrichedData = {
    ...data,
    outputName: data?.outputName || id.replace('customOutput-', 'output_'),
    config: outputNodeConfig
  };

  return <BaseNode id={id} data={enrichedData} config={outputNodeConfig} />;
}

export default OutputNode;
