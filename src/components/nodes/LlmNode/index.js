// LLM node for AI model integration
import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createOutput } from '../nodeConfig';

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
  outputs: [
    createOutput('response', 'Response', 'string', 'LLM generated response'),
    createOutput('text', 'Text Output', 'string', 'Response text content')
  ],
  style: {
    backgroundColor: '#f3e5f5',
    minHeight: 100
  }
});

export const LLMNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: llmNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={llmNodeConfig} />;
}

export default LLMNode;
