// llmNode.js

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle } from './nodeConfig';

/**
 * LLM Node Configuration
 * Defines a Large Language Model node with multiple inputs and one output
 */
const llmNodeConfig = createNodeConfig({
  title: 'LLM',
  description: 'Large Language Model',
  handles: [
    createHandle('target', 'system', {
      style: { top: `${100/3}%` }
    }),
    createHandle('target', 'prompt', {
      style: { top: `${200/3}%` }
    }),
    createHandle('source', 'response')
  ],
  fields: [],
  style: {
    backgroundColor: '#f3e5f5',
    minHeight: 100
  }
});

/**
 * LLMNode component using BaseNode abstraction
 */
export const LLMNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={llmNodeConfig} />;
}
