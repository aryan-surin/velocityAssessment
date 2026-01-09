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

import { BaseNode } from './BaseNode';
import { createNodeConfig, createHandle, createField } from './nodeConfig';

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
  style: {
    backgroundColor: '#e8eaf6',
    minHeight: 140
  }
});

/**
 * ValidatorNode component
 */
export const ValidatorNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={validatorNodeConfig} />;
};

export default ValidatorNode;
