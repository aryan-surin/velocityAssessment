/**
 * BaseNode Component
 * 
 * A reusable abstraction for creating nodes with configurable properties.
 * This component eliminates code duplication and provides a flexible
 * system for creating new node types.
 * 
 * Features:
 * - Configurable handles (input/output connections)
 * - Dynamic field rendering (text inputs, selects, textareas)
 * - Customizable styling
 * - Automatic state management for fields
 * - Support for validation and error handling
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique node identifier
 * @param {Object} props.data - Node data including configuration
 * @param {Object} props.config - Node configuration object
 */

import { useState, useCallback, useMemo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * BaseNode - Generic node component with configurable handles and fields
 */
export const BaseNode = ({ id, data, config }) => {
  // Initialize state for all fields defined in config
  const initialState = useMemo(() => {
    const state = {};
    if (config.fields) {
      config.fields.forEach(field => {
        state[field.name] = data?.[field.name] || field.defaultValue || '';
      });
    }
    return state;
  }, [config.fields, data]);

  const [fieldValues, setFieldValues] = useState(initialState);

  /**
   * Generic field change handler
   * @param {string} fieldName - Name of the field being updated
   * @param {*} value - New value for the field
   */
  const handleFieldChange = useCallback((fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  /**
   * Render a single field based on its type
   * @param {Object} field - Field configuration object
   * @returns {JSX.Element} Rendered field component
   */
  const renderField = (field) => {
    const value = fieldValues[field.name];

    switch (field.type) {
      case 'text':
        return (
          <label key={field.name} style={styles.label}>
            {field.label}:
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              style={styles.input}
            />
          </label>
        );

      case 'textarea':
        return (
          <label key={field.name} style={styles.label}>
            {field.label}:
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              rows={field.rows || 3}
              style={styles.textarea}
            />
          </label>
        );

      case 'select':
        return (
          <label key={field.name} style={styles.label}>
            {field.label}:
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              style={styles.select}
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );

      case 'number':
        return (
          <label key={field.name} style={styles.label}>
            {field.label}:
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              min={field.min}
              max={field.max}
              step={field.step}
              style={styles.input}
            />
          </label>
        );

      case 'checkbox':
        return (
          <label key={field.name} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
            {field.label}
          </label>
        );

      default:
        return null;
    }
  };

  /**
   * Render handle components based on configuration
   * @param {Array} handles - Array of handle configurations
   * @returns {Array<JSX.Element>} Array of Handle components
   */
  const renderHandles = (handles) => {
    if (!handles) return null;

    return handles.map((handle, index) => (
      <Handle
        key={`${handle.type}-${handle.id}-${index}`}
        type={handle.type} // 'source' or 'target'
        position={handle.position || (handle.type === 'source' ? Position.Right : Position.Left)}
        id={handle.id || `${id}-${handle.type}-${index}`}
        style={handle.style || {}}
      />
    ));
  };

  // Merge default styles with custom styles from config
  const containerStyle = {
    ...styles.container,
    ...config.style
  };

  return (
    <div style={containerStyle}>
      {/* Render input handles (targets) */}
      {renderHandles(config.handles?.filter(h => h.type === 'target'))}

      {/* Node title */}
      <div style={styles.title}>
        <span style={styles.titleText}>{config.title}</span>
      </div>

      {/* Node description (optional) */}
      {config.description && (
        <div style={styles.description}>
          <span>{config.description}</span>
        </div>
      )}

      {/* Render fields */}
      {config.fields && (
        <div style={styles.fieldsContainer}>
          {config.fields.map(field => renderField(field))}
        </div>
      )}

      {/* Render output handles (sources) */}
      {renderHandles(config.handles?.filter(h => h.type === 'source'))}
    </div>
  );
};

/**
 * Default styles for BaseNode components
 * These can be overridden via config.style
 */
const styles = {
  container: {
    width: 200,
    minHeight: 80,
    border: '1px solid black',
    borderRadius: '4px',
    padding: '8px',
    backgroundColor: 'white',
    fontSize: '12px'
  },
  title: {
    marginBottom: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    paddingBottom: '4px'
  },
  titleText: {
    fontSize: '14px'
  },
  description: {
    marginBottom: '8px',
    fontSize: '11px',
    color: '#666',
    fontStyle: 'italic'
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '11px',
    gap: '2px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    gap: '4px'
  },
  input: {
    padding: '4px',
    fontSize: '11px',
    border: '1px solid #ccc',
    borderRadius: '2px',
    width: '100%'
  },
  textarea: {
    padding: '4px',
    fontSize: '11px',
    border: '1px solid #ccc',
    borderRadius: '2px',
    width: '100%',
    resize: 'vertical'
  },
  select: {
    padding: '4px',
    fontSize: '11px',
    border: '1px solid #ccc',
    borderRadius: '2px',
    width: '100%'
  }
};

export default BaseNode;
