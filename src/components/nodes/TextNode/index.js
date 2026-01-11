/**
 * Text Node
 * 
 * Static text or template node.
 * Supports variable insertion with {{ variableName }} syntax.
 * Variables create input handles automatically on the left side.
 * 
 * Use Cases:
 * - Static text content
 * - Templates with variables (e.g., "Hello {{ name }}")
 * - Dynamic text generation
 * 
 * Variable Formats Supported:
 * - Simple: {{ variable }} - Creates handle named "variable"
 * - Advanced: {{nodeId.field}} - References specific node output
 */

import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

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

export default TextNode;
