// Node configuration helpers for BaseNode
import { Position } from 'reactflow';

export const createNodeConfig = (options) => {
  const {
    title,
    description,
    handles = [],
    fields = [],
    outputs = [],
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
    outputs: outputs.map(output => normalizeOutput(output)),
    style
  };
};

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

const normalizeOutput = (output) => {
  const {
    name,
    label,
    type = 'string',
    description = ''
  } = output;

  // Validate required fields
  if (!name) {
    throw new Error('Output configuration must include a name');
  }
  if (!label) {
    throw new Error('Output configuration must include a label');
  }

  // Validate output type
  const validTypes = ['string', 'number', 'array', 'object', 'boolean', 'any'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid output type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }

  return {
    name,
    label,
    type,
    description
  };
};

export const createHandle = (type, id, options = {}) => {
  return {
    type,
    id,
    ...options
  };
};

export const createField = (name, label, type = 'text', options = {}) => {
  return {
    name,
    label,
    type,
    ...options
  };
};

export const createOutput = (name, label, type = 'string', description = '') => {
  return {
    name,
    label,
    type,
    description
  };
};

export const HandlePositions = {
  TOP: Position.Top,
  RIGHT: Position.Right,
  BOTTOM: Position.Bottom,
  LEFT: Position.Left
};

export default createNodeConfig;
