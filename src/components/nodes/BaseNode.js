// Base component for all node types - handles rendering, fields, and variable detection

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Handle, Position, useNodes, useReactFlow, useUpdateNodeInternals } from 'reactflow';

export const BaseNode = ({ id, data, config }) => {
  // Get all nodes from React Flow
  const nodes = useNodes();
  const { setEdges, getEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  
  // Ref to track previous handle count to prevent infinite loops
  const prevHandleCountRef = useRef(0);

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
  
  // TODO: refactor autocomplete logic - bit messy
  const [autocomplete, setAutocomplete] = useState({
    show: false,
    step: 'node', // 'node' or 'field'
    fieldName: null,
    selectedNode: null,
    query: '',
    cursorPosition: 0,
    triggerPosition: 0,
    dropdownPosition: { top: 0, left: 0 }
  });
  const autocompleteRef = useRef(null);
  const inputRefs = useRef({});
  const [dynamicHandles, setDynamicHandles] = useState([]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  // Parse {{ variable }} and {{node.field}} formats
  const parseVariables = useCallback((text) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const content = match[1].trim();
      const parts = content.split('.');
      
      if (parts.length === 2) {
        // Advanced format: {{nodeId.field}}
        variables.push({
          full: match[0],
          nodeId: parts[0],
          field: parts[1],
          type: 'advanced'
        });
      } else if (parts.length === 1 && content.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        variables.push({
          full: match[0],
          variableName: content,
          index: match.index,
          type: 'simple'
        });
      }
    }
    
    return variables;
  }, []);

  // Create handles for detected variables
  useEffect(() => {
    const allVariables = [];
    
    if (config.fields) {
      config.fields.forEach(field => {
        const value = fieldValues[field.name] || '';
        const variables = parseVariables(value);
        
        variables.forEach(variable => {
          allVariables.push({
            ...variable,
            fieldName: field.name
          });
        });
      });
    }
    
    // Create dynamic handles for both simple and advanced formats
    const handleMap = new Map();
    
    allVariables.forEach(variable => {
      if (variable.type === 'simple') {
        handleMap.set(`var-${variable.variableName}`, {
          id: `var-${variable.variableName}`,
          variableName: variable.variableName,
          handleType: 'simple'
        });
      } else if (variable.type === 'advanced') {
        handleMap.set(`dynamic-${variable.nodeId}`, {
          id: `dynamic-${variable.nodeId}`,
          nodeId: variable.nodeId,
          handleType: 'advanced'
        });
      }
    });
    
    // TODO: improve handle positioning algorithm
    const newHandles = Array.from(handleMap.values()).map((handle, index) => ({
      ...handle,
      position: Position.Left,
      style: { 
        top: `${30 + (index * 20)}%`,
        background: handle.handleType === 'simple' ? '#10b981' : '#3b82f6' 
      }
    }));
    
    setDynamicHandles(newHandles);
    
    // Force ReactFlow to re-register handles after dynamic creation
    // Only update if handle count changed to prevent infinite loops
    if (newHandles.length > 0 && newHandles.length !== prevHandleCountRef.current) {
      prevHandleCountRef.current = newHandles.length;
      setTimeout(() => {
        updateNodeInternals(id);
      }, 50);
    } else if (newHandles.length === 0 && prevHandleCountRef.current !== 0) {
      prevHandleCountRef.current = 0;
      setTimeout(() => {
        updateNodeInternals(id);
      }, 50);
    }
    
    // console.log('Dynamic handles updated:', newHandles.length); // DEBUG
  }, [fieldValues, nodes, config.fields, parseVariables, id, updateNodeInternals]);

  const handleInputChange = useCallback((e, fieldName) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    handleFieldChange(fieldName, value);

    // Check for {{ trigger - autocomplete logic
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastBraceIndex = textBeforeCursor.lastIndexOf('{{');
    
    if (lastBraceIndex !== -1) {
      const textAfterTrigger = textBeforeCursor.substring(lastBraceIndex + 2);
      
      const hasClosingBrace = textAfterTrigger.includes('}}');
      
      if (!hasClosingBrace) {
        // Calculate dropdown position
        const input = e.target;
        const rect = input.getBoundingClientRect();
        const fieldsContainer = input.closest('.flex.flex-col.gap-1\\.5');
        const containerRect = fieldsContainer ? fieldsContainer.getBoundingClientRect() : rect;
        
        const dotIndex = textAfterTrigger.indexOf('.');
        
        if (dotIndex !== -1) {
          // Step 2: Field selection
          const nodeId = textAfterTrigger.substring(0, dotIndex);
          const fieldQuery = textAfterTrigger.substring(dotIndex + 1);
          
          setAutocomplete({
            show: true,
            step: 'field',
            fieldName,
            selectedNode: nodeId,
            query: fieldQuery,
            cursorPosition: cursorPos,
            triggerPosition: lastBraceIndex,
            dropdownPosition: {
              top: rect.bottom - containerRect.top + 5,
              left: rect.left - containerRect.left
            }
          });
        } else {
          // Step 1: Node selection
          setAutocomplete({
            show: true,
            step: 'node',
            fieldName,
            selectedNode: null,
            query: textAfterTrigger,
            cursorPosition: cursorPos,
            triggerPosition: lastBraceIndex,
            dropdownPosition: {
              top: rect.bottom - containerRect.top + 5,
              left: rect.left - containerRect.left
            }
          });
        }
        return;
      }
    }
    
    // Hide autocomplete if conditions not met
    setAutocomplete(prev => ({ ...prev, show: false }));
  }, [handleFieldChange]);

  const handleNodeSelect = useCallback((nodeId) => {
    const { fieldName, triggerPosition } = autocomplete;
    const currentValue = fieldValues[fieldName];
    
    // Remove old edges created by variable builder before changing node selection
    const oldVariables = parseVariables(currentValue);
    if (oldVariables.length > 0) {
      setEdges((edges) => 
        edges.filter(edge => 
          // Only remove edges created by variable builder (those targeting dynamic handles)
          !oldVariables.some(v => edge.target === id && edge.targetHandle === `dynamic-${v.nodeId}`)
        )
      );
    }
    
    // Remove all existing variables (enforce single variable per field)
    const cleanValue = currentValue.replace(/\{\{[^}]+\}\}/g, '');
    
    // Insert nodeId and a dot, keep cursor for field selection
    const newValue = `{{${nodeId}.`;
    const newCursorPos = newValue.length;
    
    handleFieldChange(fieldName, newValue);
    
    // Move to step 2: field selection
    setAutocomplete(prev => ({
      ...prev,
      step: 'field',
      selectedNode: nodeId,
      query: '',
      cursorPosition: newCursorPos
    }));
    
    // Refocus and reposition cursor
    setTimeout(() => {
      const input = inputRefs.current[fieldName] || textareaRefs.current[fieldName];
      if (input) {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [autocomplete, fieldValues, handleFieldChange, parseVariables, id, setEdges]);

  const handleFieldSelect = useCallback((fieldName) => {
    const { fieldName: inputFieldName, selectedNode } = autocomplete;
    const currentValue = fieldValues[inputFieldName];
    
    // Remove all existing variables and insert the new one (enforce single variable)
    const newValue = `{{${selectedNode}.${fieldName}}}`;
    
    // Remove old edges connected to this field's dynamic handle
    const oldVariables = parseVariables(currentValue);
    if (oldVariables.length > 0) {
      setEdges((edges) => 
        edges.filter(edge => 
          !oldVariables.some(v => edge.target === id && edge.targetHandle === `dynamic-${v.nodeId}`)
        )
      );
    }
    
    handleFieldChange(inputFieldName, newValue);
    
    // Create automatic edge from selected node to current node
    setTimeout(() => {
      setEdges((edges) => {
        // Check if edge already exists
        const edgeExists = edges.some(
          edge => edge.source === selectedNode && edge.target === id && edge.targetHandle === `dynamic-${selectedNode}`
        );
        
        if (!edgeExists) {
          const newEdge = {
            id: `${selectedNode}-${id}-${fieldName}`,
            source: selectedNode,
            target: id,
            targetHandle: `dynamic-${selectedNode}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 }
          };
          return [...edges, newEdge];
        }
        return edges;
      });
    }, 100); // Small delay to ensure dynamic handle is created
    
    setAutocomplete(prev => ({ ...prev, show: false }));
    
    // Refocus the input
    setTimeout(() => {
      const input = inputRefs.current[inputFieldName] || textareaRefs.current[inputFieldName];
      if (input) {
        input.focus();
        const newCursorPos = selectedNode.length + fieldName.length + 5; // {{ + nodeId + . + field + }}
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [autocomplete, fieldValues, handleFieldChange, parseVariables, id, setEdges]);

  const filteredNodes = useMemo(() => {
    if (!autocomplete.show || autocomplete.step !== 'node') return [];
    
    const query = autocomplete.query.toLowerCase();
    const availableNodes = nodes.filter(node => node.id !== id); // Exclude current node
    
    if (availableNodes.length === 0) {
      return [];
    }
    
    return availableNodes
      .filter(node => {
        const nodeId = node.id.toLowerCase();
        const nodeType = (node.type || 'unknown').toLowerCase();
        return nodeId.includes(query) || nodeType.includes(query);
      })
      .slice(0, 10); // Limit to 10 results
  }, [nodes, autocomplete, id]);

  const availableFields = useMemo(() => {
    if (!autocomplete.show || autocomplete.step !== 'field' || !autocomplete.selectedNode) {
      return [];
    }
    
    const selectedNode = nodes.find(n => n.id === autocomplete.selectedNode);
    if (!selectedNode) return [];
    
    const nodeConfig = selectedNode.data?.config || {};
    const outputs = nodeConfig.outputs || [];
    
    const query = autocomplete.query.toLowerCase();
    return outputs.filter(output => 
      output.name.toLowerCase().includes(query) || 
      output.label.toLowerCase().includes(query)
    );
  }, [nodes, autocomplete]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setAutocomplete(prev => ({ ...prev, show: false }));
      }
    };

    if (autocomplete.show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [autocomplete.show]);

  const handleKeyDown = useCallback((e, fieldName) => {
    if (autocomplete.show && autocomplete.fieldName === fieldName) {
      if (e.key === 'Escape') {
        setAutocomplete(prev => ({ ...prev, show: false }));
        e.preventDefault();
      }
    }
  }, [autocomplete]);

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

  const removeVariable = useCallback((fieldName, variable) => {
    const currentValue = fieldValues[fieldName];
    const newValue = currentValue.replace(variable, '');
    
    // Parse the variable to get handle ID
    const variables = parseVariables(variable);
    if (variables.length > 0) {
      const varData = variables[0];
      let handleIdToRemove;
      
      if (varData.type === 'simple') {
        handleIdToRemove = `var-${varData.variableName}`;
      } else if (varData.type === 'advanced') {
        handleIdToRemove = `dynamic-${varData.nodeId}`;
      }
      
      // Remove associated edge
      if (handleIdToRemove) {
        setEdges((edges) => 
          edges.filter(edge => 
            !(edge.target === id && edge.targetHandle === handleIdToRemove)
          )
        );
      }
    }
    
    handleFieldChange(fieldName, newValue);
  }, [fieldValues, handleFieldChange, parseVariables, id, setEdges]);

  const renderVariableTags = useCallback((text, fieldName) => {
    if (!text) return null;
    
    const variables = parseVariables(text);
    if (variables.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {variables.map((variable, idx) => {
          let isValid = true;
          let displayText = '';
          let colorClass = '';
          
          if (variable.type === 'simple') {
            // Simple variable format: {{ variableName }}
            displayText = variable.variableName;
            isValid = true; // Simple variables are always valid if they match pattern
            colorClass = 'bg-green-100 text-green-700 border border-green-300';
          } else if (variable.type === 'advanced') {
            // Advanced node reference format: {{nodeId.field}}
            displayText = `${variable.nodeId}.${variable.field}`;
            const referencedNode = nodes.find(n => n.id === variable.nodeId);
            isValid = referencedNode && 
              referencedNode.data?.config?.outputs?.some(out => out.name === variable.field);
            colorClass = isValid 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-red-100 text-red-700 border border-red-300';
          }
          
          return (
            <span
              key={`var-${idx}`}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}
              title={variable.type === 'simple' ? 'Simple variable' : 'Node reference'}
            >
              <span>{displayText}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVariable(fieldName, variable.full);
                }}
                className="hover:bg-white/50 rounded-full p-0.5 transition-colors"
                title="Remove variable"
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </span>
          );
        })}
      </div>
    );
  }, [parseVariables, nodes, removeVariable]);

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
                ref={(el) => { 
                  textareaRefs.current[field.name] = el;
                  inputRefs.current[field.name] = el;
                }}
                value={value}
                onChange={(e) => handleInputChange(e, field.name)}
                onKeyDown={(e) => handleKeyDown(e, field.name)}
                placeholder={field.placeholder || ''}
                className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all overflow-hidden"
                style={{ minHeight: '36px' }}
              />
              {renderVariableTags(value, field.name)}
            </label>
          );
        }
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <input
              type="text"
              ref={(el) => { inputRefs.current[field.name] = el; }}
              value={value}
              onChange={(e) => handleInputChange(e, field.name)}
              onKeyDown={(e) => handleKeyDown(e, field.name)}
              placeholder={field.placeholder || ''}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {renderVariableTags(value, field.name)}
          </label>
        );

      case 'textarea':
        return (
          <label key={field.name} className="flex flex-col text-xs gap-0.5">
            {field.label}:
            <textarea
              ref={(el) => { 
                if (field.autoExpand) textareaRefs.current[field.name] = el;
                inputRefs.current[field.name] = el;
              }}
              value={value}
              onChange={(e) => handleInputChange(e, field.name)}
              onKeyDown={(e) => handleKeyDown(e, field.name)}
              placeholder={field.placeholder || ''}
              rows={field.autoExpand ? undefined : (field.rows || 3)}
              className={`px-2 py-1.5 text-xs border border-gray-300 rounded-md w-full ${field.autoExpand ? 'resize-none overflow-hidden' : 'resize-y'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              style={field.autoExpand ? { minHeight: '60px' } : undefined}
            />
            {renderVariableTags(value, field.name)}
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
    <>
      <div 
        className={`relative border border-gray-200 rounded-lg px-3 py-3 text-xs shadow-lg hover:shadow-xl transition-all duration-200 ${getBackgroundClass()}`}
        style={{
          ...customStyle,
          width: `${nodeDimensions.width}px`,
          minHeight: `${nodeDimensions.height}px`,
          transition: 'width 0.2s ease-in-out, min-height 0.2s ease-in-out'
        }}
      >
        {/* Render static input handles (targets) */}
        {renderHandles(config.handles?.filter(h => h.type === 'target'))}
        
        {/* Render dynamic handles */}
        {renderHandles(dynamicHandles)}

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
          <div className="flex flex-col gap-1.5 relative">
            {config.fields.map(field => renderField(field))}
            
            {/* Autocomplete Dropdown - positioned relative to field */}
            {autocomplete.show && (
              <div
                ref={autocompleteRef}
                className="absolute z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto"
                style={{
                  top: `${autocomplete.dropdownPosition.top}px`,
                  left: `${autocomplete.dropdownPosition.left}px`,
                  minWidth: '220px',
                  maxWidth: '350px'
                }}
              >
          {/* Step 1: Node Selection */}
          {autocomplete.step === 'node' && (
            <div className="py-1">
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleNodeSelect(node.id)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-xs border-b border-gray-100 last:border-b-0"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="font-medium text-gray-800">{node.id}</div>
                    <div className="text-[10px] text-gray-500">
                      Type: {node.type || 'unknown'}
                    </div>
                  </button>
                ))
              ) : nodes.length <= 1 ? (
                <div className="px-3 py-3 text-xs text-gray-500 text-center">
                  <div className="text-orange-500 font-medium mb-1">⚠ No nodes available</div>
                  <div>Add nodes to the canvas first</div>
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500 italic">
                  No matching nodes found
                </div>
              )}
            </div>
          )}

          {/* Step 2: Field Selection */}
          {autocomplete.step === 'field' && (
            <div className="py-1">
              <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 text-[10px] text-gray-600 font-medium">
                Select output field for: {autocomplete.selectedNode}
              </div>
              {availableFields.length > 0 ? (
                availableFields.map((field) => (
                  <button
                    key={field.name}
                    onClick={() => handleFieldSelect(field.name)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-xs border-b border-gray-100 last:border-b-0"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="font-medium text-gray-800">{field.label}</div>
                    <div className="text-[10px] text-gray-500">
                      {field.name} • {field.type}
                      {field.description && ` • ${field.description}`}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-red-500">
                  No output fields defined for this node
                </div>
              )}
            </div>
          )}
              </div>
            )}
          </div>
        )}

        {/* Render output handles (sources) */}
        {renderHandles(config.handles?.filter(h => h.type === 'source'))}
      </div>
    </>
  );
};

export default BaseNode;
