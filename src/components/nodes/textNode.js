// textNode.js

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from './nodeConfig';

/**
 * Text Node Configuration
 * Defines a text node with editable text content
 */
const textNodeConfig = createNodeConfig({
  title: 'Text',
  description: 'Static text or template',
  handles: [
    createHandle('source', 'output')
  ],
  fields: [
    createField('text', 'Text', 'text', {
      defaultValue: '',
      placeholder: 'Enter text or template',
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

/**
 * TextNode component using BaseNode abstraction
 */
export const TextNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: textNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={textNodeConfig} />;
}
