import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { Loader2 } from 'lucide-react';

/**
 * CollaborativeEditor - Real-time collaborative code editor using Monaco + Yjs
 * 
 * Architecture:
 * 1. Yjs creates a shared CRDT document
 * 2. WebsocketProvider connects to y-websocket server
 * 3. MonacoBinding syncs Monaco editor ↔ Yjs document
 * 4. All changes propagate automatically to all connected clients
 * 
 * @param {string} sessionId - Unique room identifier
 * @param {string} userId - Current user's ID
 * @param {string} userName - Current user's display name
 * @param {string} userColor - User's cursor color (hex)
 * @param {boolean} readOnly - Whether editor is read-only
 */
export const CollaborativeEditor = ({
    sessionId,
    userId,
    userName,
    userColor = '#1A4D3E',
    readOnly = false,
    onCodeChange
}) => {
    const editorRef = useRef(null);
    const [ydoc] = useState(() => new Y.Doc());
    const [provider, setProvider] = useState(null);
    const [binding, setBinding] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize Yjs WebSocket connection
    useEffect(() => {
        if (!sessionId) return;

        // Connect to y-websocket server
        // In production, this would be your backend WebSocket URL
        const wsProvider = new WebsocketProvider(
            import.meta.env.VITE_YJS_SERVER_URL || 'ws://localhost:1234',
            `classroom-${sessionId}`, // Room name
            ydoc,
            {
                // Connection params sent to server
                params: {
                    userId,
                    userName,
                    userColor
                }
            }
        );

        // Connection status handlers
        wsProvider.on('status', (event) => {
            setIsConnected(event.status === 'connected');
            if (event.status === 'connected') {
                setIsLoading(false);
            }
        });

        // Set user awareness (for cursor presence)
        wsProvider.awareness.setLocalStateField('user', {
            name: userName,
            color: userColor,
            userId
        });

        setProvider(wsProvider);

        // Cleanup on unmount
        return () => {
            wsProvider.destroy();
            ydoc.destroy();
        };
    }, [sessionId, userId, userName, userColor]);

    // Bind Monaco editor to Yjs document
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        if (!provider) {
            console.error('Provider not initialized');
            return;
        }

        // Get or create the shared text type
        const yText = ydoc.getText('monaco');

        // Create Monaco ↔ Yjs binding
        const monacoBinding = new MonacoBinding(
            yText,
            editor.getModel(),
            new Set([editor]),
            provider.awareness
        );

        setBinding(monacoBinding);

        // Configure editor options
        editor.updateOptions({
            readOnly,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            theme: 'vs-dark',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontLigatures: true
        });

        // Notify parent of code changes
        if (onCodeChange) {
            editor.onDidChangeModelContent(() => {
                onCodeChange(editor.getValue());
            });
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E] mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Connecting to session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full relative">
            {/* Connection status indicator */}
            <div className="absolute top-2 right-2 z-10">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isConnected
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'
                        } ${isConnected ? 'animate-pulse' : ''}`} />
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            {/* Monaco Editor */}
            <Editor
                height="100%"
                defaultLanguage="python"
                defaultValue="# Welcome to the collaborative coding classroom!\n# Start typing to see real-time collaboration in action.\n\nprint('Hello, World!')"
                theme="vs-dark"
                options={{
                    readOnly,
                    fontSize: 14,
                    lineNumbers: 'on',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                }}
                onMount={handleEditorDidMount}
                loading={
                    <div className="h-full flex items-center justify-center bg-gray-900">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
                    </div>
                }
            />

            {/* Read-only indicator */}
            {readOnly && (
                <div className="absolute bottom-2 left-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-xs font-medium">
                    Read-only mode
                </div>
            )}
        </div>
    );
};
