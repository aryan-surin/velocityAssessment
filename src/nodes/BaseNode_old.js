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

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  const [nodeDimensions, setNodeDimensions] = useState({ width: 208, height: 80 });
  const textareaRefs = useRef({});

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
   * Calculate and update node dimensions based on auto-expanding fields
   */
  useEffect(() => {
    if (!config.fields) return;

    const autoExpandFields = config.fields.filter(field => field.autoExpand);
    if (autoExpandFields.length === 0) return;

    let maxWidth = 208; // Minimum width (w-52)
    let totalHeight = 80; // Minimum height (min-h-20)

    autoExpandFields.forEach(field => {
      const value = fieldValues[field.name] || '';
      const textarea = textareaRefs.current[field.name];

      if (textarea) {
        // Calculate width based on longest line
        const lines = value.split('\n');
        const longestLine = lines.reduce((max, line) => 
          line.length > max.length ? line : max, '');
        
        // Approximate width: 7px per character + padding
        const estimatedWidth = Math.min(400, Math.max(208, longestLine.length * 7 + 60));
        maxWidth = Math.max(maxWidth, estimatedWidth);

        // Calculate height based on content
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${scrollHeight}px`;
        
        const fieldHeight = Math.min(600, Math.max(60, scrollHeight + 20));
        totalHeight = Math.max(totalHeight, fieldHeight + 100); // Add space for title/padding
      }
    });

    setNodeDimensions({ width: maxWidth, height: totalHeight });
  }, [fieldValues, config.fields]);

  /**
   * Render a single field based on its type
   * @param {Object} field - Field configuration object
   * @returns {JSX.Element} Rendered field component
   */
  const renderField = (field) => {
    const value = fieldValues[field.name];

    switch (field.type) {
      case 'text':
        // Use textarea for auto-expanding text fields
        if (field.autoExpand) {
          return (
            <label key={field.name} className="flex flex-col text-xs gap-0.5">
              {field.label}:
              <textarea
                ref={(el) => { textareaRefs.current[field.name] = el; }}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all overflow-hidden"
                style={{ minHeight: '36px' }}
              />
            </label>
          );
        }
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </label>
        );

      case 'textarea':
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <textarea
              ref={field.autoExpand ? (el) => { textareaRefs.current[field.name] = el; } : undefined}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
              rows={field.autoExpand ? undefined : (field.rows || 3)}
              className={`px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full ${field.autoExpand ? 'resize-none overflow-hidden' : 'resize-y'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              style={field.autoExpand ? { minHeight: '60px' } : {}}
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
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
      className={`border border-gray-200 rounded-lg px-3 py-3 text-xs shadow-lg hover:shadow-xl transition-all duration-200 ${getBackgroundClass()}`}
      style={{
        ...customStyle,
        width: `${nodeDimensions.width}px`,
        minHeight: `${nodeDimensions.height}px`,
        transition: 'width 0.2s ease-in-out, min-height 0.2s ease-in-out'
      }}
    >
      {/* Render input handles (targets) */}
      {renderHandles(config.handles?.filter(h => h.type === 'target'))}

      {/* Node title */}
      <div className="mb-2.5 font-semibold border-b border-gray-200 pb-2">
        <span className="text-sm text-gray-800">{config.title}</span>
      </div>

      {/* Node description (optional) */}
      {config.description && (
        <div className="mb-2.5 text-[11px] text-gray-500 italic">
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
