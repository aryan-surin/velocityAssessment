// textNode.js

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

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
      defaultValue: '{{input}}',
      placeholder: 'Enter text or template',
      autoExpand: true
    })
  ],
  style: {
    backgroundColor: '#e8f5e9'
  }
});

/**
 * TextNode component using BaseNode abstraction
 */
export const TextNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={textNodeConfig} />;
}
