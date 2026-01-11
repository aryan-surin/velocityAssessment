// Input node for pipeline data entry
import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

const inputNodeConfig = createNodeConfig({
  title: 'Input',
  description: 'Data input node',
  handles: [
    createHandle('source', 'value'),
    createHandle('target', 'input')  // Enable incoming connections for cycle demonstration
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


export const InputNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    inputName: data?.inputName || id.replace('customInput-', 'input_'),
    config: inputNodeConfig
  };

  return <BaseNode id={id} data={enrichedData} config={inputNodeConfig} />;
}

export default InputNode;
