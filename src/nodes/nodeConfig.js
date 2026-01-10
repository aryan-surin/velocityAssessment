/**
 * Node Configuration Helper
 * 
 * This module provides a helper function to create node configuration objects
 * that work with the BaseNode component. It simplifies the process of defining
 * new node types by providing a clear, declarative API.
 * 
 * Usage:
 * ```javascript
 * import { createNodeConfig } from './nodeConfig';
 * 
 * const myNodeConfig = createNodeConfig({
 *   title: 'My Node',
 *   description: 'Does something useful',
 *   handles: [
 *     { type: 'target', id: 'input' },
 *     { type: 'source', id: 'output' }
 *   ],
 *   fields: [
 *     { name: 'value', label: 'Value', type: 'text' }
 *   ]
 * });
 * ```
 */

import { Position } from 'reactflow';

/**
 * Creates a node configuration object for use with BaseNode
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.title - Node title displayed at the top
 * @param {string} [options.description] - Optional description text
 * @param {Array<Object>} [options.handles] - Handle configurations
 * @param {Array<Object>} [options.fields] - Field configurations
 * @param {Object} [options.style] - Custom styles to override defaults
 * @returns {Object} Node configuration object
 */
export const createNodeConfig = (options) => {
  const {
    title,
    description,
    handles = [],
    fields = [],
    style = {}
  } = options;

  // Validate required fields
  if (!title) {
    throw new Error('Node configuration must include a title');
  }

  return {
    title,
    description,
    handles: handles.map(handle => normalizeHandle(handle)),
    fields: fields.map(field => normalizeField(field)),
    style
  };
};

/**
 * Normalizes handle configuration with defaults
 * 
 * @param {Object} handle - Handle configuration
 * @returns {Object} Normalized handle configuration
 */
const normalizeHandle = (handle) => {
  const {
    type,
    id,
    position,
    style = {}
  } = handle;

  // Validate handle type
  if (!['source', 'target'].includes(type)) {
    throw new Error(`Invalid handle type: ${type}. Must be 'source' or 'target'`);
  }

  // Default position based on type
  const defaultPosition = type === 'source' ? Position.Right : Position.Left;

  return {
    type,
    id: id || `${type}`,
    position: position || defaultPosition,
    style
  };
};

/**
 * Normalizes field configuration with defaults
 * 
 * @param {Object} field - Field configuration
 * @returns {Object} Normalized field configuration
 */
const normalizeField = (field) => {
  const {
    name,
    label,
    type = 'text',
    defaultValue = '',
    placeholder = '',
    options = [],
    min,
    max,
    step,
    rows,
    autoExpand = false
  } = field;

  // Validate required fields
  if (!name) {
    throw new Error('Field configuration must include a name');
  }
  if (!label) {
    throw new Error('Field configuration must include a label');
  }

  // Validate field type
  const validTypes = ['text', 'textarea', 'select', 'number', 'checkbox'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid field type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }

  // Validate select options
  if (type === 'select' && (!options || options.length === 0)) {
    throw new Error(`Select field '${name}' must have options array`);
  }

  const normalizedField = {
    name,
    label,
    type,
    defaultValue,
    placeholder,
    autoExpand
  };

  // Add type-specific properties
  if (type === 'select') {
    normalizedField.options = options;
  }
  if (type === 'number') {
    normalizedField.min = min;
    normalizedField.max = max;
    normalizedField.step = step || 1;
  }
  if (type === 'textarea') {
    normalizedField.rows = rows || 3;
  }

  return normalizedField;
};

/**
 * Helper function to create a handle configuration
 * 
 * @param {string} type - 'source' or 'target'
 * @param {string} id - Handle ID
 * @param {Object} options - Additional options (position, style)
 * @returns {Object} Handle configuration
 */
export const createHandle = (type, id, options = {}) => {
  return {
    type,
    id,
    ...options
  };
};

/**
 * Helper function to create a field configuration
 * 
 * @param {string} name - Field name (used for state management)
 * @param {string} label - Field label (displayed to user)
 * @param {string} type - Field type (text, textarea, select, number, checkbox)
 * @param {Object} options - Additional field options
 * @returns {Object} Field configuration
 */
export const createField = (name, label, type = 'text', options = {}) => {
  return {
    name,
    label,
    type,
    ...options
  };
};

/**
 * Predefined handle position helpers
 */
export const HandlePositions = {
  TOP: Position.Top,
  RIGHT: Position.Right,
  BOTTOM: Position.Bottom,
  LEFT: Position.Left
};

export default createNodeConfig;
