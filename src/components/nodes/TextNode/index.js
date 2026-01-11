// Text node with variable support
// Type {{ variable }} to create input handles

import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

const textNodeConfig = createNodeConfig({
  title: 'Text',
  description: 'Static text or template',
  handles: [
    createHandle('source', 'output')
  ],
  fields: [
    createField('text', 'Text', 'text', {
      defaultValue: '',
      placeholder: 'Type {{ variable }} to create input handles',
      autoExpand: true
    })
  ],
  outputs: [
    createOutput('text', 'Text Output', 'string', 'Processed text content'),
    createOutput('output', 'Output', 'string', 'Final output text')
  ],
  style: {
    backgroundColor: '#e8f5e9'
  }
});


export const TextNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: textNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={textNodeConfig} />;
}

export default TextNode;
