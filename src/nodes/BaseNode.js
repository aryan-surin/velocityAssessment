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
 * - Customizable styling with Tailwind CSS
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
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              className="px-1 py-1 text-xs border border-gray-300 rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
        );

      case 'textarea':
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              rows={field.rows || 3}
              className="px-1 py-1 text-xs border border-gray-300 rounded-sm w-full resize-y focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
        );

      case 'select':
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="px-1 py-1 text-xs border border-gray-300 rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
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
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              min={field.min}
              max={field.max}
              step={field.step}
              className="px-1 py-1 text-xs border border-gray-300 rounded-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
        );

      case 'checkbox':
        return (
          <label key={field.name} className="flex items-center text-xs gap-1">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-3 h-3"
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

  // Extract custom styles from config (for backwards compatibility)
  const customStyle = config.style || {};
  
  // Convert backgroundColor to Tailwind class if present
  const getBackgroundClass = () => {
    if (customStyle.backgroundColor) {
      // Map common colors to Tailwind classes
      const colorMap = {
        '#e3f2fd': 'bg-blue-50',
        '#e8f5e9': 'bg-green-50',
        '#fff3e0': 'bg-orange-50',
        '#f3e5f5': 'bg-purple-50',
        '#e0f2f1': 'bg-teal-50',
        '#fff9c4': 'bg-yellow-100',
        '#fce4ec': 'bg-pink-50',
        '#f1f8e9': 'bg-lime-50',
        '#ede7f6': 'bg-indigo-50',
        'white': 'bg-white'
      };
      return colorMap[customStyle.backgroundColor] || 'bg-white';
    }
    return 'bg-white';
  };

  return (
    <div 
      className={`w-48 min-h-20 border border-black rounded px-2 py-2 text-xs ${getBackgroundClass()}`}
      style={customStyle}
    >
      {/* Render input handles (targets) */}
      {renderHandles(config.handles?.filter(h => h.type === 'target'))}

      {/* Node title */}
      <div className="mb-2 font-bold border-b border-gray-300 pb-1">
        <span className="text-sm">{config.title}</span>
      </div>

      {/* Node description (optional) */}
      {config.description && (
        <div className="mb-2 text-[11px] text-gray-600 italic">
          <span>{config.description}</span>
        </div>
      )}

      {/* Render fields */}
      {config.fields && (
        <div className="flex flex-col gap-1.5">
          {config.fields.map(field => renderField(field))}
        </div>
      )}

      {/* Render output handles (sources) */}
      {renderHandles(config.handles?.filter(h => h.type === 'source'))}
    </div>
  );
};

export default BaseNode;
