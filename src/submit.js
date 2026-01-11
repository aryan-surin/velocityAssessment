// submit.js

import { useState } from 'react';
import { BiRocket } from 'react-icons/bi';
import { useStore } from './store';

/**
 * SubmitButton Component
 * 
 * Handles the submission of the pipeline to the backend for validation.
 * Sends nodes and edges data to the /pipelines/parse endpoint and displays
 * the results (number of nodes, edges, and DAG validation) in an alert.
 * 
 * Features:
 * - Loading state during API call
 * - Error handling for network failures
 * - User-friendly alert display
 * - Validation before submission
 */
export const SubmitButton = () => {
    const [loading, setLoading] = useState(false);
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);

    /**
     * Handles the pipeline submission to backend
     * 
     * @async
     * @returns {Promise<void>}
     * @throws {Error} When API call fails or network error occurs
     */
    const handleSubmit = async () => {
        // Validation: Check if pipeline has at least one node
        if (nodes.length === 0) {
            alert('⚠️ Pipeline is empty!\n\nPlease add at least one node before submitting.');
            return;
        }

        try {
            setLoading(true);

            // Prepare pipeline data for backend
            const pipelineData = {
                nodes: nodes,
                edges: edges
            };

            // Send POST request to backend
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineData),
            });

            // Handle non-200 responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            // Parse response data
            const result = await response.json();

            // Display results in user-friendly alert
            const dagStatus = result.is_dag ? '✅ Yes' : '❌ No';
            const alertMessage = `
🎉 Pipeline Analysis Complete!

📊 Pipeline Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━
• Number of Nodes: ${result.num_nodes}
• Number of Edges: ${result.num_edges}
• Is Valid DAG: ${dagStatus}

${result.is_dag 
    ? '✅ Your pipeline forms a valid Directed Acyclic Graph!' 
    : '⚠️ Warning: Your pipeline contains cycles and is NOT a valid DAG.'}
            `.trim();

            alert(alertMessage);

        } catch (error) {
            // Error handling with user-friendly messages
            console.error('Pipeline submission error:', error);
            
            let errorMessage = '❌ Failed to submit pipeline!\n\n';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += '🔌 Cannot connect to backend server.\n\n';
                errorMessage += 'Please ensure:\n';
                errorMessage += '• Backend server is running on http://localhost:8000\n';
                errorMessage += '• CORS is properly configured\n';
                errorMessage += '• Network connection is stable';
            } else {
                errorMessage += `Error: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-10">
            <button 
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`
                    flex items-center gap-2 px-6 py-3 
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 
                    text-white font-semibold rounded-lg 
                    shadow-lg hover:shadow-xl 
                    transition-all duration-200 
                    transform hover:scale-105 active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    disabled:hover:scale-100
                `}
            >
                <BiRocket className={`text-xl ${loading ? 'animate-bounce' : ''}`} />
                <span>{loading ? 'Submitting...' : 'Submit Pipeline'}</span>
            </button>
        </div>
    );
}
