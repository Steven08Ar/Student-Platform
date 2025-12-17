/**
 * OutputPanel Component
 * 
 * Displays code execution output (stdout/stderr) with execution time
 */

import { X, Terminal } from 'lucide-react';

export const OutputPanel = ({
    output,
    error,
    executionTime,
    onClear
}) => {
    const hasOutput = output || error;

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <div className="flex items-center gap-2 text-gray-300">
                    <Terminal className="h-4 w-4" />
                    <span className="text-sm font-medium">Output</span>
                    {executionTime > 0 && (
                        <span className="text-xs text-gray-500">
                            ({executionTime}ms)
                        </span>
                    )}
                </div>
                {hasOutput && (
                    <button
                        onClick={onClear}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Clear output"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {!hasOutput && (
                    <div className="text-gray-500 italic">
                        Click "Run Code" to execute and see output...
                    </div>
                )}

                {/* stdout - Success output in green */}
                {output && (
                    <div className="text-green-400 whitespace-pre-wrap mb-4">
                        {output}
                    </div>
                )}

                {/* stderr - Error output in red */}
                {error && (
                    <div className="text-red-400 whitespace-pre-wrap">
                        <div className="text-red-300 font-bold mb-1">Error:</div>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};
