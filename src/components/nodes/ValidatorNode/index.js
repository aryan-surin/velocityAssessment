/**
 * Validator Node
 * 
 * Validates input data against specified rules.
 * Demonstrates number field type and validation logic.
 * 
 * Use Cases:
 * - Data validation
 * - Quality checks
 * - Schema validation
 */

import { BaseNode } from '../BaseNode';
import { createNodeConfig, createHandle, createField, createOutput } from '../nodeConfig';

/**
 * Validator Node Configuration
 */
const validatorNodeConfig = createNodeConfig({
  title: 'Validator',
  description: 'Validate input data',
  handles: [
    createHandle('target', 'input'),
    createHandle('source', 'valid', {
      style: { top: '40%' }
    }),
    createHandle('source', 'invalid', {
      style: { top: '70%' }
    })
  ],
  fields: [
    createField('validationType', 'Validation Type', 'select', {
      defaultValue: 'notEmpty',
      options: [
        { value: 'notEmpty', label: 'Not Empty' },
        { value: 'minLength', label: 'Min Length' },
        { value: 'maxLength', label: 'Max Length' },
        { value: 'email', label: 'Email Format' },
        { value: 'url', label: 'URL Format' },
        { value: 'numeric', label: 'Numeric' }
      ]
    }),
    createField('minValue', 'Min Value/Length', 'number', {
      defaultValue: 0,
      min: 0,
      step: 1,
      placeholder: 'Minimum value'
    }),
    createField('maxValue', 'Max Value/Length', 'number', {
      defaultValue: 100,
      min: 0,
      step: 1,
      placeholder: 'Maximum value'
    })
  ],
  outputs: [
    createOutput('valid', 'Valid Data', 'any', 'Data that passed validation'),
    createOutput('invalid', 'Invalid Data', 'any', 'Data that failed validation'),
    createOutput('result', 'Validation Result', 'boolean', 'Boolean validation result')
  ],
  style: {
    backgroundColor: '#e8eaf6',
    minHeight: 140
  }
});

/**
 * ValidatorNode component
 */
export const ValidatorNode = ({ id, data }) => {
  const enrichedData = {
    ...data,
    config: validatorNodeConfig
  };
  return <BaseNode id={id} data={enrichedData} config={validatorNodeConfig} />;
};

export default ValidatorNode;
