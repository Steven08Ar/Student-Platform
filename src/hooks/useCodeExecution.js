/**
 * useCodeExecution Hook
 * 
 * Manages Python code execution state and API communication
 */

import { useState } from 'react';

export const useCodeExecution = () => {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionTime, setExecutionTime] = useState(0);

    const executeCode = async (code, sessionId) => {
        // Reset state
        setIsExecuting(true);
        setOutput('');
        setError('');
        setExecutionTime(0);

        try {
            const apiUrl = import.meta.env.VITE_EXECUTION_API_URL || 'http://localhost:3001';

            const response = await fetch(`${apiUrl}/api/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    sessionId
                })
            });

            const result = await response.json();

            // Handle response
            if (result.success) {
                setOutput(result.stdout || '(No output)');
                if (result.stderr) {
                    setError(result.stderr);
                }
            } else {
                setError(result.stderr || result.error || 'Execution failed');
            }

            setExecutionTime(result.executionTime || 0);

        } catch (err) {
            setError(`Network error: ${err.message}\n\nMake sure the execution server is running.`);
        } finally {
            setIsExecuting(false);
        }
    };

    const clearOutput = () => {
        setOutput('');
        setError('');
        setExecutionTime(0);
    };

    return {
        output,
        error,
        isExecuting,
        executionTime,
        executeCode,
        clearOutput
    };
};
